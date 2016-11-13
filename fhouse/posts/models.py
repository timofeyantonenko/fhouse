from django.db import models
from django.core.urlresolvers import reverse
from django.db.models.signals import pre_save
from django.utils import timezone
from django.utils.text import slugify
from django.utils.safestring import mark_safe
from django.conf import settings
from django.contrib.auth.models import User

# Create your models here.
from markdown_deux import markdown
from .utils import get_read_time
from utils.files_preparing import upload_location
from utils.abstract_classes import CommentedClass
from utils.abstract_classes import LikedClass
from utils.abstract_classes import ForeignContentClass


class PostTag(models.Model):
    name = models.CharField(max_length=30, unique=True)

    def __unicode__(self):
        return self.name

    def __str__(self):
        return self.name


class UserFavoriteTags(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    tags = models.ManyToManyField(PostTag)

    def __unicode__(self):
        return self.tags

    def __str__(self):
        return 'User: {}'.format(self.user.first_name)

    class Meta:
        db_table = 'user_tags'


class PostManager(models.Manager):
    def active(self, *args, **kwargs):
        return super(PostManager, self).filter(draft=False).filter(publish__lte=timezone.now())


class Post(CommentedClass, LikedClass, ForeignContentClass):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, default=1)
    title = models.CharField(max_length=120)
    slug = models.SlugField(unique=True)
    image = models.ImageField(upload_to=upload_location,
                              null=True, blank=True,
                              height_field="height_field",
                              width_field="width_field")

    tag = models.ManyToManyField(PostTag)
    height_field = models.IntegerField(default=0)
    width_field = models.IntegerField(default=0)
    content = models.TextField()
    draft = models.BooleanField(default=False)
    publish = models.DateField(auto_now=False, auto_now_add=False)
    read_time = models.IntegerField(default=0)  # models.TimeField(null=True, blank=True)  # assume minutes
    updated = models.DateTimeField(auto_now=True, auto_now_add=False)
    timestamp = models.DateTimeField(auto_now=False, auto_now_add=True)

    objects = PostManager()

    def __unicode__(self):
        return self.title

    def __str__(self):
        return self.title

    @property
    def tags(self):
        tags = PostTag.objects.filter(post=self)
        return tags

    def get_absolute_url(self):
        return reverse("posts:detail", kwargs={"slug": self.slug})
        # return "/posts/%s/" % self.id

    def get_markdown(self):
        mark_text = markdown(self.content)
        return mark_safe(mark_text)

    class Meta:
        ordering = ["-timestamp", "-updated"]


def create_slug(instance, new_slug=None):
    if new_slug is not None:
        slug = new_slug
    else:
        slug = slugify(instance.title)
    qs = Post.objects.filter(slug=slug).order_by("-id")
    exists = qs.exists()
    if exists:
        new_slug = "{}-{}".format(slug, qs.first().id)
        return create_slug(instance, new_slug=new_slug)
    return slug


def pre_save_post_receiver(sender, instance, *args, **kwargs):
    if not instance.slug:
        instance.slug = create_slug(instance)

    if instance.content:
        html_string = instance.get_markdown()
        read_time = get_read_time(html_string)
        instance.read_time = read_time


pre_save.connect(pre_save_post_receiver, sender=Post)
