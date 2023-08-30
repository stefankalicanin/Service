# Generated by Django 3.2.18 on 2023-08-17 15:48

from django.conf import settings
import django.contrib.auth.models
import django.contrib.auth.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('role', models.CharField(choices=[('ADMIN', 'Admin'), ('USER', 'User'), ('REPAIR_DIAGNOSTIC', 'Repair Diagnostic'), ('REPAIR_TROUBLESHOOTING', 'Repair Troubleshooting')], max_length=25)),
                ('gender', models.CharField(choices=[('Muški', 'M'), ('Ženski', 'F')], max_length=6)),
                ('birthday', models.DateField(blank=True, null=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128)),
                ('size', models.CharField(choices=[('BIG', 'Big'), ('SMALL', 'Small')], max_length=5)),
            ],
        ),
        migrations.CreateModel(
            name='Client',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('privileges', models.BooleanField()),
            ],
        ),
        migrations.CreateModel(
            name='Device',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128)),
                ('description', models.CharField(max_length=1024)),
                ('price', models.FloatField()),
                ('under_warranty', models.BooleanField()),
                ('quantity', models.IntegerField()),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.category')),
                ('main_device', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='device', to='core.device')),
            ],
        ),
        migrations.CreateModel(
            name='DiagnosticReport',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(max_length=1024)),
                ('state', models.CharField(choices=[('SUCCESSFULLY', 'Successfully'), ('UNSUCCESSFULLY', 'Unsuccessfully')], max_length=14)),
                ('broken_device', models.CharField(max_length=128)),
            ],
        ),
        migrations.CreateModel(
            name='Location',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('country', models.CharField(max_length=128)),
                ('city', models.CharField(max_length=128)),
                ('address', models.CharField(max_length=128)),
                ('zip', models.IntegerField()),
                ('region', models.CharField(max_length=128)),
                ('number', models.CharField(max_length=16)),
            ],
        ),
        migrations.CreateModel(
            name='Repairer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('salary', models.FloatField()),
                ('rating', models.IntegerField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ScheduleAppointment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_time', models.DateTimeField()),
                ('end_time', models.DateTimeField()),
                ('is_done', models.BooleanField()),
                ('repairer_profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.repairer')),
            ],
        ),
        migrations.CreateModel(
            name='Troubleshooting',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('REPLACE', 'Replace'), ('REPAIR', 'Repair')], max_length=7)),
                ('date', models.DateTimeField()),
                ('diagnostic_report', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='core.diagnosticreport')),
                ('schedule_appointment', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='core.scheduleappointment')),
            ],
        ),
        migrations.CreateModel(
            name='TroubleshootingReport',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(max_length=1024)),
                ('state', models.CharField(choices=[('SUCCESSFULLY', 'Successfully'), ('UNSUCCESSFULLY', 'Unsuccessfully')], max_length=14)),
                ('troubleshooting', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='core.troubleshooting')),
            ],
        ),
        migrations.CreateModel(
            name='TravelWarrant',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data', models.CharField(max_length=1024)),
                ('schedule_appointment', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='core.scheduleappointment')),
            ],
        ),
        migrations.CreateModel(
            name='Pricing',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('price', models.FloatField()),
                ('discount_quota', models.FloatField()),
                ('schedule_appointment', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='core.scheduleappointment')),
            ],
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField()),
                ('quantity', models.IntegerField()),
                ('device', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.device')),
            ],
        ),
        migrations.CreateModel(
            name='DiagnosticsRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type_house', models.CharField(choices=[('HOUSE', 'House'), ('IN SERVICE', 'In Service')], max_length=10)),
                ('date', models.DateTimeField()),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.client')),
                ('device', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='core.device')),
                ('schedule_appointment', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='core.scheduleappointment')),
            ],
        ),
        migrations.AddField(
            model_name='diagnosticreport',
            name='diagnostic_request',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='core.diagnosticsrequest'),
        ),
        migrations.AddField(
            model_name='client',
            name='location',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, to='core.location'),
        ),
        migrations.AddField(
            model_name='client',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
