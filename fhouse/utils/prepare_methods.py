from django.contrib.contenttypes.models import ContentType
from comments.models import Comment
from comments.serializers import CommentSerializer

from django.core.paginator import Paginator, EmptyPage
from django.shortcuts import get_object_or_404
from rest_framework.response import Response


def create_comment_data(request, content_type, obj_id, content_data):
    content_type = ContentType.objects.get(model=content_type)
    parent_object = None
    try:
        parent_id = int(request.POST.get("parent_id"))
    except:
        parent_id = None

    if parent_id:
        parent_qs = Comment.objects.filter(id=parent_id)
        if parent_qs.exists() and parent_qs.count() == 1:
            parent_object = parent_qs.first()

    # comment =

    new_comment = Comment(
        user=request.user,
        content_type=content_type,
        object_id=obj_id,
        content=content_data,
        parent=parent_object
    )
    new_comment.save()
    return new_comment


def create_comment(content_type, request):
    parent_id = request.POST.get("id")
    content = request.POST.get("content")
    new_comment = create_comment_data(request=request, content_type=content_type,
                                      obj_id=parent_id, content_data=content)
    return new_comment


def get_comments(request, content_type):
    count_of_comments_per_page = 10
    entity_id = request.GET.get("id")
    page = request.GET.get("p", 1)
    instance = get_object_or_404(content_type, id=entity_id)
    comments = instance.comments
    paginator = Paginator(comments, count_of_comments_per_page)  # Show n posts per page
    try:
        comments = paginator.page(page)
    except EmptyPage:
        comments = paginator.page(paginator.num_pages)
    comment_serializer = CommentSerializer(comments, many=True, context={'request': request})
    return Response(comment_serializer.data)
