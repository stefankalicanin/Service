# Generated by Django 3.2.18 on 2023-05-23 08:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_remove_diagnosticsrequest_ready_for_repair'),
    ]

    operations = [
        migrations.AddField(
            model_name='diagnosticsrequest',
            name='ready_for_repair',
            field=models.BooleanField(default=False),
        ),
    ]
