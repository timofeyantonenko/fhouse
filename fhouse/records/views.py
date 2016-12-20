from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.shortcuts import render, get_object_or_404, render_to_response
# Create your views here.
from django.views.generic import ListView

from .models import RecordGroup, RecordTable, Record


def record_groups(request):  # list items
    groups_set = RecordGroup.objects.all()
    title = "Records"
    group_table_list = []
    for group in groups_set:
        # tables = group.tables
        # tables_records_list = []
        # for table in tables:
        #     tables_records_list.append({
        #         "table": table,
        #         "records": table.records[:5],
        #     })
        #     for record in table.records:
        #         print(record.content_object)
        group_table_list.append({
            'group': group,
            # 'tables': tables_records_list,
        })

    context = {
        "groups_tables": group_table_list,
        "title": title,
    }
    return render(request, "records/records_groups.html", context)


def group_tables(request, slug=None):
    group = get_object_or_404(RecordGroup, slug=slug)
    tables = group.tables
    context = {
        "tables": tables,
        "title": group.title,
    }
    return render(request, "records/group_tables.html", context)


def table_records(request, group_slug=None, table_slug=None):
    group = RecordGroup.objects.filter(slug=group_slug)
    table = RecordTable.objects.filter(record_group=group, slug=table_slug).first()
    # table = get_object_or_404(group, slug=table_slug)
    records = table.records
    context = {
        "record_name": table.title,
        "records": records,
        "title": table.title,
    }
    return render(request, "records/table_records.html", context)


def record_detail(request, group_slug=None, table_slug=None, record_slug=None):
    group = RecordGroup.objects.filter(slug=group_slug)
    table = RecordTable.objects.filter(record_group=group, slug=table_slug)
    record = Record.objects.filter(record_table=table, slug=record_slug).first()
    context = {
        "record": record,
        "title": record.record_owner,
    }
    return render(request, "records/record_detail.html", context)


class RecordList(ListView):
    model = RecordTable
    template_name = 'records/record_group_list.html'
    context_object_name = 'record_table_list'
    first_paginate = 6
    paginate_by = 3
    allow_empty = True

    def get_context_data(self, **kwargs):
        context = super(RecordList, self).get_context_data(**kwargs)
        group = self.request.GET.get('group')
        self.paginate_by = self.get_paginate_by(None)
        if group:
            tables = RecordTable.objects.filter(record_group__title=group)
            paginator = Paginator(tables, self.paginate_by)
            page = self.request.GET.get('page')
            try:
                tables = paginator.page(page)
            except PageNotAnInteger:
                tables = paginator.page(1)
            except EmptyPage:
                tables = paginator.page(paginator.num_pages)
        else:
            tables = RecordTable.objects.all()
            paginator = Paginator(tables, self.paginate_by)
            page = self.request.GET.get('page', 1)
            try:
                tables = paginator.page(page)
            except EmptyPage as e:
                # If page is out of range (e.g. 9999), deliver last page of results.
                tables = paginator.page(paginator.num_pages)
        context['record_table_list'] = tables
        return context

    def get_paginate_by(self, queryset):
        """
        Paginate by specified value in querystring, or use default class property value.
        """
        if 'page' in self.request.GET:
            return self.paginate_by
        else:
            return self.first_paginate


def get_main_page_record_list(request):
    groups_set = RecordGroup.objects.all()
    table_list = []
    for group in groups_set:
        table = group.tables.order_by('-updated')[0]
        table_list.append({
            'table': table,
            'records': table.records[:5],
        })

    context = {
        "groups_tables": table_list,
    }
    return render_to_response(template_name="records/main_records_list.html", context=context, content_type='text/html')
