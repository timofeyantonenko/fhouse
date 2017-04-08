from datetime import datetime, timedelta

from django.db.models import Sum
from django.utils import timezone

from django.shortcuts import render, get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import StageBetSerializer
from django.views.decorators.csrf import csrf_protect

from .models import StageBet, League, MatchBetFromUser, UsersResult


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
    current_week_bet = StageBet.objects.filter(must_be_checked=True).last()
    bet_serializer = StageBetSerializer(current_week_bet, many=False, context={'request': request})
    return Response({'stage_bet': bet_serializer.data})


@csrf_protect
@api_view(['POST'])
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
    user_results = UsersResult.objects.filter(stage__in=all_stages).values('user').annotate(
        score=Sum('score')).order_by('-score')
    print("UR: ", user_results)
    # all_matches = set()
    # for stage in all_stages:
    #     all_matches.add(stage.match_1)
    #     all_matches.add(stage.match_2)
    #     all_matches.add(stage.match_3)
    # print(all_stages)

    return Response({'stage_bet': [1, 2, 3]})
