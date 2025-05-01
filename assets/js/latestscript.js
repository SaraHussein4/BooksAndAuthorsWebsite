document.addEventListener("DOMContentLoaded", function () {
    const authorsUrl = "https://hani-el-shafei.runasp.net/api/Author";
    const latestBookUrl ="https://hani-el-shafei.runasp.net/api/Book/GetLatestBooks";
    

    Promise.all([
        fetch(authorsUrl).then(response => response.json()),
        fetch(latestBookUrl).then(response=>response.json())
    ])
    .then(([authors ,latestBooks]) => {
        const container = document.getElementById("featured-container");
        


        container.innerHTML = ""; 

        if (!latestBooks || latestBooks.length === 0) {
            container.innerHTML = "<p>No books found.</p>";
            return;
        }

        latestBooks.slice(0,12).forEach(book => {
            const title = book.title || "No title available";
            const image = book.imageBook || "https://via.placeholder.com/150";
            
            const author = authors.find(author => author.id === book.authorId);
            const authorName = author ? author.name : "Unknown author";
           

            const BookHTML = `
               	<div class="col-md-3 col-sm-6 col-6">
									<div class="product-item">
										<figure class="product-style" >
                                        <div style="overflow:hidden">
											<img src="${image}" alt="Books" class="product-item" style="height:360px;">
											<button type="button" class="add-to-cart" data-product-tile="add-to-cart" data-toggle="modal" data-target="#myModal" data-id="${book.id}" >Read More</button>
                                            </div>
										</figure>
										<figcaption>
											<h3 style="height:60px; margin-top:14px;">${title}</h3>
											<span>${authorName}</span>
										</figcaption>
									</div>
								</div>
                </div>
            `;
            // container.innerHTML += BookHTML;
            container.insertAdjacentHTML('beforeend', BookHTML);


            })

            

  $('#myModal').on('show.bs.modal', function (event) {
    const button = $(event.relatedTarget); 
    const bookId = button.data('id'); 
    const book = latestBooks.find(b => b.id === bookId);
    if (book) {
        const author = authors.find(author => author.id === book.authorId);
        const authorName = author ? author.name : "Unknown author";
        const modal = $(this);
        modal.find('.modal-title').text(book.title); 
        modal.find('.modal-header').html(`
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
			<h4 class="modal-title" id="myModalLabel">${book.title}</h4> 
            `);   
        modal.find('.modal-body').html(`
            <div class="row">
                <div class="col-md-4">
                    <img src="${book.imageBook || "https://via.placeholder.com/150"}" alt="${book.title}" class="img-fluid">
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
   

        
    })
    .catch(error => console.error("Error fetching data:", error));
});
