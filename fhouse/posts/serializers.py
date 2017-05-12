from rest_framework import serializers
from .models import Post, PostTag


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = "__all__"


class PostTitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ("title", "id")
