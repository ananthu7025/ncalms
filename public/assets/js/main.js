"use strict";

/* ::::::::::::::::::::
:: GLobal Javascript ::
::::::::::::::::::::::: */
// =========== Preloader =============
document.addEventListener("DOMContentLoaded", function() {
  // Function to hide the preloader
  function hidePreloader() {
      document.querySelector(".preloader").classList.add("hide");
      // Show the main content after the preloader is hidden
      setTimeout(function() {
          document.querySelector(".page-wrapper").classList.add("show");
          document.body.style.overflow = "auto"; // Enable scrolling
      }, 1000); // Wait for the hide animation to finish
  }

  // Simulate loading time (e.g., 3 seconds) or use window.onload for real load time
  setTimeout(hidePreloader, 3000); // 3 seconds loading time

  // Optional: Use window.onload to handle all resources being loaded
  // window.onload = hidePreloader;
});

// ==== Sticky Menu ====
window.addEventListener("scroll", function () {
  let siteHeader = document.querySelector("header");
  siteHeader.classList.toggle("scrolling", window.scrollY > 0);
});

// ================================ Scroll to Top ==================================
const scrollTopBtn = document.getElementById("scrollTopBtn");

// Show the button when scrolling down 20px from the top
window.onscroll = function () {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    scrollTopBtn.style.display = "block";
  } else {
    scrollTopBtn.style.display = "none";
  }
};

// Scroll to the top when the button is clicked
scrollTopBtn.onclick = function () {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE, and Opera
};

// ================================Animate Interaction on Scroll ==================================
JOS.init({
  // disable: false, // Disable JOS gloabaly | Values :  'true', 'false'
  // debugMode: true, // Enable JOS debug mode | Values :  'true', 'false'
  passive: false, // Set the passive option for the scroll event listener | Values :  'true', 'false'

  once: true, // Disable JOS after first animation | Values :  'true', 'false' || Int : 0-1000
  animation: "fade-up", // JOS global animation type | Values :  'fade', 'slide', 'zoom', 'flip', 'fade-right', 'fade-left', 'fade-up', 'fade-down', 'zoom-in-right', 'zoom-in-left', 'zoom-in-up', 'zoom-in-down', 'zoom-out-right', 'zoom-out-left', 'zoom-out-up', 'zoom-out-down', 'flip-right', 'flip-left', 'flip-up', 'flip-down, spin, revolve, stretch, "my-custom-animation"
  // animationInverse: "static", // Set the animation type for the element when it is scrolled out of view | Values :  'fade', 'slide', 'zoom', 'flip', 'fade-right', 'fade-left', 'fade-up', 'fade-down', 'zoom-in-right', 'zoom-in-left', 'zoom-in-up', 'zoom-in-down', 'zoom-out-right', 'zoom-out-left', 'zoom-out-up', 'zoom-out-down', 'flip-right', 'flip-left', 'flip-up', 'flip-down, spin, revolve, stretch, "my-custom-animation"
  timingFunction: "ease", // JOS global timing function | Values :  'ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear', 'step-start', 'step-end', 'steps()', 'cubic-bezier()', 'my-custom-timing-function'
  //mirror : false, // Set whether the element should animate back when scrolled out of view | Values :  'true', 'false'
  threshold: 0, // Set gloabal the threshold for the element to be visible | Values :  0-1
  delay: 0.5, // Set global the delay for the animation to start | Values :  0,1,2,3,4,5
  duration: 0.7, // Set global the duration for the animation playback | Values :  flota : 0-1 & int : 0,1,2,3,4,5

  // startVisible: "true", // Set whether the element should animate when the page is loaded | Values :  'true', 'false' || MS : 0-10000
  scrollDirection: "down", // Set the scroll direction for the element to be visible | Values :  'up', 'down', 'none'
  //scrollProgressDisable: true // disable or enable scroll callback function | Values :  'true', 'false'
  // intersectionRatio: 0.4, // Set the intersection ratio between which the element should be visible | Values :  0-1 (automaticaly set)
  // rootMargin_top: "0%", // Set by which percent the element should animate out (Recommended value between 10% to -30%)
  // rootMargin_bottom: "-50%", // Set by which percent the element should animate out (Recommended value between -10% to -60%)
  rootMargin: "0% 0% 15% 0%", // Set the root margin for the element to be visible | Values :  _% _% _% _%  (automaticaly set)
});

// ======================================== Accordion ======================================
let accordions = document.querySelectorAll(".accordion-item");
accordions.forEach((item) => {
  let label = item.querySelector(".accordion-header");
  label.addEventListener("click", () => {
    accordions.forEach((accordionItem) => {
      accordionItem.classList.remove("active");
    });
    item.classList.toggle("active");
  });
});

//=========== Progress Bar =============
// Find the element with the class 'progress-bar'
const progressBars = document.querySelectorAll(".progress-bar");

// Iterate over each progress bar element
progressBars.forEach((progressBar) => {
  // Get the value of the 'data-percentage-value' attribute for each progress bar
  const percentageValue = progressBar.getAttribute("data-percentage-value");
  progressBar.style.width = percentageValue + "%";
});

//=========== Pricing Button =============
function toggleSwitch() {
  var month = document.querySelectorAll(".month");
  var annual = document.querySelectorAll(".annual");
  for (var i = 0; i < month.length; i++) {
    if (document.getElementById("toggle").checked == true) {
      month[i].classList.add("hidden");
      annual[i].classList.remove("hidden");
    } else {
      month[i].classList.remove("hidden");
      annual[i].classList.add("hidden");
    }
  }
}

// =========== Show Image On Hover =============
function showImage(event) {
  const hoverOnItem = event.currentTarget;
  const hoverOnImage = hoverOnItem.querySelector(".hover-on-image");
  const hoveredImage = document.getElementById("hoveredImage");

  // Set the hovered image source to the hoverOn image source
  hoveredImage.src = hoverOnImage.src;

  // Show the hovered image
  hoveredImage.style.display = "block";

  // Move the hovered image with the cursor
  document.addEventListener("mousemove", moveImage);

  function moveImage(event) {
    const x = event.clientX;
    const y = event.clientY;

    hoveredImage.style.transform = `translate(${x}px, ${y}px)`;
  }

  // Hide the hovered image when mouse leaves the hoverOn item
  hoverOnItem.onmouseleave = () => {
    hoveredImage.style.display = "none";
    document.removeEventListener("mousemove", moveImage);
  };
}

// =========== Element Image Move =============
const elementWrapper = document.querySelector(".element-wrapper");
const elementMove = document.querySelectorAll(".element-move");
const elementMoveX = document.querySelectorAll(".element-move-x");

elementWrapper.addEventListener("mousemove", (e) => {
  const { clientX: mouseX, clientY: mouseY } = e;

  const centerX = elementWrapper.clientWidth / 2;
  const centerY = elementWrapper.clientHeight / 2;

  const offsetX = (mouseX - centerX) / 70;
  const offsetY = (mouseY - centerY) / 70;

  elementMove.forEach((image, index) => {
    const offset = index + 1;
    image.style.transform = `translate(${offsetX * offset}px, ${offsetY * offset}px)`;
  });
  elementMoveX.forEach((image, index) => {
    const offset = index + 2;
    image.style.transform = `translate(${offsetX * offset}px)`;
  });
});

// =========== Tabs Menu =============

// Get all tab buttons and content sections
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

// Add click event listeners to tab buttons
tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove 'active' class from all tab buttons and hide all tab content
    tabButtons.forEach((btn) => {
      btn.classList.remove("active");
    });
    tabContents.forEach((content) => {
      content.classList.add("hidden");
    });

    // Get the data-tab attribute of the clicked button
    const tabId = button.getAttribute("data-tab");
    const correspondingTab = document.getElementById(tabId);

    // Add 'active' class to the clicked button and show the corresponding tab content
    button.classList.add("active");
    correspondingTab.classList.remove("hidden");
  });
});

// =========== Category Menu ===========
const categoryMenu = document.querySelector(".category-menu");
const body = document.querySelector("body");

const categoryMenuBtn = () => {
  categoryMenu.classList.toggle("hidden");
};

// =========== Product Increment/ Decrement Buttons ===========
const productValue = document.querySelector(".product-value");
let productNumberCounter = 1;

const incrementBtn = () => {
  productNumberCounter = productNumberCounter + 1;
  productValue.textContent = productNumberCounter;
};
const decrementBtn = () => {
  if (productNumberCounter > 1) productNumberCounter = productNumberCounter - 1;
  productValue.textContent = productNumberCounter;
};

// =========== User Login/Signup ===========
const overlayBackground = document.querySelector(".overlay-bg");
const signinBlock = document.querySelector(".signin-block");
const signupBlock = document.querySelector(".signup-block");

const signinBtn = () => {
  signinBlock.classList.remove("hidden");
  overlayBackground.classList.remove("hidden");
};
const signinTextBtn = () => {
  signupBlock.classList.add("hidden");
  signinBlock.classList.remove("hidden");
  overlayBackground.classList.remove("hidden");
};
const signupBtn = () => {
  signupBlock.classList.remove("hidden");
  overlayBackground.classList.remove("hidden");
};
const signupTextBtn = () => {
  signupBlock.classList.remove("hidden");
  signinBlock.classList.add("hidden");
  overlayBackground.classList.remove("hidden");
};

// =========== Side-menu - Add to cart ===========
const menuCart = document.querySelector(".menu-add-to-cart");
const sideAddToCartBtn = () => {
  menuCart.style.transform = "translateX(0)";
  overlayBackground.classList.remove("hidden");
};

// =========== Side-menu - Info ===========
const menuInfo = document.querySelector(".menu-info");
const sideInfoBtn = () => {
  menuInfo.style.transform = "translateX(0)";
  overlayBackground.classList.remove("hidden");
};

// Hide Element - Overlay
const hideElement = () => {
  signupBlock.classList.add("hidden");
  signinBlock.classList.add("hidden");
  overlayBackground.classList.add("hidden");
  menuCart.style.transform = "translateX(100%)";
  menuInfo.style.transform = "translateX(100%)";
};
/* ::::::::::::::::::::::
:: Template Javascript ::
::::::::::::::::::::::::: */
// =========== Hero Slider - 1 =============
const heroSliderOne = new Swiper(".hero-slider-1", {
  // Optional parameters
  loop: true,
  speed: 1500,
  autoplay: {
    delay: 3000,
  },
  // Navigation arrows
  navigation: {
    nextEl: ".slider-button-next",
    prevEl: ".slider-button-prev",
  },
});

// =========== Client Logo Slider =============
const clientSlider = new Swiper(".client-slider", {
  slidesPerView: 1,
  loop: true,
  speed: 5000,
  autoplay: {
    delay: 1,
    disableOnInteraction: false,
  },
  breakpoints: {
    576: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 3,
    },
    992: {
      slidesPerView: 4,
    },
    1200: {
      slidesPerView: 5,
    },
  },
});

// =========== Client Logo Slider - 2 =============
const clientSliderTwo = new Swiper(".client-slider-2", {
  slidesPerView: 1,
  loop: true,
  speed: 5000,
  autoplay: {
    delay: 1,
    disableOnInteraction: false,
  },
  breakpoints: {
    576: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 3,
    },
    992: {
      slidesPerView: 4,
    },
    1200: {
      slidesPerView: 5,
    },
  },
});
// =========== Client Logo Slider - 2 =============
const clientSliderThree = new Swiper(".client-slider-2-reverse", {
  slidesPerView: 1,
  loop: true,
  speed: 5000,
  autoplay: {
    delay: 1,
    disableOnInteraction: false,
    reverseDirection: true,
  },
  breakpoints: {
    576: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 3,
    },
    992: {
      slidesPerView: 4,
    },
    1200: {
      slidesPerView: 5,
    },
  },
});

// =========== Testimonial Slider - 1 =============
const testimonialSliderOne = new Swiper(".testimonial-slider-1", {
  // Optional parameters
  slidesPerView: 1,
  loop: true,
  spaceBetween: 24,
  // Navigation arrows
  navigation: {
    nextEl: ".slider-button-next",
    prevEl: ".slider-button-prev",
  },
});

// =========== Testimonial Slider - 2 =============
const testimonialSliderTwo = new Swiper(".testimonial-slider-2", {
  // Optional parameters
  slidesPerView: 1,
  loop: true,
  spaceBetween: 24,
  // Navigation arrows
  navigation: {
    nextEl: ".slider-button-next",
    prevEl: ".slider-button-prev",
  },
});

// =========== Testimonial Slider - 3 =============
const testimonialSliderThree = new Swiper(".testimonial-slider-3", {
  // Optional parameters
  slidesPerView: 1,
  spaceBetween: 30,
  // If we need pagination
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },

  breakpoints: {
    576: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 3,
    },
    1200: {
      slidesPerView: 4,
    },
  },
});

// =========== Category Slider - 1 =============
const categorySlider = new Swiper(".category-slider", {
  // Optional parameters
  slidesPerView: 3,
  spaceBetween: 30,
  // If we need pagination
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  // Navigation arrows
  navigation: {
    nextEl: ".slider-button-next",
    prevEl: ".slider-button-prev",
  },
  breakpoints: {
    576: {
      slidesPerView: 4,
    },
    992: {
      slidesPerView: 5,
    },
    1200: {
      slidesPerView: 6,
    },
    1600: {
      slidesPerView: 7,
    },
    1800: {
      slidesPerView: 8,
    },
  },
});
