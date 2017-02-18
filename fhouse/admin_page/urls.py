from django.conf.urls import url
from .views import (
    admin_page,
)

urlpatterns = [
    url(r'^$', admin_page, name="sections"),
]
