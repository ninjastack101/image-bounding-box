import json
from django.shortcuts import render
from django.views.generic import TemplateView
from django.http import HttpResponse
from myapp.models import Task
from django.core import serializers
from django.http import JsonResponse


# Create your views here.
class HomePageView(TemplateView):
    def get(self, request, **kwargs):
        return render(request, 'index.html', {})


def setImageDimension(request):
    data = json.loads(request.GET['drawings'])
    image_id = data['imageId']
    if image_id:
        ln = data['lines']
        rect = data['rectangles']
        task, created = Task.objects.get_or_create(
            image_detail = image_id
        )
        if len(rect) > 0 :
            task.box = rect
        if len(ln) > 0 :
            task.polyLines = ln
        task.save()
        data ={'status':200,'message':'success'}
        return HttpResponse(json.dumps(data), content_type="application/json")
    data ={'status':404,'message':'not found'}
    return HttpResponse(json.dumps(data), content_type="application/json")


def getImageDimension(request, imgid):
    try:
        task = Task.objects.get( image_detail = imgid )
        data = { 'image_detail': task.image_detail, 'box': task.box, 'polyLines': task.polyLines}
        return JsonResponse(data)
    except:
        data ={'status':404,'message':'not found'}
        return HttpResponse(json.dumps(data), content_type="application/json")


   
    if task:
        data ={'status':200,'message': task}
        return HttpResponse(json.dumps(data), content_type="application/json")
    data ={'status':404,'message':'not found'}
    return HttpResponse(json.dumps(data), content_type="application/json")


def resetImageDimension(request, imgid):
    try :
        task = Task.objects.get(image_detail = imgid )
        task.delete()
        data ={'status':200,'message': 'success'}
        return HttpResponse(json.dumps(data), content_type="application/json")
    except:
        data ={'status':404,'message':'not found'}
        return HttpResponse(json.dumps(data), content_type="application/json")
