from rest_framework import serializers
from .models import Post, PostTag
from utils.abstract_classes import CommentedSerializer, LikedSerializer


class PostTitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ("title", "id")


class PostTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostTag
        fields = "__all__"


class PostSerializer(CommentedSerializer, LikedSerializer):
    tag = PostTagSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = "__all__"
