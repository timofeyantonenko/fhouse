from django.shortcuts import render

# project import
from posts.models import Post
from bettournament.models import StageBet, UsersResult

# Create your views here.
from django.views.decorators.csrf import csrf_protect
from rest_framework.decorators import api_view
from rest_framework.response import Response


def admin_page(request):
    context = {'title': 'Admin Page'}
    return render(request, "admin_page/admin_news.html", context)


def show_unaccepted_news(request):
    posts_to_check = Post.objects.non_activated()
    context = {
        'posts_to_check': posts_to_check,
    }
    return render(request, "admin_page/admin_news.html", context)


def show_articles(request):
    posts_to_check = Post.objects.non_activated()
    context = {
        'posts_to_check': posts_to_check,
    }
    return render(request, "admin_page/admin_article.html", context)


def show_bets(request):
    posts_to_check = Post.objects.non_activated()
    context = {
        'posts_to_check': posts_to_check,
    }
    return render(request, "admin_page/admin_bets.html", context)


def add_photo_page(request):
    posts_to_check = Post.objects.non_activated()
    context = {
        'posts_to_check': posts_to_check,
    }
    return render(request, "admin_page/admin_photo.html", context)


@csrf_protect
@api_view(['POST'])
def update_results(request):
    # get stage info
    stage_id = request.POST.get("stage_id", 1)
    stage_object = StageBet.objects.get(id=stage_id)

    # get matches ingo
    match_1 = stage_object.match_1
    match_2 = stage_object.match_2
    match_3 = stage_object.match_3
    result_match_1 = match_1.match_result
    result_match_2 = match_2.match_result
    result_match_3 = match_3.match_result
    coef_match_1 = match_1.coefficient
    coef_match_2 = match_2.coefficient
    coef_match_3 = match_3.coefficient
    cofs = {
        1: {
            0: coef_match_1.home_coef,
            1: coef_match_1.draw_coef,
            2: coef_match_1.guest_coef,
        },
        2: {
            0: coef_match_2.home_coef,
            1: coef_match_2.draw_coef,
            2: coef_match_2.guest_coef,
        },
        3: {
            0: coef_match_3.home_coef,
            1: coef_match_3.draw_coef,
            2: coef_match_3.guest_coef,
        }
    }
    if (result_match_1 == -1) or (result_match_2 == -1) or (result_match_3 == -1):
        return Response(status=500)
    users_results = UsersResult.objects.filter(stage=stage_object)
    for user in users_results:
        if user.result_match1.user_bet == result_match_1 and user.result_match1.user_bet == result_match_1 and user.result_match1.user_bet == result_match_1:
            score = cofs[1][user.result_match1.user_bet] * cofs[2][user.result_match2.user_bet] * cofs[3][
                user.result_match3.user_bet]
            score = round(score, 2)
            user.score += score
            user.save()
    return Response()
