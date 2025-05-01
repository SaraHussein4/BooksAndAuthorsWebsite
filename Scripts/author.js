document.addEventListener("DOMContentLoaded", function () {
    const authorsUrl = "https://hani-el-shafei.runasp.net/api/Author";
    const authorsPerPage = 8;
  
    let authors = [];
  
    function renderAuthors(page = 1) {
      const container = document.querySelector(".testimonial-carousel");
      container.innerHTML = "";
  
      const start = (page - 1) * authorsPerPage;
      const paginatedAuthors = authors.slice(start, start + authorsPerPage);
  
      const row = document.createElement("div");
      row.className = "row justify-content-center";
      container.appendChild(row);
  
      paginatedAuthors.forEach(author => {
        const html = `
          <div class="col-lg-3 col-md-4 col-sm-6 col-12 mb-4 product-s">
            <div class="product-item">
              <div class="product-style" style="height: 360px; background-color: #f8f9fa; position: relative;">
                <img src="${author.imageAuthor || 'https://via.placeholder.com/150'}" alt="${author.name}" class="product-image" style="height:100%; object-fit: cover;">
                <button type="button" class="add-to-cart" data-bs-toggle="modal" data-bs-target="#myModal" data-id="${author.id}" style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); display: none;">Read More</button>
              </div>
              <figcaption class="text-center mt-2">
                <h5>${author.name || "No Name"}</h5>
                <span>${author.nationality || "Unknown"}</span>
              </figcaption>
            </div>
          </div>`;
        row.insertAdjacentHTML("beforeend", html);
      });
  
      document.querySelectorAll(".product-style").forEach(card => {
        card.addEventListener("mouseenter", () => {
          const btn = card.querySelector(".add-to-cart");
          if (btn) btn.style.display = "block";
        });
        card.addEventListener("mouseleave", () => {
          const btn = card.querySelector(".add-to-cart");
          if (btn) btn.style.display = "none";
        });
      });
  
      const pagination = document.getElementById("author-pagination");
      const totalPages = Math.ceil(authors.length / authorsPerPage);
      pagination.innerHTML = '';
  
      for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += `
          <li class="page-item ${i === page ? 'active' : ''}">
            <button class="page-link" data-page="${i}">${i}</button>
          </li>`;
      }
    }
  
    fetch(authorsUrl)
      .then(response => response.json())
      .then(data => {
        authors = data;
        renderAuthors(1);
      })
      .catch(error => console.error("Error fetching authors:", error));
  
    document.getElementById("author-pagination").addEventListener("click", function (e) {
      if (e.target.classList.contains("page-link")) {
        const page = parseInt(e.target.getAttribute("data-page"));
        renderAuthors(page);
      }
    });
  
    $('#myModal').on('show.bs.modal', function (event) {
      const button = $(event.relatedTarget);
      const authorId = button.data('id');
      const author = authors.find(a => a.id === authorId);
  
      if (author) {
        const modal = $(this);
        modal.find('.modal-header').html(`
          <h5 class="modal-title">${author.name}</h5>
          <button type="button" class="btn-close ms-auto" data-bs-dismiss="modal" aria-label="Close"></button>
        `);
  
        modal.find('.modal-body').html(`
          <div class="row">
            <div class="col-md-4 mb-3">
              <img src="${author.imageAuthor || 'https://via.placeholder.com/150'}" alt="${author.name}" class="img-fluid rounded">
            </div>
            <div class="col-md-8">
              <p><strong>Nationality:</strong> ${author.nationality || "Unknown"}</p>
              <p><strong>Birth Date:</strong> ${author.birthDate ? new Date(author.birthDate).toLocaleDateString() : "N/A"}</p>
              <p><strong>Description:</strong> ${author.description || "No description available."}</p>
            </div>
          </div>
        `);
      }
    });
  
    $('#myModal').on('hidden.bs.modal', function () {
      $('.product-item').removeClass('hover-reset');
      $('.product-item').hide().show(0);
    });
  });
  