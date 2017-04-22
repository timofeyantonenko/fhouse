from django.conf.urls import url
from .views import (
    gallery_sections,
    section_albums,
    album_photos,
    photo_detail,
    PhotoList,
    LastSectionPhotoList,
    get_section_information,
    get_album_photos,
    get_photo_comments
    # api_test,
)

urlpatterns = [  # get_section_information
    # url(r'^slider_photo_list/$', PhotoList.as_view()),
    url(r'^photo/comments/$', get_photo_comments, name='photo_comments'),
    url(r'^slider_photo_list/$', get_section_information),
    url(r'^album_photo_list/$', get_album_photos),
    url(r'^api/$', get_section_information),
    url(r'^last_section_photo_list/$', LastSectionPhotoList.as_view()),
    url(r'^main_page_photo_list/$', PhotoList.as_view()),
    url(r'^$', gallery_sections, name="sections"),
    url(r'^(?P<slug>[\w-]+)/$', section_albums, name='albums'),
    url(r'^(?P<section_slug>[\w-]+)/(?P<album_slug>[\w-]+)/$', album_photos, name='photos'),
    url(r'^(?P<section_slug>[\w-]+)/(?P<album_slug>[\w-]+)/(?P<photo_slug>[\w-]+)/$', photo_detail,
        name='photo_detail'),
]
