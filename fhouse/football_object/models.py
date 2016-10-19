from django.db import models
from utils.abstract_classes import FootballObject
from geohelp.models import Country


# Create your models here.

class FootballCountry(FootballObject):
    country = models.OneToOneField(Country, on_delete=models.CASCADE, null=True, blank=True)


class FootballClub(FootballObject):
    country = models.ForeignKey(FootballCountry, on_delete=models.CASCADE)


class Footballer(FootballObject):
    club = models.ForeignKey(FootballClub, on_delete=models.CASCADE)
    country = models.ForeignKey(FootballCountry, on_delete=models.CASCADE)
