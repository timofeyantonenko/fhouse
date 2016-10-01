from django.contrib import admin

# Register your models here.
from .models import Match, MatchBetFromUser, MatchPreview, Team, Coefficient, UsersResult, League


admin.site.register(League)
admin.site.register(Team)
admin.site.register(Match)
admin.site.register(MatchBetFromUser)
admin.site.register(MatchPreview)
admin.site.register(Coefficient)
admin.site.register(UsersResult)
