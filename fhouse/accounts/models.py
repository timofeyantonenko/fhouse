from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.db import models

# Create your models here.
from football_object.models import FootballCountry
from utils.files_preparing import upload_location

from django.utils import timezone


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password,
                     is_staff, is_superuser, **extra_fields):
        """
        Creates and saves a User with the given email and password.
        """
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email,
                          is_staff=is_staff, is_active=True,
                          is_superuser=is_superuser, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        return self._create_user(email, password, False, False,
                                 **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        return self._create_user(email, password, True, True,
                                 **extra_fields)


class FHUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    # country of user
    country = models.ForeignKey(FootballCountry, on_delete=models.CASCADE, null=True, blank=True)

    # country of user
    # city = models.ForeignKey(FootballCountry, on_delete=models.CASCADE, null=True, blank=True)

    avatar = models.ImageField(upload_to=upload_location,
                               null=True, blank=True,
                               height_field="height_field",
                               width_field="width_field")

    height_field = models.IntegerField(default=0)
    width_field = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    # is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __unicode__(self):
        return self.email

    def get_short_name(self):
        return self.email

    def get_full_name(self):
        pass
