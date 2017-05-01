import json

from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import csrf_protect
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Like

# Create your views here.
from django.views.generic import TemplateView
from posts.models import Post
from gallery.models import AlbumPhoto

ADD_POSITIVE_LIKE = 0
ADD_NEGATIVE_LIKE = 1
REMOVE_POSITIVE_LIKE = 2
REMOVE_NEGATIVE_LIKE = 3


def post_change_like(request):
    if request.user.is_authenticated():
        slug = request.GET.get("slug")
        modifying_list = []
        context = {}
        if slug:
            post = Post.objects.filter(slug=slug).first()
            content_type = post.get_content_type
            likes = Like.objects.filter_by_instance(post).filter(user=request.user)
            like_type = request.GET.get("type")
            print(type(like_type))
            if like_type == '0':
                print(likes)
                if not likes:
                    like = Like(content_type=content_type, object_id=post.id, user=request.user, like=True)
                    like.save()
                    modifying_list.append(ADD_POSITIVE_LIKE)
                else:
                    if likes.first().like:
                        likes.first().delete()
                        modifying_list.append(REMOVE_POSITIVE_LIKE)
                    else:
                        modifying_list.append(REMOVE_NEGATIVE_LIKE)
                        modifying_list.append(ADD_POSITIVE_LIKE)
                        likes.first().delete()
                        like = Like(content_type=content_type, object_id=post.id, user=request.user, like=True)
                        like.save()
            elif like_type == '1':
                print(likes)
                if not likes:
                    like = Like(content_type=content_type, object_id=post.id, user=request.user, like=False)
                    like.save()
                    modifying_list.append(ADD_NEGATIVE_LIKE)
                else:
                    if not likes.first().like:
                        likes.first().delete()
                        modifying_list.append(REMOVE_NEGATIVE_LIKE)
                    else:
                        modifying_list.append(REMOVE_POSITIVE_LIKE)
                        modifying_list.append(ADD_NEGATIVE_LIKE)
                        likes.first().delete()
                        like = Like(content_type=content_type, object_id=post.id, user=request.user, like=False)
                        like.save()
            context['add_result'] = modifying_list
            return HttpResponse(json.dumps(context), content_type="application/json")


@csrf_protect
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def photo_change_like(request):
    photo_id = request.POST.get("photo_id")
    modifying_list = []
    context = {}
    if photo_id:
        photo = get_object_or_404(AlbumPhoto, id=photo_id)
        content_type = photo.get_content_type
        likes = Like.objects.filter_by_instance(photo).filter(user=request.user)
        like_type = request.POST.get("type")
        if like_type == '0':
            if not likes:
                like = Like(content_type=content_type, object_id=photo_id, user=request.user, like=True)
                like.save()
                modifying_list.append(ADD_POSITIVE_LIKE)
            else:
                if likes.first().like:
                    likes.first().delete()
                    modifying_list.append(REMOVE_POSITIVE_LIKE)
                else:
                    modifying_list.append(REMOVE_NEGATIVE_LIKE)
                    modifying_list.append(ADD_POSITIVE_LIKE)
                    likes.first().delete()
                    like = Like(content_type=content_type, object_id=photo_id, user=request.user, like=True)
                    like.save()
        elif like_type == '1':
            if not likes:
                like = Like(content_type=content_type, object_id=photo_id, user=request.user, like=False)
                like.save()
                modifying_list.append(ADD_NEGATIVE_LIKE)
            else:
                if not likes.first().like:
                    likes.first().delete()
                    modifying_list.append(REMOVE_NEGATIVE_LIKE)
                else:
                    modifying_list.append(REMOVE_POSITIVE_LIKE)
                    modifying_list.append(ADD_NEGATIVE_LIKE)
                    likes.first().delete()
                    like = Like(content_type=content_type, object_id=photo_id, user=request.user, like=False)
                    like.save()
        context['add_result'] = modifying_list
        print(context)
        return Response(context, content_type="application/json")


class LikeVIew(TemplateView):
    model = Like
    template_name = 'gallery/slider_photo_list.html'
    context_object_name = 'like_view'
    paginate_by = 5

    def get_context_data(self, **kwargs):
        context = super(LikeVIew, self).get_context_data(**kwargs)
        print('HERE>>>>>>>')
        post_slug = self.request.GET.get('post')
        post = Post.objects.filter(slug=post_slug)
        context['p_likes'] = len(post.likes.filter(like=True))
        context['n_likes'] = len(post.likes - context['p_likes'])
        print('HERE>>>>>>>{}<<<<<<<'.format(post_slug))
        return context
