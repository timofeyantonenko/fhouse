from django.contrib import admin

# Register your models here.
from .models import GallerySection, SectionAlbum, AlbumPhoto

admin.site.register(GallerySection)
admin.site.register(SectionAlbum)
admin.site.register(AlbumPhoto)
