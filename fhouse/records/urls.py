from django.conf.urls import url
from .views import (
    record_groups,
    group_tables,
    table_records,
    record_detail,
    # post_detail,
    # post_update
)

urlpatterns = [
    url(r'^$', record_groups, name="groups"),
    url(r'^(?P<slug>[\w-]+)/$', group_tables, name='group_tables'),
    url(r'^(?P<group_slug>[\w-]+)/(?P<table_slug>[\w-]+)/$', table_records, name='table_records'),
    url(r'^(?P<group_slug>[\w-]+)/(?P<table_slug>[\w-]+)/(?P<record_slug>[\w-]+)/$', record_detail, name='record'),
]
