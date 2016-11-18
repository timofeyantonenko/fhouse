from django import forms


class CommentForm(forms.Form):
    content_type = forms.CharField(widget=forms.HiddenInput, required=False)
    object_id = forms.IntegerField(widget=forms.HiddenInput, required=False)
    # parent_id = forms.IntegerField(widget=forms.HiddenInput, required=False)
    content = forms.CharField(label='content', widget=forms.TextInput(attrs={'placeholder': 'Оставить комментарий...'}))
