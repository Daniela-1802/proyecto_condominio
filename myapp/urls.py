from django.urls import path
from .views import MeView, home   # importa las vistas de la app

urlpatterns = [
    #path('', views.home, name='home'),  # ruta raíz -> vista "home"
    path("", home, name="home"),              # /api/  -> home (opcional)
    path("me/", MeView.as_view(), name="me"), # /api/me/ -> requiere JWT
]
