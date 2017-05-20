from datetime import datetime, timedelta

from django.contrib.contenttypes.models import ContentType
from django.core.paginator import Paginator, EmptyPage

from django.db.models import Sum
from django.utils import timezone

from django.shortcuts import render, get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import StageBetSerializer, TeamSeasonResultSerializer, MatchSerializer, SeasonStageSerializer
from django.views.decorators.csrf import csrf_protect

from .models import StageBet, League, MatchBetFromUser, UsersResult, TeamSeasonResult, Match, SeasonStage, Season
from utils.prepare_methods import create_comment
from comments.serializers import CommentSerializer


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
    active_seasons = Season.objects.active()
    context["seasons"] = active_seasons
    if request.user.is_authenticated():
        context['user'] = request.user
    else:
        pass
    return render(request, "bets/all_reviews.html", context)


@api_view(['GET'])
def get_bet_stage_info(request):
    context = {}
    # we take current bet. BE AWARE - it must be only one object
    current_week_bet = StageBet.objects.filter(must_be_checked=True).last()
    bet_serializer = StageBetSerializer(current_week_bet, many=False, context={'request': request})
    return Response({'stage_bet': bet_serializer.data})


@api_view(['GET'])
def get_league_status(request):
    all_teams = TeamSeasonResult.objects.all()
    # context = {}
    # we take current bet. BE AWARE - it must be only one object
    # current_week_bet = StageBet.objects.filter(must_be_checked=True).last()
    league_serializer = TeamSeasonResultSerializer(all_teams, many=True, context={'request': request})
    print(league_serializer)
    return Response({'league_table': league_serializer.data})


@csrf_protect
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def make_bet(request):
    print("COME IN")
    response = Response()
    if request.user.is_authenticated():
        bet_stage_id = request.POST.get("stage_id")
        bet_stage_instance = get_object_or_404(StageBet, id=bet_stage_id)

        if UsersResult.objects.filter(stage=bet_stage_instance, user=request.user).exists():
            response.status_code = 409  # Conflict :: already exist
        else:
            first_match_instance = bet_stage_instance.match_1
            first_match_bet = request.POST.get("first_match")
            new_first_match_bet_from_user = MatchBetFromUser(
                user_bet=first_match_bet,
                match=first_match_instance,
                user=request.user
            )

            second_match_instance = bet_stage_instance.match_2
            second_match_bet = request.POST.get("second_match")
            new_second_match_bet_from_user = MatchBetFromUser(
                user_bet=second_match_bet,
                match=second_match_instance,
                user=request.user
            )

            third_match_instance = bet_stage_instance.match_3
            third_match_bet = request.POST.get("third_match")
            new_third_match_bet_from_user = MatchBetFromUser(
                user_bet=third_match_bet,
                match=third_match_instance,
                user=request.user
            )

            new_first_match_bet_from_user.save()
            new_second_match_bet_from_user.save()
            new_third_match_bet_from_user.save()

            user_result = UsersResult(
                user=request.user,
                result_match1=new_first_match_bet_from_user,
                result_match2=new_second_match_bet_from_user,
                result_match3=new_third_match_bet_from_user,
                stage=bet_stage_instance
            )
            user_result.save()
        return response


@api_view(['GET'])
def get_bet_result_table(request):
    period = request.GET.get("period", "week")
    days = -1
    if period == "week":
        days = 7
    elif period == "month":
        days = 30

    # today = datetime.today()
    today = timezone.now()
    begin_check_date = today - timedelta(days=100)
    all_stages = StageBet.objects.filter(check_date__gte=begin_check_date)
    user_results = UsersResult.objects.filter(stage__in=all_stages).values("user__first_name",
                                                                           "user__last_name",
                                                                           "user__avatar").annotate(
        score=Sum('score')).order_by('-score')

    return Response(user_results)


@api_view(['GET'])
def get_stage_matches(request):

    tour_id = request.GET.get("tour_id")

    tour_matches = Match.objects.filter(stage__id=tour_id)

    if not tour_id:
        tour_matches = tour_matches.filter(stage__is_current=True)
    else:
        tour_matches = tour_matches.filter(stage__id=tour_id)

    comments = SeasonStage.objects.get(id=tour_id).comments.count()

    match_serializer = MatchSerializer(tour_matches, many=True, context={'request': request})
    return Response({"matches": match_serializer.data,
                     "comments_count": comments})


@api_view(['GET'])
def get_season_tours(request):
    season_id = request.GET.get("season_id")
    stages = SeasonStage.objects.filter(stage_season__id=season_id)
    stages_serializer = SeasonStageSerializer(stages, many=True, context={'request': request})
    return Response(stages_serializer.data)


def get_all_bet_rating(request):
    context = {}
    return render(request, "bets/user_rating_table.html", context)


@api_view(['GET'])
def get_stage_comments(request):
    count_of_comments_per_page = 10
    stage_id = request.GET.get("stage_id", 2)
    page = request.GET.get("p", 1)
    instance = SeasonStage.objects.get(id=stage_id)
    comments = instance.comments
    paginator = Paginator(comments, count_of_comments_per_page)  # Show n posts per page
    try:
        comments = paginator.page(page)
    except EmptyPage:
        comments = paginator.page(paginator.num_pages)
    comment_serializer = CommentSerializer(comments, many=True, context={'request': request})
    return Response(comment_serializer.data)


@csrf_protect
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def add_stage_comment(request):
    content_type = ContentType.objects.get_for_model(SeasonStage)
    content_type = str(content_type).replace(" ", "")
    new_comment = create_comment(content_type, request)
    return Response(status=200)
