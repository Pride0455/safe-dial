document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('primary-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  const copyStatus = document.getElementById('copy-status');
  document.querySelectorAll('.copy-btn').forEach(button => {
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.code);
        button.textContent = 'Copied';
        if (copyStatus) copyStatus.textContent = `${button.dataset.code} copied to clipboard`;
      } catch {
        if (copyStatus) copyStatus.textContent = 'Could not copy. Select the code and copy it manually.';
      }
      window.setTimeout(() => { button.textContent = 'Copy code'; }, 2000);
    });
  });

  const form = document.getElementById('contact-form');
  if (!form) return;

  const rules = {
    name: value => value.trim().length >= 2 ? '' : 'Enter your full name.',
    email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Enter a valid email address.',
    topic: value => value ? '' : 'Choose a topic.',
    message: value => value.trim().length >= 10 ? '' : 'Write at least 10 characters.'
  };

  function validateField(id) {
    const input = document.getElementById(id);
    const error = document.getElementById(`${id}-error`);
    const message = rules[id](input.value);
    error.textContent = message;
    input.classList.toggle('invalid', Boolean(message));
    input.setAttribute('aria-invalid', String(Boolean(message)));
    return !message;
  }

  Object.keys(rules).forEach(id => {
    document.getElementById(id).addEventListener('blur', () => validateField(id));
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const valid = Object.keys(rules).map(validateField);
    const firstInvalid = Object.keys(rules).find((id, index) => !valid[index]);
    if (firstInvalid) {
      document.getElementById(firstInvalid).focus();
      return;
    }

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const topic = document.getElementById('topic').value;
    const message = document.getElementById('message').value.trim();
    const body = `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`;
    const mailto = `mailto:safedial25@gmail.com?subject=${encodeURIComponent(`SafeDial enquiry: ${topic}`)}&body=${encodeURIComponent(body)}`;
    document.getElementById('form-status').textContent = 'Your email app should open with a draft. Send the draft there to complete your enquiry. If it does not open, email safedial25@gmail.com.';
    window.location.href = mailto;
  });
});