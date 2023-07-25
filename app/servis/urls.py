from django.urls import path
from servis import views

urlpatterns = [
    path('HelloWorld', views.HelloWorld, name = "Hello World"),
    path('admin/users', views.get_all_users_profile, name="Get all users profile"),
    path('user/register', views.register_user, name = "Register user"),
    path('repairer/register', views.register_repairer, name = "Register repair"),
    path('user/diagnostic_request', views.get_diagnostic_schedule_appointment, name="Request for diagnostics"),
    path('user/diagnostic_request/save', views.create_diagnostic_request, name="User accept recommended diagnostic request"),
    path('user/all_categories', views.get_all_categories, name="Get all categories"),
    path('user/all_device_by_category/<int:id>', views.get_all_device_by_category, name="Get all device by category id"),
    path('user/category/<int:id>', views.get_one_category, name="Get one category by id"),
    path('repairer/diagnostic_schedule_appointments/<int:id>', views.get_diagnostic_schedule_appointments_by_repairer, name="Get all diagnostic schedule appointments by repairer id"),
    path('repairer/profile/<int:id>', views.get_repairer_profile_by_user, name="Get repairer profile by user id"),
    path('repairer/update_diagnostic_schedule_appointment_done/<int:id>', views.update_diagnostic_schedule_appointment_done, name=" Diagnostic appointment is done"),
    path('user/diagnostic_requests_done/<int:id>', views.get_done_diagnostic_requests_by_user, name="Get all diagnostic requests from user"),
    path('user/create_troubleshooting_request_repair', views.create_troubleshooting_request_repair, name="Create repair troubleshooting request"),
    path('user/save_troubleshooting_request_repair', views.save_troubleshooting_request_repair, name="Save repair troubleshooting request"),
    path('repairer/get_troubleshooting_request_by_repairer/<int:id>', views.get_troubleshooting_request_by_repair, name="Get troubleshooting request"),
    path('repairer/troubleshooting/done/<int:id>', views.troubleshooting_request_done, name="Troubleshooting request is done"),
    path('user/diagnostic_request_wait/<int:id>', views.get_wait_diagnostic_requests_by_user, name="Get all diagnostic requests from user which is wait"),
    path('user/troubleshooting_request_wait/<int:id>', views.get_wait_troubleshooting_requests_by_user, name="All trobuleshooting requests from user which wait"),
    path('user/troubleshooting_request_done/<int:id>', views.get_done_troubleshooting_requests_by_user, name="All trobuleshooting requests from user which done"),
    path('user/device/devices/<int:id>', views.get_devices_by_device, name="Get all devices from device"),
    path('user/diagnostic_report', views.create_diagnostic_report, name="Create diagnostic report"),
    path('user/devices/quantity/<int:id>', views.get_number_of_devices, name="Get quantity of device"),
    path('user/order/device/<int:id>', views.get_order_by_device, name="Get order for device device"),
    path('user/report/<int:id>', views.generate_PDF, name="Generate report"),
    path('repairer/password', views.change_password_repairer, name="Change password repairer - first time login")
]