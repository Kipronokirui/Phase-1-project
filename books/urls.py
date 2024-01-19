from django.urls import path
from .views import home, CategoryListView, CategoryBooksListView, BooksListView, BookDetailsView, BookSubscriptionView

urlpatterns=[
    path('books/', BooksListView.as_view(), name='books'),
    path('categorys/', CategoryListView.as_view(), name='categorys'),
    path('category/<int:id>/', CategoryBooksListView.as_view(), name='category_books'),
    path('book/<int:id>/', BookDetailsView.as_view(), name='book_details'),
    path('book/subscribe/<int:id>/', BookSubscriptionView.as_view(), name='book_subscription'),
]