from rest_framework import serializers
from .models import Comment
from accounts.serializers import FHUserSerializer


class CommentSerializer(serializers.ModelSerializer):
    user = FHUserSerializer(many=False, read_only=True)

    class Meta:
        model = Comment
        fields = "__all__"
