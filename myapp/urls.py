from django.conf.urls import url
from django.conf.urls.static import static 
from django.conf import settings 
from myapp import views


urlpatterns = [
    url(r'^$', views.HomePageView.as_view()),
    url(r'^setImageDimension$', views.setImageDimension),
    url(r'^getImageDimension/(?P<imgid>[\w\-]+)/$', views.getImageDimension),
    url(r'^resetImageDimension/(?P<imgid>[\w\-]+)/$', views.resetImageDimension),
]

if settings.DEBUG: 
        urlpatterns += static(settings.MEDIA_URL, 
                              document_root=settings.MEDIA_ROOT) 
