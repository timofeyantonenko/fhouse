from django.conf.urls import url
from .views import (
    gallery_sections,
    sections_articles,
    article_detail,
)

urlpatterns = [
    url(r'^$', gallery_sections, name="sections"),
    url(r'^(?P<slug>[\w-]+)/$', sections_articles, name='articles_list'),
    url(r'^(?P<section_slug>[\w-]+)/(?P<article_slug>[\w-]+)/$', article_detail, name='article'),
]
