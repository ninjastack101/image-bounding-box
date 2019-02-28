from django.db import models
from jsonfield import JSONField



# Create your models here.
class Task(models.Model):
    image_detail = models.TextField(max_length=1000, null=True, blank=True)
    name = models.TextField(max_length=1000, null=True, blank=True)
    box = JSONField(null=True, blank=True)
    polyLines = JSONField(null=True, blank=True)

    def __unicode__(self):
        return self.image_detail
        