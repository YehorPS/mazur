let medicalRecordsLoaded = false; 
window.onload = async () => {
  await loadPatientData(); 
  startPollingPatientData(); 
};


async function loadPatientData() {
  const token = localStorage.getItem('authToken');
  if (!token) {
    window.location.href = '/login.html';
    return;
  }

 
  const urlParams = new URLSearchParams(window.location.search);
  const patientId = urlParams.get('id');

  try {
    
    const response = await fetch(`/api/doctor/patient/${patientId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    console.log("Дані про пацієнта, отримані з сервера:", data);

    if (response.ok) {
      
      document.getElementById('patientName').textContent = data.patient.fullName;
      document.getElementById('patientEmail').textContent = data.patient.email;
      document.getElementById('patientPhone').textContent = data.patient.phone || 'Не вказано';
      document.getElementById('patientPhoto').src = data.patient.photo || '/default-photo.jpg';

      
      if (data.medicalRecords && data.medicalRecords.length > 0) {
        if (!medicalRecordsLoaded) {
          renderMedicalRecords(data.medicalRecords);
          medicalRecordsLoaded = true;
        }
      } else {
        document.getElementById('noMedicalRecordsMessage').style.display = 'block';
      }
    } else {
      alert(data.message || 'Щось пішло не так');
    }
  } catch (error) {
    console.error('Помилка під час отримання інформації про пацієнта:', error);
  }
}


function startPollingPatientData() {
  setInterval(async () => {
    await loadPatientData(); 
  }, 5000); 
}


const createMedicalRecord = async () => {
  const token = localStorage.getItem('authToken');
  const patientId = new URLSearchParams(window.location.search).get('id');
  const diagnosis = document.getElementById('diagnosis').value;
  const treatment = document.getElementById('treatment').value;
  const surgery = document.getElementById('surgery').value;
  const healthComplaints = document.getElementById('healthComplaints').value;
  const vaccinations = document.getElementById('vaccinations').value;

  try {
    const response = await fetch(`/api/doctor/patient/${patientId}/medical-record`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        diagnoses: diagnosis,
        treatments: treatment,
        surgeries: surgery,
        healthComplaints: healthComplaints,
        vaccinations: vaccinations
      })
    });

    const data = await response.json();
    if (response.ok) {
      alert('Медичну картку успішно додано');

      
      await loadPatientData();

      
      clearMedicalRecordForm();
    } else {
      alert(data.message || 'Щось пішло не так');
    }
  } catch (error) {
    console.error('Помилка при створенні медичної картки:', error);
  }
};


function renderMedicalRecords(medicalRecords) {
  const tableBody = document.getElementById('medicalRecordsTableBody');
  tableBody.innerHTML = ''; 

  
  medicalRecords.forEach(record => {
    const rows = createMedicalRecordRows(record);
    rows.forEach(row => tableBody.appendChild(row));
  });
}


function createMedicalRecordRows(record) {
  const rows = [];

 
  const length = Math.max(
    record.diagnoses.length,
    record.treatments.length,
    record.surgeries.length,
    record.healthComplaints.length,
    record.vaccinations.length,
    record.doctorComments.length
  );

  for (let i = 0; i < length; i++) {
    const row = document.createElement('tr');

    const diagnosis = record.diagnoses[i] || 'Не вказано';
    const treatment = record.treatments[i] || 'Не вказано';
    const surgery = record.surgeries[i] || 'Не вказано';
    const healthComplaint = record.healthComplaints[i] || 'Не вказано';
    const vaccination = record.vaccinations[i] || 'Не вказано';
    const doctorComment = record.doctorComments[i] || 'Не вказано';

    row.innerHTML = `
      <td>${diagnosis}</td>
      <td>${treatment}</td>
      <td>${surgery}</td>
      <td>${healthComplaint}</td>
      <td>${vaccination}</td>
      <td>${doctorComment}</td>
    `;

    rows.push(row);
  }

  return rows;
}


function clearMedicalRecordForm() {
  document.getElementById('diagnosis').value = '';
  document.getElementById('treatment').value = '';
  document.getElementById('surgery').value = '';
  document.getElementById('healthComplaints').value = '';
  document.getElementById('vaccinations').value = '';
}


document.getElementById('createMedicalRecordButton').addEventListener('click', createMedicalRecord);
