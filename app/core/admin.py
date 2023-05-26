from .models import Location, UserProfile, RepairerProfile, ScheduleAppointment, Category, Device, DiagnosticsRequest, Troubleshooting, Pricing, CustomUser, DiagnosticReport, Order
from django.contrib import admin

admin.site.register(UserProfile)
admin.site.register(Location)
admin.site.register(RepairerProfile)
admin.site.register(ScheduleAppointment)
admin.site.register(Category)
admin.site.register(Device)
admin.site.register(DiagnosticsRequest)
admin.site.register(Troubleshooting)
admin.site.register(Pricing)
admin.site.register(CustomUser)
admin.site.register(DiagnosticReport)
admin.site.register(Order)
