from django.contrib import admin

# Register your models here.
from .forms import AdminRecordForm
from .models import RecordGroup, RecordTable, Record


class RecordAdmin(admin.ModelAdmin):
    form = AdminRecordForm


admin.site.register(RecordGroup)
admin.site.register(RecordTable)
admin.site.register(Record, RecordAdmin)
