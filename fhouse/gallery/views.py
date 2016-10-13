from django.shortcuts import render, get_object_or_404
from .models import GallerySection, SectionAlbum, AlbumPhoto


# Create your views here.
def gallery_sections(request):  # list items
    sections_set = GallerySection.objects.all()
    section_result_dict = {}
    for section in sections_set:
        albums = section.albums
        print(len(albums))
        section_result_dict[section] = {
            "updated": section.updated,
        }
    title = "Gallery"

    context = {
        "sections": section_result_dict,
        "title": title,
    }
    return render(request, "gallery/gallery_sections.html", context)


def section_albums(request, slug=None):
    section = get_object_or_404(GallerySection, slug=slug)
    albums = section.albums
    print(albums)
    context = {
        "albums": albums,
        "title": section.section_title,
    }
    return render(request, "gallery/section_albums.html", context)


def album_photos(request, section_slug=None, album_slug=None):
    section = GallerySection.objects.filter(slug=section_slug)
    album = SectionAlbum.objects.filter(album_section=section, slug=album_slug).first()
    photos = album.photos
    context = {
        "photos": photos,
        "title": album.album_title,
    }
    return render(request, "gallery/album_photos.html", context)


def photo_detail(request, section_slug=None, album_slug=None, photo_slug=None):
    section = GallerySection.objects.filter(slug=section_slug)
    album = SectionAlbum.objects.filter(album_section=section, slug=album_slug)
    photo = AlbumPhoto.objects.filter(photo_album=album, slug=photo_slug).first()
    context = {
        "photo": photo,
        "title": photo.photo_title,
    }
    return render(request, "gallery/photo_detail.html", context)
