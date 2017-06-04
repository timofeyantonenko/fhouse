from rest_framework import serializers
from .models import SectionArticle
from accounts.serializers import FHUserSerializer


class SectionArticleSerializer(serializers.ModelSerializer):
    user = FHUserSerializer(many=False, read_only=True)
    # comments_count = serializers.SerializerMethodField()
    # positive_likes_count = serializers.SerializerMethodField()
    # negative_likes_count = serializers.SerializerMethodField()
    # album_title = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    # photo_album = serializers.RelatedField(read_only=True)

    class Meta:
        model = SectionArticle
        fields = '__all__'

        # def get_comments_count(self, obj):
        #     return obj.comments.count()
        #
        # def get_positive_likes_count(self, obj):
        #     return obj.positive_likes.count()
        #
        # def get_negative_likes_count(self, obj):
        #     return obj.negative_likes.count()
