import json
from urllib.request import urlopen
from urllib.parse import quote_plus, urlparse

from django.views.decorators.csrf import csrf_protect
from io import BytesIO

from os.path import basename

from django.contrib import messages
from django.contrib.contenttypes.models import ContentType
from django.core.files.temp import NamedTemporaryFile
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, get_object_or_404, redirect, render_to_response
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import Http404
from django.core.files.base import File
# from django.contrib.auth.decorators import login_required

# Create your views here.
from comments.models import Comment
from comments.forms import CommentForm
from django.utils import timezone
from django.db.models import Q
from django.views.generic import ListView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .forms import PostForm, PostTagForm
from .models import Post, UserFavoriteTags, PostTag
from .serializers import PostTagSerializer, PostSerializer, PostTitleSerializer
from comments.serializers import CommentSerializer
from likes.models import Like

from utils.prepare_methods import create_comment, get_comments


def post_create(request):
    """
    Method for creating a post
    :param request:
    :return:
    """
    # if not (request.user.is_staff or request.user.is_superuser):
    #     raise Http404
    post_content = request.POST.get("content")
    post_image_url = request.POST.get("image_url")
    print(request.POST.get("content"))
    print(request.POST.get("image_url"))
    if request.user.is_authenticated():
        new_post = Post(
            user=request.user,
            draft=True,
            content=post_content,
        )
        response = urlopen(post_image_url)
        io = BytesIO(response.read())
        new_post.image.save(quote_plus(post_image_url), File(io))

        # new_post.image.url = post_image_url
        new_post.save()
        print(new_post)
    context = {
        "form": post_content,
    }
    return render(request, "posts/post_form.html", context)


def post_detail(request, slug=None):  # retrieve
    instance = get_object_or_404(Post, slug=slug)
    if instance.draft or instance.publish > timezone.now().date():
        if not (request.user.is_staff or request.user.is_superuser):
            raise Http404

    initial_data = {
        "content_type": instance.get_content_type,
        "object_id": instance.id,
    }
    comment_form = CommentForm(request.POST or None, initial=initial_data)
    if comment_form.is_valid() and request.user.is_authenticated():
        content_type = instance.get_content_type
        comment_form.cleaned_data['object_id'] = instance.id
        new_comment, created = create_comment_data(request=request, content_type=content_type,
                                                   comment_form=comment_form)
        return HttpResponseRedirect(new_comment.content_object.get_absolute_url())

    comments = instance.comments
    count_of_additional_posts = 3
    tagged_posts = Post.objects.filter(tag__in=instance.tag.all()).order_by('-updated')
    elder_additional_posts = tagged_posts.filter(updated__lt=instance.updated)

    if len(elder_additional_posts) > count_of_additional_posts:
        prepare_additional_posts = list(elder_additional_posts[:count_of_additional_posts])
    else:
        prepare_additional_posts = Post.objects.active().filter(updated__lt=instance.updated).order_by('-updated')[
                                   :count_of_additional_posts]

    additional_posts = [{"title": post.title, "image": post.image.url,
                         "slug": post.slug, "date": str(post.timestamp),
                         "tags": [tag.name for tag in post.tags]}
                        for post in prepare_additional_posts]
    comment_serializer = CommentSerializer(comments, many=True, context={'request': request})

    likes = Like.objects.filter_by_instance(instance).filter(user=request.user)
    user_like = None
    if likes:
        if likes.first().like:
            user_like = True
        else:
            user_like = False

    state_object = {
        "state": user_like,
        "likes": instance.positive_likes.count(),
        "dislikes": instance.negative_likes.count(),
        "slug": instance.slug,
        "id": instance.id,
        "date": str(instance.timestamp),
    }

    context = {
        "instance": instance,
        "state": json.dumps(state_object),
        "additional_posts": json.dumps(additional_posts),
        "title": instance.title,
        "share_string": quote_plus(instance.content),
        'comments': comment_serializer.data,
        'comment_form': comment_form,
    }
    return render(request, "posts/post_detail.html", context)


@api_view(['GET'])
def get_post_comments(request):
    return get_comments(request, Post)


def post_list(request):
    today = timezone.now().date()
    try:
        user_tags = UserFavoriteTags.objects.filter(user=request.user).first()
        user_tags = user_tags.tags.all()
    except:
        user_tags = UserFavoriteTags.objects.none()
    all_tags = PostTag.objects.all()
    tag = request.GET.get('tab', False)
    if request.user.is_staff or request.user.is_superuser:
        if tag and tag != 'all':
            tag = user_tags.filter(name=tag)
            queryset_list = Post.objects.filter(tag=tag)
        else:
            queryset_list = Post.objects.all()
    else:
        queryset_list = Post.objects.active()  # .order_by("-timestamp")

    query = request.GET.get('q')
    if query:
        queryset_list = queryset_list.filter(
            Q(title__icontains=query) |
            Q(content__icontains=query) |
            Q(user__first_name__icontains=query) |
            Q(user__last_name__icontains=query)
        ).distinct()
    paginator = Paginator(queryset_list, 5)  # Show 5 posts per page
    page_request_var = "page"
    page = request.GET.get(page_request_var, 1)  # If page is not an integer, deliver first page.
    try:
        queryset = paginator.page(page)
    except EmptyPage:
        # If page is out of range (e.g. 9999), deliver last page of results.
        queryset = paginator.page(paginator.num_pages)

    # IF I WANT EXCLUDE SOME TAGS FROM MODAL
    # user_tags_ids = list(user_tags.values_list('id', flat=True))
    # all_tags = all_tags.exclude(id__in=user_tags_ids)

    post_form = PostForm(request.POST or None, request.FILES or None)

    context = {
        # "post_list": queryset,
        "title": "List",
        "page_request_var": page_request_var,
        "today": today,
        'user_tags': user_tags,
        'all_tags': all_tags,
        'page': page,
        'post_form': post_form,
    }
    # return render(request, "posts/list_section.html", context)
    return render(request, "posts/post_list.html", context)


def post_update(request, slug=None):
    if not (request.user.is_staff or request.user.is_superuser):
        raise Http404
    instance = get_object_or_404(Post, slug=slug)
    form = PostForm(request.POST or None, request.FILES or None, instance=instance)
    if form.is_valid():
        instance = form.save(commit=False)
        instance.save()
        messages.success(request, "<h1>Saved</h1>", extra_tags='html_safe')
        return HttpResponseRedirect(instance.get_absolute_url())
    elif form.errors:
        messages.success(request, "Not Saved")
    context = {
        "instance": instance,
        "title": instance.title,
        "form": form,
    }
    return render(request, "posts/post_form.html", context)


def post_delete(request, slug=None):
    if not (request.user.is_staff or request.user.is_superuser):
        raise Http404
    instance = get_object_or_404(Post, slug=slug)
    instance.delete()
    messages.success(request, "Successfully deleted")
    return redirect("posts:list")


# @login_required
def user_tag_delete(request):
    tag_name = request.POST.get('tag_name')
    if tag_name is None:
        return HttpResponse('200 ok')
    instance = UserFavoriteTags.objects.get_or_create(user=request.user)[0]
    tag = PostTag.objects.filter(name=tag_name).first()
    instance.tags.remove(tag.id)
    return HttpResponse('200 ok')


def user_tag_add(request):
    tag_name = request.POST.get('tag_name')
    if tag_name is None:
        return HttpResponse('200 ok')
    instance = UserFavoriteTags.objects.get_or_create(user=request.user)[0]
    tag = PostTag.objects.filter(name=tag_name).first()
    instance.tags.add(tag.id)
    return HttpResponse('200 ok')


def change_user_tags(request):
    add_tags = request.POST.getlist('tags_add[]')
    delete_tags = request.POST.getlist('tags_delete[]')
    instance = UserFavoriteTags.objects.get_or_create(user=request.user)[0]
    instance.add_tags(request.user, add_tags)
    instance.remove_tags(request.user, delete_tags)
    return HttpResponse('200 ok')


def show_tabs(request):
    """
    AJAX request
    :param request:
    :return:
    """
    if not request.is_ajax():
        return post_list(request)
    tag = request.GET['tab']
    user_tags = UserFavoriteTags.objects.filter(user=request.user).first()
    user_tags = user_tags.tags.all()
    if tag == 'all':
        queryset_list = Post.objects.all()
    elif request.user.is_staff or request.user.is_superuser:
        tag = user_tags.filter(name=tag)
        queryset_list = Post.objects.filter(tag=tag)
    else:
        queryset_list = Post.objects.active()  # .order_by("-timestamp")

    queryset_list = Post.objects.get_only_active(queryset_list)
    today = timezone.now().date()
    paginator = Paginator(queryset_list, 5)  # Show 5 posts per page
    page_request_var = "page"
    page = request.GET.get(page_request_var, 1)  # If page is not an integer, deliver first page.
    try:
        queryset = paginator.page(page)
        print("LEN OR RESP: ", len(queryset))
        if len(queryset) == 1:
            print(queryset[0])
    except EmptyPage:
        raise Http404('No posts on this page')
    print('page is:', page)
    context = {
        "page": page,
        "post_list": queryset,
        "title": "List",
        "page_request_var": page_request_var,
        "today": today,
        'user_tags': user_tags,
    }
    return render_to_response(template_name='posts/list_section.html', context=context, content_type='text/html')
    # return HttpResponse(json.dumps({'tab': tab}), content_type='application/json')


class PostList(ListView):
    model = Post
    template_name = 'main/main_posts.html'
    context_object_name = 'post_list'
    paginate_by = 5
    allow_empty = True

    def get_context_data(self, **kwargs):
        context = super(PostList, self).get_context_data(**kwargs)
        posts = Post.objects.active()
        context['post_list'] = posts[1:5]
        context['main_post'] = posts[0]
        return context


@api_view(['GET'])
def api_get_posts(request):
    tag = request.GET.get("tag", None)
    page = request.GET.get("p", 1)
    if tag:
        post_queryset = Post.objects.filter(tag__id=tag)
    else:
        post_queryset = Post.objects.all()

    post_queryset = Post.objects.get_only_active(post_queryset)
    paginator = Paginator(post_queryset, 5)  # Show 5 posts per page
    try:
        post_queryset = paginator.page(page)
    except PageNotAnInteger:
        post_queryset = paginator.page(1)
    except EmptyPage:
        post_queryset = []

    post_serializer = PostSerializer(post_queryset, many=True, context={"request": request})
    return Response(post_serializer.data)


@csrf_protect
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def add_comment(request):
    content_type = ContentType.objects.get_for_model(Post)
    new_comment = create_comment(content_type, request)
    return Response(status=200)


@api_view(['GET'])
def search_post(request):
    limit = 10
    tag = request.GET['tab']
    user_tags = UserFavoriteTags.objects.filter(user=request.user).first()
    user_tags = user_tags.tags.all()
    if tag == 'all':
        print('IN ALL')
        queryset_list = Post.objects.all()
    elif request.user.is_staff or request.user.is_superuser:
        tag = user_tags.filter(name=tag)
        queryset_list = Post.objects.filter(tag=tag)
    else:
        queryset_list = Post.objects.active()  # .order_by("-timestamp")
    query = request.GET.get('q')
    if query:
        queryset_list = queryset_list.filter(
            Q(title__icontains=query) |
            Q(content__icontains=query) |
            Q(user__first_name__icontains=query) |
            Q(user__last_name__icontains=query)
        ).distinct()[:limit]
    else:
        queryset_list = queryset_list[:10]

    title_serializer = PostTitleSerializer(queryset_list, many=True, context={'request': request})
    print(queryset_list)
    return Response(title_serializer.data)


@api_view(['GET'])
def search_tags(request):
    limit = 5
    query = request.GET.get('q')
    page = request.GET.get('p')
    queryset_list = PostTag.objects.all()
    if query:
        queryset_list = queryset_list.filter(
            Q(name__icontains=query)
        ).distinct()

    paginator = Paginator(queryset_list, 5)  # Show 5 tags per page
    try:
        queryset_list = paginator.page(page)
    except PageNotAnInteger:
        queryset_list = paginator.page(1)
    except EmptyPage:
        queryset_list = []
    tags_serializer = PostTagSerializer(queryset_list[:limit], many=True, context={'request': request})
    return Response(tags_serializer.data)


@csrf_protect
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def att_tag(request):
    post_tag_form = PostTagForm(request.POST)
    if post_tag_form.is_valid():
        post_tag = PostTag.objects.create(name=post_tag_form.cleaned_data["name"])
        post_tag_serializer = PostTitleSerializer(post_tag, many=False, context={'request': request})
        return Response(post_tag_serializer.data)
    else:
        return Response({'error': post_tag_form.errors})

