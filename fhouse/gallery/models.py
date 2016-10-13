from django.db import models
from django.core.urlresolvers import reverse

# Create your models here.
from django.db.models.signals import pre_save
from django.utils.text import slugify
from utils.files_preparing import upload_location


class GallerySection(models.Model):
    section_title = models.TextField(max_length=120)
    # slug for absolute url
    slug = models.SlugField(unique=True)

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


class SectionAlbum(models.Model):
    album_title = models.TextField(max_length=120)
    # slug for absolute url
    slug = models.SlugField(unique=True)

    album_section = models.ForeignKey(GallerySection, on_delete=models.CASCADE)

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


class AlbumPhoto(models.Model):
    photo_title = models.TextField(max_length=120)
    # slug for absolute url
    slug = models.SlugField(unique=True)

    photo_album = models.ForeignKey(SectionAlbum, on_delete=models.CASCADE)

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
        slug = slugify(instance.title)
    qs = GallerySection.objects.filter(slug=slug).order_by("-id")
    exists = qs.exists()
    if exists:
        new_slug = "{}-{}".format(slug, qs.first().id)
        return create_slug(instance, new_slug=new_slug)
    return slug


def pre_save_post_receiver(sender, instance, *args, **kwargs):
    if not instance.slug:
        instance.slug = create_slug(instance)


pre_save.connect(pre_save_post_receiver, sender=GallerySection)
