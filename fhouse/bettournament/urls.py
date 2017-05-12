from django.conf.urls import url
from .views import (
    main_bet,
    all_reviews,
    get_bet_stage_info,
    make_bet,
    get_bet_result_table,
    get_all_bet_rating,
    get_league_status,
    get_stage_matches,
    get_stage_comments,
    add_stage_comment,
)

urlpatterns = [
    url(r'^get_bet_stage_info/$', get_bet_stage_info),
    url(r'^get_league_status/$', get_league_status),
    url(r'^all_bet_rating/$', get_all_bet_rating),
    url(r'^get_stage_matches/$', get_stage_matches),
    url(r'^get_stage_comments/$', get_stage_comments),
    url(r'^add_stage_comment/$', add_stage_comment),
    url(r'^make_bet/$', make_bet),
    url(r'^$', main_bet, name="bets"),
    url(r'^all_reviews/$', all_reviews),
    url(r'^get_rating/$', get_bet_result_table),
]
