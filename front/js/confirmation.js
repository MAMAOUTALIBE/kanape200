// Récupération de l'orderId pour l'afficher sur la page de confirmation
let orderId = new URLSearchParams(window.location.search).get('id');
let displayIdOrder = document.getElementById('orderId');
displayIdOrder.textContent = orderId;

// Efface le localStorage
localStorage.clear();