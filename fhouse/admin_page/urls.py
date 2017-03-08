from django.conf.urls import url
from .views import (
    admin_page,
    show_unaccepted_news,
)

urlpatterns = [
    url(r'^$', admin_page, name="news"),
    url(r'^articles/$', admin_page, name="news"),
    url(r'^bets/$', admin_page, name="news"),
    url(r'^gallery/$', admin_page, name="news"),
    url(r'^news/$', show_unaccepted_news, name="news"),
]
