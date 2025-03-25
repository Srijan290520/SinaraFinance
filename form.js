document.getElementById('inquiry-form').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const fullName = document.getElementById('full_name').value;
    const phoneNumber = document.getElementById('phone_number').value;
    const email = document.getElementById('email').value;
    const query = document.getElementById('query').value;
  
    const formData = { fullName, phoneNumber, email, query };
  
    fetch('https://script.google.com/macros/s/AKfycby-vqLs4CrBWK1J6QrBtUlLCe-UWGpqLTFugJKJ5yWMxUPBYfmfAptB_GxbLks0eSbYgA/exec', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      if (data.result === 'success') {
        const popup = document.getElementById('thank-you-popup');
        popup.classList.remove('hidden');
        setTimeout(() => { window.location.href = 'index.html'; }, 5000);
      } else {
        alert('Error submitting query. Please try again.');
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
      alert('Error submitting query. Please try again.');
    });
  });