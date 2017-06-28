"""
 File for storing methods for common use
"""


def upload_location(instance, filename):
    return "{}/{}".format(instance.id, filename)


def upload_photo_photo(instance, filename):
    return "{}/{}".format(instance.photo_album.id, filename)


def upload_album_photo(instance, filename):
    return "{}/{}".format(instance.album_section.id, filename)
