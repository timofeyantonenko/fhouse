from django.conf.urls import url
from .views import (
    main_bet,
    all_reviews,
    get_bet_stage_info,
    make_bet,
)

urlpatterns = [
    url(r'^get_bet_stage_info/$', get_bet_stage_info),
    url(r'^make_bet/$', make_bet),
    url(r'^$', main_bet, name="bets"),
    url(r'^all_reviews/$', all_reviews),
]
