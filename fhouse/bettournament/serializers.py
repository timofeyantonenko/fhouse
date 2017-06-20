from rest_framework import serializers
from .models import StageBet, SeasonStage, Match, Team, Coefficient, \
    TeamSeasonResult, UsersResult, Season, MatchBetFromUser


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = "__all__"


class SeasonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Season
        fields = "__all__"


class TeamSeasonResultSerializer(serializers.ModelSerializer):
    team = TeamSerializer(many=False, read_only=True)

    class Meta:
        model = TeamSeasonResult
        fields = ("team", "games", "goals", "points", "place")


class CoefficientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coefficient
        fields = "__all__"


class MatchSerializer(serializers.ModelSerializer):
    home_team = TeamSerializer(many=False, read_only=True)
    guest_team = TeamSerializer(many=False, read_only=True)
    coefficient = CoefficientSerializer(many=False, read_only=True)

    class Meta:
        model = Match
        fields = '__all__'


class StageBetSerializer(serializers.ModelSerializer):
    match_1 = MatchSerializer(many=False, read_only=True)
    match_2 = MatchSerializer(many=False, read_only=True)
    match_3 = MatchSerializer(many=False, read_only=True)

    class Meta:
        model = StageBet
        fields = '__all__'


class MatchBetFromUserSerializer(serializers.ModelSerializer):
    match = MatchSerializer(many=False, read_only=True)

    class Meta:
        model = MatchBetFromUser
        fields = "__all__"


class UserResultStageCheckedSerializer(serializers.ModelSerializer):
    class Meta:
        model = StageBet
        fields = ("must_be_checked",)


class UsersResultSerializer(serializers.ModelSerializer):
    result_match1 = MatchBetFromUserSerializer(many=False, read_only=True)
    result_match2 = MatchBetFromUserSerializer(many=False, read_only=True)
    result_match3 = MatchBetFromUserSerializer(many=False, read_only=True)
    stage = UserResultStageCheckedSerializer(many=False, read_only=True)

    class Meta:
        model = UsersResult
        fields = ("result_match1", "result_match2", "result_match3", "stage", "score")


class StageBetListSerializer(serializers.ModelSerializer):
    class Meta:
        model = StageBet
        fields = ("id", )


class SeasonStageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SeasonStage
        fields = '__all__'
