'use strict';
// Récuperation de  l'ID
const urlSearchParams = new URLSearchParams(window.location.search);
const id = urlSearchParams.get('id');

// Relier l'API
const url = `http://localhost:3000/api/products/${id}`;

/**
 * Récupération des caractéristiques du produit sélectionné
 * pour l'afficher sur la page produit
 */
(async function () {
  const sofa = await getSofa(url);
  addAttributes(sofa);
})();

/**
 * Récupération de la liste des produits sur l'API
 * Message d'erreur si l'API n'est pas disponible
 */
async function getSofa(url) {
  try {
    const res = await fetch(url);
    const sofa = await res.json();

    return sofa;
  } catch (err) {
    console.warn(`${err.message}: ${url}`);

    return [];
  }
}

/**
 * Création des éléments
 * avec la récupération des données de l'API
 * pour afficher le produit sélectionné
 */
function addAttributes(sofa) {
  const image = document.createElement('img');
  image.src = sofa.imageUrl;
  image.alt = sofa.altTxt;
  const imageParent = document.querySelector('.item__img');
  imageParent.appendChild(image);

  const title = document.getElementById('title');
  title.textContent = sofa.name;

  const price = document.getElementById('price');
  price.textContent = sofa.price;

  const description = document.getElementById('description');
  description.textContent = sofa.description;

  const select = document.getElementById('colors');
  sofa.colors.forEach((color) => {
    const option = document.createElement('option');
    option.value = color;
    option.textContent = color;
    select.appendChild(option);
  });
}

/**
 * Ajouter au panier
 * Verifie si les champs quantité et couleur sont renseignés
 * Si même couleur modifie la quantité, sinon rajoute l'article
 * Vérifie la quantité maximum
 * Remet les valeurs de choix par défaut
 */
const button = document.getElementById('addToCart');
button.addEventListener('click', () => {
  let color = document.getElementById('colors').value;
  let quantity = document.getElementById('quantity').value;

  if (color === '' && quantity === '0') {
    alert('Merci de sélectionner la couleur et la quantité');
    return;
  } else if (color === '') {
    alert('Merci de sélectionner la couleur');
    return;
  } else if (quantity === '0') {
    alert('Merci de sélectionner la quantité');
    return;
  } else if (quantity > 100) {
    alert('La quantité maximum est 100!');
    return;
  } else if (quantity <= 0){
    alert('Merci de selection une quantité non negatif!')
    return;
  }


  const product = {
    id: id,
    color: color,
    quantity: Number(quantity),
  };
  let cart = localStorage.getItem('Product');
  cart = JSON.parse(cart) ?? [];

  let item = cart.find(
    (cartItems) =>
      product.id == cartItems.id && product.color == cartItems.color
  );
  if (item) {
    let totalQuantity = Number(product.quantity) + Number(item.quantity);
    if (totalQuantity < 101) {
      alert('Ajouté(s) au panier');
      item.quantity = totalQuantity;
      localStorage.setItem('Product', JSON.stringify(cart));
    } else {
      alert('La quantité maximum est 100!');
      localStorage.removeItem('cart');
    }
  } else {
    alert('Ajouté(s) au panier');
    cart.push(product);
    localStorage.setItem('Product', JSON.stringify(cart));
  }

  document.getElementById('colors').value = '';
  document.getElementById('quantity').value = 0;
});