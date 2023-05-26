from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def validate(self, attr):
        user = get_user_model().objects.get(username = attr["username"])
        token = super().get_token(user) 
        token["username"] = user.username
        token["role"] = user.role
        response = {
            'refresh': str(token),
            'access': str(token.access_token),
        }

        return response

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token',
        '/api/token/refresh'
    ]
    return Response(routes)
