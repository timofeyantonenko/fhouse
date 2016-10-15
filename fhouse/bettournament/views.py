from django.shortcuts import render


# Create your views here.

def main_bet(request):
    context = {}
    if request.user.is_authenticated():
        context['user'] = request.user
    else:
        pass
    return render(request, "bets/bet_main.html", context)
