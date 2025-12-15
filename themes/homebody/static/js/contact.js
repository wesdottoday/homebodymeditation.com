(function() {
  // --- CONFIGURATION ---
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwDMPxdFLuWDWSynyuWYBWF9U5kHao0V1S1ikgy9XYyyBhVcGODU8GhrW7SZ1fgYAKv/exec"; 

  // --- MODAL FUNCTIONALITY ---
  const modal = document.getElementById('contact-modal');
  const triggers = document.querySelectorAll('.contact-modal-trigger');
  const closeBtn = document.querySelector('.contact-modal-close');
  const body = document.body;

  // Open modal
  triggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      modal.classList.add('active');
      body.classList.add('contact-modal-open');
    });
  });

  // Close modal
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      modal.classList.remove('active');
      body.classList.remove('contact-modal-open');
    });
  }

  // Close on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
      body.classList.remove('contact-modal-open');
    }
  });

  // --- FORM FUNCTIONALITY ---
  const form = document.getElementById('contact-form');
  const btn = document.getElementById('submit-btn');
  const status = document.getElementById('form-status');

  if (!form) return;

  // Regex that supports gTLDs (anything after the last dot)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener('submit', function(e) {
    e.preventDefault(); // Stop page reload

    // 1. CLEAR PREVIOUS STATUS
    status.style.display = 'none';
    status.className = '';
    
    // 2. VALIDATION
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const faxNumber = form.fax_number.value; // Honeypot

    if (!name || !email || !message) {
      showStatus('Please fill in all required fields.', 'error');
      return;
    }

    if (!emailRegex.test(email)) {
      showStatus('Please enter a valid email address.', 'error');
      return;
    }

    // 3. HONEYPOT TRAP (Client Side)
    // If the hidden fax field has data, it's a bot.
    if (faxNumber !== "") {
      console.log('Bot detected.');
      return; // Stop execution silently
    }

    // 4. PREPARE SENDING
    const originalBtnText = btn.innerText;
    btn.innerText = 'Sending...';
    btn.disabled = true;

    const payload = {
      name: name,
      email: email,
      message: message,
      fax_number: faxNumber
    };

    // 5. SEND TO GOOGLE
    fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
      // text/plain prevents CORS preflight OPTIONS check
      headers: { "Content-Type": "text/plain;charset=utf-8" },
    })
    .then(response => {
      // Assuming success if network request worked
      showStatus('Thanks! Your message has been sent.', 'success');
      form.reset();
    })
    .catch(error => {
      console.error('Error:', error);
      showStatus('Oops! Something went wrong. Please try again later.', 'error');
    })
    .finally(() => {
      btn.innerText = originalBtnText;
      btn.disabled = false;
    });
  });

  function showStatus(msg, type) {
    status.innerText = msg;
    status.className = type;
    status.style.display = 'block';
  }
})();
