from django.contrib import admin

# Register your models here.
from .models import FootballCountry, FootballClub, Footballer

admin.site.register(FootballCountry)
admin.site.register(FootballClub)
admin.site.register(Footballer)
