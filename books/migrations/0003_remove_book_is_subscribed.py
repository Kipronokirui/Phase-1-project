# Generated by Django 4.2.9 on 2024-01-18 19:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("books", "0002_book_is_subscribed"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="book",
            name="is_subscribed",
        ),
    ]
