from django.conf.urls import url
from .views import (
    gallery_sections,
    sections_articles,
    article_detail,
    ArticleList,
)

urlpatterns = [
    url(r'^$', gallery_sections, name="sections"),
    url(r'^article_list/$', ArticleList.as_view()),
    url(r'^(?P<slug>[\w-]+)/$', sections_articles, name='articles_list'),
    url(r'^(?P<section_slug>[\w-]+)/(?P<article_slug>[\w-]+)/$', article_detail, name='article'),
]
