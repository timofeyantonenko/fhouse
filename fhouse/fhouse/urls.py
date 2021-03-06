"""fhouse URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.static import static
from django.contrib import admin

from accounts.views import (login_view, register_view, logout_view)

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^accounts/', include('allauth.urls')),
    url(r'^comments/', include("comments.urls", namespace='comments')),
    url(r'^likes/', include("likes.urls", namespace='likes')),
    url(r'^posts/', include("posts.urls", namespace='posts')),
    url(r'^bets/', include("bettournament.urls", namespace='bets')),
    url(r'^records/', include("records.urls", namespace='records')),
    url(r'^gallery/', include("gallery.urls", namespace='gallery')),
    url(r'^articles/', include("article.urls", namespace='article')),
    url(r'^admin_page/', include("admin_page.urls", namespace='admin_page')),
    url(r'^login/', login_view, name='login'),
    url(r'^logout/', logout_view, name='logout'),
    url(r'^register/', register_view, name='register'),
    url(r'^', include("main_page.urls", namespace='main')),
    # url(r'^posts/$', views.post_home)
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
