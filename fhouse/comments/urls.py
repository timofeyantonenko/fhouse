from django.conf.urls import url
from .views import (
    comment_thread,
    comment_delete,
    add_comment
)

urlpatterns = [
    url(r'^(?P<id>\d+)/$', comment_thread, name='thread'),
    url(r'^(?P<id>\d+)/delete/$', comment_delete, name='delete'),
    url(r'^comment/$', add_comment, name='add'),
]
