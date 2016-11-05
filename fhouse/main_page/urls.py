from django.conf.urls import url
from .views import (
show_main,
)


urlpatterns = [
    url(r'^$', show_main, name="base_main"),
]
