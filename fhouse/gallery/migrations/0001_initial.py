# -*- coding: utf-8 -*-
# Generated by Django 1.9.9 on 2016-10-01 12:24
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='GallerySection',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('section_title', models.TextField(max_length=120)),
                ('slug', models.SlugField(unique=True)),
            ],
        ),
    ]
