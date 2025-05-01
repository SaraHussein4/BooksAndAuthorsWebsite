document.addEventListener("DOMContentLoaded", function () {
    const booksUrl = "https://hani-el-shafei.runasp.net/api/Book/GetLatestBooks";
    const authorsUrl = "https://hani-el-shafei.runasp.net/api/Author";

    

    Promise.all([
        fetch(booksUrl).then(response => response.json()),
        fetch(authorsUrl).then(response => response.json()),
    ])
    .then(([books, authors ]) => {
        const container = document.getElementById("featured-container");

        


        container.innerHTML = ""; 

        if (!books || books.length === 0) {
            container.innerHTML = "<p>No books found.</p>";
            return;
        }

        books.slice(0,8).forEach(book => {
            const title = book.title || "No title available";
            const image = book.imageBook || "https://via.placeholder.com/150";
            
            const author = authors.find(author => author.id === book.authorId);
            const authorName = author ? author.name : "Unknown author";

            const BookHTML = `
               <div class="col-md-3 col-sm-6 col-6" style="height:500px">
  <div class="product-item" style="height:500px">
    <div class="product-style">
      <img src="${image}" alt="Books" class="product-image" style="height:360px;">
      <button type="button" class="add-to-cart" data-bs-toggle="modal" data-bs-target="#myModal" data-id="${book.id}">Read More</button>
    </div>
    <figcaption>
      <h3 style="height:40px; margin-top:14px;">${title}</h3>
      <span>${authorName}</span>
    </figcaption>
  </div>
</div>
            `;
            container.innerHTML += BookHTML;
        

            })

            

        

  $('#myModal').on('show.bs.modal', function (event) {
    const button = $(event.relatedTarget);
    const bookId = button.data('id');
    const book = books.find(b => b.id === bookId);

    if (book) {
        const author = authors.find(author => author.id === book.authorId);
        const authorName = author ? author.name : "Unknown author";
        const modal = $(this);

        modal.find('.modal-header').html(`
            <h5 class="modal-title" id="myModalLabel">${book.title}</h5>
            <button type="button" class="btn-close ms-auto" data-bs-dismiss="modal" aria-label="Close"></button>
        `);

        modal.find('.modal-body').html(`
            <div class="row">
                <div class="col-md-4 mb-3">
                    <img src="${book.imageBook || "https://via.placeholder.com/150"}" alt="${book.title}" class="img-fluid rounded">
                </div>
                <div class="col-md-8">
                    <p><strong>Author:</strong> ${authorName}</p>
                    ${book.description ? `<p><strong>Description:</strong> ${book.description}</p>` : ''}
                    ${book.publishedDate ? `<p><strong>Published Date:</strong> ${new Date(book.publishedDate).toLocaleDateString()}</p>` : ''}
                    ${book.category ? `<p><strong>Genre:</strong> ${book.category}</p>` : ''}
                    ${book.isbn ? `<p><strong>ISBN:</strong> ${book.isbn}</p>` : ''}
                    ${book.pages ? `<p><strong>Number Of Pages:</strong> ${book.pages}</p>` : ''}
                    ${book.price ? `<p><strong>Price:</strong> ${book.price}</p>` : ''}
                </div>
            </div>
        `);
    }
});


$('#myModal').on('hidden.bs.modal', function () {
    
    $('.product-item').removeClass('hover-reset');

    $('.product-item').hide().show(0);
});
        
    })
    .catch(error => console.error("Error fetching data:", error));
});





