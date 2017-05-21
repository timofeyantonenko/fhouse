from rest_framework import serializers
from .models import StageBet, SeasonStage, Match, Team, Coefficient, TeamSeasonResult


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
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


class SeasonStageSerializer(serializers.ModelSerializer):

    class Meta:
        model = SeasonStage
        fields = '__all__'

# class SectionAlbumSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = SectionAlbum
#         fields = '__all__'
#
#
# class GallerySectionSerializer(serializers.HyperlinkedModelSerializer):
#     class Meta:
#         model = GallerySection
#         fields = '__all__'


# class AlbumPhotoSerializer(serializers.ModelSerializer):
#     comments = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
#     positive_likes = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
#     negative_likes = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
#     album_title = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
#
#     # photo_album = serializers.RelatedField(read_only=True)
#
#     class Meta:
#         model = AlbumPhoto
#         fields = '__all__'
