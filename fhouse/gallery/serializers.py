from rest_framework import serializers
from .models import AlbumPhoto, SectionAlbum, GallerySection
from likes.models import Like


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


class AlbumPhotoSerializer(serializers.ModelSerializer):
    # comments = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    comments_count = serializers.SerializerMethodField()
    positive_likes_count = serializers.SerializerMethodField()
    negative_likes_count = serializers.SerializerMethodField()
    user_like = serializers.SerializerMethodField()
    # positive_likes = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    # negative_likes = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    album_title = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    # photo_album = serializers.RelatedField(read_only=True)

    class Meta:
        model = AlbumPhoto
        fields = '__all__'

    def get_comments_count(self, obj):
        return obj.comments.count()

    def get_positive_likes_count(self, obj):
        return obj.positive_likes.count()

    def get_negative_likes_count(self, obj):
        return obj.negative_likes.count()

    def get_user_like(self, obj):
        request = self.context['request']  # get the request

        likes = Like.objects.filter_by_instance(obj).filter(user=request.user)
        result = None
        if likes:
            if likes.first().like:
                result = True
            else:
                result = False
        return result


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
