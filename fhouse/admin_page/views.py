from django.shortcuts import render


# Create your views here.

def admin_page(request):
    context = {'title': 'Admin Page'}
    return render(request, "admin_page/main_admin.html", context)
