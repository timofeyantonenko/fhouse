from django.conf.urls import url
from .views import (
    admin_page,
    show_unaccepted_news,
    show_articles,
    show_bets,
    add_photo_page,
)

urlpatterns = [
    url(r'^$', admin_page, name="news"),
    url(r'^articles/$', show_articles, name="news"),
    url(r'^bets/$', show_bets, name="news"),
    url(r'^gallery/$', add_photo_page, name="news"),
    url(r'^news/$', show_unaccepted_news, name="news"),
]
