from rest_framework import serializers
from .models import SectionArticle
from accounts.serializers import FHUserSerializer


class SectionArticleSerializer(serializers.ModelSerializer):
    user = FHUserSerializer(many=False, read_only=True)
    section_slug = serializers.ReadOnlyField(source='article_section.slug', read_only=True)

    class Meta:
        model = SectionArticle
        fields = '__all__'
