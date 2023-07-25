from django.utils.dateparse import parse_datetime
from django.db.models import Q
from django.contrib.auth import get_user_model

import datetime

from core.models import Client, DiagnosticsRequest, ScheduleAppointment, Repairer, Category, Device, Pricing, Troubleshooting, CustomUser, DiagnosticReport, Order
from servis.serializers import UserProfileSerializers, DiagnosticsRequestSerializers, TroubleshootingSerializers, RepairerProfileSerializers, CategorySerializers, DeviceSerializers, DiagnosticReportSerializers, OrderSerializers, CustomUserSerializers
    

class UserService: 

    @staticmethod
    def change_repairer_password(username, password):
        user = get_user_model().objects.get(username=username)
        user.set_password(password)
        user.save()

        serializersCustomUser = CustomUserSerializers(user)
        return serializersCustomUser.data
    
    @staticmethod
    def get_one_user(id):
        user = get_user_model().objects.get(id=id)

        serializersCustomUser = CustomUserSerializers(user)
        return serializersCustomUser.data

class UserProfileService:

    @staticmethod
    def get_all_users_profiles():
        users_profiles = Client.objects.all()

        serializersUserProfile = UserProfileSerializers(users_profiles, many=True)
        return serializersUserProfile.data



class RepairerService:

    @staticmethod
    def get_one_repairer_for_diagnostic():
        user = get_user_model().objects.get(role = CustomUser.Role.REPAIR_DIAGNOSTIC)
        repairer_profile = Repairer.objects.filter(user=user).first()

        serializersRepairerProfile = RepairerProfileSerializers(repairer_profile)
        return serializersRepairerProfile.data

    @staticmethod
    def get_repairer_profile_by_user(id):
        repairer_profile = Repairer.objects.get(user_id = id)
        
        serializersRepairerProfile = RepairerProfileSerializers(repairer_profile)
        return serializersRepairerProfile.data
    
    @staticmethod
    def get_one_repairer_for_troubleshooting():
        user = get_user_model().objects.get(role = CustomUser.Role.REPAIR_TROUBLESHOOTING)
        repairer_profile = Repairer.objects.filter(user=user).first()

        serializersRepairerProfile = RepairerProfileSerializers(repairer_profile)
        return serializersRepairerProfile.data
    

class DiagnosticsRequestService:

    @staticmethod
    def get_diagnostics_request(primary_key):
        diagnostic_request = DiagnosticsRequest.objects.get(id=primary_key)

        serializersDiagnosticRequest = DiagnosticsRequestSerializers(diagnostic_request)
        return serializersDiagnosticRequest.data

    @staticmethod
    def get_wait_diagnostic_requests_by_user(id):
        diagnostic_request = DiagnosticsRequest.objects.all().filter(Q(user_id=id, schedule_appointment__is_done=False))

        serializersDiagnosticRequest = DiagnosticsRequestSerializers(diagnostic_request, many=True)
        return serializersDiagnosticRequest.data

class ScheduleAppointmentService:     
    
    @staticmethod
    def get_diagnostic_schedule_appointment(date):
        start_time_request = date
        end_time_request = start_time_request + datetime.timedelta(minutes=30)
        overlapping_appointments = DiagnosticsRequest.objects.filter(
        Q(schedule_appointment__start_time__lte=end_time_request, schedule_appointment__end_time__gte=start_time_request)).order_by('schedule_appointment__start_time')
        while overlapping_appointments.exists():
             start_time_request = overlapping_appointments.last().schedule_appointment.end_time + datetime.timedelta(minutes=1)
             end_time_request = start_time_request + datetime.timedelta(minutes=30)
             overlapping_appointments = DiagnosticsRequest.objects.filter(
        Q(schedule_appointment__start_time__lte=end_time_request, schedule_appointment__end_time__gte=start_time_request)).order_by('schedule_appointment__start_time')
        repairer_profile = RepairerService.get_one_repairer_for_diagnostic()
        serializersRepairerProfile = RepairerProfileSerializers(repairer_profile)
        return serializersRepairerProfile.data, start_time_request, end_time_request
        
        
            
    
    @staticmethod
    def get_diagnostic_schedule_appointments_by_repairer(id):
        diagnostic_schedule_appointments = DiagnosticsRequest.objects.filter(schedule_appointment__repairer_profile_id = id, schedule_appointment__is_done=False)

        serializersDiagnosticScheduleAppointments = DiagnosticsRequestSerializers(diagnostic_schedule_appointments, many=True)
        return serializersDiagnosticScheduleAppointments.data

    @staticmethod
    def update_diagnostic_schedule_appointment_done(id):
        diagnostic_request = DiagnosticsRequest.objects.get(id=id)

        ScheduleAppointment.objects.filter(id=diagnostic_request.schedule_appointment.id).update(is_done=True)


        return True


class CategoryService:

    @staticmethod
    def get_all_categories():
        categories = Category.objects.all()

        categoriesSerializers = CategorySerializers(categories, many=True)
        return categoriesSerializers.data
    
    @staticmethod
    def get_one_category(id):
        category = Category.objects.get(id=id)

        categorySerializers = CategorySerializers(category)
        return categorySerializers.data
    

class DeviceService:

    @staticmethod
    def get_all_device_by_category(category):
        devices = Device.objects.filter(Q(category=category, main_device=None))
        
        devicesSerializers = DeviceSerializers(devices, many=True)
        return devicesSerializers.data
    
    @staticmethod
    def get_devices_by_device(id):
        device = Device.objects.get(id=id)
        devices = Device.objects.filter(main_device=device)

        devicesSerializers = DeviceSerializers(devices, many=True)
        return devicesSerializers.data
    
    @staticmethod
    def get_number_of_devices(id):
        devices = Device.objects.get(id=id)
        quantity = devices.quantity
       
        return quantity
    
class TroubleshootingService:

    @staticmethod
    def create_troubleshooting_request_repair(date):
        start_time_request = date
        end_time_request = start_time_request + datetime.timedelta(minutes=30)
        overlapping_appointments = Troubleshooting.objects.filter(
        Q(schedule_appointment__start_time__lte=end_time_request, schedule_appointment__end_time__gte=start_time_request)).order_by('schedule_appointment__start_time')
        while overlapping_appointments.exists():
             start_time_request = overlapping_appointments.last().schedule_appointment.end_time + datetime.timedelta(minutes=1)
             end_time_request = start_time_request + datetime.timedelta(minutes=30)
             overlapping_appointments = DiagnosticsRequest.objects.filter(
        Q(schedule_appointment__start_time__lte=end_time_request, schedule_appointment__end_time__gte=start_time_request)).order_by('schedule_appointment__start_time')
        repairer_profile = RepairerService.get_one_repairer_for_troubleshooting()
        serializersRepairerProfile = RepairerProfileSerializers(repairer_profile)
        return serializersRepairerProfile.data, start_time_request, end_time_request

    @staticmethod
    def get_troubleshooting_request_by_repair(id):
        
        troubleshooting_request = Troubleshooting.objects.filter(Q(schedule_appointment__repairer_profile__id=id, schedule_appointment__is_done=False))

        troubleshootingSerializers = TroubleshootingSerializers(troubleshooting_request, many=True)
        return troubleshootingSerializers.data                    

    def troubleshooting_request_done(id):

        troubleshooting = Troubleshooting.objects.get(id=id)
        ScheduleAppointment.objects.filter(id=troubleshooting.schedule_appointment.id).update(is_done=True)

        return True        

    @staticmethod
    def get_wait_troubleshooting_requests_by_user(id):
        troubleshooting_requests = Troubleshooting.objects.filter(Q(diagnostic_request__user_id=id, schedule_appointment__is_done=False))  
        
        troubleshootingSerializers = TroubleshootingSerializers(troubleshooting_requests, many=True)
        return troubleshootingSerializers.data     
    
    @staticmethod
    def get_done_troubleshooting_requests_by_user(id):
        troubleshooting_requests = Troubleshooting.objects.filter(Q(diagnostic_request__user_id=id, schedule_appointment__is_done=True))  
        
        troubleshootingSerializers = TroubleshootingSerializers(troubleshooting_requests, many=True)
        return troubleshootingSerializers.data     
    

class DiagnosticReportService:

    @staticmethod
    def get_done_diagnostic_requests_by_user(id):
        diagnostic_request = DiagnosticsRequest.objects.all().filter(Q(user_id=id,schedule_appointment__is_done=True, ready_for_repair=False))
        diagnostic_report = DiagnosticReport.objects.all().filter(diagnostic_request__in=diagnostic_request)

        serializersDiagnosticReport = DiagnosticReportSerializers(diagnostic_report, many=True)
        return serializersDiagnosticReport.data
    

class OrderService:

    @staticmethod
    def get_order_by_device(id):
        device = Device.objects.get(id=id)
        order = Order.objects.get(device=device)

        orderSerializers = OrderSerializers(order)
        return orderSerializers.data