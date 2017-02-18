from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import StageBetSerializer

from .models import StageBet, League


# Create your views here.

def main_bet(request):
    """
    main page of the bets
    :param request:
    :return:
    """
    context = {}
    if request.user.is_authenticated():
        context['user'] = request.user
    else:
        pass
    # we take current bet. BE AWARE - it must be only one object
    current_week_bet = StageBet.objects.filter(must_be_checked=True).first()
    context['current_week_bet'] = current_week_bet

    # Lat's take all of leagues
    leagues = League.objects.all()
    context['leagues'] = leagues
    return render(request, "bets/bet_main.html", context)


def all_reviews(request):
    context = {}
    if request.user.is_authenticated():
        context['user'] = request.user
    else:
        pass
    return render(request, "bets/all_reviews.html", context)


@api_view(['GET'])
def get_bet_stage_info(request):
    context = {}
    # we take current bet. BE AWARE - it must be only one object
    current_week_bet = StageBet.objects.filter(must_be_checked=True).first()
    bet_serializer = StageBetSerializer(current_week_bet, many=False, context={'request': request})
    return Response({'stage_bet': bet_serializer.data})
    context['current_week_bet'] = current_week_bet
    count_of_photo_to_load = 15
    count_of_albums_to_load = 6
    album_id = request.GET.get('album_id', 1)
    album = SectionAlbum.objects.get(id=album_id)
    photos = album.photos.order_by('-updated')[:count_of_photo_to_load]
    photo_serializer = AlbumPhotoSerializer(photos, many=True, context={'request': request})
    return Response({"photo_list": photo_serializer.data})
