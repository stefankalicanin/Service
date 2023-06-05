from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import User
from django.conf import settings


class CustomUser(AbstractUser):

    class Role(models.TextChoices):
        ADMIN = "ADMIN"
        USER = "USER"
        REPAIR_DIAGNOSTIC = "REPAIR_DIAGNOSTIC"
        REPAIR_TROUBLESHOOTING = "REPAIR_TROUBLESHOOTING"

    role = models.CharField(max_length=25, choices=Role.choices)


class Location(models.Model):
    country = models.CharField(max_length=20)
    city = models.CharField(max_length=20)
    address = models.CharField(max_length=20)

    def __str__(self) -> str :
        return self.country


class UserProfile(models.Model):
    birthday = models.DateField()
    gender = models.CharField(max_length=6)
    privileges = models.BooleanField()
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    location = models.OneToOneField(
        Location,
        on_delete=models.SET_NULL,
        null=True
    )

    def __str__(self) -> str :
        return self.user.username


class RepairerProfile(models.Model):
    birthday = models.DateField()
    gender = models.CharField(max_length=10)
    salary = models.FloatField()
    rating = models.IntegerField()
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    def __str__(self) -> str :
        return self.user.username


class Category(models.Model):
    name = models.TextField()
    big_size = models.BooleanField()

    def __str__(self) -> str :
        return self.name


class Device(models.Model):
    name = models.TextField()
    description = models.TextField()
    price = models.FloatField()
    under_warranty = models.BooleanField()
    quantity = models.IntegerField()
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE
    )
    main_device = models.ForeignKey(
        'self',
        null=True,
        related_name="device",
        on_delete=models.CASCADE,
        blank=True
    )

    def __str__(self) -> str :
        return self.name
    
    
class ScheduleAppointment(models.Model):
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    is_done = models.BooleanField()
    repairer_profile = models.ForeignKey(
        RepairerProfile,
        on_delete = models.CASCADE
    )

    def __str__(self) -> str :
        return str(self.start_time)
    

class DiagnosticsRequest(models.Model):
    type_house = models.BooleanField()
    date = models.DateTimeField()
    ready_for_repair = models.BooleanField(default=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    device = models.ForeignKey(
        Device,
        on_delete=models.DO_NOTHING
    )
    schedule_appointment = models.ForeignKey(
        ScheduleAppointment,
        on_delete=models.CASCADE
    )

    def __str__(self) -> str :
        return str(self.date)
    

class Troubleshooting(models.Model):


    class TypeOfTroubleshooting(models.TextChoices):
        REPLACE = "REPLACE"
        REPAIR = "REPAIR"


    type = models.CharField(max_length=7, choices=TypeOfTroubleshooting.choices)  
    date = models.DateTimeField() 
    schedule_appointment = models.ForeignKey(
        ScheduleAppointment,
        on_delete=models.CASCADE
    )
    diagnostic_request = models.ForeignKey(
        DiagnosticsRequest,
        on_delete=models.CASCADE
    )

    def __str__(self) -> str :
        return self.type


class Pricing(models.Model):
    price = models.FloatField()
    discount_quota = models.FloatField()

    def __str__(self) -> str :
        return str(self.price)


class DiagnosticReport(models.Model):
    description = models.TextField()
    device = models.ForeignKey(
        Device,
        on_delete=models.CASCADE
    )
    diagnostic_request = models.OneToOneField(
        DiagnosticsRequest,
        on_delete=models.CASCADE
    )
    price = models.OneToOneField(
        Pricing,
        on_delete=models.SET_NULL,
        null=True
    )

    def __str__(self) -> str :
        return self.description
    

class Order(models.Model):
    date = models.DateTimeField()
    quantity = models.IntegerField()
    device = models.ForeignKey (
        Device,
        on_delete = models.CASCADE
    )




    



