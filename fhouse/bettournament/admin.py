from django.contrib import admin

# Register your models here.
from .models import Match, MatchBetFromUser,\
    Team, Coefficient, UsersResult,\
    League, SeasonStage, Season, TeamSeasonResult, Championat, ChampionatGroup, ChampionatType
from .models import StageBet


admin.site.register(League)
admin.site.register(Team)
admin.site.register(Championat)
admin.site.register(ChampionatGroup)
admin.site.register(TeamSeasonResult)
admin.site.register(Match)
admin.site.register(MatchBetFromUser)
admin.site.register(Coefficient)
admin.site.register(UsersResult)
admin.site.register(SeasonStage)
admin.site.register(Season)
admin.site.register(StageBet)
admin.site.register(ChampionatType)
