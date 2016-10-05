from django.shortcuts import render, get_object_or_404
# Create your views here.

from .models import RecordGroup, RecordTable, Record


def record_groups(request):  # list items
    groups_set = RecordGroup.objects.all()
    title = "Records"
    group_table_list = []
    for group in groups_set:
        tables = group.tables
        tables_records_list = []
        for table in tables:
            tables_records_list.append({
                "table": table,
                "records": table.records,
            })
            print(table.records)
        group_table_list.append({
            'group': group,
            'tables': tables_records_list,
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
