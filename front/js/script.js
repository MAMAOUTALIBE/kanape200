'use strict';
const apiUrl = 'http://localhost:3000/api/products';
const items = document.getElementById('items');

/**
 * Création des éléments
 * avec la récupération des données de l'API
 * pour afficher les produits
 */
function addProducts(sofa) {
  const image = document.createElement('img');
  image.src = sofa.imageUrl;
  image.alt = sofa.altTxt;

  const h3 = document.createElement('h3');
  h3.classList.add('productName');
  h3.textContent = sofa.name;

  const p = document.createElement('p');
  p.classList.add('productDescription');
  p.textContent = sofa.description;

  const article = document.createElement('article');
  article.appendChild(image);
  article.appendChild(h3);
  article.appendChild(p);

  const link = document.createElement('a');
  link.href = './product.html?id=' + sofa._id;
  link.appendChild(article);

  items.appendChild(link);
}

/**
 * Récupération de la liste des produits sur l'API
 * Message d'erreur si l'API n'est pas disponible
 */
async function getSofas() {
  try {
    const res = await fetch(apiUrl);
    const sofas = await res.json();

    return sofas;
  } catch (err) {
    console.warn(`${err.message}: ${apiUrl}`);

    return [];
  }
}

/**
 * Récupération des composants des produits
 * pour les ajouter sur la page d'accueil
 */
(async function () {
  const sofas = await getSofas();
  sofas.forEach((sofa) => addProducts(sofa));
})();