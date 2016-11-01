from django.contrib import admin

# Register your models here.
from .models import Post, PostTag, UserFavoriteTags


class PostModelAdmin(admin.ModelAdmin):
    list_display = ["title", "updated", "timestamp"]
    list_display_links = ["updated"]
    list_editable = ["title"]
    list_filter = ["updated", "timestamp"]
    search_fields = ["title", "content"]

    class Meta:
        model = Post


class PostTagModelAdmin(admin.ModelAdmin):
    class Meta:
        model = PostTag


admin.site.register(Post, PostModelAdmin)
admin.site.register(PostTag, PostTagModelAdmin)
admin.site.register(UserFavoriteTags)
