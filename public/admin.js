let loggedIn = false;

async function login() {
  const username = document.getElementById('user').value;
  const password = document.getElementById('pass').value;

  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (data.success) {
    loggedIn = true;
    document.getElementById('adminPanel').style.display = 'block';

    loadOrders();
    loadProducts();
  } else {
    alert('Login failed');
  }
}

async function addProduct() {
  const name = document.getElementById('pname').value;
  const price = parseFloat(document.getElementById('pprice').value);

  const res = await fetch('/api/admin/add-product', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price })
  });

  const data = await res.json();
  alert(data.success ? 'Product added' : 'Failed to add');
}

async function loadOrders() {
  const res = await fetch('/api/admin/orders');
  const orders = await res.json();
  const container = document.getElementById('orders');
  container.innerHTML = '';
  orders.forEach(order => {
    const div = document.createElement('div');
    div.textContent = `Address: ${order.address} | Items: ${order.items.map(i => i.name).join(', ')}`;
    container.appendChild(div);
  });
}

async function loadProducts() {
  const res = await fetch('/api/admin/products');
  const products = await res.json();

  const container = document.getElementById('products');
  container.innerHTML = '';
  
  products.forEach(product => {
    const { id, name, price } = product;
    console.log("loading product: " + id, name, price)

    const div = document.createElement('div');
    div.innerHTML = `
      (${id}) <b>${name}</b> – ${price} Kč
      <button onclick="editProduct('${id}', '${name}', ${price})">Upravit</button>
      <button onclick="deleteProduct('${id}')">Smazat</button>
    `;
    container.appendChild(div);
});
}

async function deleteProduct(id) {
  if (!confirm('Opravdu smazat produkt?')) return;
  await fetch('/api/admin/products/' + id, { method: 'DELETE' });
  loadProducts();
}

async function editProduct(id, currentName, currentPrice) {
  const newName = prompt('Nový název:', currentName);
  if (newName === null) return;

  const newPrice = parseFloat(prompt('Nová cena:', currentPrice));
  if (isNaN(newPrice)) {
    alert('Neplatná cena.');
    return;
  }

  await fetch('/api/admin/products/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: newName, price: newPrice })
  });

  loadProducts();
}

