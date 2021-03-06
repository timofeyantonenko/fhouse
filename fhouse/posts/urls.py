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
    add_comment,
    search_post,
    api_get_posts,
    get_post_comments,
    search_tags,
    att_tag,
    update_post,
)

urlpatterns = [
    url(r'^get_comments/$', get_post_comments, name='post_comments'),
    url(r'^search/$', search_post),
    url(r'^update/$', update_post, name="update_post"),
    url(r'^search/tags/$', search_tags),
    url(r'^api_get_posts/$', api_get_posts),
    url(r'^$', post_list, name="list"),
    url(r'^ajax_post_list/$', PostList.as_view()),
    url(r'^delete_user_tag/$', user_tag_delete),
    url(r'^change_user_tags/$', change_user_tags),
    url(r'^add_user_tag/$', user_tag_add),
    url(r'^tabs/$', show_tabs),
    url(r'^comment/$', add_comment),
    url(r'^create/$', post_create),
    url(r'^create/tag/$', att_tag),
    url(r'^(?P<slug>[\w-]+)/$', post_detail, name='detail'),
    # url(r'^(?P<slug>\d+)/$', post_detail, name='detail'),
    url(r'^(?P<slug>[\w-]+)/edit/$', post_update, name="update"),
    url(r'^(?P<slug>[\w-]+)/delete/$', post_delete),
    # url(r'^posts/$', views.post_home)
]
