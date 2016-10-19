from django.db import models
from utils.files_preparing import upload_location


# Create your models here.

class Country(models.Model):
    name = models.CharField(max_length=200, unique=True)
    image = models.ImageField(upload_to=upload_location,
                              null=True, blank=True)

    def __str__(self):
        return self.name

    # @classmethod
    # def create(cls, name):
    #     country = cls(name=name)
    #     # do something with the book
    #     return book


class City(models.Model):
    name = models.CharField(max_length=200)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, null=True, blank=True)
    image = models.ImageField(upload_to=upload_location,
                              null=True, blank=True)

    def __str__(self):
        return self.name
