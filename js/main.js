// Fire Reality: interacciones de la página
document.documentElement.classList.add('js');

// Correo al que llegan los mensajes del formulario. Cámbialo por el real.
const CONTACT_EMAIL = 'contacto@firereality.mx';

// Cinta de precaución: se repite el patrón dos veces para que el desplazamiento sea continuo
document.querySelectorAll('.caution__track').forEach(track => {
  const unit = '<span class="caution__stripes"></span><span class="caution__word">CAUTION</span>';
  track.innerHTML = unit.repeat(32);
});

// Fondo del menú al hacer scroll
const nav = document.querySelector('.nav');
const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Menú móvil
const toggle = document.querySelector('.nav__toggle');
const menu = document.getElementById('menu');
toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
}));

// Aparición de elementos al hacer scroll
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 5) * 70}ms`;
    io.observe(el);
  });
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
}

// Visor de imágenes de la galería
const lightbox = document.getElementById('lightbox');
const lbImg = lightbox.querySelector('img');
document.querySelectorAll('[data-full]').forEach(btn => {
  btn.addEventListener('click', () => {
    const img = btn.querySelector('img');
    lbImg.src = btn.dataset.full;
    lbImg.alt = img ? img.alt : '';
    lightbox.showModal();
  });
});
lightbox.querySelector('.lightbox__close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.close(); });

// Formulario: abre el correo del usuario con el mensaje ya escrito
const form = document.getElementById('contact-form');
const status = form.querySelector('.form__status');
form.addEventListener('submit', e => {
  e.preventDefault();
  if (!form.checkValidity()) {
    status.textContent = 'Completa tu nombre, un correo válido y el mensaje.';
    status.classList.add('is-error');
    form.reportValidity();
    return;
  }
  const d = new FormData(form);
  const subject = `Demo Fire Reality - ${d.get('nombre')}`;
  const body = `Nombre: ${d.get('nombre')}\nCorreo: ${d.get('correo')}\nOrganización: ${d.get('organizacion') || '-'}\n\n${d.get('mensaje')}`;
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  status.classList.remove('is-error');
  status.textContent = 'Se abrió tu aplicación de correo con el mensaje listo para enviar.';
});
