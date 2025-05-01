document.addEventListener("DOMContentLoaded", function () {
    const booksUrl = "https://hani-el-shafei.runasp.net/api/Book";
    const authorsUrl = "https://hani-el-shafei.runasp.net/api/Author";
    const booksPerPage = 8;
  
    Promise.all([
      fetch(booksUrl).then(res => res.json()),
      fetch(authorsUrl).then(res => res.json())
    ])
    .then(([books, authors]) => {
      const tabsContainer = document.getElementById("category-tabs");
      const booksContainer = document.getElementById("books-container");
  
      const categories = ["All Genre", ...new Set(books.map(book => book.category))];
  
      // Build tabs
      tabsContainer.innerHTML = '';
      categories.forEach((category, index) => {
        const sanitized = category.replace(/\s+/g, "-").toLowerCase();
        const active = index === 0 ? 'active' : '';
        const tabHTML = `
          <li class="nav-item">
            <button class="nav-link ${active}" data-bs-toggle="tab" data-tab-target="#${sanitized}" type="button">${category}</button>
          </li>`;
        tabsContainer.innerHTML += tabHTML;
      });
  
      // Build content containers
      booksContainer.innerHTML = '';
      categories.forEach((category, index) => {
        const sanitized = category.replace(/\s+/g, "-").toLowerCase();
        const active = index === 0 ? 'show active' : '';
        booksContainer.innerHTML += `
          <div class="tab-pane fade ${active}" id="${sanitized}" role="tabpanel">
            <div class="books-wrapper"></div>
            <nav>
              <ul class="pagination justify-content-center mt-4"></ul>
            </nav>
          </div>`;
      });
  
      // Group books by category
      const categoryBooksMap = {};
      categories.forEach(cat => {
        categoryBooksMap[cat] = books.filter(book => cat === "All Genre" || book.category === cat);
      });
  
      // Render paginated books
      function renderBooks(category, page = 1) {
        const sanitized = category.replace(/\s+/g, "-").toLowerCase();
        const wrapper = document.querySelector(`#${sanitized} .books-wrapper`);
        const paginationEl = document.querySelector(`#${sanitized} .pagination`);
        const booksList = categoryBooksMap[category];
  
        const start = (page - 1) * booksPerPage;
        const paginatedBooks = booksList.slice(start, start + booksPerPage);
  
        wrapper.innerHTML = `<div class="row g-4"></div>`;
        const row = wrapper.querySelector('.row');
  
        paginatedBooks.forEach(book => {
          const image = book.imageBook || "https://via.placeholder.com/150";
          const title = book.title || "Untitled";
          const author = authors.find(a => a.id === book.authorId);
          const authorName = author ? author.name : "Unknown Author";
  
          row.innerHTML += `
            <div class="col-md-3 col-sm-6 col-6">
              <div class="product-item">
                <div class="product-style">
                  <img src="${image}" alt="Books" class="product-image" style="height:360px;">
                  <button type="button" class="add-to-cart" data-bs-toggle="modal" data-bs-target="#myModal" data-id="${book.id}">Read More</button>
                </div>
                <figcaption>
                  <h3 style="height:40px; margin-top:14px;">${title}</h3>
                  <span>${authorName}</span>
                </figcaption>
              </div>
            </div>`;
        });
  
        // Pagination
        const totalPages = Math.ceil(booksList.length / booksPerPage);
        paginationEl.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
          paginationEl.innerHTML += `
            <li class="page-item ${i === page ? 'active' : ''}">
              <button class="page-link" data-page="${i}" data-category="${category}">${i}</button>
            </li>`;
        }
      }
  
      // Initial render for all categories
      categories.forEach(cat => renderBooks(cat, 1));
  
      // Handle tab click
      const tabButtons = document.querySelectorAll('[data-tab-target]');
      const tabPanes = document.querySelectorAll('.tab-pane');
  
      tabButtons.forEach(button => {
        button.addEventListener('click', () => {
          const target = document.querySelector(button.getAttribute('data-tab-target'));
          tabButtons.forEach(btn => btn.classList.remove('active'));
          tabPanes.forEach(pane => pane.classList.remove('show', 'active'));
  
          button.classList.add('active');
          target.classList.add('show', 'active');
        });
      });
  
      // Handle pagination click
      booksContainer.addEventListener('click', e => {
        if (e.target.classList.contains('page-link')) {
          const category = e.target.getAttribute('data-category');
          const page = parseInt(e.target.getAttribute('data-page'));
          renderBooks(category, page);
        }
      });
  
      // Modal dynamic content
      const myModal = document.getElementById('myModal');
      myModal.addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget;
        const bookId = button.getAttribute('data-id');
        const book = books.find(b => b.id == bookId);
  
        if (book) {
          const author = authors.find(a => a.id === book.authorId);
          const authorName = author ? author.name : "Unknown Author";
  
          myModal.querySelector('.modal-title').textContent = book.title;
  
          myModal.querySelector('.modal-body').innerHTML = `
            <div class="row">
              <div class="col-md-4">
                <img src="${book.imageBook || "https://via.placeholder.com/150"}" class="img-fluid" alt="${book.title}">
              </div>
              <div class="col-md-8">
                <p><strong>Author:</strong> ${authorName}</p>
                ${book.description ? `<p><strong>Description:</strong> ${book.description}</p>` : ''}
                ${book.publishedDate ? `<p><strong>Published Date:</strong> ${new Date(book.publishedDate).toLocaleDateString()}</p>` : ''}
                ${book.category ? `<p><strong>Genre:</strong> ${book.category}</p>` : ''}
                ${book.isbn ? `<p><strong>ISBN:</strong> ${book.isbn}</p>` : ''}
                ${book.pages ? `<p><strong>Pages:</strong> ${book.pages}</p>` : ''}
                ${book.price ? `<p><strong>Price:</strong> ${book.price}</p>` : ''}
              </div>
            </div>`;
        }
      });
    })
    .catch(err => console.error("Error loading data:", err));
  });
  