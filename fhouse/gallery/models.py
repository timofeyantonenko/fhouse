from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.core.urlresolvers import reverse

# Create your models here.
from django.db.models.signals import pre_save
from django.utils.text import slugify

from utils.files_preparing import upload_location, upload_photo_photo, upload_album_photo
from utils.abstract_classes import CommentedClass
from utils.abstract_classes import LikedClass
from utils.abstract_classes import ForeignContentClass
from likes.models import Like


class GallerySection(models.Model):
    section_title = models.TextField(max_length=20)

    updated = models.DateTimeField(auto_now=True, auto_now_add=False)
    timestamp = models.DateTimeField(auto_now=False, auto_now_add=True)

    image = models.ImageField(upload_to=upload_location,
                              null=True, blank=True)

    def __str__(self):
        return self.section_title

    def get_absolute_url(self):
        return reverse("gallery:albums", kwargs={"slug": self.slug})

    @property
    def albums(self):
        query_set = SectionAlbum.objects.filter(album_section=self)
        return query_set


class SectionAlbum(LikedClass):
    album_title = models.TextField(max_length=45)

    updated = models.DateTimeField(auto_now=True, auto_now_add=False)
    timestamp = models.DateTimeField(auto_now=False, auto_now_add=True)

    album_section = models.ForeignKey(GallerySection, on_delete=models.CASCADE)
    image = models.ImageField(upload_to=upload_album_photo,
                              null=True, blank=True)

    def __str__(self):
        return self.album_title

    def get_absolute_url(self):
        section = self.album_section.slug
        context = {
            "section_slug": section,
            "album_slug": self.slug
        }
        return reverse("gallery:photos", kwargs=context)

    @property
    def photos(self):
        query_set = AlbumPhoto.objects.filter(photo_album=self)
        return query_set

    @property
    def positive_likes(self):
        photos = AlbumPhoto.objects.filter(photo_album=self)
        content_type = ContentType.objects.get_for_model(AlbumPhoto)
        likes = Like.objects.filter(object_id__in=photos, content_type=content_type).filter(like=True)
        return likes

    class Meta:
        unique_together = ('album_title', 'image')
        ordering = ["-timestamp", "-updated"]


class AlbumPhoto(CommentedClass, LikedClass, ForeignContentClass):
    photo_title = models.TextField(max_length=40)

    photo_album = models.ForeignKey(SectionAlbum, on_delete=models.CASCADE)

    # one photo
    image = models.ImageField(upload_to=upload_photo_photo,
                              null=True, blank=True)

    updated = models.DateTimeField(auto_now=True, auto_now_add=False)
    timestamp = models.DateTimeField(auto_now=False, auto_now_add=True)

    @property
    def album_title(self):
        return self.photo_album.album_title

    def __str__(self):
        return self.photo_title

    def get_absolute_url(self):
        album = self.photo_album
        section = album.album_section.slug
        context = {
            "section_slug": section,
            "album_slug": album.slug,
            "photo_slug": self.slug,
        }
        return reverse("gallery:photo_detail", kwargs=context)


def create_slug(instance, new_slug=None):
    if new_slug is not None:
        slug = new_slug
    else:
        slug = slugify(instance.photo_title)
    qs = GallerySection.objects.filter(slug=slug).order_by("-id")
    exists = qs.exists()
    if exists:
        new_slug = "{}-{}".format(slug, qs.first().id)
        return create_slug(instance, new_slug=new_slug)
    return slug


def pre_save_post_receiver(sender, instance, *args, **kwargs):
    if not instance.slug:
        instance.slug = create_slug(instance)


def pre_save_photo_receiver(sender, instance, *args, **kwargs):
    parent_album = instance.photo_album
    parent_album.updated = instance.timestamp
    parent_album.save()


pre_save.connect(pre_save_photo_receiver, sender=AlbumPhoto)
# pre_save.connect(pre_save_post_receiver, sender=GallerySection)
