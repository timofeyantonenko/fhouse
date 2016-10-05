from django.db import models
from comments.models import Comment
from django.contrib.contenttypes.models import ContentType


class CommentedClass(models.Model):
    @property
    def comments(self):
        instance = self
        query_set = Comment.objects.filter_by_instance(instance)
        return query_set

    @property
    def get_content_type(self):
        instance = self
        content_type = ContentType.objects.get_for_model(instance.__class__)
        return content_type

    class Meta:
        abstract = True
