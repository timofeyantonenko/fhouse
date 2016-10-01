from urllib.parse import quote_plus
from django.contrib import messages
from django.contrib.contenttypes.models import ContentType
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, get_object_or_404, redirect
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import Http404
# Create your views here.

from django.utils import timezone
from .models import RecordGroup, RecordTable, Record


def record_groups(request):  # list items
    groups_set = RecordGroup.objects.all()
    print('>>>>>>>>>>>>>', groups_set)
    title = "Records"

    context = {
        "groups": groups_set,
        "title": title,
    }
    return render(request, "records/records_groups.html", context)


def group_tables(request, slug=None):
    group = get_object_or_404(RecordGroup, slug=slug)
    tables = group.tables
    print(tables)
    context = {
        "tables": tables,
        "title": group.title,
    }
    return render(request, "records/group_tables.html", context)


def table_records(request, group_slug=None, table_slug=None):
    group = RecordGroup.objects.filter(slug=group_slug)
    table = RecordTable.objects.filter(record_group=group, slug=table_slug).first()
    print('>>>>>TYPE>>>>>>>', table)
    print(request)
    # table = get_object_or_404(group, slug=table_slug)
    records = table.records
    print(records)
    context = {
        "records": records,
        "title": table.title,
    }
    return render(request, "records/table_records.html", context)


def record_detail(request, group_slug=None, table_slug=None, record_slug=None):
    group = RecordGroup.objects.filter(slug=group_slug)
    table = RecordTable.objects.filter(record_group=group, slug=table_slug)
    record = Record.objects.filter(record_table=table, slug=record_slug).first()
    print(record)
    context = {
        "record": record,
        "title": record.record_owner,
    }
    return render(request, "records/record_detail.html", context)
