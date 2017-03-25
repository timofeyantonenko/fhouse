from django.shortcuts import render

# project import
from posts.models import Post


# Create your views here.

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
