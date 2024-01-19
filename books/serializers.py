from django.contrib.auth.models import User
from rest_framework import routers, serializers, viewsets
from .models import Category, Book, Subscription

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['id', 'username']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model=Category 
        fields = ['id', 'title', 'cover_image']

class BookSerializer(serializers.ModelSerializer):
    is_subscribed = serializers.SerializerMethodField()
    class Meta:
        model=Book 
        fields = ['id', 'title', 'cover_image', 'summary', 'book_file', 'is_subscribed']

    def get_is_subscribed(self, obj):
        # Check if the user is subscribed to the book
        request = self.context.get('request')
        # user = request.user if request else None
        username='admin'
        user = User.objects.get(username=username)

        if user:
            return obj.subscribed_book.filter(user=user).exists()
        return False

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model=Subscription
        fields = ['id']