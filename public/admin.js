if (sessionStorage.getItem('isLoggedIn') !== 'true') {
  window.location.href = 'login.html';
}
loadOrders();
loadProducts();



function logout() {
  sessionStorage.removeItem('isLoggedIn');
  window.location.href = 'login.html';
}



async function loadOrders() {
  const res = await fetch('/api/admin/orders');
  const orders = await res.json();
  const container = document.getElementById('orders');
  container.innerHTML = '';

  orders.forEach(order => {
    const div = document.createElement('div');
    div.className = 'd-flex justify-content-between align-items-center border rounded p-4 mb-1 bg-white shadow-sm';

    div.innerHTML = `
      <div>
        <div>
          <div><strong>E-mail: ${order.address}</strong></div>
          <div><strong>Položky:</strong> ${order.items.map(i => i.name).join(', ')}</div>
        <div>
          <button onclick="" class="btn btn-sm btn-outline-danger">Smazat</button>
      </div>
    `;

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
    const div = document.createElement('div');
    div.className="d-flex justify-content-between align-items-center border rounded p-4 mb-1 bg-white shadow-sm"
    div.innerHTML = `
      <div>
        <strong>${name}</strong>
      </div>
      <div class="text-end me-3">
        ${price} Kč</span>
      </div>
      <div>
        <button onclick="editProduct('${id}', '${name}', ${price})" class="btn btn-sm btn-outline-primary me-2">Upravit</button>
        <button onclick="deleteProduct('${id}')" class="btn btn-sm btn-outline-danger">Smazat</button>
      </div>
    `;
    container.appendChild(div);
  });
}

async function addProduct() {
  const name = document.getElementById('addName').value;
  const price = parseFloat(document.getElementById('addPrice').value);

  const res = await fetch('/api/admin/add-product', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price })
  });

  const data = await res.json();
  alert(data.success ? 'Product added' : 'Failed to add');

  toggleAddForm(false);
  loadProducts();
}

async function deleteProduct(id) {
  if (!confirm('Opravdu smazat produkt?')) return;

  const res = await fetch('/api/admin/delete-product', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });

  const data = await res.json();
  if (!data.success) {
    alert('Nepodařilo se smazat produkt.');
  }

  loadProducts();
}

function editProduct(id, currentName, currentPrice) {
  document.getElementById('editId').value = id;
  document.getElementById('editName').value = currentName;
  document.getElementById('editPrice').value = currentPrice;
  document.getElementById('editForm').style.display = 'block';
}

function cancelEdit() {
  document.getElementById('editForm').style.display = 'none';
}

async function submitEdit() {
  const id = document.getElementById('editId').value;
  const name = document.getElementById('editName').value;
  const price = parseFloat(document.getElementById('editPrice').value);

  if (!name || isNaN(price)) {
    alert('Vyplňte správně název a cenu');
    return;
  }

  const res = await fetch('/api/admin/edit-product', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, name, price })
  });

  const data = await res.json();
  if (data.success) {
    alert('Produkt upraven');
    cancelEdit();
    loadProducts();
  } else {
    alert('Chyba při úpravě produktu');
  }
}

function toggleAddForm(visible){
  if (visible) document.getElementById('addForm').style.display = 'block';
  else document.getElementById('addForm').style.display = 'none';
  
}
