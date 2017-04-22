from django.conf.urls import url
from .views import (
    LikeVIew,
    post_change_like,
    photo_change_like,
)

urlpatterns = [
    url(r'^post/$', LikeVIew.as_view()),
    url(r'^post/modify/$', post_change_like),
    url(r'^photo/modify/$', photo_change_like),
    # url(r'^(?P<id>\d+)/delete/$', comment_delete, name='delete'),
]
