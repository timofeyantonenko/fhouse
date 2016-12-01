from django.conf.urls import url
from .views import (
    post_list,
    post_create,
    post_delete,
    post_detail,
    post_update,
    show_tabs,
    PostList,
    user_tag_delete,
    user_tag_add,
    change_user_tags,
)

urlpatterns = [
    url(r'^$', post_list, name="list"),
    url(r'^ajax_post_list/$', PostList.as_view()),
    url(r'^delete_user_tag/$', user_tag_delete),
    url(r'^change_user_tags/$', change_user_tags),
    url(r'^add_user_tag/$', user_tag_add),
    url(r'^tabs/$', show_tabs),
    url(r'^create/$', post_create),
    url(r'^(?P<slug>[\w-]+)/$', post_detail, name='detail'),
    # url(r'^(?P<slug>\d+)/$', post_detail, name='detail'),
    url(r'^(?P<slug>[\w-]+)/edit/$', post_update, name="update"),
    url(r'^(?P<slug>[\w-]+)/delete/$', post_delete),
    # url(r'^posts/$', views.post_home)
]
