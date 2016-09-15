from django.shortcuts import render, get_object_or_404
from django.http import HttpResponseRedirect
from django.contrib import messages
from django.contrib.contenttypes.models import ContentType
from .models import Comment
from .forms import CommentForm


# Create your views here.

def comment_thread(request, id):
    obj = get_object_or_404(Comment, id=id)
    content_object = obj.content_object
    content_id = obj.content_object.id
    initial_data = {
        "content_type": obj.content_type,
        "object_id": obj.object_id,
    }
    form = CommentForm(request.POST or None, initial=initial_data)
    print(form.errors)
    if form.is_valid():
        content_type = form.cleaned_data.get("content_type")
        content_type = ContentType.objects.get(model=content_type)
        obj_id = form.cleaned_data.get("object_id")
        content_data = form.cleaned_data.get("content")
        parent_object = None
        try:
            parent_id = int(request.POST.get("parent_id"))
        except:
            parent_id = None

        if parent_id:
            parent_qs = Comment.objects.filter(id=parent_id)
            if parent_qs.exists() and parent_qs.count() == 1:
                parent_object = parent_qs.first()

        new_comment, created = Comment.objects.get_or_create(
            user=request.user,
            content_type=content_type,
            object_id=obj_id,
            content=content_data,
            parent=parent_object
        )
        return HttpResponseRedirect(new_comment.content_object.get_absolute_url())
    context = {
        "comment": obj,
        "form": form,
    }
    return render(request, "comment_thread.html", context)
