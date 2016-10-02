# -*- coding: utf-8 -*-
# Generated by Django 1.9.9 on 2016-10-01 13:51
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('gallery', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='SectionAlbum',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('album_title', models.TextField(max_length=120)),
                ('slug', models.SlugField(unique=True)),
                ('album_section', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='gallery.GallerySection')),
            ],
        ),
    ]
