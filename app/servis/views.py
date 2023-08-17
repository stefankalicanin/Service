from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework import status
from django.utils.dateparse import parse_datetime
from django.contrib.auth import get_user_model
from reportlab.pdfgen import canvas
from django.http import HttpResponse
from django.db.models import Q

import json
import os

from core.models import Client, Location, Repairer, DiagnosticsRequest, Device, ScheduleAppointment, Category, Troubleshooting, CustomUser, DiagnosticReport, Pricing
from servis.services import UserProfileService, DiagnosticsRequestService, ScheduleAppointmentService, DiagnosticsRequestService, CategoryService, DeviceService, RepairerService, TroubleshootingService, DiagnosticReportService, OrderService, UserService

@api_view(['GET'])
def HelloWorld(request):
    return Response("Hello World", status=status.HTTP_200_OK)

@api_view(['GET'])
def get_all_clients_profile(request):
    return Response(UserProfileService.get_all_clients_profiles, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_one_user(request,id):
    return Response(UserService.get_one_user(id), status=status.HTTP_200_OK)

@api_view(['POST'])
def register_user(request):
    data = json.loads(request.body)

    location = Location (
        country = data['country'],
        city = data['city'],
        address = data['address'],
        zip = data['zip'],
        region = data['region'],
        number = data['number']
    )

    
    
    user = get_user_model().objects.create(
        username = data['username'],
        first_name = data['first_name'],
        last_name = data['last_name'],
        role = CustomUser.Role.USER,
        birthday = data['birthday'],
        gender = data['gender']
    )

    user.set_password(data['password'])

    client = Client (
        user = user,
        location = location,
        privileges = False
    )
    
    location.save()
    user.save()
    client.save()
    
    return Response(status=status.HTTP_201_CREATED)

@api_view(['POST'])
def register_repairer(request):
    data = json.loads(request.body)

    user = get_user_model().objects.create(
        username = data['username'],
        first_name = data['first_name'],
        last_name = data['last_name'],
        role = data['type'],
        birthday = data['birthday'],
        gender = data['gender']
    )

    user.set_password('123')

    repairer = Repairer (
        user = user,
        salary = 100000,
        rating = 0
    )

    user.save()
    repairer.save()
    
    return Response(status=status.HTTP_201_CREATED)

@api_view(['POST'])
def get_diagnostic_schedule_appointment(request):
    data = json.loads(request.body)

    date = parse_datetime(data['date'])
    response, start_time, end_time = ScheduleAppointmentService.get_diagnostic_schedule_appointment(date)
    res = {
            "start_time" : str(start_time),
            "end_time" : str(end_time)
        }
    
    return Response(res, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def change_password_repairer(request):
    data = json.loads(request.body)

    username = data['username']
    password = data['password']
    repairer = UserService.change_repairer_password(username, password)
    
    return Response(repairer, status=status.HTTP_200_OK)

@api_view(['POST'])
def create_diagnostic_request(request):
    data = json.loads(request.body)

    date = parse_datetime(data['date'])
    response, start_time, end_time = ScheduleAppointmentService.get_diagnostic_schedule_appointment(date)

    schedule_appointment = ScheduleAppointment(
        start_time = start_time,
        end_time = end_time,
        is_done = False,
        repairer_profile = Repairer.objects.get(id=response['id'])
        )
    schedule_appointment.save()

    type_house = data['type_house']
    if type_house == True:
        type_house = 'HOUSE'
    else:
        type_house = 'IN SERVICE'

    user = get_user_model().objects.get(id=data['id_user'])
    client = Client.objects.get(user=user)
    
    diagnostics_request = DiagnosticsRequest(
        type_house = type_house,
        date = start_time,
        client = client,
        device = Device.objects.get(id=data['id_device']),
        schedule_appointment = schedule_appointment
        )

    diagnostics_request.save()

    return Response(response, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def get_all_categories(request):
    return Response(CategoryService.get_all_categories(), status=status.HTTP_200_OK)

@api_view(['GET'])
def get_all_device_by_category(request, id):
    category = Category.objects.get(id=id)

    return Response(DeviceService.get_all_device_by_category(category), status=status.HTTP_200_OK)

@api_view(['GET'])
def get_one_category(request, id):
    return Response(CategoryService.get_one_category(id), status=status.HTTP_200_OK)

@api_view(['GET'])
def get_diagnostic_schedule_appointments_by_repairer(request, id):
    return Response(ScheduleAppointmentService.get_diagnostic_schedule_appointments_by_repairer(id), status=status.HTTP_200_OK)

@api_view(['GET'])
def get_repairer_profile_by_user(request, id):
    return Response(RepairerService.get_repairer_profile_by_user(id), status=status.HTTP_200_OK)

@api_view(['POST'])
def update_diagnostic_schedule_appointment_done(request, id):
    return Response(ScheduleAppointmentService.update_diagnostic_schedule_appointment_done(id), status=status.HTTP_200_OK)

@api_view(['GET'])
def get_done_diagnostic_requests_by_user(request, id):
    return Response(DiagnosticReportService.get_done_diagnostic_requests_by_user(id), status=status.HTTP_200_OK)

@api_view(['POST'])
def create_troubleshooting_request_repair(request):
    data = json.loads(request.body)
    date = parse_datetime(data['date'])

    response, start_time, end_time = TroubleshootingService.create_troubleshooting_request_repair(date)

    res = {
            "start_time" : str(start_time),
            "end_time" : str(end_time)
        }
    
    return Response(res, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def save_troubleshooting_request_repair(request):
    data = json.loads(request.body)
    date = parse_datetime(data['date'])
    type = data['type']
    response, start_time, end_time = TroubleshootingService.create_troubleshooting_request_repair(date)
    
    DiagnosticsRequest.objects.filter(id=data['id']).update(ready_for_repair=True)
    diagnostic_request = DiagnosticsRequest.objects.get(id=data['id'])
    diagnostic_report = DiagnosticReport.objects.get(diagnostic_request=diagnostic_request)
    
    device_quantity = diagnostic_report.device.quantity
    Device.objects.filter(id=diagnostic_report.device.id).update(quantity=device_quantity-1)
    schedule_appointment = ScheduleAppointment(
        start_time = start_time,
        end_time = end_time,
        is_done = False,
        repairer_profile = Repairer.objects.get(id=response['id'])
        )
    schedule_appointment.save()

    if type:
        type_troubleshooting = Troubleshooting.TypeOfTroubleshooting.REPLACE
    else:
        type_troubleshooting = Troubleshooting.TypeOfTroubleshooting.REPAIR
        
    troubleshooting = Troubleshooting(
        type = type_troubleshooting,
        date = start_time,
        schedule_appointment = schedule_appointment,
        diagnostic_request = diagnostic_request
    )

    troubleshooting.save()

    return Response(response)

@api_view(['GET'])
def get_troubleshooting_request_by_repair(request, id):
    id = id
    return Response(TroubleshootingService.get_troubleshooting_request_by_repair(id), status.HTTP_200_OK)

@api_view(['POST'])
def troubleshooting_request_done(request, id):
    id = id
    return Response(TroubleshootingService.troubleshooting_request_done(id), status.HTTP_200_OK)

@api_view(['GET'])
def get_wait_diagnostic_requests_by_user(request, id):
    id = id
    return Response(DiagnosticsRequestService.get_wait_diagnostic_requests_by_user(id), status.HTTP_200_OK)

@api_view(['GET'])
def get_wait_troubleshooting_requests_by_user(request, id):
    id = id
    return Response(TroubleshootingService.get_wait_troubleshooting_requests_by_user(id), status.HTTP_200_OK)

@api_view(['GET'])
def get_done_troubleshooting_requests_by_user(request, id):
    id = id
    return Response(TroubleshootingService.get_done_troubleshooting_requests_by_user(id), status.HTTP_200_OK)

@api_view(['GET'])
def get_devices_by_device(request, id):
    id = id
    return Response(DeviceService.get_devices_by_device(id), status.HTTP_200_OK)

@api_view(['POST'])
def create_diagnostic_report(request):
    data = json.loads(request.body)

    state = data['state']
    if state == True:
        state = DiagnosticReport.State.SUCCESSFULLY
    else:
        state = DiagnosticReport.State.UNSUCCESSFULLY
    
    diagnostic_report = DiagnosticReport (
        description = data['description'],
        state=state,
        diagnostic_request = DiagnosticsRequest.objects.get(id=data['id_diagnostic']),
        broken_device = data['broken_device']
    )
    device = Device.objects.filter(name=data['broken_device']).exists()
    print("eeeeeeeeeeee",device)
    if (device == False):
        device = Device (
            name = data['broken_device'],
            main_device = diagnostic_report.diagnostic_request.device,
            category = diagnostic_report.diagnostic_request.device.category
        )
        device.save()
    diagnostic_report.save()

    return Response(status.HTTP_201_CREATED)

@api_view(['GET'])
def get_number_of_devices(request, id):
    return Response(DeviceService.get_number_of_devices(id), status.HTTP_200_OK)

@api_view(['GET'])
def get_order_by_device(request, id):
    number_device = DeviceService.get_number_of_devices(id)
    if number_device == 0:
            order = OrderService.get_order_by_device(id)
            return Response(order, status.HTTP_200_OK)
    else:
        return Response(None, status.HTTP_200_OK)
    
@api_view(['GET'])
def generate_PDF(request, id):
    troubleshooting_request = Troubleshooting.objects.get(id=id)
    diagnostic_request = DiagnosticsRequest.objects.get(id=troubleshooting_request.diagnostic_request.id)
    diagnostic_report = DiagnosticReport.objects.get(diagnostic_request=diagnostic_request)
    
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="report.pdf"'

    pdf = canvas.Canvas(response)
    
    pdf.setTitle("Report")
    pdf.setFont("Helvetica-Bold", 30)
    pdf.drawString(250, 800, "Report")
    pdf.line(200, 785, 250 + pdf.stringWidth("Report", "Helvetica-Bold", 30) + 50, 785)
    pdf.setFont("Helvetica-Bold", 20)
    pdf.drawString(50, 600, "Diagnostic request details")
    pdf.line(50, 585, 50 + pdf.stringWidth("Diagnostic request details", "Helvetica-Bold", 20) + 50, 585)
    pdf.setFont("Helvetica", 13)
    pdf.drawString(50, 550, "Device: " + str(diagnostic_request.device.name))
    pdf.drawString(50, 530, "Category of device: "+ str(diagnostic_request.device.category.name))
    pdf.drawString(50, 510, "Start time: " + str(diagnostic_request.schedule_appointment.start_time)[:19])
    pdf.drawString(50, 490, "End time: " + str(diagnostic_request.schedule_appointment.end_time)[:19])
    pdf.setFont("Helvetica-Bold", 13)
    pdf.drawString(50, 470, "Repairer details:")
    pdf.setFont("Helvetica", 13)
    pdf.drawString(70, 450, "First name:" + str(troubleshooting_request.diagnostic_request.schedule_appointment.repairer_profile.user.first_name))
    pdf.drawString(70, 430, "Last name:" + str(troubleshooting_request.diagnostic_request.schedule_appointment.repairer_profile.user.last_name))
    pdf.drawString(50, 410, "Broken device: " + str(diagnostic_report.device.name))
    pdf.drawString(50, 390, "Repairer recommended " + str(troubleshooting_request.type) + " device " + str(diagnostic_report.device.name))
    pdf.drawString(50, 370, "Description: " + str(diagnostic_report.description))
    pdf.drawString(50, 350, "Price: " + str(diagnostic_report.price) + " €")
    pdf.setFont("Helvetica-Bold", 20)
    pdf.drawString(50, 300, "Troubleshooting details")
    pdf.line(50, 285, 50 + pdf.stringWidth("Troubleshooting details", "Helvetica-Bold", 20) + 50, 285)
    pdf.setFont("Helvetica", 13)
    pdf.drawString(50, 250, "Start time: " + str(troubleshooting_request.schedule_appointment.start_time)[:19])
    pdf.drawString(50, 230, "End time: " + str(troubleshooting_request.schedule_appointment.end_time)[:19])
    pdf.setFont("Helvetica-Bold", 13)
    pdf.drawString(50, 210, "Repairer details:")
    pdf.setFont("Helvetica", 13)
    pdf.drawString(70,190, "First name: " + str(troubleshooting_request.schedule_appointment.repairer_profile.user.first_name))
    pdf.drawString(70,170, "Last name: " + str(troubleshooting_request.schedule_appointment.repairer_profile.user.last_name))
    image_path = os.path.join(os.path.dirname(__file__), './img/user.png')
    pdf.drawImage(image_path, 50, 650, 100, 100)
    pdf.drawString(200, 730, "First name: " + str(diagnostic_request.user.first_name))
    pdf.drawString(200, 700, "Last name: " + str(diagnostic_request.user.last_name))
    pdf.drawString(200, 670, "Username: " + str(diagnostic_request.user.username))

    pdf.showPage()
    pdf.save()

    return response

@api_view(['POST'])
def edit_user_profile(request):
    data = json.loads(request.body)

    id = data['id']

    user = get_user_model().objects.get(id=id)
    user.first_name = data['first_name']
    user.last_name = data['last_name']
    user.username = data['username']
    user.gender = data['gender']
    user.birthday = data['birthday']
    

    user.save()

    return Response(status=status.HTTP_200_OK)

@api_view(['POST'])
def create_category(request):
    data = json.loads(request.body)

    category = Category (
       name = data['name'],
       size = data['size']
    )
    category.save()

    return Response(status=status.HTTP_201_CREATED)

@api_view(['POST'])
def create_device(request):
    data = json.loads(request.body)
    
    if data['under_warranty'] == 'true':
        under_warranty = True
    else:
        under_warranty = False
    category = Category.objects.get(id=data['id_category'])
    if data['id_main_device'] != None:
        main_device = Device.objects.get(id=data['id_main_device'])
    else:
        main_device = None
    device = Device (
        name = data['name'],
        description = data ['description'],
        price = data['price'],
        under_warranty = under_warranty,
        quantity = data['quantity'],
        category = category,
        main_device = main_device
    )

    device.save()

    return Response(status=status.HTTP_201_CREATED)

@api_view(['GET'])
def get_all_users_profile(request):
    return Response(UserService.get_all_users(), status=status.HTTP_200_OK)

@api_view(['POST'])
def change_password_user(request):
    data = json.loads(request.body)
    User = get_user_model()
    user = User.objects.get(username=data['username'])
    if user.check_password(data['current_password']):
        user.set_password(data['new_password'])
        user.save()
        return Response({}, status=status.HTTP_200_OK)
    else:
        return Response({}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
def repairer_profiles(request):
    return Response(RepairerService.get_all_repairers(), status=status.HTTP_200_OK)