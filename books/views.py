from django.shortcuts import render
from rest_framework import routers, serializers, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import filters, generics, permissions, status
from django.contrib.auth.models import User
from .serializers import (Category, CategorySerializer, 
                          Book, BookSerializer, 
                          Subscription, SubscriptionSerializer)
from django.db.models import F
from django.db.models import Exists, OuterRef

# Create your views here.
def home(request):
    context={}
    return render(request, 'books/books.html', context)

class CategoryListView(APIView):
    def get(self, request, format=None):
        categorys=Category.objects.all()
        categorys_serializer=CategorySerializer(categorys, many=True)
        data={
            "categorys":categorys_serializer.data,
        }
        return Response(data)

class CategoryBooksListView(APIView):
    def get(self, request, id, format=None):
        try:
            category = Category.objects.get(id=id)
            category_books=Book.objects.filter(category=category)
            category_books_serializer=BookSerializer(category_books, many=True)
            data={
                "books":category_books_serializer.data,
            }
            return Response(data)
        
        except Category.DoesNotExist:
            return Response("Category not found", status=status.HTTP_404_NOT_FOUND)

class BooksListView(APIView):
    def get(self, request, format=None):
        username='admin'
        user = User.objects.get(username=username)
        books = Book.objects.annotate(
            is_subscribed=Exists(
                Subscription.objects.filter(
                    user=user,
                    book=OuterRef('pk'),
                )
            )
        )
        books=Book.objects.all()
        books_serializer=BookSerializer(books, many=True)
        data={
            "books":books_serializer.data,
        }
        return Response(data)

class BookDetailsView(APIView):
    def get(self, request, id, format=None):
        try:
            book = Book.objects.get(id=id)
            book_serializer=BookSerializer(book, many=False)
            data={
                "book":book_serializer.data,
            }
            return Response(data, status=status.HTTP_200_OK)
        
        except Book.DoesNotExist:
            return Response("Book not found", status=status.HTTP_404_NOT_FOUND)
        
class BookSubscriptionView(APIView):
    def post(self, request, id, format=None):
        if request.method == 'POST':
            try:
                book = Book.objects.get(id=id)
                username='admin'
                user = User.objects.get(username=username)
                subscription = Subscription.objects.create(
                    user=user,
                    book=book
                )
                subscription.save()
                # book.is_subscribed = True
                # book.save()
                book_serializer=BookSerializer(book, many=False)
                data={
                    "book":book_serializer.data,
                }
                return Response(data, status=status.HTTP_200_OK)
            
            except Book.DoesNotExist:
                return Response("Book not found", status=status.HTTP_404_NOT_FOUND)
