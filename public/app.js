let cart = [];

async function loadProducts() {
  const res = await fetch('/api/products');
  const products = await res.json();
  const container = document.getElementById('products');
  container.innerHTML = '';

  products.forEach(p => {
    const col = document.createElement('div');
    col.className = 'col';

    const card = document.createElement('div');
    card.className = 'card h-100 shadow-sm';

    card.innerHTML = `
      <div class="card-body d-flex flex-column gap-1 align-items-center">
        <h3 class="card-title">${p.name}</h3>
        <p class="card-text">${p.price} Kč</p>
        <button class="btn btn-sm btn-primary" onclick='addToCart(${JSON.stringify(p)})'>Přidat do košíku</button>
      </div>
    `;

    col.appendChild(card);
    container.appendChild(col);
  });
}

function addToCart(product) {
  cart.push(product);
  updateCart();
}

function updateCart() {
  const cartDiv = document.getElementById('cart');
  cartDiv.innerHTML = '';

  if (cart.length === 0) {
    cartDiv.innerHTML = '<div class="text-muted">Košík je prázdný</div>';
    return;
  }

  const list = document.createElement('ul');
  list.className = 'list-group';

  cart.forEach((p, i) => {
    const item = document.createElement('li');
    item.className = 'list-group-item d-flex justify-content-between align-items-center';
    item.innerHTML = `
      ${p.name} <span>${p.price} Kč</span>
    `;
    list.appendChild(item);
  });

  cartDiv.appendChild(list);
}

function checkout() {
  if (cart.length === 0) {
    alert('Košík je prázdný!');
    return;
  }
  document.getElementById('addressForm').style.display = 'block';
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

async function submitOrder() {
  const address = document.getElementById('address').value.trim();

  if (!address) {
    alert('Zadejte prosím adresu.');
    return;
  }

  const res = await fetch('/api/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address, items: cart })
  });

  const data = await res.json();
  if (data.success) {
    alert('Objednávka úspěšně odeslána!');
    cart = [];
    updateCart();
    document.getElementById('addressForm').style.display = 'none';
    document.getElementById('address').value = '';
  } else {
    alert('Chyba při odesílání objednávky.');
  }
}

loadProducts();
