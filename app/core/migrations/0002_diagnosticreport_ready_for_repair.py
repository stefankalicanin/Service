# Generated by Django 3.2.18 on 2023-08-17 16:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='diagnosticreport',
            name='ready_for_repair',
            field=models.BooleanField(default=None),
            preserve_default=False,
        ),
    ]