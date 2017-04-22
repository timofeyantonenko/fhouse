from django.contrib.contenttypes.models import ContentType
from comments.models import Comment


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

    new_comment, created = Comment.objects.get_or_create(
        user=request.user,
        content_type=content_type,
        object_id=obj_id,
        content=content_data,
        parent=parent_object
    )
    return new_comment, created
