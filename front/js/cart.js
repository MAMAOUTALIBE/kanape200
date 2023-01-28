'use strict';
// Récupere le LocalStorage
let cart = localStorage.getItem('Product');
cart = JSON.parse(cart);

if (cart == null) {
  cart = [];
}

// Relier l'API 
const url = `http://localhost:3000/api/products/`;

const articleParent = document.getElementById('cart__items');

/**
 * Récupération de la liste des produits sur l'API
 * Message d'erreur si l'API n'est pas disponible
 */
async function getSofas(url) {
  try {
    const res = await fetch(url);
    const sofas = await res.json();

    return sofas;
  } catch (err) {
    console.warn(`${err.message}: ${url}`);

    return [];
  }
}

/**
 * Récupération des caractéristiques des produits
 * Vérifie le contenu du LocalStorage
 * récupère les attributs manquants
 */
(async function () {
  const sofas = await getSofas(url);

  for (let i = 0; i < cart.length; i++) {
    for (let j = 0; j < sofas.length; j++) {
      if (cart[i].id === sofas[j]._id) cart[i].imageUrl = sofas[j].imageUrl;
      cart[i].altTxt = sofas[j].altTxt;
      cart[i].name = sofas[j].name;
      cart[i].price = sofas[j].price;
      cart[i].subtotal = cart[i].quantity * sofas[j].price;
    }
  }
  refreshView();
})();

/**
 * Actualise le panier
 * Affiche panier vide si localstorage vide
 */
function refreshView() {
  articleParent.innerText = '';
  cart.forEach((item) => addItemsToCart(item));

  if (cart === null || cart == 0) {
    document.getElementById('totalQuantity').textContent = 0;
    document.getElementById('totalPrice').textContent = 0;
    document.querySelector('h1').innerHTML = 'Votre panier est vide';
    cart = [];
  }
}

/**
 * Création des éléments
 * avec la récupération des données de l'API
 * pour afficher les produits du panier
 */
function addItemsToCart(item) {
  const cartArticle = document.createElement('article');
  cartArticle.classList.add('cart__item');
  cartArticle.dataset.id = item.id;
  cartArticle.dataset.color = item.color;
  articleParent.appendChild(cartArticle);

  const imgDiv = document.createElement('div');
  imgDiv.classList.add('cart__item__img');
  cartArticle.appendChild(imgDiv);
  const cartImage = document.createElement('img');
  cartImage.src = item.imageUrl;
  cartImage.alt = item.altTxt;
  imgDiv.appendChild(cartImage);

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('cart__item__content');
  cartArticle.appendChild(contentDiv);

  const contentDescriptionDiv = document.createElement('div');
  contentDescriptionDiv.classList.add('cart__item__content__description');
  contentDiv.appendChild(contentDescriptionDiv);

  const productName = document.createElement('h2');
  productName.textContent = item.name;
  contentDescriptionDiv.appendChild(productName);

  const productColor = document.createElement('p');
  productColor.textContent = 'Couleur: ' + item.color;
  contentDescriptionDiv.appendChild(productColor);

  const productPrice = document.createElement('p');
  productPrice.textContent = 'Prix: ' + item.price + ' €';
  contentDescriptionDiv.appendChild(productPrice);

  const settingsDiv = document.createElement('div');
  settingsDiv.classList.add('cart__item__content__settings');
  contentDiv.appendChild(settingsDiv);

  const settingsQuantityDiv = document.createElement('div');
  settingsQuantityDiv.classList.add('cart__item__content__settings__quantity');
  settingsDiv.appendChild(settingsQuantityDiv);

  const productQuantity = document.createElement('p');
  productQuantity.textContent = 'Qté :';
  settingsQuantityDiv.appendChild(productQuantity);

  const itemQuantity = document.createElement('input');
  itemQuantity.classList.add('itemQuantity');
  itemQuantity.type = 'number';
  itemQuantity.name = 'itemQuantity';
  itemQuantity.min = '1';
  itemQuantity.max = '100';
  itemQuantity.value = item.quantity;
  itemQuantity.addEventListener('input', () =>
    newQuantity(item.id, item.color, itemQuantity.value)
  );
  settingsQuantityDiv.appendChild(itemQuantity);

  const deleteSettingsDiv = document.createElement('div');
  deleteSettingsDiv.classList.add('cart__item__content__settings__delete');
  settingsDiv.appendChild(deleteSettingsDiv);

  const productDelete = document.createElement('p');
  productDelete.classList.add('deleteItem');
  productDelete.textContent = 'Supprimer';
  deleteSettingsDiv.appendChild(productDelete);

  const dataId = productDelete.closest('.cart__item').dataset.id;
  const dataColor = productDelete.closest('.cart__item').dataset.color;
  productDelete.addEventListener('click', () => deleteItem(dataId, dataColor));

  addTotalQuantity();
  addTotalPrice();
}

// Calculer et afficher la quantité totale
function addTotalQuantity() {
  let itemsTotalQuantity = document.getElementById('totalQuantity');
  let totalQuantity = 0;

  for (let i = 0; i < cart.length; i++) {
    totalQuantity += cart[i].quantity;
  }
  itemsTotalQuantity.textContent = totalQuantity;
}

// Calculer et afficher le montant total
function addTotalPrice() {
  let itemsTotalPrice = document.getElementById('totalPrice');
  let totalPrice = 0;

  for (let i = 0; i < cart.length; i++) {
    totalPrice += cart[i].quantity * cart[i].price;
  }
  itemsTotalPrice.textContent = totalPrice;
}

// Modifier la quantité dans le localStorage
function newQuantity(id, color, newValue) {
  const itemToChange = cart.find(
    (item) => item.id === id && item.color === color
  );
  itemToChange.quantity = Number(newValue);

  addTotalQuantity();
  addTotalPrice();
  localStorage.setItem('Product', JSON.stringify(cart));
}

// Supprimer un article
function deleteItem(dataId, dataColor) {
  for (let i = 0; i < cart.length; i++) {
    let product = cart[i];
    if (product.id === dataId && product.color === dataColor) {
      cart.splice(i, 1);
    }
    localStorage.setItem('Product', JSON.stringify(cart));
    refreshView();
  }
}
// Formulaire

const order = document.getElementById('order');

/**
 *  Créer un objet contact où seront vérifiées et
 *  enregistrées les données saisies dans le formulaire pour
 *  l'envoi de celui-ci
 *  Message d'erreur si champ formulaire pas valide
 */
order.addEventListener('click', (event) => {
  event.preventDefault();

  const contact = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    address: document.getElementById('address').value,
    city: document.getElementById('city').value,
    email: document.getElementById('email').value,
  };

  const firstName = contact.firstName;
  const lastName = contact.lastName;
  const address = contact.address;
  const city = contact.city;
  const email = contact.email;

  const namesCityRegex = (value) => {
    return /^[A-Za-z ,.'-]{1,40}$/.test(value);
  };

  const namesCityErrorMsg = `Vous ne pouvez utiliser que des lettres majuscules ou minuscules, des espaces ou les caractères suivants: , . ' -`;

  function verifyFirstName() {
    let firstNameErrorMsg = document.getElementById('firstNameErrorMsg');

    if (namesCityRegex(firstName)) {
      firstNameErrorMsg.innerText = '';
      return true;
    } else {
      firstNameErrorMsg.innerText = namesCityErrorMsg;
      return false;
    }
  }

  function verifyLastName() {
    let lastNameErrorMsg = document.getElementById('lastNameErrorMsg');

    if (namesCityRegex(lastName)) {
      lastNameErrorMsg.innerText = '';
      return true;
    } else {
      lastNameErrorMsg.innerText = namesCityErrorMsg;
      return false;
    }
  }

  function verifyAddress() {
    let addressErrorMsg = document.getElementById('addressErrorMsg');

    if (/^[A-Za-z0-9° ,.'-]{1,80}$/.test(address)) {
      addressErrorMsg.innerText = '';
      return true;
    } else {
      addressErrorMsg.innerText = `Vous ne pouvez utiliser que des chiffres, lettres majuscules ou minuscules, des espaces ou les caractères suivants: , . ' -`;
      return false;
    }
  }

  function verifyCity() {
    let cityErrorMsg = document.getElementById('cityErrorMsg');

    if (namesCityRegex(city)) {
      cityErrorMsg.innerText = '';
      return true;
    } else {
      cityErrorMsg.innerText = namesCityErrorMsg;
      return false;
    }
  }

  function verifyEmail() {
    let emailErrorMsg = document.getElementById('emailErrorMsg');

    if (/^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,4}$/.test(email)) {
      emailErrorMsg.innerText = '';
      return true;
    } else {
      emailErrorMsg.innerText =
        'Email invalide, merci de renseigner une adresse mail correcte, par exemple: jean.dupont@orange.fr';
      return false;
    }
  }

  if (
    verifyFirstName() &&
    verifyLastName() &&
    verifyAddress() &&
    verifyCity() &&
    verifyEmail()
  ) {
    localStorage.setItem('contact', JSON.stringify(contact));

    let products = [];
    for (let itemSelected of cart) {
      products.push(itemSelected.id);
    }

    const datasToPost = {
      products,
      contact,
    };

    submitForm(datasToPost);
  } else {
    alert('Veuillez remplire votre formulaire');
  }
});

/**
 *  Envoi du formulaire
 *  si le panier est vide pas d'envoi
 */
function submitForm(datasToPost) {
  if (cart.length == 0) {
    alert("Il n'y a pas d'article dans votre panier");
    return;
  }

  const submitForm = fetch('http://localhost:3000/api/products/order', {
    method: 'POST',
    body: JSON.stringify(datasToPost),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  submitForm.then(async (response) => {
    try {
      const content = await response.json();
      let orderId = content.orderId;
      window.location.assign('confirmation.html?id=' + orderId);
    } catch (error) {
      console.log(error);
    }
  });
}