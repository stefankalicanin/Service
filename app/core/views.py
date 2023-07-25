from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.db.models import Q
from django.contrib.auth import get_user_model

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def validate(cls, attr):
        User = get_user_model()
        try:
            user = User.objects.get(username=attr["username"])
            if user.check_password(attr["password"]):
                token = super().get_token(user) 
                token["username"] = user.username
                token["role"] = user.role
                response = {
                    'refresh': str(token),
                    'access': str(token.access_token),
                }
                return response
            else:
                raise User.DoesNotExist
        except User.DoesNotExist:
            return None

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token',
        '/api/token/refresh'
    ]
    return Response(routes)
