document.getElementById('editProfileForm').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const photo = document.getElementById('photoInput').files[0];
  
    let photoData = null;
    if (photo) {
      const reader = new FileReader();
      reader.onload = async function(e) {
        photoData = e.target.result;
        
        await sendProfileData(fullName, email, password, photoData);
      };
      reader.readAsDataURL(photo); 
    } else {
      await sendProfileData(fullName, email, password, photoData);
    }
  });
  
  
  async function sendProfileData(fullName, email, password, photoData) {
    const token = localStorage.getItem('authToken');
    
    try {
      const response = await fetch('/api/user/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ fullName, email, password, photo: photoData })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Профіль успішно оновлено');
        
        window.location.href = '/profile.html';
      } else {
        alert(data.message || 'Помилка при оновленні профілю');
      }
    } catch (error) {
      console.error('Помилка запиту:', error);
      alert('Щось пішло не так, спробуйте ще раз');
    }
  }
  