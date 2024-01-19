const bookModal = document.getElementById('bookModal')
const booksList = document.getElementById('booksList')
const categorysList = document.getElementById('categorysList')
const backendURL = 'http://127.0.0.1:8000'

function fetchCategories(){
    fetch('http://127.0.0.1:8000/categorys/')
    .then((response) => response.json())
    .then(categories => {
        categories.categorys.forEach(category => {
            const categoryContainer = document.createElement('li');
            categoryContainer.innerHTML =`
                <button 
                    onclick="showCategoryBooks(${category.id})"
                    type="button" 
                    class="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-4 py-2 text-center"
                >
                    ${category.title}
                </button>
            `
            categorysList.appendChild(categoryContainer)
        });
    })
}

function fetchBooks(){
    booksList.innerHTML=''
    fetch('http://127.0.0.1:8000/books/')
    .then((response) => response.json())
    .then(data => {
        data.books.forEach(book => {
            const coverImage = backendURL+book.cover_image
            const bookContainer = document.createElement('div');
            bookContainer.classList.add('max-w-sm', 'bg-white', 'border', 'border-gray-200', 'rounded-lg', 'shadow');
            // bookContainer.classList.add('max-w-sm bg-white border border-gray-200 rounded-lg shadow')
            bookContainer.innerHTML =`
                    <a href="#">
                        <img 
                            class="rounded-t-lg w-full max-h-36" 
                            src="${coverImage}"  
                            alt="" 
                        />
                    </a>
                    <div class="p-2">
                        <a href="#">
                            <h5 
                                class="mb-2 text-xl font-bold tracking-tight text-gray-900"
                            >
                                ${book.title}
                            </h5>
                        </a>
                        
                        <button onclick="showModal(${book.id})" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800">
                            Read more
                        </button>
                    </div>
            `
            booksList.appendChild(bookContainer)
        });
    })
}
function showModal(id){
    const bookTitle = document.getElementById('bookTitle')
    const bookDescription = document.getElementById('bookDescription')
    const downloadButton = document.getElementById('downloadButton')
    bookTitle.textContent = ''
    bookDescription.textContent = ''
    fetch(`http://127.0.0.1:8000/book/${id}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then((response) => response.json())
    .then(data => {
        const bookFile = backendURL+data.book.book_file
        bookTitle.textContent = data.book.title
        bookDescription.textContent = data.book.summary
        if (data.book && data.book.is_subscribed === true) {
            downloadButton.innerHTML=`
                <a 
                    class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800"
                    href="${bookFile}" 
                    download
                > 
                    Download File
                </a>
            `
        }
        else{
            downloadButton.innerHTML=`
                <button 
                    class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800"
                    onclick="subscribeToBook(event, ${id})" 
                    download
                > 
                    Subscribe Now
                </button>
            `
        }
    })
    bookModal.classList.remove('hidden')
}

function hideModal(){
    bookModal.classList.add('hidden')
}

function subscribeToBook(event, id){
    event.preventDefault();
    fetch(`http://127.0.0.1:8000/book/subscribe/${id}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then((response) => {
        if (response.status === 200) {
            alert(`Subscription successful for Book Id: ${id}`);
        } else {
            alert(`Failed to subscribe to Book Id: ${id}`);
        }
        return response.json();
    })
    .then(data => {
        bookModal.classList.remove('hidden')
    })
    .catch(error => {
        console.error('Error:', error);
    });
    bookModal.classList.remove('hidden')
}

function showCategoryBooks(id){
    booksList.innerHTML=''
    fetch(`http://127.0.0.1:8000/category/${id}/`)
    .then((response) => response.json())
    .then(data => {
        if (data.books && data.books.length > 0) {
            data.books.forEach(book => {
                const coverImage = backendURL+book.cover_image
                const bookContainer = document.createElement('div');
                bookContainer.classList.add('max-w-sm', 'bg-white', 'border', 'border-gray-200', 'rounded-lg', 'shadow');
                // bookContainer.classList.add('max-w-sm bg-white border border-gray-200 rounded-lg shadow')
                bookContainer.innerHTML =`
                        <a href="#">
                            <img 
                                class="rounded-t-lg w-full max-h-36" 
                                src="${coverImage}" 
                                alt="" 
                            />
                        </a>
                        <div class="p-2">
                            <a href="#">
                                <h5 
                                    class="mb-2 text-xl font-bold tracking-tight text-gray-900"
                                >
                                    ${book.title}
                                </h5>
                            </a>
                            
                            <button onclick="showModal()" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800">
                                Read more
                            </button>
                        </div>
                `
                booksList.appendChild(bookContainer)
            });
        } else {
            const noBooksMessage = document.createElement('p');
            noBooksMessage.classList.add('text-center', 'font-bold')
            noBooksMessage.textContent = 'No books available in this category.';
            booksList.appendChild(noBooksMessage);
        }
    })
    .catch(error => {
        alert(('Error fetching data:', error))
        // console.error('Error fetching data:', error);
    })
}

window.onload = function() {
    fetchCategories();
    fetchBooks();
}