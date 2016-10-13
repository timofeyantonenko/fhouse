from django.conf import settings
from django.db import models
from utils.files_preparing import upload_location
from utils.abstract_classes import FootballObject


# Create your models here.

# class FootballObject(models.Model):
#     name = models.CharField(max_length=200)
#     image = models.ImageField(upload_to=upload_location,
#                               null=True, blank=True,
#                               height_field="height_field",
#                               width_field="width_field")
#
#     height_field = models.IntegerField(default=0)
#     width_field = models.IntegerField(default=0)
#
#     def __str__(self):
#         return self.name

class FootballCountry(FootballObject):
    pass


class FootballClub(FootballObject):
    country = models.ForeignKey(FootballCountry, on_delete=models.CASCADE)


class Footballer(FootballObject):
    club = models.ForeignKey(FootballClub, on_delete=models.CASCADE)
    country = models.ForeignKey(FootballCountry, on_delete=models.CASCADE)