from django.db import models

class Services(models.Model):
    # these attributes match the name and types from the Service table in the DB
    service_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=255, null=True, blank=True)

    # query the Services table
    class Meta:
        db_table = 'Services'

    def __str__(self):
        return self.name
