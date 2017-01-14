from rest_framework import serializers
from .models import AlbumPhoto, SectionAlbum, GallerySection


class SectionAlbumSerializer(serializers.ModelSerializer):
    class Meta:
        model = SectionAlbum
        fields = '__all__'


class GallerySectionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = GallerySection
        fields = '__all__'


class AlbumPhotoSerializer(serializers.ModelSerializer):
    comments = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    positive_likes = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    negative_likes = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    album_title = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    # photo_album = serializers.RelatedField(read_only=True)

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
