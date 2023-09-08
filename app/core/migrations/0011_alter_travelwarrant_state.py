# Generated by Django 3.2.18 on 2023-09-05 12:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0010_remove_travelwarrant_data'),
    ]

    operations = [
        migrations.AlterField(
            model_name='travelwarrant',
            name='state',
            field=models.CharField(choices=[('APPROVED', 'Approved'), ('UNAPPROVED', 'Unapproved'), ('ON_WAIT', 'On Wait')], max_length=10),
        ),
    ]