window.onload = async () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    window.location.href = '/login.html'; 
    return;
  }

  const doctorName = document.getElementById('doctorName');
  const doctorEmail = document.getElementById('doctorEmail');
  const doctorPhone = document.getElementById('doctorPhone');
  const doctorSpecialty = document.getElementById('doctorSpecialty');
  const doctorPhoto = document.getElementById('doctorPhoto');
  const patientsTable = document.getElementById('patientsTable');
  const editProfileBtn = document.getElementById('editProfileBtn');
  const editProfileModal = document.getElementById('editProfileModal');
  const calendarEl = document.getElementById('calendar');

  
  try {
    const response = await fetch('/api/doctor/dashboard', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (response.ok) {
      
      doctorName.textContent = data.doctor.fullName;
      doctorEmail.textContent = data.doctor.email;
      doctorPhone.textContent = data.doctor.phone || 'Не вказано';
      doctorSpecialty.textContent = data.doctor.specialty || 'Не вказано';
      doctorPhoto.src = data.doctor.photo || '/default-photo.jpg';

      
      const patientsResponse = await fetch('/api/doctor/patients', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const patientsData = await patientsResponse.json();
      if (patientsResponse.ok) {
        patientsTable.innerHTML = `
          <thead>
            <tr>
              <th>ПІБ</th>
              <th>Пошта</th>
              <th>Номер телефону</th>
              <th>Дія</th>
            </tr>
          </thead>
          <tbody>
            ${patientsData.map(patient => `
              <tr>
                <td>${patient.fullName}</td>
                <td>${patient.email}</td>
                <td>${patient.phone || 'Не вказано'}</td>
                <td><button class="view-profile-btn btn btn-outline-primary" data-id="${patient._id}">Переглянути профіль</button></td>
              </tr>
            `).join('')}
          </tbody>
        `;

        document.querySelectorAll('.view-profile-btn').forEach(button => {
          button.addEventListener('click', (e) => {
            const patientId = e.target.getAttribute('data-id');
            window.location.href = `/profile.html?id=${patientId}`;
          });
        });
      }

      
      const appointments = await loadAppointments();
      if (calendarEl) {
        const calendar = new FullCalendar.Calendar(calendarEl, {
          initialView: 'timeGridWeek',
          locale: 'uk',
          headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridDay,timeGridWeek'
          },
          events: appointments,
          eventClick: function (info) {
            const eventData = info.event.extendedProps;
            document.getElementById('appointmentPatientName').textContent = `Пацієнт: ${eventData.patientFullName}`;
            document.getElementById('appointmentPhone').textContent = `Телефон: ${eventData.patientPhone}`;
            document.getElementById('appointmentReason').textContent = `Причина: ${eventData.reason}`;
            document.getElementById('appointmentPhoto').src = eventData.patientPhoto || '/default-photo.jpg';

            const bootstrapModal = new bootstrap.Modal(document.getElementById('appointmentModal'));
            bootstrapModal.show();
          }
        });
        calendar.render();
      }

    } else {
      alert(data.message || 'Щось пішло не так');
    }
  } catch (error) {
    console.error('Помилка при завантаженні даних лікаря:', error);
  }

  
  document.addEventListener('DOMContentLoaded', () => {
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editProfileModalElement = document.getElementById('editProfileModal');
    const editProfileModal = new bootstrap.Modal(editProfileModalElement);
  
    
    if (editProfileBtn) {
      editProfileBtn.addEventListener('click', () => {
        const editFullNameInput = document.getElementById('editFullName');
        const editEmailInput = document.getElementById('editEmail');
        const editPhoneInput = document.getElementById('editPhone');
  
        if (editFullNameInput && editEmailInput && editPhoneInput) {
         
          editFullNameInput.value = doctorName.textContent || '';
          editEmailInput.value = doctorEmail.textContent || '';
          editPhoneInput.value = doctorPhone.textContent !== 'Не вказано' ? doctorPhone.textContent : '';
  
          
          editProfileModal.show();
        } else {
          console.error("Не вдалося знайти елементи для редагування профілю.");
        }
      });
    }
  
    
    editProfileModalElement.addEventListener('shown.bs.modal', () => {
      document.getElementById('editFullName').focus();
    });
  });

  document.getElementById('editProfileForm').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const token = localStorage.getItem('authToken');
    const fullName = document.getElementById('editFullName').value;
    const email = document.getElementById('editEmail').value;
    const phone = document.getElementById('editPhone').value;
    const photoInput = document.getElementById('photoInput').files[0];
  
    let photoBase64 = null;
    if (photoInput) {
      photoBase64 = await convertToBase64(photoInput);
    }
  
    const data = {
      fullName,
      email,
      phone,
      ...(photoBase64 && { photo: photoBase64 }),
    };
  
    try {
      const response = await fetch('/api/doctor/update-profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
      const result = await response.json();
      if (response.ok) {
        alert('Профіль успішно оновлено');
        window.location.reload(); 
      } else {
        alert(result.message || 'Помилка при оновленні профілю');
      }
    } catch (error) {
      console.error('Помилка при оновленні профілю:', error);
    }
  });

  // Функція для конвертації файлу у base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Функція для отримання записів до лікаря (календар)
  async function loadAppointments() {
    try {
      const response = await fetch('/api/doctor/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok && data.appointments && data.appointments.length > 0) {
        return data.appointments.map(appointment => ({
          title: `${appointment.patientId.fullName} - ${appointment.reason}`,
          start: new Date(appointment.dateTime).toISOString(),
          end: new Date(new Date(appointment.dateTime).getTime() + 30 * 60 * 1000).toISOString(),
          patientFullName: appointment.patientId.fullName,
          patientPhone: appointment.patientId.phone || 'Не вказано',
          patientPhoto: appointment.patientId.photo || '/default-photo.jpg',
          reason: appointment.reason
        }));
      } else {
        console.warn('Записи не знайдено або дані порожні');
        return [];
      }
    } catch (error) {
      console.error('Помилка під час завантаження записів до лікаря:', error);
      return [];
    }
  }
};
