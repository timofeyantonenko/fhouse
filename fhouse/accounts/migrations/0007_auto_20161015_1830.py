# -*- coding: utf-8 -*-
# Generated by Django 1.9.9 on 2016-10-15 18:30
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('geohelp', '0001_initial'),
        ('accounts', '0006_remove_fhuser_is_admin'),
    ]

    operations = [
        migrations.AddField(
            model_name='fhuser',
            name='city',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='geohelp.City'),
        ),
        migrations.AlterField(
            model_name='fhuser',
            name='country',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='geohelp.Country'),
        ),
    ]
