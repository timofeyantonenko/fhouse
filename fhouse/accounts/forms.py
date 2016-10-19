from django import forms
from django.contrib.auth import (
    authenticate,
    get_user_model,
    login,
    logout
)
from geohelp.models import Country, City

User = get_user_model()


class UserLoginForm(forms.Form):
    username = forms.CharField()
    password = forms.CharField(widget=forms.PasswordInput)

    def clean(self, *args, **kwargs):
        username = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')
        # user_qs = User.objects.filter(username=username)
        # if user_qs.count() == 1:
        #     user = user_qs.first()
        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise forms.ValidationError('This user does not exist.')

            if not user.check_password(password):
                raise forms.ValidationError('Incorrect password.')

            if not user.is_active:
                raise forms.ValidationError('This user is not longer active.')

        return super(UserLoginForm, self).clean(*args, **kwargs)


class UserRegisterForm(forms.ModelForm):
    first_name = forms.CharField(label='First name')
    last_name = forms.CharField(label='Last name')
    email = forms.EmailField(label='Email address')
    email2 = forms.EmailField(label='Confirm Email')
    password = forms.CharField(widget=forms.PasswordInput)
    country = forms.CharField()
    city = forms.CharField()
    avatar = forms.ImageField()
    date_of_birth = forms.DateField()

    class Meta:
        model = User
        fields = [
            'first_name',
            'last_name',
            'email',
            'email2',
            'password',
            'country',
            'city',
            'avatar',
            'date_of_birth',
        ]

    # def clean(self, *args, **kwargs):
    #     email = self.cleaned_data.get('email')
    #     email2 = self.cleaned_data.get('email2')
    #     if email != email2:
    #         raise forms.ValidationError('Emails must match')
    #
    #     email_qs = User.objects.filter(email=email)
    #     if email_qs.exists():
    #         raise forms.ValidationError('This email has already been registered.')
    #     return super(UserRegisterForm, self).clean(*args, **kwargs)

    def clean_city(self):
        city = self.cleaned_data.get('city')
        # country_name = self.cleaned_data.get('country')
        country_obj = self.clean_country()
        city_set = City.objects.filter(name=city, country=country_obj)
        if len(city_set) > 0:
            return city_set.first()
        else:
            new_city = City(country=country_obj, name=city)
            new_city.save()
            return new_city

    def clean_country(self):
        country = self.cleaned_data.get('country')
        country_set = Country.objects.filter(name=country)
        print(country_set)
        if len(country_set) > 0:
            return country_set.first()
        else:
            new_country = Country(name=country)
            new_country.save()
            return new_country

    def clean_email2(self):
        email = self.cleaned_data.get('email')
        email2 = self.cleaned_data.get('email2')
        if email != email2:
            raise forms.ValidationError('Emails must match')

        email_qs = User.objects.filter(email=email)
        if email_qs.exists():
            raise forms.ValidationError('This email has already been registered.')

        return email
