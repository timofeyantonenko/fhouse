from django.contrib.auth import (
authenticate,
get_user_model,
login,
logout
)
from django.shortcuts import render, redirect


from .forms import UserLoginForm, UserRegisterForm


# Create your views here.

def login_view(request):
    next = request.GET.get('next')
    title = 'Вход'
    form = UserLoginForm(request.POST or None)
    if form.is_valid():
        username = form.cleaned_data.get('username')
        password = form.cleaned_data.get('password')
        user = authenticate(username=username, password=password)
        login(request, user)
        if next:
            return redirect(next)
        return redirect('/')
    context = {
        'title': title,
        'form': form
    }
    return render(request, 'form.html', context)


def register_view(request):
    next = request.GET.get('next')
    title = 'Register'
    form = UserRegisterForm(request.POST or None, request.FILES or None)
    if form.is_valid():
        user = form.save(commit=False)
        password = form.cleaned_data.get('password')
        user.set_password(password)
        user.save()
        new_user = authenticate(email=user.email, password=password)
        login(request, new_user)
        if next:
            return redirect(next)
        return redirect('/')
    else:
        print('Form not valid')

    context = {
        'title': title,
        'form': form
    }
    # return render(request, 'login/login.html', context)
    return render(request, 'login/register.html', context)


def logout_view(request):
    logout(request)
    return redirect('/')
    # return render(request, 'form.html', {})
