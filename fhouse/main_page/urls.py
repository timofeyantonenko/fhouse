from django.conf.urls import url
from .views import (
show_main,
show_user_profile,
)


urlpatterns = [
    url(r'^$', show_main, name="base_main"),
    url(r'^user/$', show_user_profile, name="main_user_profile"),
]
