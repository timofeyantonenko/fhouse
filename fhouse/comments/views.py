from django.shortcuts import render, get_object_or_404
from django.http import HttpResponseRedirect, Http404, HttpResponse
from django.contrib import messages
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_protect
from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Comment
from .forms import CommentForm

from utils.prepare_methods import create_comment


# Create your views here.

@login_required  # (login_url='/login/')  # LOGIN_URL = '/login/'
def comment_delete(request, id):
    # obj = get_object_or_404(Comment, id=id)
    # obj = Comment.objects.get(id=id)
    try:
        obj = Comment.objects.get(id=id)
    except:
        raise Http404

    if obj.user != request.user:
        # messages.error(request, "You do not have permission to view this.")
        # raise Http404
        response = HttpResponse("You do not have permission to do this.")
        response.status_code = 403
        return response
        # return render(request, "confirm_delete.html", context, status_code=403)

    if request.method == "POST":
        parent_object_url = obj.content_object.get_absolute_url()
        obj.delete()
        messages.success(request, "This has been deleted.")
        return HttpResponseRedirect(parent_object_url)
    context = {
        'object': obj,
    }
    return render(request, "confirm_delete.html", context)


def comment_thread(request, id):
    # obj = get_object_or_404(Comment, id=id)
    # obj = Comment.objects.get(id=id)
    try:
        obj = Comment.objects.get(id=id)
    except:
        raise Http404

    if not obj.is_parent:
        obj = obj.parent
    content_object = obj.content_object
    content_id = obj.content_object.id
    initial_data = {
        "content_type": obj.content_type,
        "object_id": obj.object_id,
    }
    form = CommentForm(request.POST or None, initial=initial_data)
    print(form.errors)
    if form.is_valid() and request.user.is_authenticated():
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


@csrf_protect
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def add_comment(request):
    content_type = ContentType.objects.get_for_model(Comment)
    new_comment = create_comment(content_type, request)
    return Response(status=200)



