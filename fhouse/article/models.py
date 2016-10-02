from django.db import models
from django.core.urlresolvers import reverse


# Create your models here.
class ArticlesSection(models.Model):
    section_title = models.TextField(max_length=120)
    # slug for absolute url
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.section_title

    def get_absolute_url(self):
        return reverse("article:articles_list", kwargs={"slug": self.slug})

    @property
    def articles(self):
        query_set = SectionArticle.objects.filter(article_section=self)
        return query_set


class SectionArticle(models.Model):
    article_title = models.TextField(max_length=120)
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
