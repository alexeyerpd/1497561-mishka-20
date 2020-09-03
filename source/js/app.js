const menu = document.querySelector(".menu");
const burger = document.querySelector(".burger");
const burgerPopup = document.querySelector(".burger-popup");

const cart = document.querySelector(".burger-popup__link--cart");
const modal = document.querySelector(".modal");

function onBurgerClose() {
  burger.classList.remove("burger--open");
  burgerPopup.classList.remove("burger-popup--open");
}

burger.addEventListener("click", (e) => {
  const target = e.currentTarget;

  target.classList.toggle("burger--open");
  burgerPopup.classList.toggle("burger-popup--open");
});

cart.addEventListener("click", (e) => {
  e.preventDefault();

  if (window.location.pathname.startsWith("/form")) return;

  if (!modal.classList.contains("modal--open")) {
    modal.classList.add("modal--open");
    onBurgerClose();
  }
});

modal.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    e.target.classList.remove("modal--open");
  }
});

function init() {
  const noJsElements = document.querySelectorAll(".nojs");
  noJsElements.forEach((el) => el.classList.remove("nojs"));
}

init();
