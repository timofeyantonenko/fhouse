from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.core.urlresolvers import reverse
from django.db import models

from football_object.models import FootballObject

# Create your models here.
from django.db.models.signals import pre_save
from django.utils.text import slugify


class RecordGroup(models.Model):
    """
    Group of record tables. Like "transfers" etc.
    """

    # who added a record table
    user = models.ForeignKey(settings.AUTH_USER_MODEL, default=1)
    # when record table was added and updated
    updated = models.DateTimeField(auto_now=True, auto_now_add=False)
    timestamp = models.DateTimeField(auto_now=False, auto_now_add=True)
    # name of table
    title = models.CharField(max_length=120)

    # slug for absolute url
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("records:group_tables", kwargs={"slug": self.slug})

    @property
    def tables(self):
        query_set = RecordTable.objects.filter(record_group=self)
        return query_set


class RecordTable(models.Model):
    """
    Type of records. Like "Best forwards" etc.
    """

    # who added a record table
    user = models.ForeignKey(settings.AUTH_USER_MODEL, default=1)
    # when record table was added and updated
    updated = models.DateTimeField(auto_now=True, auto_now_add=False)
    timestamp = models.DateTimeField(auto_now=False, auto_now_add=True)
    # name of table
    title = models.CharField(max_length=120)

    record_group = models.ForeignKey(RecordGroup, on_delete=models.CASCADE)

    # slug for absolute url
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.title

    @property
    def records(self):
        query_set = Record.objects.filter(record_table=self)
        return query_set

    def get_absolute_url(self):
        group = self.record_group.slug
        context = {
            "group_slug": group,
            "table_slug": self.slug
        }
        return reverse("records:table_records", kwargs=context)
        # return "/posts/%s/" % self.id


class Record(models.Model):
    """
    Class for storing records.
    Any record contain a record_table, owner, current value, description, photo,
    Date of creating.
    """

    # who added a record
    user = models.ForeignKey(settings.AUTH_USER_MODEL, default=1)
    # when record was added and updated
    updated = models.DateTimeField(auto_now=True, auto_now_add=False)
    timestamp = models.DateTimeField(auto_now=False, auto_now_add=True)

    # what record is mean
    record_table = models.ForeignKey(RecordTable, on_delete=models.CASCADE)
    record_owner = models.ForeignKey(FootballObject, on_delete=models.CASCADE)
    record_value = models.IntegerField()
    record_description = models.TextField()

    # slug for absolute url
    slug = models.SlugField(unique=True)

    def get_absolute_url(self):
        table = self.record_table
        group = table.record_group.slug
        context = {
            "group_slug": group,
            "table_slug": table.slug,
            "record_slug": self.slug,
        }
        return reverse("records:record", kwargs=context)

    def __str__(self):
        return self.record_owner.name

    class Meta:
        ordering = ["-record_value"]


def create_slug(instance, new_slug=None):
    if new_slug is not None:
        slug = new_slug
    else:
        slug = slugify(instance.title)
    qs = RecordTable.objects.filter(slug=slug).order_by("-id")
    exists = qs.exists()
    if exists:
        new_slug = "{}-{}".format(slug, qs.first().id)
        return create_slug(instance, new_slug=new_slug)
    return slug


def pre_save_post_receiver(sender, instance, *args, **kwargs):
    if not instance.slug:
        instance.slug = create_slug(instance)


pre_save.connect(pre_save_post_receiver, sender=RecordGroup)
