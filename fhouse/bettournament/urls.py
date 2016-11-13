from django.conf.urls import url
from .views import (
main_bet,
all_reviews,
)


urlpatterns = [
    url(r'^$', main_bet, name="bets"),
    url(r'^all_reviews/$', all_reviews),
]
