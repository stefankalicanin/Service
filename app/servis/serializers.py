from rest_framework import serializers

from core.models import Client, DiagnosticsRequest, ScheduleAppointment, Repairer, Category, Device, CustomUser, Troubleshooting, DiagnosticReport, Order, Pricing, TravelWarrant, TroubleshootingReport



class CustomUserSerializers(serializers.ModelSerializer):


    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'first_name', 'last_name', 'birthday', 'gender', 'role']


class UserProfileSerializers(serializers.ModelSerializer):

    user = CustomUserSerializers()

    class Meta:
        model = Client
        fields = ['id', 'user']


class CategorySerializers(serializers.ModelSerializer):

    
    class Meta:
        model = Category
        fields = ['id', 'name', 'size']

        
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
    schedule_appointment = ScheduleAppointmentSerializers()
    client = UserProfileSerializers()
    
    class Meta:
        model = DiagnosticsRequest
        fields = ['id', 'date', 'device','type_house', 'state', 'schedule_appointment', 'client']

class DiagnosticReportSerializers(serializers.ModelSerializer):

    diagnostic_request = DiagnosticsRequestSerializers()
    
    
    class Meta:
        model = DiagnosticReport
        fields = ['id', 'description', 'state', 'diagnostic_request', 'broken_device', 'ready_for_repair', 'unsuccessfully_processing']


class TroubleshootingSerializers(serializers.ModelSerializer):

    schedule_appointment = ScheduleAppointmentSerializers()
    diagnostic_report = DiagnosticReportSerializers()
   
    class Meta:
        model = Troubleshooting
        fields = ['id', 'type', 'date', 'state', 'schedule_appointment', 'diagnostic_report']


class TroubleshootingReportSerializers(serializers.ModelSerializer):

    troubleshooting = TroubleshootingSerializers()

    class Meta:
        model = TroubleshootingReport
        fields = ['id', 'description', 'state', 'unsuccessfully_processing', 'troubleshooting']

class PricingSerializers(serializers.ModelSerializer):


    class Meta:
        model = Pricing
        fields = ['id', 'price', 'discount_quota']

        
class DiagnosticReportSerializers(serializers.ModelSerializer):

    diagnostic_request = DiagnosticsRequestSerializers()
    
    
    class Meta:
        model = DiagnosticReport
        fields = ['id', 'description', 'state', 'diagnostic_request', 'broken_device']


class OrderSerializers(serializers.ModelSerializer):

    device = DeviceSerializers()

    class Meta:
        model = Order
        fields = ['id', 'date', 'quantity', 'device']


class TravelWarrantSerializers(serializers.ModelSerializer):

    schedule_appointment = ScheduleAppointmentSerializers()

    class Meta:
        model = TravelWarrant
        fields = ['id', 'state', 'schedule_appointment']

