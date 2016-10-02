from django.contrib import admin

# Register your models here.
from .models import ArticlesSection, SectionArticle

admin.site.register(ArticlesSection)
admin.site.register(SectionArticle)
