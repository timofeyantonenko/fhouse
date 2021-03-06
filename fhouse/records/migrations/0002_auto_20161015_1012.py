# -*- coding: utf-8 -*-
# Generated by Django 1.9.9 on 2016-10-15 10:12
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('records', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Record',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('updated', models.DateTimeField(auto_now=True)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('record_value', models.IntegerField()),
                ('record_description', models.TextField()),
                ('object_id', models.PositiveIntegerField()),
                ('slug', models.SlugField(unique=True)),
                ('owner_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contenttypes.ContentType')),
            ],
            options={
                'ordering': ['-record_value'],
            },
        ),
        migrations.CreateModel(
            name='RecordTable',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('updated', models.DateTimeField(auto_now=True)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('title', models.CharField(max_length=120)),
                ('slug', models.SlugField(unique=True)),
            ],
        ),
        migrations.AddField(
            model_name='recordgroup',
            name='slug',
            field=models.SlugField(default=1, unique=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='recordtable',
            name='record_group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='records.RecordGroup'),
        ),
        migrations.AddField(
            model_name='recordtable',
            name='user',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='record',
            name='record_table',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='records.RecordTable'),
        ),
        migrations.AddField(
            model_name='record',
            name='user',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
