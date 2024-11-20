
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
  
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password, role })
    });
  
    const data = await response.json();
    if (response.ok) {
      alert('Реєстрація успішна! Тепер можете увійти.');
      window.location.href = '/login.html';
    } else {
      alert(data.message || 'Щось пішло не так');
    }
  });
  