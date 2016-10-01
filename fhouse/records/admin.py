from django.contrib import admin

# Register your models here.
from .models import RecordGroup, RecordTable, Record

admin.site.register(RecordGroup)
admin.site.register(RecordTable)
admin.site.register(Record)
