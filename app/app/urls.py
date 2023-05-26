from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('servis.urls')),
    path('core/', include('core.urls'))
]
