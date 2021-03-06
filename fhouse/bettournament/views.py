from datetime import datetime, timedelta

from django.contrib.contenttypes.models import ContentType
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from django.db.models import Sum
from django.utils import timezone

from django.shortcuts import render, get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import StageBetSerializer, TeamSeasonResultSerializer, MatchSerializer, SeasonStageSerializer, \
    SeasonSerializer, UsersResultSerializer, StageBetListSerializer
from .forms import SeasonStageForm
from django.views.decorators.csrf import csrf_protect

from .models import StageBet, MatchBetFromUser, UsersResult, TeamSeasonResult, Match, SeasonStage, Season, \
    LeagueType, SeasonGroup
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
    seasons_list = []
    seasons = Season.objects.filter(is_active=True)
    for season in seasons:
        seasons_list.append({
            "id": season.id,
            "name": season.season_league.league_name,
            "img": season.season_league.image.url,
        })
        active_tour = SeasonStage.objects.filter(is_current=True).filter(stage_season=season).first()
        if active_tour:
            seasons_list[-1]["tour"] = {
                "id": active_tour.id,
                "name": active_tour.stage_name
            }
    context['active_seasons'] = seasons_list
    return render(request, "bets/bet_main.html", context)


def all_reviews(request):
    context = {}
    active_seasons = Season.objects.active()
    context["seasons"] = active_seasons

    championats_dict = {}
    championat_types = LeagueType.objects.all()
    for championat_type in championat_types:
        championats_dict[championat_type.name] = {}
        seasons = Season.objects.filter(season_league__league_type=championat_type)
        for season in seasons:
            championats_dict[championat_type.name][season.season_league.league_name] = {"id": season.id}
            groups = SeasonGroup.objects.filter(season=season)
            if groups:
                championats_dict[championat_type.name][season.season_league.league_name]["groups"] = []
                for group in groups:
                    championats_dict[championat_type.name][season.season_league.league_name]["groups"].append({
                        "name": group.group_name,
                        "id": group.id,
                    })

    context["championats_dict"] = championats_dict

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
    if "season" in request.GET:
        season_id = request.GET.get("season")
        season = Season.objects.filter(id=season_id)
        all_teams = TeamSeasonResult.objects.filter(season=season)
    else:
        group_id = request.GET.get("group")
        group = SeasonGroup.objects.filter(id=group_id)
        all_teams = TeamSeasonResult.objects.filter(group=group)
    # context = {}
    league_serializer = TeamSeasonResultSerializer(all_teams, many=True, context={'request': request})
    return Response(league_serializer.data)


@csrf_protect
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def make_bet(request):
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
    context = {}
    period = request.GET.get("period", "all")
    page = int(request.GET.get("p", 1))
    pagination = int(request.GET.get("offset", 10))
    days = None
    if period == "month":
        days = 7
    elif period == "season":
        days = 30

    if days:
        today = timezone.now()
        begin_check_date = today - timedelta(days=days)
        all_stages = StageBet.objects.filter(check_date__gte=begin_check_date)
        user_results = UsersResult.objects.filter(stage__in=all_stages).values("user__first_name",
                                                                               "user__last_name",
                                                                               "user__avatar").annotate(
            score=Sum('score')).order_by('-score')
    else:
        user_results = UsersResult.objects.all().values("user__first_name",
                                                        "user__last_name",
                                                        "user__avatar").annotate(
            score=Sum('score')).order_by('-score')
    result = user_results[(page - 1) * pagination:page * pagination]
    context["users_table"] = result
    context["all_users"] = len(user_results)
    return Response(context)


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


@api_view(['GET'])
def get_season_weeks(request):
    season = request.GET.get("season", 1)
    weeks = SeasonStage.objects.filter(stage_season__id=season)
    weeks_serializer = SeasonStageSerializer(weeks, many=True)
    return Response(weeks_serializer.data)


@csrf_protect
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def add_season_stage(request):
    season_stage_form = SeasonStageForm(request.POST)
    if season_stage_form.is_valid():
        print(season_stage_form.cleaned_data)
        season_stage_form.save()
        # print(season_stage_form.cleaned_data["st"])
    # season = request.GET.get("season", 1)
    # start_date = request.GET.get("sd", 1)
    # end_date = request.GET.get("ed", 1)
    # name = request.GET.get("name")
    # weeks = SeasonStage.objects.filter(stage_season__id=season)
    # weeks_serializer = SeasonStageSerializer(weeks, many=True)
    return Response({})  # weeks_serializer.data)


@api_view(['GET'])
def get_active_seasons(request):
    active_seasons = Season.objects.active()
    season_serializers = SeasonSerializer(active_seasons, many=True)
    return Response(season_serializers.data)


@api_view(['GET'])
def get_active_seasons(request):
    active_seasons = Season.objects.active()
    season_serializers = SeasonSerializer(active_seasons, many=True)
    return Response(season_serializers.data)


@csrf_protect
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def add_stage_comment(request):
    content_type = ContentType.objects.get_for_model(SeasonStage)
    content_type = str(content_type).replace(" ", "")
    new_comment = create_comment(content_type, request)
    return Response(status=200)


@api_view(["GET"])
def get_user_stage_bet_info(request):
    bet_stage_id = request.GET.get("stage_id", 1)
    stage_user_result = UsersResult.objects.filter(stage__id=bet_stage_id, user=request.user).first()
    if stage_user_result:
        result_serializer = UsersResultSerializer(stage_user_result, many=False)
        return Response(result_serializer.data)
    else:
        return get_bet_stage_info(request)


@api_view(["GET"])
def get_bet_stages(request):
    stages = StageBet.objects.all()
    return Response(stages.values_list("id", flat=True))
