from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Category(models.Model):
    title = models.CharField(max_length=100)
    cover_image = models.ImageField(blank=True, null=True)

    def __str__(self):
        return self.title
    
class Book(models.Model):
    category = models.ForeignKey(Category, related_name='category_book', on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    summary = models.TextField()
    book_file = models.FileField(upload_to='books/', blank=True, null=True)
    cover_image = models.ImageField(blank=True, null=True)
    # is_subscribed = models.BooleanField(default=False)

    def __str__(self):
        return self.title

class Subscription(models.Model):
    user = models.ForeignKey(User, related_name='user_subscription', on_delete=models.CASCADE)
    book = models.ForeignKey(Book, related_name='subscribed_book', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} subscribed to {self.book.title}"
