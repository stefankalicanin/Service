# Generated by Django 3.2.18 on 2023-09-19 10:53

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0014_troubleshootingreport_unsuccessfully_processing'),
    ]

    operations = [
        migrations.AlterField(
            model_name='troubleshooting',
            name='diagnostic_report',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.diagnosticreport'),
        ),
    ]
