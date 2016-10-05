from django.db import models
from django.core.urlresolvers import reverse
from utils.files_preparing import upload_location
from utils.abstract_classes import CommentedClass


# Create your models here.
class ArticlesSection(models.Model):
    section_title = models.CharField(max_length=120)
    # slug for absolute url
    slug = models.SlugField(unique=True)

    image = models.ImageField(upload_to=upload_location,
                              null=True, blank=True,
                              height_field="height_field",
                              width_field="width_field")

    height_field = models.IntegerField(default=0)
    width_field = models.IntegerField(default=0)

    def __str__(self):
        return self.section_title

    def get_absolute_url(self):
        return reverse("article:articles_list", kwargs={"slug": self.slug})

    @property
    def articles(self):
        query_set = SectionArticle.objects.filter(article_section=self)
        return query_set


class SectionArticle(CommentedClass):
    article_title = models.CharField(max_length=120)
    article_description = models.TextField(max_length=240)
    article_text = models.TextField()
    image = models.ImageField(upload_to=upload_location,
                              null=True, blank=True,
                              height_field="height_field",
                              width_field="width_field")

    height_field = models.IntegerField(default=0)
    width_field = models.IntegerField(default=0)
    # slug for absolute url
    slug = models.SlugField(unique=True)

    article_section = models.ForeignKey(ArticlesSection, on_delete=models.CASCADE)

    def __str__(self):
        return self.article_title

    def get_absolute_url(self):
        section = self.article_section.slug
        context = {
            "section_slug": section,
            "article_slug": self.slug
        }
        return reverse("article:article", kwargs=context)
