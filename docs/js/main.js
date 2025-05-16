document.addEventListener('DOMContentLoaded', () => {
  const btn      = document.querySelector('.nav-toggle');
  const navList  = document.querySelector('.nav-list');
  const openBtn  = document.getElementById('open-modal');
  const closeBtn = document.getElementById('close-modal');
  const overlay  = document.getElementById('modal-overlay');
  const form     = document.getElementById('application-form');
  const msg      = document.getElementById('form-message');

  // Бургер
  btn.addEventListener('click', () => {
    navList.classList.toggle('nav-list--open');
  });

  // Модалка
  openBtn.addEventListener('click', () => {
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  });
  closeBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  });
  overlay.addEventListener('click', e => {
    if (e.target === overlay) {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }
  });

  // AJAX-отправка
  form.addEventListener('submit', async e => {
    e.preventDefault();
    msg.textContent = '';
    const data = new FormData(form);

    try {
      const res  = await fetch('apply.php', { method: 'POST', body: data });
      const json = await res.json();
      if (res.ok && json.status === 'ok') {
        msg.textContent = 'Спасибо! Ваша заявка принята.';
        form.reset();
        overlay.style.display = 'none';
        document.body.style.overflow = '';
      } else {
        msg.textContent = json.error || 'Ошибка отправки, попробуйте позже.';
      }
    } catch {
      msg.textContent = 'Сетевая ошибка. Проверьте соединение.';
    }
  });
});
// Закрываем модалку сразу при сабмите, чтобы «сымитировать» отправку
document.getElementById('application-form').addEventListener('submit', e => {
  e.preventDefault();                      // отменяем реальную отправку
  const overlay = document.getElementById('modal-overlay');
  overlay.style.display = 'none';          // прячем модалку
  document.body.style.overflow = '';       // возвращаем прокрутку страницы
});
