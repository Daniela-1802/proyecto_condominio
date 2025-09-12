from django.shortcuts import render

from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated  # 👈 nuevo
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework import serializers

# Create your views here.
# myapp/views.py
from django.http import HttpResponse

def home(request):
    return HttpResponse("Bienvenido a mi sistema de información (Django + React + PostgreSQL)")
# Serializer simple del usuario
class UserPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "email", "is_staff"]

# Vista protegida: requiere token JWT
class MeView(APIView):
    def get(self, request):
        return Response(UserPublicSerializer(request.user).data)
