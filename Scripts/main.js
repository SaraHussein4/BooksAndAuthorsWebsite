var preloader = document.getElementsByClassName("preloader")[0];

window.onload = function () {
    setTimeout(function () {
        preloader.style.transition = "opacity 0.3s ease";
        preloader.style.opacity = 0;
        setTimeout(function () {
            preloader.style.display = "none";
        }, 400)
    }, 600)

}



var nav = document.querySelector("nav");

window.onscroll = function () {
    if (scrollY > 480) {
        nav.classList.add("sticky-bar");
    }

    else {
        nav.classList.remove("sticky-bar");

    }

}

