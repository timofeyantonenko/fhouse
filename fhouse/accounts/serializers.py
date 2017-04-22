from rest_framework import serializers
from .models import FHUser


class FHUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = FHUser
        fields = ("id", "first_name", "last_name", "avatar")
