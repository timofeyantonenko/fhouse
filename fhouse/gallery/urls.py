from django.conf.urls import url
from .views import (
    gallery_sections,
    section_albums,
    album_photos,
    photo_detail,
    PhotoList,
)

urlpatterns = [
    url(r'^slider_photo_list/$', PhotoList.as_view()),
    url(r'^$', gallery_sections, name="sections"),
    url(r'^(?P<slug>[\w-]+)/$', section_albums, name='albums'),
    url(r'^(?P<section_slug>[\w-]+)/(?P<album_slug>[\w-]+)/$', album_photos, name='photos'),
    url(r'^(?P<section_slug>[\w-]+)/(?P<album_slug>[\w-]+)/(?P<photo_slug>[\w-]+)/$', photo_detail,
        name='photo_detail'),
]
