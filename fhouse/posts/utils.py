import datetime
import re
import math
from django.utils.html import strip_tags


def count_words(html_string):
    """
    :param html_string:
    :return: count of words in input param
    """
    word_string = strip_tags(html_string)
    matching_words = re.findall(r'\w+', word_string)
    count = len(matching_words)
    return count


def get_read_time(html_string):
    count = count_words(html_string)
    read_time_min = math.ceil(count / 200.0)  # assuming 200 wpm
    # read_time_sec = read_time_min * 60.0
    # read_time = str(datetime.timedelta(seconds=read_time_sec))
    read_time = datetime.timedelta(minutes=read_time_min)
    return read_time
