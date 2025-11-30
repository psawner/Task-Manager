from django.db import models

class Task(models.Model):
    title = models.CharField(max_length=200)
    due_date = models.DateField()
    estimated_hours = models.IntegerField()
    importance = models.IntegerField()
    dependencies = models.JSONField(default=list)
    score = models.FloatField(default=0)

    def __str__(self):
        return self.title

