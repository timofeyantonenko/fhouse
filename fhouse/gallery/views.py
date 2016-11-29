from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404, render_to_response
from django.views.generic import ListView
from .models import GallerySection, SectionAlbum, AlbumPhoto


# Create your views here.
def gallery_sections(request):  # list items
    sections_set = GallerySection.objects.all()
    section_result_dict = {}
    for section in sections_set:
        albums = section.albums
        section_result_dict[section] = {
            "updated": section.updated,
            "albums": albums,
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


class PhotoList(ListView):
    model = AlbumPhoto
    template_name = 'gallery/slider_photo_list.html'
    context_object_name = 'photo_list'
    paginate_by = 5

    def get_queryset(self):
        section = self.request.GET.get('section')
        if section:
            albums = SectionAlbum.objects.filter(album_section__section_title=section)
            photos = AlbumPhoto.objects.filter(photo_album__in=albums)
            print('SECTION: {}, PHOTOS: {}'.format(section, photos))
        else:
            photos = AlbumPhoto.objects.all()
        return photos


class LastSectionPhotoList(ListView):
    model = SectionAlbum
    template_name = 'gallery/main_section_list.html'
    context_object_name = 'last_photos'
    paginate_by = 5

    def get_context_data(self, **kwargs):

        context = super(LastSectionPhotoList, self).get_context_data(**kwargs)
        last_photos = []
        sections = GallerySection.objects.all()
        for section in sections:
            albums = section.albums
            last_photo = AlbumPhoto.objects.filter(photo_album__in=albums).order_by('-timestamp')[0]
            last_photos.append(last_photo)
        context['last_photos'] = last_photos
        return context

        section = self.request.GET.get('section')
        if section:
            albums = SectionAlbum.objects.filter(album_section__section_title=section)
            photos = AlbumPhoto.objects.filter(photo_album__in=albums)
        else:
            photos = AlbumPhoto.objects.all()
        return photos

