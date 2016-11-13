from django.shortcuts import render


# Create your views here.
def show_main(request):
    return render(request, "main/main.html", {})


def show_user_profile(request):
    return render(request, "main/user_main.html", {})
