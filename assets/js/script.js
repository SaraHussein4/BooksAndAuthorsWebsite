document.addEventListener("DOMContentLoaded", function () {
    const booksUrl = "https://hani-el-shafei.runasp.net/api/Book";
    const authorsUrl = "https://hani-el-shafei.runasp.net/api/Author";
    const latestBookUrl ="https://hani-el-shafei.runasp.net/api/Book/GetLatestBooks";
    

    Promise.all([
        fetch(booksUrl).then(response => response.json()),
        fetch(authorsUrl).then(response => response.json()),
        fetch(latestBookUrl).then(response=>response.json())
    ])
    .then(([books, authors ,latestBooks]) => {
        const container = document.getElementById("featured-container");
        const Authorcontainer = document.querySelector(".testimonial-carousel");
        const LatestBookContainer = document.querySelector(".latestBooks");
        


        container.innerHTML = ""; 
        Authorcontainer.innerHTML="";
        LatestBookContainer.innerHTML="";

        if (!books || books.length === 0) {
            container.innerHTML = "<p>No books found.</p>";
            return;
        }

        books.slice(0,4).forEach(book => {
            const title = book.title || "No title available";
            const image = book.imageBook || "https://via.placeholder.com/150";
            
            const author = authors.find(author => author.id === book.authorId);
            const authorName = author ? author.name : "Unknown author";

            const BookHTML = `
               	<div class="col-md-3 col-sm-6 col-6">
									<div class="product-item">
										<figure class="product-style" >
											<img src="${image}" alt="Books" class="product-item" style="height:360px;">
											<button type="button" class="add-to-cart" data-product-tile="add-to-cart" data-toggle="modal" data-target="#myModal" data-id="${book.id}" >Read More</button>
										</figure>
										<figcaption>
											<h3 style="height:60px; margin-top:14px;">${title}</h3>
											<span>${authorName}</span>
										</figcaption>
									</div>
								</div>
                </div>
            `;
            container.innerHTML += BookHTML;
        

            })

            

            authors.slice(0,3).forEach(author =>{
                const authorName = author.name || "No";
                const authorImage = author.imageAuthor;
                const Description = author.Description || "No Description";
                const Nationality = author.nationality;
                const AuthorHtml = `
                  <div class="col-sm-3 col-xs-12">
      <div class="single-testimonial-box">
         <div class="testimonial-description">
            <div class="testimonial-info">
               <div class="testimonial-img">
                  <img src="${authorImage}" alt="image of clients person" />
               </div>
            </div>
            <div class="testimonial-comment">
               <p>${Description}</p>
            </div>
            <div class="testimonial-person">
               <h2><a href="#">${authorName}</a></h2>
               <h4>${Nationality}</h4>
            </div>
         </div>
      </div>
   </div>

                `;
                Authorcontainer.insertAdjacentHTML('beforeend', AuthorHtml);
        });
      
        latestBooks.slice(0,3).forEach(book=>{
            const title = book.title || "No title available";
            const image = book.imageBook || "https://via.placeholder.com/150";
            const description = book.description.split(".")[0] + "." || "No Description";
            const description2 = book.description.split(".")[1] + "." || "No Description";
            const LatestBookHTML =`
            <div class="new-cars-item">
								<div class="single-new-cars-item">
									<div class="row">
										<div class="col-md-7 col-sm-12">
											<div class="new-cars-img">
												<img src="${image}" alt="img" height="300px" />
											</div>
										</div>
										<div class="col-md-5 col-sm-12">
											<div class="new-cars-txt">
												<h2><a href="#">${title}</a></h2>
												<p>
                                                            ${description}												
                                                </p>
												<p class="new-cars-para2">
                                                    ${description2}												
                                                </p>
												<button class="welcome-btn new-cars-btn" onclick="window.location.href='#'">
													View Details
												</button>
											</div><!--/.new-cars-txt-->	
										</div><!--/.col-->
									</div><!--/.row-->
								</div><!--/.single-new-cars-item-->
							</div>
            `

            const LatestBookContainer = document.querySelector('#new-cars-carousel');

            if ($(LatestBookContainer).data('owl.carousel')) {
                $(LatestBookContainer).owlCarousel('destroy');
}
            LatestBookContainer.innerHTML += LatestBookHTML;

            $(LatestBookContainer).owlCarousel({
                loop: true,
                nav: true,
                dots: true,
                responsive: {
                    0: {
                        items: 1
                    },
                    600: {
                        items: 1
                    },
                    1000: {
                        items: 1
                    }
                }
            });

        });

  $('#myModal').on('show.bs.modal', function (event) {
    const button = $(event.relatedTarget); 
    const bookId = button.data('id'); 
    const book = books.find(b => b.id === bookId);
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

        
        setTimeout(() => {
            $('.owl-carousel1').owlCarousel('destroy');  
            $('.owl-carousel1').owlCarousel({
                loop: true,
                margin: 10,
                nav: true,
                responsive: {
                    0: { items: 1 },
                    600: { items: 2 },
                    1000: { items: 3 }
                }
            });
        }, 100); 

        
    })
    .catch(error => console.error("Error fetching data:", error));
});





