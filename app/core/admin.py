from .models import Location, Client, Repairer, ScheduleAppointment, Category, Device, DiagnosticsRequest, Troubleshooting, Pricing, CustomUser, DiagnosticReport, Order, TroubleshootingReport, TravelWarrant
from django.contrib import admin

admin.site.register(Client)
admin.site.register(Location)
admin.site.register(Repairer)
admin.site.register(ScheduleAppointment)
admin.site.register(Category)
admin.site.register(Device)
admin.site.register(DiagnosticsRequest)
admin.site.register(Pricing)
admin.site.register(CustomUser)
admin.site.register(DiagnosticReport)
admin.site.register(Order)
admin.site.register(TroubleshootingReport)
admin.site.register(TravelWarrant)
admin.site.register(Troubleshooting)

