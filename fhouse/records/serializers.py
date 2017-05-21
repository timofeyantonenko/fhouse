from rest_framework import serializers
from .models import RecordGroup, RecordTable, Record


class RecordGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecordGroup
        fields = "__all__"


class RecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Record
        fields = "__all__"


class RecordTableSerializer(serializers.ModelSerializer):
    team = RecordSerializer(many=False, read_only=True)

    class Meta:
        model = RecordTable
        fields = "__all__"


# class MatchSerializer(serializers.ModelSerializer):
#     home_team = TeamSerializer(many=False, read_only=True)
#     guest_team = TeamSerializer(many=False, read_only=True)
#     coefficient = CoefficientSerializer(many=False, read_only=True)
#
#     class Meta:
#         model = Match
#         fields = '__all__'
#
#
# class StageBetSerializer(serializers.ModelSerializer):
#     match_1 = MatchSerializer(many=False, read_only=True)
#     match_2 = MatchSerializer(many=False, read_only=True)
#     match_3 = MatchSerializer(many=False, read_only=True)
#
#     class Meta:
#         model = StageBet
#         fields = '__all__'
#
#
# class SeasonStageSerializer(serializers.ModelSerializer):
#
#     class Meta:
#         model = SeasonStage
#         fields = '__all__'

