# Generated by Django 3.2.18 on 2023-09-11 10:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0013_troubleshooting_state'),
    ]

    operations = [
        migrations.AddField(
            model_name='troubleshootingreport',
            name='unsuccessfully_processing',
            field=models.BooleanField(default=False),
        ),
    ]
