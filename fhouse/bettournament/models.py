from django.conf import settings
from django.contrib.auth.models import User
from django.db import models


# Create your models here.


class League(models.Model):
    """
    One object is APL, or Espana Primera
    """
    league_name = models.CharField(max_length=80)
    league_description = models.TextField()

    def __str__(self):
        return self.league_name


class Team(models.Model):
    team_name = models.CharField(max_length=80)
    team_league = models.ForeignKey(League, on_delete=models.CASCADE)

    def __str__(self):
        return self.team_name


class Match(models.Model):
    home_team = models.ForeignKey(Team, related_name='match_home_team', on_delete=models.CASCADE)
    guest_team = models.ForeignKey(Team, related_name='match_guest_team', on_delete=models.CASCADE)

    # time when match will be played
    match_time = models.DateTimeField()
    simple = 0
    continent_club = 1
    world_club = 2
    continent_nation = 3
    world_nation = 4
    special = 5
    MATCH_TYPE_CHOICES = (
        (simple, 'simple'),
        (continent_club, 'continental club match'),
        (world_club, 'world club match'),
        (continent_nation, 'continental national teams match'),
        (world_nation, 'world national teams match'),
        (special, 'special'),
    )
    match_type = models.IntegerField(
        choices=MATCH_TYPE_CHOICES,
        default=simple,
    )

    league = models.ForeignKey(League, on_delete=models.CASCADE)

    match_bonus = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return '{} vs {}'.format(self.home_team, self.guest_team)


class Coefficient(models.Model):
    home_coef = models.FloatField()
    draw_coef = models.FloatField()
    guest_coef = models.FloatField()

    match = models.OneToOneField(Match, on_delete=models.CASCADE)

    def __str__(self):
        return 'h: {}; d: {}, g: {}'.format(self.home_coef, self.draw_coef, self.guest_coef)


class MatchPreview(models.Model):
    # who added a match preview
    user = models.ForeignKey(settings.AUTH_USER_MODEL, default=1)
    # when match preview was added and updated
    updated = models.DateTimeField(auto_now=True, auto_now_add=False)
    timestamp = models.DateTimeField(auto_now=False, auto_now_add=True)

    match = models.OneToOneField(Match, on_delete=models.CASCADE)

    description = models.TextField()

    def __str__(self):
        return 'preview: {}'.format(self.match)


# class BetFromUser(models.Model):
#     # which user make the bat
#     user = models.ForeignKey(settings.AUTH_USER_MODEL, default=1)
#     match = models.ForeignKey(MatchBetFromUser, on_delete=models.CASCADE)


class MatchBetFromUser(models.Model):
    home_win = 0
    draw = 1
    guest_win = 2
    USER_BETS = (
        (home_win, 'home win'),
        (draw, 'draw'),
        (guest_win, 'guest win'),
    )
    user_bet = models.PositiveSmallIntegerField(
        choices=USER_BETS,
        default=draw,
    )
    match = models.ForeignKey(Match, on_delete=models.CASCADE)

    def __str__(self):
        return '{},  bet: {}'.format(self.match, self.user_bet)


class UsersResult(models.Model):
    # which user make the bat
    user = models.ForeignKey(settings.AUTH_USER_MODEL, default=1)
    match = models.OneToOneField(MatchBetFromUser, on_delete=models.CASCADE)
    score = models.FloatField()

    def __str__(self):
        return 'user: {} match: {}, score: {}'.format(self.user, self.match, self.score)
