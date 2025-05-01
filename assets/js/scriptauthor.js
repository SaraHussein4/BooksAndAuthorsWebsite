document.addEventListener("DOMContentLoaded", function () {
    const booksUrl = "https://hani-el-shafei.runasp.net/api/Book";
    const authorsUrl = "https://hani-el-shafei.runasp.net/api/Author";

    Promise.all([
        fetch(authorsUrl).then(response => response.json())
    ])
    .then(([ authors]) => {
        const Authorcontainer = document.querySelector(".owl");

        Authorcontainer.innerHTML="";


            authors.forEach(author =>{
                const authorName = author.name || "No";
                const authorImage = author.imageAuthor;
                const Nationality = author.nationality;
                const AuthorHtml = `
                  <div class="col-md-4 col-sm-3 col-xs-12 col-12">
      <div class="single-testimonial-box m-3">
         <div class="testimonial-description">
            <div class="testimonial-info">
               <div class="testimonial-img">
                  <img src="${authorImage}" alt="image of clients person" />
            <button type="button" class="author-read-more" data-product-tile="add-to-cart" data-toggle="modal" data-target="#myModal" data-id="${author.id}">Read More</button>

               </div>
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

        
  $('#myModal').on('show.bs.modal', function (event) {
    const button = $(event.relatedTarget); 
    const AuthorId = button.data('id'); 
    const author = authors.find(a => a.id === AuthorId);
    if (author) {

        const modal = $(this);
        modal.find('.modal-header').html(`
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
			<h4 class="modal-title" id="myModalLabel">${author.name}</h4> 
            `);   
        modal.find('.modal-body').html(`
            <div class="row">
                <div class="col-md-4">
                    <img src="${author.imageAuthor || "https://via.placeholder.com/150"}" alt="${author.imageAuthor}" class="img-fluid">
                </div>
                <div class="col-md-8">
                    <p><strong>Author:</strong> ${author.name}</p>
                    ${author.description ? `<p><strong>Description:</strong> ${author.description}</p>` : ''}
                    ${author.birthDate ? `<p><strong>Published Date:</strong> ${new Date(author.birthDate).toLocaleDateString()}</p>` : ''}
                    <p><strong>Author:</strong> ${author.nationality}</p>

                </div>
            </div>
        `);
    }
});


$(document).ready(function(){
    $('#myModal').on('hidden.bs.modal', function () {
        Authorcontainer.insertAdjacentHTML('beforeend', AuthorHtml);

    });
});

        
    })
    .catch(error => console.error("Error fetching data:", error));
});
