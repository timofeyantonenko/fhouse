import json

from django.http import HttpResponse
from django.core import serializers
from django.http import JsonResponse
from django.forms.models import model_to_dict
from django.shortcuts import render, get_object_or_404, render_to_response
from django.views.generic import ListView
from .models import GallerySection, SectionAlbum, AlbumPhoto
from .serializers import AlbumPhotoSerializer, SectionAlbumSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def get_section_information(request):
    count_of_photo_to_load = 15
    count_of_albums_to_load = 6
    section = request.GET.get('section')
    if not section:
        section = 'Soccer'
    if section:
        albums = SectionAlbum.objects.filter(album_section__section_title=section).order_by('-updated')[
                 :count_of_albums_to_load]
        photos = AlbumPhoto.objects.filter(photo_album__in=albums).order_by('-updated')[:count_of_photo_to_load]
        photo_serializer = AlbumPhotoSerializer(photos, many=True, context={'request': request})
        album_serializer = SectionAlbumSerializer(albums, many=True, context={'request': request})
    return Response({"photo_list": photo_serializer.data, 'albums': album_serializer.data})


@api_view(['GET'])
def get_album_photos(request):
    count_of_photo_to_load = 15
    count_of_albums_to_load = 6
    album_id = request.GET.get('album_id', 1)
    album = SectionAlbum.objects.get(id=album_id)
    photos = album.photos.order_by('-updated')[:count_of_photo_to_load]
    photo_serializer = AlbumPhotoSerializer(photos, many=True, context={'request': request})
    return Response({"photo_list": photo_serializer.data})


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


# def get_section_information(request):
#     count_of_photo_to_load = 15
#     count_of_albums_to_load = 6
#     section = request.GET.get('section')
#     if section:
#
#         photos_list = []
#         albums = SectionAlbum.objects.filter(album_section__section_title=section).order_by('-updated')[
#                  :count_of_albums_to_load]
#         photos = AlbumPhoto.objects.filter(photo_album__in=albums).order_by('-updated')[:count_of_photo_to_load]
#         for photo in photos:
#             photos_list.append(
#                 {'url': photo.image.url, 'name': photo.photo_title, 'album': photo.photo_album.album_title,
#                  'comments': serializers.serialize('json', photo.comments),
#                  'likes': serializers.serialize('json', photo.likes)})
#         print(photos_list)
#         print('SECTION: {}, ALBUMS: {}, PHOTOS: {}'.format(section, albums, photos))
#     else:
#         photos = AlbumPhoto.objects.all().order_by('-timestamp')[:count_of_photo_to_load]
#     context = {
#         'photo_list': photos_list,  # serializers.serialize('json', photos),
#         'albums': serializers.serialize('json', albums, fields=('image', 'album_title')),
#     }
#     context = json.dumps(context)
#     # return HttpResponse(content=context, content_type='json')
#     print(json.dumps(context))
#     return JsonResponse(data=context, safe=False)
#     # return render_to_response(template_name='gallery/slider_photo_list.html', content_type='html', context=context)


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
