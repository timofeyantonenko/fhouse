from django.conf.urls import url
from .views import (
    record_groups,
    group_tables,
    table_records,
    record_detail,
    get_main_page_record_list,
    RecordList,
    # post_update
)

urlpatterns = [
    url(r'^$', record_groups, name="groups"),
    url(r'^table_list/$', RecordList.as_view(), name="table_list"),
    url(r'^get_main_page_record_list/$', get_main_page_record_list),
    url(r'^(?P<slug>[\w-]+)/$', group_tables, name='group_tables'),
    url(r'^(?P<group_slug>[\w-]+)/(?P<table_slug>[\w-]+)/$', table_records, name='table_records'),
    url(r'^(?P<group_slug>[\w-]+)/(?P<table_slug>[\w-]+)/(?P<record_slug>[\w-]+)/$', record_detail, name='record'),
]
