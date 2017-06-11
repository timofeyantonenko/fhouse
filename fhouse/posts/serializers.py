from rest_framework import serializers
from .models import Post, PostTag
from utils.abstract_classes import CommentedSerializer, LikedSerializer


class PostTitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ("title", "id")


class PostTagSerializer(serializers.ModelSerializer):
    posts_count = serializers.SerializerMethodField()

    class Meta:
        model = PostTag
        fields = "__all__"

    def get_posts_count(self, obj):
        return obj.posts.count()


class PostSerializer(CommentedSerializer, LikedSerializer):
    tag = PostTagSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = "__all__"
