from django.contrib.contenttypes.models import ContentType
from django.core.paginator import Paginator, EmptyPage
from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import csrf_protect
from django.views.generic import ListView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import GallerySection, SectionAlbum, AlbumPhoto
from .serializers import AlbumPhotoSerializer, SectionAlbumSerializer
from comments.serializers import CommentSerializer
from utils.prepare_methods import create_comment


@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def get_section_information(request):
    count_of_photo_by_pagination = 9
    count_of_albums_to_load = 6

    page = request.GET.get("page", 1)
    # page = request.GET.page
    # print("page is {}".format(page))
    section = request.GET.get('section', "Soccer")
    albums = SectionAlbum.objects.filter(album_section__section_title=section).order_by('-updated')
    print("PAGE IS: {}".format(page))
    photos = AlbumPhoto.objects.filter(photo_album__in=albums).order_by('-updated')
    paginator = Paginator(photos, count_of_photo_by_pagination)  # Show n posts per page
    photos = paginator.page(page)
    photo_serializer = AlbumPhotoSerializer(photos, many=True, context={'request': request})
    album_serializer = SectionAlbumSerializer(albums[
                                              :count_of_albums_to_load], many=True, context={'request': request})
    return Response({"photo_list": photo_serializer.data, 'albums': album_serializer.data})


@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def get_album_photos(request):
    count_of_photo_by_pagination = 9
    page = request.GET.get("page", 1)
    album_id = request.GET.get('album_id', -1)
    section = request.GET.get('section', -1)

    print("page is {}, album: {}".format(page, album_id))
    if album_id != -1:
        album = SectionAlbum.objects.get(id=album_id)
        photos = album.photos.order_by('-updated')  # [:count_of_photo_to_load]
        paginator = Paginator(photos, count_of_photo_by_pagination)  # Show n posts per page
        photos = paginator.page(page)
    else:
        albums = SectionAlbum.objects.filter(album_section__section_title=section).order_by('-updated')
        photos = AlbumPhoto.objects.filter(photo_album__in=albums).order_by('-updated')
        paginator = Paginator(photos, count_of_photo_by_pagination)  # Show n posts per page
        photos = paginator.page(page)
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


@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def get_photo_comments(request):
    count_of_comments_per_page = 10
    photo_id = request.GET.get("id_img")
    page = request.GET.get("p")
    instance = get_object_or_404(AlbumPhoto, id=photo_id)
    comments = instance.comments
    paginator = Paginator(comments, count_of_comments_per_page)  # Show n posts per page
    try:
        comments = paginator.page(page)
    except EmptyPage:
        comments = paginator.page(paginator.num_pages)
    comment_serializer = CommentSerializer(comments, many=True, context={'request': request})
    print(comment_serializer)
    return Response(comment_serializer.data)


@csrf_protect
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def add_photo_comment(request):
    content_type = ContentType.objects.get_for_model(AlbumPhoto)
    content_type = str(content_type).replace(" ", "")
    new_comment = create_comment(content_type, request)
    return Response(status=200)
