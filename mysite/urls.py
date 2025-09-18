from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),

<<<<<<< HEAD
    # Incluimos todas las rutas de nuestra app
    path("api/", include("myapp.urls")),  
=======
    # Auth JWT
    path("api/auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    path('api/', include('myapp.urls')),  # envía las rutas a myapp
    path("api/roles/", include("myapp.roles.urls")),

    
>>>>>>> feature/usuarios-roles
]
