"""
 File for storing methods for common use
"""


def upload_location(instance, filename):
    return "{}/{}".format(instance.id, filename)
