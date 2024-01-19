from django.contrib import admin
from .models import Category, Book, Subscription

# Register your models here.
admin.site.register(Category)
admin.site.register(Book)
admin.site.register(Subscription)