from django.db import models
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType


# Create your models here.
class LikesManager(models.Manager):
    def all(self):
        qs = super(LikesManager, self).filter(parent=None)
        return qs

    def filter_by_instance(self, instance):
        content_type = ContentType.objects.get_for_model(instance.__class__)
        obj_id = instance.id
        query_set = super(LikesManager, self).filter(content_type=content_type, object_id=obj_id)
        return query_set


class Like(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, default=1)
    # post = models.ForeignKey(Post, default=1)
    #
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    like = models.BooleanField()

    objects = LikesManager()

    def __str__(self):
        return "user: {}, like: {}".format(self.user, self.like)

    def __unicode__(self):
        return "user: {}, like: {}".format(self.user, self.like)
