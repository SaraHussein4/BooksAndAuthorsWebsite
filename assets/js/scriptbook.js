document.addEventListener("DOMContentLoaded", function () {
    const booksUrl = "https://hani-el-shafei.runasp.net/api/Book";
    const authorsUrl = "https://hani-el-shafei.runasp.net/api/Author";

    Promise.all([
        fetch(booksUrl).then(response => response.json()),
        fetch(authorsUrl).then(response => response.json())
    ])
    .then(([books, authors]) => {
        const container = document.getElementById("featured-container");
        const tabsContainer = document.querySelector(".tabs");
        const tabContentContainer = document.querySelector(".tab-content");

        if (!books || books.length === 0) {
            container.innerHTML = "<p>No books found.</p>";
            return;
        }

        const categories = ["All Genre", ...new Set(books.map(book => book.category))];

        tabsContainer.innerHTML = "";
        categories.forEach((category, index) => {
            const tab = document.createElement("li");
            tab.classList.add("tab");
            if (index === 0) tab.classList.add("active");
            tab.textContent = category;
            tab.dataset.tabTarget = `#${category.replace(/\s+/g, "-").toLowerCase()}`;
            tabsContainer.appendChild(tab);
        });

        tabContentContainer.innerHTML = "";
        categories.forEach((category, index) => {
            const tabContent = document.createElement("div");
            tabContent.id = category.replace(/\s+/g, "-").toLowerCase();
            tabContent.dataset.tabContent = true;
            if (index === 0) tabContent.classList.add("active");
            tabContent.innerHTML = `<div class="row"></div>`;
            tabContentContainer.appendChild(tabContent);
        });

        books.forEach(book => {
            const title = book.title || "No title available";
            const image = book.imageBook || "https://via.placeholder.com/150";
            const author = authors.find(author => author.id === book.authorId);
            const authorName = author ? author.name : "Unknown author";

            const bookHTML = `
                <div class="col-md-3 col-sm-6 col-6">
                    <div class="product-item">
                        <figure class="product-style">
                            <img src="${image}" alt="Book" class="product-item" style="height:360px;">
                            <button type="button" class="add-to-cart" data-toggle="modal" data-target="#myModal" data-id="${book.id}" >Read More</button>
                        </figure>
                        <figcaption>
                            <h3 style="height:60px;margin-top:14px;">${title}</h3>
                            <span>${authorName}</span>
                        </figcaption>
                    </div>
                </div>
            `;

            document.querySelector("#all-genre .row").innerHTML += bookHTML;
            
            const categoryId = book.category.replace(/\s+/g, "-").toLowerCase();
            const categoryTab = document.querySelector(`#${categoryId} .row`);
            if (categoryTab) {
                categoryTab.innerHTML += bookHTML;
            }
        });

        const tabs = document.querySelectorAll(".tab");
        const tabContents = document.querySelectorAll("[data-tab-content]");

        tabs.forEach(tab => {
            tab.addEventListener("click", () => {
                const target = document.querySelector(tab.dataset.tabTarget);
                tabContents.forEach(tabContent => tabContent.classList.remove("active"));
                tabs.forEach(t => t.classList.remove("active"));
                tab.classList.add("active");
                target.classList.add("active");
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


        

    })
    .catch(error => console.error("Error fetching data:", error));
});
