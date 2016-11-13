from django.shortcuts import render


# Create your views here.

def main_bet(request):
    context = {}
    if request.user.is_authenticated():
        context['user'] = request.user
    else:
        pass
    return render(request, "bets/bet_main.html", context)


def all_reviews(request):
    context = {}
    if request.user.is_authenticated():
        context['user'] = request.user
    else:
        pass
    return render(request, "bets/all_reviews.html", context)
