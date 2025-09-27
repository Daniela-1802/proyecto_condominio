# myapp/usuarios/views.py
import uuid
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.permissions import IsAdminUser

from .models import Usuarios
# NUEVO: importamos el serializer de update además de los dos que ya usabas
from .serializers import (
    UsuarioSerializer,
    UsuarioCreateSerializer,
    UsuarioUpdateSerializer,   # ← NUEVO
)


def get_or_create_usuario_for_django_user(dj_user) -> Usuarios:
    perfil = getattr(dj_user, 'perfil', None)
    if perfil:
        return perfil
    return Usuarios.objects.create(
        id=uuid.uuid4(),
        usuario=dj_user.username,
        correo=dj_user.email or f"{dj_user.username}@example.com",
        nombre_completo=dj_user.get_full_name() or dj_user.username,
        hash_contrasena="(externo)",
        activo=True,
        creado_en=timezone.now(),
        actualizado_en=timezone.now(),
        auth_user=dj_user,
    )


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        perfil = get_or_create_usuario_for_django_user(request.user)
        # (opcional) pasamos request por context por si el serializer lo requiere
        return Response(UsuarioSerializer(perfil, context={"request": request}).data)


# Si tu router/urls lo registra como UsuarioViewSet, respeta el nombre:
# myapp/usuarios/views.py
class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuarios.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == "create":
            return UsuarioCreateSerializer
        if self.action in ("update", "partial_update"):
            return UsuarioUpdateSerializer
        return UsuarioSerializer
    
        #return UsuarioCreateSerializer if self.action == "create" else UsuarioSerializer

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx["request"] = self.request
        return ctx

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        dj = getattr(instance, "auth_user", None)
        response = super().destroy(request, *args, **kwargs)
        try:
            if dj:
                dj.delete()
        except Exception:
            pass
        return response
    
    def perform_destroy(self, instance: Usuarios):
        dj = instance.auth_user
        # borra primero el perfil (si tu FK no es CASCADE), luego el auth_user
        super().perform_destroy(instance)
        if dj:
            dj.delete()
