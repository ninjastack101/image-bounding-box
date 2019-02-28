from django.contrib import admin
from myapp.models import Task


class TaskAdmin(admin.ModelAdmin):
    list_display = ('image_detail',)


admin.site.register(Task, TaskAdmin)
