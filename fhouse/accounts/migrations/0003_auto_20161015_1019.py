# -*- coding: utf-8 -*-
# Generated by Django 1.9.9 on 2016-10-15 10:19
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_auto_20161015_1018'),
    ]

    operations = [
        migrations.AddField(
            model_name='fhuser',
            name='is_admin',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='fhuser',
            name='is_staff',
            field=models.BooleanField(default=False),
        ),
    ]
