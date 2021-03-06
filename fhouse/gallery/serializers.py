from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField
from .models import AlbumPhoto, SectionAlbum, GallerySection
from likes.models import Like
from utils.abstract_classes import CommentedSerializer, LikedSerializer


class SectionAlbumSerializer(serializers.ModelSerializer):
    photos_count = serializers.SerializerMethodField()
    positive_likes_count = serializers.SerializerMethodField()

    class Meta:
        model = SectionAlbum
        fields = '__all__'

    def get_photos_count(self, obj):
        return obj.photos.count()

    def get_positive_likes_count(self, obj):
        return obj.positive_likes.count()


class AlbumPhotoSerializer(CommentedSerializer, LikedSerializer):
    album_title = serializers.PrimaryKeyRelatedField(many=False, read_only=True)

    class Meta:
        model = AlbumPhoto
        fields = '__all__'


class GallerySectionSerializer(serializers.ModelSerializer):
    albums = SectionAlbumSerializer(many=True, read_only=True)

    class Meta:
        model = GallerySection
        fields = '__all__'
