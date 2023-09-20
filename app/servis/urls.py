from django.urls import path
from servis import views

urlpatterns = [
    path('HelloWorld', views.HelloWorld, name = "Hello World"),
    path('admin/users', views.get_all_clients_profile, name="Get all users profile"),
    path('user/register', views.register_user, name = "Register user"),
    path('repairer/register', views.register_repairer, name = "Register repair"),
    path('user/diagnostic_request', views.get_diagnostic_schedule_appointment, name="Request for diagnostics"),
    path('user/diagnostic_request/save', views.create_diagnostic_request, name="User accept recommended diagnostic request"),
    path('user/all_categories', views.get_all_categories, name="Get all categories"),
    path('user/all_device_by_category/<int:id>', views.get_all_device_by_category, name="Get all device by category id"),
    path('admin/all_device_by_category/<int:id>', views.get_all_device, name="All device by category id"),
    path('user/category/<int:id>', views.get_one_category, name="Get one category by id"),
    path('repairer/diagnostic_schedule_appointments/<int:id>', views.get_diagnostic_schedule_appointments_by_repairer, name="Get all diagnostic schedule appointments by repairer id"),
    path('repairer/profile/<int:id>', views.get_repairer_profile_by_user, name="Get repairer profile by user id"),
    path('repairer/update_diagnostic_schedule_appointment_done/<int:id>', views.update_diagnostic_schedule_appointment_done, name=" Diagnostic appointment is done"),
    path('repairert/update_troubleshooting_schedule_appointment_done/<int:id>', views.update_troubleshooting_schedule_appointment_done, name=" Diagnostic appointment is done"),
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
    path('user/order/device/<str:name>', views.get_order_by_device, name="Get order for device device"),
    path('user/report/<int:id>', views.generate_PDF, name="Generate report"),
    path('repairer/password', views.change_password_repairer, name="Change password repairer - first time login"),
    path('user/profile/<int:id>', views.get_one_user, name="Get one user"),
    path('user/profile/edit', views.edit_user_profile, name="Edit profile data"),
    path('admin/create/category', views.create_category, name="Create category"),
    path('admin/create/device', views.create_device, name="Create device"),
    path('admin/users/profiles', views.get_all_users_profile, name="All users profiles"),
    path('user/password/change', views.change_password_user, name="Change user password"),
    path('user/repairer/profiles', views.repairer_profiles, name="Repairer profiles"),
    path('repairer/travel_warrant_request', views.create_travel_warrant, name="Request for travel warrant"),
    path('admin/travel_warrant_unapproved/troubleshooting', views.get_travel_warrant_troubleshooting_on_wait, name="Get all unapproved travel warrant troubleshooting"),
    path('admin/travel_warrant_unapproved/diagnostic', views.get_travel_warrant_diagnostic_on_wait, name="Get all unapproved travel warrant diagnostic"),
    path('admin/diagnostic_request/<int:id>', views.get_diagnostic_request_by_schedule_appointment, name="Get details about travel warrant"),
    path('admin/travel_warrant/troubleshooting/approved', views.approved_travel_warrant_troubleshooting, name="Update travel warrant troubleshooting to approved"),
    path('admin/travel_warrant/troubleshooting/unapproved', views.unapproved_travel_warrant_troubleshooting, name="Update travel warrant troubleshooting to unapproved"),
    path('admin/travel_warrant/diagnostic/approved', views.approved_travel_warrant_diagnostic, name="Update travel warrant diagnostic to approved"),
    path('admin/travel_warrant/diagnostic/unapproved', views.unapproved_travel_warrant_diagnostic, name="Update travel warrant diagnostic to unapproved"),
    path('repairer/travel_warrant/schedule_appointment/<int:id>', views.get_travelwarrant_by_scheduleappointment_id, name="Travel warrant by schedule appointment"),
    path('admin/createOrder', views.create_order, name="Create order"),
    path('user/travelwarrant/diagnostic/unnapproved/<int:id>', views.get_unnaproved_diagnostic_travelwarrant_by_user, name="Get unnaproved diagnostic travel warrant by user"),
    path('user/travelwarrant/troubleshooting/unnapproved/<int:id>', views.get_unnaproved_troubleshooting_travelwarrant_by_user, name="Get unnaproved troubleshooting travel warrant by user"),
    path('repairer/troubleshooting_report', views.create_troubleshooting_report, name="Create trobuleshooting report"),
    path('repairert/travel_warrant_request', views.create_travel_warrant_troubleshooting, name="Create travel warrant for troubleshooting"),
    path('admin/troubleshooting_request/<int:id>', views.get_troubleshooting_request_by_schedule_appointment, name="Get details about travel warrant troubleshooting"),
    path('admin/pricing/all', views.get_scheduleappointment_for_pricing, name="Get all schedule appointment for pricing"),
    path('admin/pricing/create', views.create_pricing, name="Create price for user")



]