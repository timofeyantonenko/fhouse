from rest_framework import serializers
from .models import AlbumPhoto, SectionAlbum, GallerySection
from likes.models import Like
from utils.abstract_classes import CommentedSerializer, LikedSerializer


class SectionAlbumSerializer(serializers.ModelSerializer):
    # photos = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    photos_count = serializers.SerializerMethodField()
    positive_likes_count = serializers.SerializerMethodField()

    class Meta:
        model = SectionAlbum
        fields = '__all__'

    def get_photos_count(self, obj):
        return obj.photos.count()

    def get_positive_likes_count(self, obj):
        return obj.positive_likes.count()


class GallerySectionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = GallerySection
        fields = '__all__'


class AlbumPhotoSerializer(CommentedSerializer, LikedSerializer):
    album_title = serializers.PrimaryKeyRelatedField(many=False, read_only=True)

    class Meta:
        model = AlbumPhoto
        fields = '__all__'


# class AlbumPhotoRelatedField(serializers.RelatedField):
#     """
#     A custom field to use for the `tagged_object` generic relationship.
#     """
#
#     def to_internal_value(self, data):
#         print('Here')
#         pass
#
#     def to_representation(self, value):
#         """
#         Serialize tagged objects to a simple textual representation.
#         """
#         if isinstance(value, SectionAlbum):
#             return 'Bookmark: ' + value.album_title
#         # elif isinstance(value, Note):
#         #     return 'Note: ' + value.text
#         raise Exception('Unexpected type of tagged object')
