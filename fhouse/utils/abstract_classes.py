from django.db import models
from comments.models import Comment
from records.models import Record
from django.contrib.contenttypes.models import ContentType
from .files_preparing import upload_location


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


class FootballObject(models.Model):
    name = models.CharField(max_length=200)
    image = models.ImageField(upload_to=upload_location,
                              null=True, blank=True,
                              height_field="height_field",
                              width_field="width_field")

    height_field = models.IntegerField(default=0)
    width_field = models.IntegerField(default=0)

    @property
    def records(self):
        instance = self
        query_set = Record.objects.filter_by_instance(instance)
        return query_set

    @property
    def get_content_type(self):
        instance = self
        content_type = ContentType.objects.get_for_model(instance.__class__)
        return content_type

    def __str__(self):
        return self.name

    class Meta:
        abstract = True