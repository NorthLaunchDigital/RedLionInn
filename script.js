/* =====================================================================
   The Red Lion at Finavon — shared scripts
   1) Mobile navigation toggle (works on every page)
   2) Booking form -> opens the visitor's own email app via mailto:
   ===================================================================== */

/* ----- 1. Mobile navigation ----- */
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.getElementById('nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Close the menu after tapping a link (mobile)
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ----- 2. Booking / enquiry form ----- */
(function () {
  var form = document.getElementById('booking-form');
  if (!form) return; // only runs on booking.html

  /* >>> CHANGE THIS to the hotel's real inbox before going live <<< */
  var RECIPIENT_EMAIL = 'hello@example.com';

  var status = document.getElementById('form-status');

  function setError(field, on) {
    var wrap = field.closest('.field');
    if (wrap) wrap.classList.toggle('has-error', on);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // we build a mailto link instead of submitting to a server

    var required = form.querySelectorAll('[required]');
    var firstInvalid = null;
    required.forEach(function (field) {
      var empty = !field.value.trim();
      setError(field, empty);
      if (empty && !firstInvalid) firstInvalid = field;
    });

    // Basic email sanity check
    var emailField = form.querySelector('#email');
    if (emailField && emailField.value.trim() &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim())) {
      setError(emailField, true);
      if (!firstInvalid) firstInvalid = emailField;
    }

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    // Pull values
    var get = function (id) {
      var el = form.querySelector('#' + id);
      return el ? el.value.trim() : '';
    };
    var name = get('name');
    var type = get('enquiry-type');

    // Build a readable email body
    var lines = [
      'Name: ' + name,
      'Email: ' + get('email'),
      'Phone: ' + (get('phone') || '—'),
      'Preferred date: ' + (get('date') || '—'),
      'Number of guests: ' + (get('guests') || '—'),
      'Enquiry type: ' + type,
      '',
      'Message:',
      get('message') || '—'
    ];

    var subject = 'Website enquiry (' + (type || 'General') + ') — ' + name;
    var mailto = 'mailto:' + RECIPIENT_EMAIL +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(lines.join('\n'));

    // Open the visitor's email app with everything pre-filled
    window.location.href = mailto;

    if (status) {
      status.style.display = 'block';
      status.textContent =
        'Opening your email app… please review and press send to reach us.';
    }
  });
})();
