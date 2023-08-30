from django.core.management.base import BaseCommand
from core.models import Category, Device


class Command(BaseCommand):
    help = "Inserts initial into the database"

    def handle(self, *args, **options):
        data = [
            {
                'name': 'Mobile phone',
                'size': 'SMALL'
            },
            {
                'name': 'Fridge',
                'size': 'BIG'
            }
        ]

        for entry in data:
            Category.objects.create(**entry)
            self.stdout.write(self.style.SUCCESS('Successfully inserted initial data'))
