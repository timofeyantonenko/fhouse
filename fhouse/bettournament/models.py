from django.conf import settings
from django.db import models

from utils.files_preparing import upload_location
from utils.abstract_classes import CommentedClass
from utils.abstract_classes import ForeignContentClass


# Create your models here.


class LeagueType(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class League(models.Model):
    """
    One object is APL, or Espana Primera
    """
    league_name = models.CharField(max_length=80)
    league_type = models.ForeignKey(LeagueType, on_delete=models.CASCADE)
    league_description = models.TextField()
    image = models.ImageField(upload_to=upload_location,
                              null=True, blank=True)

    def __str__(self):
        return self.league_name


class SeasonManager(models.Manager):
    def active(self, *args, **kwargs):
        return super(SeasonManager, self).filter(is_active=True)


class Season(models.Model):
    season_name = models.CharField(max_length=50)
    season_league = models.ForeignKey(League, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)

    objects = SeasonManager()

    def __str__(self):
        return "{}: {}".format(self.season_league, self.season_name)


class SeasonGroup(models.Model):
    group_name = models.CharField(max_length=120)
    season = models.ForeignKey(Season, on_delete=models.CASCADE)

    def __str__(self):
        return "{}:{}:{}".format(self.season.season_league, self.season.season_name, self.group_name)


class SeasonStage(CommentedClass, ForeignContentClass):
    """
    Analog of a tour, semi-final etc.
    """
    stage_name = models.CharField(max_length=80)
    stage_season = models.ForeignKey(Season, on_delete=models.CASCADE)
    is_current = models.BooleanField(default=False)

    def __str__(self):
        return '{}: {}'.format(self.stage_season, self.stage_name)


class Team(models.Model):
    team_name = models.CharField(max_length=80)
    team_short_name = models.CharField(max_length=10, null=True, blank=True)
    team_league = models.ManyToManyField(Season)
    image = models.ImageField(upload_to=upload_location,
                              null=True, blank=True)

    def __str__(self):
        return self.team_name


class TeamSeasonResult(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    group = models.ForeignKey(SeasonGroup, on_delete=models.CASCADE, null=True, blank=True)
    season = models.ForeignKey(Season, on_delete=models.CASCADE, null=True, blank=True)
    place = models.SmallIntegerField(default=0)
    games = models.SmallIntegerField(default=0)
    goals = models.SmallIntegerField(default=0)
    points = models.SmallIntegerField(default=0)

    def __str__(self):
        return "{}, {}: games: {}, goals: {}, points: {}".format(self.season, self.team, self.games,
                                                                 self.goals, self.points)


class Match(models.Model):
    stage = models.ForeignKey(SeasonStage, on_delete=models.CASCADE)

    preview = models.TextField(null=True, blank=True)

    home_goals = models.IntegerField(default=0)
    guest_goals = models.IntegerField(default=0)

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

    no_played = -1
    home_win = 0
    draw = 1
    guest_win = 2
    MATCH_RESULT_CHOICES = (
        (no_played, 'No played'),
        (home_win, 'Home win'),
        (draw, 'Draw'),
        (guest_win, 'Guest win'),
    )
    match_result = models.IntegerField(
        choices=MATCH_RESULT_CHOICES,
        default=no_played,
    )

    # if match used for bet and if we want to give some specific bonus for this match
    match_bonus = models.IntegerField(blank=True, null=True)

    # if we want to give for match name
    match_name = models.CharField(max_length=120, blank=True, null=True)

    def __str__(self):
        return '{} vs {}::{}-{}'.format(self.home_team, self.guest_team, self.stage.stage_season.season_league,
                                        self.stage)


class Coefficient(models.Model):
    home_coef = models.FloatField()
    draw_coef = models.FloatField()
    guest_coef = models.FloatField()

    match = models.OneToOneField(Match, on_delete=models.CASCADE)

    def __str__(self):
        return '{} :: h: {}; d: {}, g: {}'.format(self.match, self.home_coef, self.draw_coef, self.guest_coef)


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

    # which user make the bet
    user = models.ForeignKey(settings.AUTH_USER_MODEL, default=1)

    # for which match user make the bet
    match = models.ForeignKey(Match, on_delete=models.CASCADE)

    def __str__(self):
        return '{},  bet: {}'.format(self.match, self.user_bet)


class StageBet(models.Model):
    """
    need for setup stage bet
    """

    # we have three matches for one stage
    match_1 = models.ForeignKey(Match, on_delete=models.CASCADE, related_name='%(class)s_match1_stage', default=1)
    match_2 = models.ForeignKey(Match, on_delete=models.CASCADE, related_name='%(class)s_match2_stage', default=1)
    match_3 = models.ForeignKey(Match, on_delete=models.CASCADE, related_name='%(class)s_match3_stage', default=1)

    start_date = models.DateTimeField()
    check_date = models.DateTimeField()
    must_be_checked = models.BooleanField(default=True)

    def __str__(self):
        return 'match1: {},\nmatch2: {}\nmatch3: {}'.format(self.match_1, self.match_2, self.match_3) + \
               " id: " + str(self.id)


class UsersResult(models.Model):
    # which user make the bet
    user = models.ForeignKey(settings.AUTH_USER_MODEL, default=1)

    # three matches for every user
    result_match1 = models.OneToOneField(MatchBetFromUser, on_delete=models.CASCADE,
                                         related_name='%(class)s_match1_result', default=1)
    result_match2 = models.OneToOneField(MatchBetFromUser, on_delete=models.CASCADE,
                                         related_name='%(class)s_match2_result', default=1)
    result_match3 = models.OneToOneField(MatchBetFromUser, on_delete=models.CASCADE,
                                         related_name='%(class)s_match3_result', default=1)

    stage = models.ForeignKey(StageBet, on_delete=models.CASCADE)

    score = models.FloatField(default=0)

    def __str__(self):
        return 'user: {}, score: {}'.format(self.user, self.score)
