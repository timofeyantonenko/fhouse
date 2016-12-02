from django.shortcuts import render

# project import
from posts.models import Post


# Create your views here.
def show_main(request):
    return render(request, "main/main.html", {})


def show_user_profile(request):
    user = request.user
    user_posts = Post.objects.filter(user=user)
    first_name = user.first_name
    last_name = user.last_name
    avatar_url = user.avatar.url

    context = {
        'users_posts_count': len(user_posts),
        'first_name': first_name,
        'last_name': last_name,
        'avatar_url': avatar_url,
    }
    return render(request=request, template_name="main/user_main.html", context=context)
