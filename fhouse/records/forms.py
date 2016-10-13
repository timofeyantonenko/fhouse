from django import forms
from django.contrib import admin
from pagedown.widgets import PagedownWidget
from django.contrib.admin.widgets import ForeignKeyRawIdWidget
from django.db.models.fields.related import ManyToOneRel
from .widgets import ContentTypeSelect

from football_object.models import FootballCountry, FootballClub, Footballer
from .models import Record
from django.contrib.admin.sites import site


class AdminRecordForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(AdminRecordForm, self).__init__(*args, **kwargs)

        try:
            model = self.instance.owner_type.model_class()
            model_key = model._meta.pk.name
        except:
            model = Footballer
            model_key = 'id'

        self.fields['object_id'].widget = ForeignKeyRawIdWidget(
            rel=ManyToOneRel(model._meta.get_field('id'), model, model_key,
                             ),
            admin_site=site)
        print('<<<<<<<<>>>>>>>>>>')
        print(model._meta.get_field('id'))
        print(self.fields['owner_type'].widget.attrs)
        print(self.fields['owner_type'].widget.choices)
        self.fields['owner_type'].widget.widget = ContentTypeSelect('lookup_id_object_id',
                                                                    self.fields['owner_type'].widget.attrs,
                                                                    self.fields['owner_type'].widget.choices)

    class Meta:
        model = Record
        fields = "__all__"
