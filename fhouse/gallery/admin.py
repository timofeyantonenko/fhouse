from django.contrib import admin

# Register your models here.
from .models import GallerySection, SectionAlbum, AlbumPhoto


class SectionAlbumModelAdmin(admin.ModelAdmin):
    list_display = ["album_title",  "album_section", "updated", "timestamp"]
    # list_display_links = ["updated"]
    list_editable = ["album_title"]
    list_filter = ["updated"]
    search_fields = ["album_title", "album_section"]

    class Meta:
        model = SectionAlbum


class AlbumPhotoModelAdmin(admin.ModelAdmin):
    list_display = ["photo_title",  "photo_album", "updated", "timestamp"]
    # list_display_links = ["updated"]
    list_editable = ["photo_title"]
    list_filter = ["updated", "timestamp"]
    search_fields = ["photo_title", "photo_album"]

    class Meta:
        model = AlbumPhoto


admin.site.register(GallerySection)
admin.site.register(SectionAlbum, SectionAlbumModelAdmin)
admin.site.register(AlbumPhoto, AlbumPhotoModelAdmin)
