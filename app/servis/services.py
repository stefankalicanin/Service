from django.utils.dateparse import parse_datetime
from django.db.models import Q
from django.contrib.auth import get_user_model

import datetime

from core.models import Client, DiagnosticsRequest, ScheduleAppointment, Repairer, Category, Device, Pricing, Troubleshooting, CustomUser, DiagnosticReport, Order, TravelWarrant, TroubleshootingReport
from servis.serializers import UserProfileSerializers, DiagnosticsRequestSerializers, TroubleshootingSerializers, RepairerProfileSerializers, CategorySerializers, DeviceSerializers, DiagnosticReportSerializers, OrderSerializers, CustomUserSerializers, TravelWarrantSerializers, TroubleshootingReportSerializers
    

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
    
    @staticmethod
    def get_all_users():
        users = get_user_model().objects.filter(~Q(role = CustomUser.Role.ADMIN))
        print(users)
        serializersCustomUsers = CustomUserSerializers(users, many=True)
        return serializersCustomUsers.data

class UserProfileService:

    @staticmethod
    def get_all_clients_profiles():
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
    
    @staticmethod
    def get_all_repairers():
        users = get_user_model().objects.filter(Q(role=CustomUser.Role.REPAIR_DIAGNOSTIC) | Q(role=CustomUser.Role.REPAIR_TROUBLESHOOTING))

        serializersUsers= CustomUserSerializers(users, many=True)
        return serializersUsers.data

class DiagnosticsRequestService:

    @staticmethod
    def get_diagnostics_request(primary_key):
        diagnostic_request = DiagnosticsRequest.objects.get(id=primary_key)

        serializersDiagnosticRequest = DiagnosticsRequestSerializers(diagnostic_request)
        return serializersDiagnosticRequest.data

    @staticmethod
    def get_wait_diagnostic_requests_by_user(id):
        user = get_user_model().objects.get(id=id)
        client = Client.objects.get(user=user)
        diagnostic_request = DiagnosticsRequest.objects.all().filter(Q(client=client, schedule_appointment__is_done=False, state=DiagnosticsRequest.DiagnosticState.INITIAL))

        serializersDiagnosticRequest = DiagnosticsRequestSerializers(diagnostic_request, many=True)
        return serializersDiagnosticRequest.data
    
    @staticmethod
    def get_diagnostic_request_by_schedule_appointment(id):
        schedule_appointment = ScheduleAppointment.objects.get(id=id)
        diagnostic_request = DiagnosticsRequest.objects.get(schedule_appointment=schedule_appointment)

        diagnosticRequestSerializers = DiagnosticsRequestSerializers(diagnostic_request)
        return diagnosticRequestSerializers.data

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
        diagnostic_schedule_appointments = DiagnosticsRequest.objects.filter( schedule_appointment__repairer_profile_id = id, schedule_appointment__is_done=False)

        serializersDiagnosticScheduleAppointments = DiagnosticsRequestSerializers(diagnostic_schedule_appointments, many=True)
        return serializersDiagnosticScheduleAppointments.data

    @staticmethod
    def update_diagnostic_schedule_appointment_done(id):
        diagnostic_request = DiagnosticsRequest.objects.get(id=id)
        diagnostic_request.state = DiagnosticsRequest.DiagnosticState.PROCESSED
        diagnostic_request.save()
        
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
    def get_all_device(category):
        devices = Device.objects.filter(Q(category=category))
        
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

        Troubleshooting.objects.filter(id=id).update(state=Troubleshooting.TroubleshootingState.PROCESSED)
        troubleshooting = Troubleshooting.objects.get(id=id)
        ScheduleAppointment.objects.filter(id=troubleshooting.schedule_appointment.id).update(is_done=True)

        return True        

    @staticmethod
    def get_wait_troubleshooting_requests_by_user(id):
        user = get_user_model().objects.get(id=id)
        client = Client.objects.get(user=user)
        diagnostic_request = DiagnosticsRequest.objects.all().filter(Q(client=client,schedule_appointment__is_done=True, state=DiagnosticsRequest.DiagnosticState.PROCESSED))
        diagnostic_report = DiagnosticReport.objects.all().filter(Q(diagnostic_request__in=diagnostic_request, ready_for_repair=True, unsuccessfully_processing=False))
        troubleshooting = Troubleshooting.objects.all().filter(diagnostic_report__in=diagnostic_report, state=Troubleshooting.TroubleshootingState.INITIAL)
        
        troubleshootingSerializers = TroubleshootingSerializers(troubleshooting, many=True)
        return troubleshootingSerializers.data     
    
    @staticmethod
    def get_done_troubleshooting_requests_by_user(id):
        user = get_user_model().objects.get(id=id)
        client = Client.objects.get(user=user)
        diagnostic_request = DiagnosticsRequest.objects.all().filter(Q(client=client,schedule_appointment__is_done=True, state=DiagnosticsRequest.DiagnosticState.PROCESSED))
        diagnostic_report = DiagnosticReport.objects.all().filter(Q(diagnostic_request__in=diagnostic_request, ready_for_repair=True, unsuccessfully_processing=False))
        troubleshooting = Troubleshooting.objects.all().filter(diagnostic_report__in=diagnostic_report, state=Troubleshooting.TroubleshootingState.PROCESSED)
        troubleshooting_report = TroubleshootingReport.objects.all().filter(troubleshooting__in=troubleshooting)
        troubleshootingReportSerializers = TroubleshootingReportSerializers(troubleshooting_report, many=True)
        return troubleshootingReportSerializers.data
    
    @staticmethod
    def get_troubleshooting_request_by_schedule_appointment(id):
        schedule_appointment = ScheduleAppointment.objects.get(id=id)
        troubleshooting = Troubleshooting.objects.get(schedule_appointment=schedule_appointment)

        troubleshootingSerializers = TroubleshootingSerializers(troubleshooting)
        return troubleshootingSerializers.data

class DiagnosticReportService:

    @staticmethod
    def get_done_diagnostic_requests_by_user(id):
        user = get_user_model().objects.get(id=id)
        client = Client.objects.get(user=user)
        diagnostic_request = DiagnosticsRequest.objects.all().filter(Q(client=client,schedule_appointment__is_done=True, state=DiagnosticsRequest.DiagnosticState.PROCESSED))
        diagnostic_report = DiagnosticReport.objects.all().filter(Q(diagnostic_request__in=diagnostic_request, ready_for_repair=False, unsuccessfully_processing=False))
        serializersDiagnosticReport = DiagnosticReportSerializers(diagnostic_report, many=True)
        return serializersDiagnosticReport.data
    

class OrderService:

    @staticmethod
    def get_order_by_device(name):
        device = Device.objects.get(name=name)
        order_exists = Order.objects.filter(device=device).exists()
        if order_exists:
            order = Order.objects.get(device=device)
            orderSerializers = OrderSerializers(order)
            return orderSerializers.data
        else:
            return None
    

class TravelWarrantService:

    @staticmethod
    def get_all_on_wait_travel_warrant_troubleshooting():
        troubleshooting = Troubleshooting.objects.filter(state=DiagnosticsRequest.DiagnosticState.PROCESSING)
        schedule_appointment = []

        for t in troubleshooting:
            schedule_appointment.append(t.schedule_appointment)

        travel_warrant = TravelWarrant.objects.filter(state=TravelWarrant.TravelWarrantState.ON_WAIT, schedule_appointment__in=schedule_appointment)

        travelWarrantSerializers = TravelWarrantSerializers(travel_warrant, many=True)
        return travelWarrantSerializers.data
    
    @staticmethod
    def get_all_on_wait_travel_warrant_diagnostic():
        diagnostic_request = DiagnosticsRequest.objects.filter(state=DiagnosticsRequest.DiagnosticState.PROCESSING)
        schedule_appointment = []

        for t in diagnostic_request:
            schedule_appointment.append(t.schedule_appointment)

        travel_warrant = TravelWarrant.objects.filter(state=TravelWarrant.TravelWarrantState.ON_WAIT, schedule_appointment__in=schedule_appointment)

        travelWarrantSerializers = TravelWarrantSerializers(travel_warrant, many=True)
        return travelWarrantSerializers.data
    
    @staticmethod
    def approved_troubleshooting(id):
        travel_warrant = TravelWarrant.objects.filter(id=id).update(state=TravelWarrant.TravelWarrantState.APPROVED)
        travel_warrant = TravelWarrant.objects.get(id=id)
        schedule_appointment = travel_warrant.schedule_appointment
        troubleshooting = Troubleshooting.objects.get(schedule_appointment=schedule_appointment)
        Troubleshooting.objects.filter(id = troubleshooting.id).update(state=DiagnosticsRequest.DiagnosticState.PROCESSED)
        return True
    
    @staticmethod
    def unapproved_troubleshooting(id):
        travel_warrant = TravelWarrant.objects.filter(id=id).update(state=TravelWarrant.TravelWarrantState.UNAPPROVED)
        travel_warrant = TravelWarrant.objects.get(id=id)
        schedule_appointment = travel_warrant.schedule_appointment
        troubleshooting = Troubleshooting.objects.get(schedule_appointment=schedule_appointment)
        Troubleshooting.objects.filter(id = troubleshooting.id).update(state=DiagnosticsRequest.DiagnosticState.UNPROCESSED)
        return True
    
    @staticmethod
    def approved_diagnostic(id):
        travel_warrant = TravelWarrant.objects.filter(id=id).update(state=TravelWarrant.TravelWarrantState.APPROVED)
        travel_warrant = TravelWarrant.objects.get(id=id)
        schedule_appointment = travel_warrant.schedule_appointment
        diagnostic_request = DiagnosticsRequest.objects.get(schedule_appointment=schedule_appointment)
        DiagnosticsRequest.objects.filter(id = diagnostic_request.id).update(state=DiagnosticsRequest.DiagnosticState.PROCESSED)
        return True
    
    @staticmethod
    def unapproved_diagnostic(id):
        travel_warrant = TravelWarrant.objects.filter(id=id).update(state=TravelWarrant.TravelWarrantState.UNAPPROVED)
        travel_warrant = TravelWarrant.objects.get(id=id)
        schedule_appointment = travel_warrant.schedule_appointment
        diagnostic_request = DiagnosticsRequest.objects.get(schedule_appointment=schedule_appointment)
        DiagnosticsRequest.objects.filter(id = diagnostic_request.id).update(state=DiagnosticsRequest.DiagnosticState.UNPROCESSED)
        return True
    
    @staticmethod
    def get_travelwarrant_by_scheduleappointment_id(id):
        schedule_appointment = ScheduleAppointment.objects.get(id=id)
        travel_warrant = TravelWarrant.objects.get(schedule_appointment=schedule_appointment)

        travelWarrantSerializers = TravelWarrantSerializers(travel_warrant)
        return travelWarrantSerializers.data
    
    @staticmethod
    def get_unnaproved_travelwarrant_by_user(id):
        user = get_user_model().objects.get(id=id)
        client = Client.objects.get(user=user)

        diagnostic_requests = DiagnosticsRequest.objects.filter(client=client, state=DiagnosticsRequest.DiagnosticState.PROCESSED)
        schedule_appointment = []
        for dr in diagnostic_requests:
            schedule_appointment.append(dr.schedule_appointment)
        
        travel_warrants = TravelWarrant.objects.filter(schedule_appointment__in=schedule_appointment, state=TravelWarrant.TravelWarrantState.UNAPPROVED)
        
        schedule_appointment_travel_warrant_unnapproved = []
        for tw in travel_warrants:
            schedule_appointment_travel_warrant_unnapproved.append(tw.schedule_appointment)
        
        diagnostic_requests_tw_unnaproved = DiagnosticsRequest.objects.filter(schedule_appointment__in=schedule_appointment_travel_warrant_unnapproved)
        daignosticRequestSerializers = DiagnosticsRequestSerializers(diagnostic_requests_tw_unnaproved, many=True)
        return daignosticRequestSerializers.data
    
