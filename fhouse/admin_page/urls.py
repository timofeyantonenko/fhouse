from django.conf.urls import url
from .views import (
    admin_page,
    show_unaccepted_news,
    show_articles,
    show_bets,
    add_photo_page,
    update_results
)

urlpatterns = [
    url(r'^$', admin_page, name="news"),
    url(r'^articles/$', show_articles, name="news"),
    url(r'^bets/$', show_bets, name="news"),
    url(r'^gallery/$', add_photo_page, name="news"),
    url(r'^news/$', show_unaccepted_news, name="news"),
    url(r'^bets/update_results/$', update_results, name="bets"),
]
