import json
from urllib.parse import quote_plus
from django.contrib import messages
from django.contrib.contenttypes.models import ContentType
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, get_object_or_404, redirect, render_to_response
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import Http404

# Create your views here.
from comments.models import Comment
from comments.forms import CommentForm
from django.utils import timezone
from django.db.models import Q
from django.views.generic import ListView
from .forms import PostForm
from .models import Post, UserFavoriteTags

from utils.prepare_methods import create_comment_data


def post_create(request):
    """
    Method for creating a post
    :param request:
    :return:
    """
    if not (request.user.is_staff or request.user.is_superuser):
        raise Http404
    form = PostForm(request.POST or None, request.FILES or None)
    if form.is_valid():
        instance = form.save(commit=False)
        instance.save()
        messages.success(request, "Successfully created")
        return HttpResponseRedirect(instance.get_absolute_url())
    elif form.errors:
        messages.error(request, "Fail of created")
    context = {
        "form": form,
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
        print('POSTFORM')
        content_type = instance.get_content_type
        comment_form.cleaned_data['object_id'] = instance.id
        new_comment, created = create_comment_data(request=request, content_type=content_type,
                                                   comment_form=comment_form)
        return HttpResponseRedirect(new_comment.content_object.get_absolute_url())

    comments = instance.comments
    context = {
        "instance": instance,
        "title": instance.title,
        "share_string": quote_plus(instance.content),
        'comments': comments,
        'comment_form': comment_form,
    }
    return render(request, "posts/post_detail.html", context)


def post_list(request):  # list items
    today = timezone.now().date()

    user_tags = UserFavoriteTags.objects.filter(user=request.user).first()
    user_tags = user_tags.tags.all()
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

    context = {
        "post_list": queryset,
        "title": "List",
        "page_request_var": page_request_var,
        "today": today,
        'user_tags': user_tags,
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
    today = timezone.now().date()
    paginator = Paginator(queryset_list, 5)  # Show 5 posts per page
    page_request_var = "page"
    page = request.GET.get(page_request_var, 1)  # If page is not an integer, deliver first page.
    try:
        queryset = paginator.page(page)
    except EmptyPage:
        # If page is out of range (e.g. 9999), deliver last page of results.
        queryset = paginator.page(paginator.num_pages)

    context = {
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
