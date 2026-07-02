/* ==========================================================================
   Dr. Ochoa — app.js
   Menú móvil, dropdowns, scroll reveal, validación básica del formulario.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Menú móvil ---------- */
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      menuToggle.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
    });
  }

  /* ---------- Dropdowns como acordeón en móvil ---------- */
  document.querySelectorAll('.has-dropdown > .nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 980) {
        e.preventDefault();
        link.parentElement.classList.toggle('open');
      }
    });
  });

  /* ---------- Resaltar enlace activo según la página actual ---------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav.main-nav a.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.closest('li').classList.add('active');
    }
  });

  /* ---------- Scroll reveal con IntersectionObserver ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- Acordeón de preguntas frecuentes (FAQ) ---------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      faqItems.forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq-answer').style.maxHeight = null;
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Formulario de contacto: validación + envío real vía FormSubmit ---------- */
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/contacto@drochoa.co';
    const feedback = document.querySelector('#form-feedback');
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const requiredFields = contactForm.querySelectorAll('[required]');
      let valid = true;
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#d9534f';
        } else {
          field.style.borderColor = '';
        }
      });

      if (!valid) {
        if (feedback) {
          feedback.textContent = 'Por favor completa los campos obligatorios.';
          feedback.style.color = '#d9534f';
        }
        return;
      }

      const formData = new FormData(contactForm);
      formData.append('_subject', 'Nuevo contacto desde la web - Dr. Ochoa');
      formData.append('_template', 'table');
      formData.append('_captcha', 'false');

      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

      fetch(FORMSUBMIT_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData
      })
        .then(res => {
          if (!res.ok) throw new Error('Request failed');
          return res.json();
        })
        .then(() => {
          if (feedback) {
            feedback.textContent = '¡Gracias! Tu mensaje fue enviado, te contactaremos pronto.';
            feedback.style.color = 'var(--green)';
          }
          contactForm.reset();
        })
        .catch(() => {
          if (feedback) {
            feedback.innerHTML = 'No pudimos enviar tu mensaje. Por favor escríbenos directo por <a href="https://wa.me/573106457155" target="_blank" rel="noopener" style="color:var(--green);font-weight:600;">WhatsApp</a>.';
            feedback.style.color = '#d9534f';
          }
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
        });
    });
  }

  /* ---------- Modal lista de espera Quiropedia ---------- */
  const waitlistForm = document.querySelector('#waitlist-form');
  const modalOverlay = document.querySelector('#modal-waitlist');

  if (waitlistForm && modalOverlay) {
    const wlFeedback = document.querySelector('#waitlist-feedback');
    const wlBtn = waitlistForm.querySelector('button[type="submit"]');
    const WL_ENDPOINT = 'https://formsubmit.co/ajax/contacto@drochoa.co';

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('open');
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') modalOverlay.classList.remove('open');
    });

    waitlistForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const required = waitlistForm.querySelectorAll('[required]');
      let valid = true;
      required.forEach(f => {
        if (!f.value.trim()) { valid = false; f.style.borderColor = '#d9534f'; }
        else f.style.borderColor = '';
      });
      if (!valid) { if (wlFeedback) { wlFeedback.textContent = 'Por favor completa los campos requeridos.'; wlFeedback.style.color = '#d9534f'; } return; }

      const originalHTML = wlBtn.innerHTML;
      wlBtn.disabled = true;
      wlBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';

      const formData = new FormData(waitlistForm);
      fetch(WL_ENDPOINT, { method: 'POST', headers: { Accept: 'application/json' }, body: formData })
        .then(r => { if (!r.ok) throw new Error(); return r.json(); })
        .then(() => {
          if (wlFeedback) { wlFeedback.textContent = '¡Listo! Te avisaremos en cuanto Quiropedia Clínica esté disponible.'; wlFeedback.style.color = 'var(--green)'; }
          waitlistForm.reset();
        })
        .catch(() => {
          if (wlFeedback) { wlFeedback.textContent = 'Error al enviar. Escríbenos directamente por WhatsApp.'; wlFeedback.style.color = '#d9534f'; }
        })
        .finally(() => { wlBtn.disabled = false; wlBtn.innerHTML = originalHTML; });
    });
  }

});
