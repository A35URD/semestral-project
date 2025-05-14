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
        sessionStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'admin.html';
    } else {
        document.getElementById('error').style.display = 'block';
    }
}