# myapp/usuarios/serializers.py
import uuid
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from rest_framework import serializers

from .models import Usuarios


# -------------------------
#  Serializer de lectura
# -------------------------
class UsuarioSerializer(serializers.ModelSerializer):
    # Exponemos datos del auth_user relacionado
    is_staff = serializers.BooleanField(source="auth_user.is_staff", read_only=True)
    groups   = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Usuarios
        fields = (
            "id",
            "usuario",
            "correo",
            "nombre_completo",
            "telefono",
            "activo",
            "auth_user_id",
            "is_staff",
            "groups",
        )
        # Nota: este serializer es SOLO de lectura
        read_only_fields = ("id", "auth_user_id", "is_staff", "groups", "activo")

    def get_groups(self, obj):
        if not obj.auth_user_id:
            return []
        return [{"id": g.id, "name": g.name} for g in obj.auth_user.groups.all()]


# -------------------------
#  Serializer de creación
# -------------------------
class UsuarioCreateSerializer(serializers.Serializer):
    # Campos de entrada (perfil + auth_user)
    username        = serializers.CharField(write_only=True)
    password        = serializers.CharField(write_only=True)
    email           = serializers.EmailField(required=False, allow_blank=True, write_only=True)
    nombre_completo = serializers.CharField(required=False, allow_blank=True)
    telefono        = serializers.CharField(required=False, allow_blank=True)

    # Opcionales para auth_user/perfil al crear
    activo   = serializers.BooleanField(required=False, default=True)
    is_staff = serializers.BooleanField(required=False, default=False)

    groups   = serializers.ListField(
        child=serializers.IntegerField(min_value=1),
        required=False,
        allow_empty=True,
        write_only=True,
        help_text="IDs de roles (auth_group) a asignar",
    )

    def validate_groups(self, value):
        ids = value or []
        found = set(Group.objects.filter(id__in=ids).values_list("id", flat=True))
        missing = [gid for gid in ids if gid not in found]
        if missing:
            raise serializers.ValidationError(f"Grupos inexistentes: {missing}")
        return ids

    def create(self, validated):
        User = get_user_model()

        activo = bool(validated.get("activo", True))

        # 1) crear usuario de Django
        dj = User.objects.create_user(
            username  = validated["username"],
            email     = validated.get("email") or "",
            password  = validated["password"],
            is_active = activo,
        )

        # 1.1) setear is_staff si vino (no tocamos superuser)
        if "is_staff" in validated:
            dj.is_staff = bool(validated["is_staff"])
            dj.save(update_fields=["is_staff", "is_active"])
        else:
            dj.save(update_fields=["is_active"])

        # 1.2) asignar grupos si vinieron
        if "groups" in validated:
            ids = validated["groups"] or []
            dj.groups.set(Group.objects.filter(id__in=ids))

        # 2) crear perfil de negocio
        perfil = Usuarios.objects.create(
            id              = uuid.uuid4(),
            usuario         = dj.username,
            correo          = dj.email or f"{dj.username}@example.com",
            nombre_completo = validated.get("nombre_completo") or dj.get_full_name() or dj.username,
            telefono        = validated.get("telefono") or "",
            hash_contrasena = "(externo)",
            activo          = activo,
            creado_en       = timezone.now(),
            actualizado_en  = timezone.now(),
            auth_user       = dj,
        )
        return perfil

    # Al responder el POST, devolvemos la forma “de lectura”
    def to_representation(self, instance):
        return UsuarioSerializer(instance, context=self.context).data


# -------------------------
#  Serializer de actualización (PATCH/PUT)
# -------------------------
class UsuarioUpdateSerializer(serializers.Serializer):
    # NUEVOS / EXISTENTES CAMPOS QUE ADMITE EL PATCH
    username        = serializers.CharField(required=False)                 # ← NUEVO
    correo          = serializers.EmailField(required=False, allow_blank=True)
    nombre_completo = serializers.CharField(required=False, allow_blank=True)
    telefono        = serializers.CharField(required=False, allow_blank=True)
    activo          = serializers.BooleanField(required=False)
    is_staff        = serializers.BooleanField(required=False)
    groups          = serializers.ListField(
        child=serializers.IntegerField(min_value=1),
        required=False,
        allow_empty=True,
        help_text="IDs de roles (auth_group) a asignar",
    )

    # --- Validaciones específicas ---
    def validate_username(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("El username no puede estar vacío.")
        User = get_user_model()
        # self.instance es un objeto Usuarios; queremos excluir SU auth_user actual
        instance = getattr(self, "instance", None)
        current_user_id = instance.auth_user_id if instance else None
        if User.objects.filter(username=value).exclude(id=current_user_id).exists():
            raise serializers.ValidationError("Ese username ya está en uso.")
        return value

    def validate_groups(self, value):
        """Opcional: valida que todos los IDs existan y devuelve la misma lista."""
        ids = list(value or [])
        missing = set(ids) - set(Group.objects.filter(id__in=ids).values_list("id", flat=True))
        if missing:
            raise serializers.ValidationError(f"Grupos inexistentes: {missing}")
        return ids

    # --- Update principal ---
    def update(self, instance, validated):
        """
        instance: es un objeto de tu modelo Usuarios
        validated: dict con los campos presentes en el PATCH
        """
        request = self.context.get("request")
        dj = instance.auth_user  # usuario de auth_user enlazado
        changed = False          # bandera para saber si debemos guardar el perfil

        # Cambiar username (auth_user.username) y reflejarlo en perfil.usuario
        if "username" in validated:
            new_username = validated["username"]
            # (Opcional) si quieres sólo staff:
            # if not (request and request.user and request.user.is_staff):
            #     raise serializers.ValidationError("No autorizado para cambiar username.")
            dj.username = new_username
            dj.save(update_fields=["username"])
            instance.usuario = new_username
            changed = True

        # Actualizar datos del perfil
        if "correo" in validated:
            instance.correo = validated["correo"]; changed = True
        if "nombre_completo" in validated:
            instance.nombre_completo = validated["nombre_completo"]; changed = True
        if "telefono" in validated:
            instance.telefono = validated["telefono"]; changed = True
        if "activo" in validated:
            instance.activo = bool(validated["activo"]); changed = True

        if changed:
            instance.actualizado_en = timezone.now()
            instance.save()

        # Actualizar auth_user.is_staff  (proteger con staff)
        if "is_staff" in validated:
            if not (request and request.user and request.user.is_staff):
                raise serializers.ValidationError("No autorizado para cambiar is_staff.")
            dj.is_staff = bool(validated["is_staff"])
            dj.save(update_fields=["is_staff"])

        # Actualizar roles (grupos)  (proteger con staff)
        if "groups" in validated:
            if not (request and request.user and request.user.is_staff):
                raise serializers.ValidationError("No autorizado para asignar roles.")
            ids = validated["groups"] or []
            dj.groups.set(Group.objects.filter(id__in=ids))

        return instance

    # DRF llama create() en POST; aquí no aplica
    def create(self, validated):
        raise NotImplementedError("Use POST en /usuarios/ para crear.")

    def to_representation(self, instance):
        # reutiliza tu serializer de lectura
        return UsuarioSerializer(instance, context=self.context).data