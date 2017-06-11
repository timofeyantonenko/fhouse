from django import forms
from pagedown.widgets import PagedownWidget

from .models import Post, PostTag


# class PostForm(forms.ModelForm):
#     content = forms.CharField(widget=PagedownWidget(show_preview=False))
#     publish = forms.DateField(widget=forms.SelectDateWidget)
#
#     class Meta:
#         model = Post
#         fields = [
#             "title",
#             "content",
#             "image",
#             "draft",
#             "publish",
#         ]

class PostTagForm(forms.ModelForm):
    class Meta:
        model = PostTag
        fields = ['name']


class PostForm(forms.Form):
    content = forms.CharField(label='content', widget=forms.Textarea(attrs={'placeholder': 'Текст новости...',
                                                                            'class': 'type'}))
    image_url = forms.CharField(label='post_image_url',
                                widget=forms.Textarea(attrs={'placeholder': "Ссылка на изображения",
                                                             'class': 'linkImg'}))
