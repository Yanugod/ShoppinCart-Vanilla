import apiProducts from "./product.js";

let containerIconCart = document.getElementById("containerIconCart");
let cartItems = document.querySelector(".cartItems");
let productContainer = document.querySelector(".productContainer");
let IconCartQuantity = document.getElementById("IconCartQuantity");
let listProducts = document.querySelector(".listContainer");
let listItemsContainer = document.querySelector(".listItemsContainer");

let listCards = [];
let totalPrice = 0;

const loadFromLocalStorage = () => {
  const savedListCards = localStorage.getItem("listCards");
  if (savedListCards) {
    listCards = JSON.parse(savedListCards);
  }
};

const saveLocalStorage = () => {
  localStorage.setItem("listCards", JSON.stringify(listCards));
};

const initApp = () => {
  loadFromLocalStorage();

  apiProducts.forEach((product, index) => {
    let newDiv = document.createElement("div");
    newDiv.classList.add("listCardBox");
    newDiv.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <span>${product.name}</span>
      <span>$${product.price.toLocaleString()}</span>
      <button class="add-to-cart" data-id="${index}">Add to Cart</button>
    `;
    listProducts.appendChild(newDiv);
  });

  reloadCard();

  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", addToCard);
  });
};

function addToCard(event) {
  const index = event.target.getAttribute("data-id");
  const product = apiProducts[index];

  if (listCards[index] == null) {
    listCards[index] = { ...product, qty: 1 };
  } else {
    listCards[index].qty += 1;
  }

  reloadCard();
  saveLocalStorage();
}

const reloadCard = () => {
  listItemsContainer.innerHTML = "";
  let count = 0;
  totalPrice = 0;

  listCards.forEach((item, index) => {
    if (item != null) {
      count += item.qty;
      totalPrice += item.price * item.qty;

      let newLi = document.createElement("li");
      newLi.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <span class="itemPrice">$${item.price.toLocaleString()}</span>
        <div>
          <button class="itemButton" data-index="${index}" data-action="decrease">-</button>
          <span>${item.qty}</span>
          <button class="itemButton" data-index="${index}" data-action="increase">+</button>
        </div>
      `;
      listItemsContainer.appendChild(newLi);
    }
  });

  let totalPriceSpan = document.querySelector(".cartTotal");
  if (totalPriceSpan) {
    totalPriceSpan.remove();
  }

  totalPriceSpan = document.createElement("span");
  totalPriceSpan.classList.add("cartTotal");
  totalPriceSpan.innerText = `Total: $${totalPrice.toLocaleString()}`;
  listItemsContainer.appendChild(totalPriceSpan);

  IconCartQuantity.innerText = count;

  document.querySelectorAll(".itemButton").forEach((button) => {
    button.addEventListener("click", changeQuantity);
  });
};

function changeQuantity(event) {
  const index = event.target.getAttribute("data-index");
  const action = event.target.getAttribute("data-action");
  const item = listCards[index];

  if (item) {
    if (action === "increase") {
      item.qty += 1;
    } else if (action === "decrease") {
      item.qty -= 1;
      if (item.qty <= 0) {
        delete listCards[index];
      }
    }
    reloadCard();
    saveLocalStorage();
  }
}

containerIconCart.addEventListener("click", () => {
  cartItems.classList.toggle("active");
  productContainer.classList.toggle("movement");
});

document.querySelector(".close").addEventListener("click", () => {
  cartItems.classList.toggle("active");
  productContainer.classList.remove("movement");
});

initApp();
