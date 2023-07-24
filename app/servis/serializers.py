from rest_framework import serializers

from core.models import Client, DiagnosticsRequest, ScheduleAppointment, Repairer, Category, Device, CustomUser, Troubleshooting, DiagnosticReport, Order, Pricing



class CustomUserSerializers(serializers.ModelSerializer):


    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'first_name', 'last_name']


class UserProfileSerializers(serializers.ModelSerializer):

    user = CustomUserSerializers()

    class Meta:
        model = Client
        fields = ['id', 'user']


class CategorySerializers(serializers.ModelSerializer):

    
    class Meta:
        model = Category
        fields = ['id', 'name', 'big_size']

        
class DeviceSerializers(serializers.ModelSerializer):

    category = CategorySerializers()

    class Meta:
        model = Device
        fields = ['id', 'name', 'description', 'price', 'under_warranty', 'quantity', 'category']


class RepairerProfileSerializers(serializers.ModelSerializer):

    user = CustomUserSerializers()

    class Meta:
        model = Repairer
        fields = ['id', 'user']


class ScheduleAppointmentSerializers(serializers.ModelSerializer):

    repairer_profile = RepairerProfileSerializers()
    
    class Meta:
        model = ScheduleAppointment
        fields = ['id', 'start_time', 'end_time','repairer_profile', 'is_done']

class DiagnosticsRequestSerializers(serializers.ModelSerializer):

    device = DeviceSerializers()
    user = CustomUserSerializers()
    schedule_appointment = ScheduleAppointmentSerializers()

    class Meta:
        model = DiagnosticsRequest
        fields = ['id', 'date', 'device', 'user', 'schedule_appointment']

class TroubleshootingSerializers(serializers.ModelSerializer):

    schedule_appointment = ScheduleAppointmentSerializers()
    diagnostic_request = DiagnosticsRequestSerializers()
   
    class Meta:
        model = Troubleshooting
        fields = ['id', 'type', 'date', 'schedule_appointment', 'diagnostic_request']

class PricingSerializers(serializers.ModelSerializer):


    class Meta:
        model = Pricing
        fields = ['id', 'price', 'discount_quota']

        
class DiagnosticReportSerializers(serializers.ModelSerializer):

    diagnostic_request = DiagnosticsRequestSerializers()
    device = DeviceSerializers()
    price = PricingSerializers()

    class Meta:
        model = DiagnosticReport
        fields = ['id', 'description', 'device', 'diagnostic_request', 'price']


class OrderSerializers(serializers.ModelSerializer):

    device = DeviceSerializers()

    class Meta:
        model = Order
        fields = ['id', 'date', 'quantity', 'device']

