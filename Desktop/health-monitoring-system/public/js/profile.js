// public/js/profile.js
window.onload = async () => {
    const token = localStorage.getItem('authToken');
    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get('id');
    
    if (!token) {
      window.location.href = '/login.html';
      return;
    }
  
    const patientInfo = document.getElementById('patientInfo');
    const medicalRecord = document.getElementById('medicalRecord');
  
    const response = await fetch(`/api/doctor/patient/${patientId}/record`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  
    const data = await response.json();
    if (response.ok) {
      const { fullName, email } = data.user;
      patientInfo.innerHTML = `<p>Пацієнт: ${fullName}</p><p>Email: ${email}</p>`;
  
      const record = data.record || 'Немає медичної картки';
      medicalRecord.innerHTML = `<p>${record}</p>`;
    } else {
      alert(data.message || 'Щось пішло не так');
    }
  
    document.getElementById('addRecordForm').addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const doctorComment = document.getElementById('doctorComment').value;
  
      const res = await fetch(`/api/doctor/patient/${patientId}/record`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ doctorComments: doctorComment })
      });
  
      const result = await res.json();
      if (res.ok) {
        alert('Запис успішно додано!');
        window.location.reload();
      } else {
        alert(result.message || 'Щось пішло не так');
      }
    });
  };
  