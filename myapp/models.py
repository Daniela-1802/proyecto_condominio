from django.db import models
from django.conf import settings
import uuid

class Usuarios(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    usuario = models.TextField(unique=True)
    correo = models.TextField(unique=True)
    nombre_completo = models.TextField(blank=True, null=True)
    telefono = models.TextField(blank=True, null=True)
    hash_contrasena = models.TextField()
    activo = models.BooleanField()
    ultimo_login_en = models.DateTimeField(blank=True, null=True)
    creado_en = models.DateTimeField()
    actualizado_en = models.DateTimeField()

    auth_user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        db_column='auth_user_id',
        null=True, blank=True,
        related_name='perfil',
    )
    class Meta:
        managed = False
        db_table = 'usuarios'
# Create your models here.
def __str__(self):
        return self.usuario

