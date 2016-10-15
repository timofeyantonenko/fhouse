from django.conf.urls import url
from .views import (
main_bet,
)


urlpatterns = [
    url(r'^$', main_bet, name="bets"),
]
