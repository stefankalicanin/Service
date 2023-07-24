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

    class Gender(models.TextChoices):
        M = "Male"
        F = "Female"

    role = models.CharField(max_length=25, choices=Role.choices)
    gender = models.CharField(max_length=6, choices=Gender.choices)
    birthday = models.DateField(null=True, blank=True)

class Location(models.Model):
    country = models.CharField(max_length=128)
    city = models.CharField(max_length=128)
    address = models.CharField(max_length=128)
    zip = models.IntegerField()
    region = models.CharField(max_length=128)
    number = models.CharField(max_length=16)

    def __str__(self) -> str :
        return self.country


class Client(models.Model):
    privileges = models.BooleanField()
    user = models.ForeignKey(
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


class Repairer(models.Model):
    salary = models.FloatField()
    rating = models.IntegerField()
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    def __str__(self) -> str :
        return self.user.username


class Category(models.Model):

    class Size(models.TextChoices):
        BIG = "BIG"
        SMALL = "SMALL"
        
    name = models.CharField(max_length=128)
    size = models.CharField(max_length=5, choices=Size.choices)

    def __str__(self) -> str :
        return self.name


class Device(models.Model):
    name = models.CharField(max_length=128)
    description = models.CharField(max_length=1024)
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
        Repairer,
        on_delete = models.CASCADE
    )

    def __str__(self) -> str :
        return str(self.start_time)
    

class DiagnosticsRequest(models.Model):

    class DiagnosticType(models.TextChoices):
        HOUSE = "HOUSE"
        IN_SERVICE = "IN SERVICE"

    type_house = models.CharField(max_length=10, choices=DiagnosticType.choices)
    date = models.DateTimeField()
    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE
    )
    device = models.ForeignKey(
        Device,
        on_delete=models.DO_NOTHING
    )
    schedule_appointment = models.OneToOneField(
        ScheduleAppointment,
        on_delete=models.CASCADE
    )

    def __str__(self) -> str :
        return str(self.date)
    
class DiagnosticReport(models.Model):

    class State(models.TextChoices):
        SUCCESSFULLY = "SUCCESSFULLY"
        UNSUCCESSFULLY = "UNSUCCESSFULLY"

    description = models.CharField(max_length=1024)
    state = models.CharField(max_length=14, choices=State.choices)
    diagnostic_request = models.OneToOneField(
        DiagnosticsRequest,
        on_delete=models.CASCADE
    )

    def __str__(self) -> str :
        return self.description
    
class Troubleshooting(models.Model):


    class TypeOfTroubleshooting(models.TextChoices):
        REPLACE = "REPLACE"
        REPAIR = "REPAIR"


    type = models.CharField(max_length=7, choices=TypeOfTroubleshooting.choices)  
    date = models.DateTimeField() 
    schedule_appointment = models.OneToOneField(
        ScheduleAppointment,
        on_delete=models.CASCADE
    )
    diagnostic_request = models.OneToOneField(
        DiagnosticsRequest,
        on_delete=models.CASCADE
    )
    diagnostic_report = models.OneToOneField(
        DiagnosticReport,
        on_delete=models.CASCADE
    )
    def __str__(self) -> str :
        return self.type


class Pricing(models.Model):
    price = models.FloatField()
    discount_quota = models.FloatField()
    schedule_appointment = models.OneToOneField(
        ScheduleAppointment,
        on_delete = models.CASCADE
    )
    def __str__(self) -> str :
        return str(self.price)


class Order(models.Model):
    date = models.DateTimeField()
    quantity = models.IntegerField()
    device = models.ForeignKey (
        Device,
        on_delete = models.CASCADE
    )


class TravelWarrant(models.Model):
    data = models.CharField(max_length=1024)
    schedule_appointment = models.OneToOneField(
        ScheduleAppointment,
        on_delete = models.CASCADE
    )


class TroubleshootingReport(models.Model):
    description = models.CharField(max_length=1024)
    state = models.CharField(max_length=14, choices=DiagnosticReport.State.choices)
    troubleshooting = models.OneToOneField(
        Troubleshooting,
        on_delete = models.CASCADE
    )

    



