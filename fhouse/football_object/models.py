from django.conf import settings
from django.db import models


# Create your models here.

class FootballObject(models.Model):

    name = models.CharField(max_length=200)

    # who added a record
    user = models.ForeignKey(settings.AUTH_USER_MODEL, default=1)
    # when record was added and updated
    updated = models.DateTimeField(auto_now=True, auto_now_add=False)
    timestamp = models.DateTimeField(auto_now=False, auto_now_add=True)

    def __str__(self):
        return self.name
