const WA = '5591985560099';
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Valor em reais: só dígitos, formatado como 1.234,56 */
function formatBRL(raw) {
  const digits = String(raw).replace(/\D/g, '').replace(/^0+/, '').slice(0, 11);
  if (!digits) return '';
  const cents = digits.padStart(3, '0');
  const int = cents.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${int},${cents.slice(-2)}`;
}

function buildMessage({ nome, valor, banco }) {
  return [
    'Olá! Vim pelo site da MKS Advogados e caí em um golpe do Pix.',
    `Nome: ${nome}`,
    `Valor perdido: R$ ${valor}`,
    `O golpista se passou por agente do banco: ${banco}`,
    'Gostaria de uma análise do meu caso.',
  ].join('\n');
}

if (typeof document !== 'undefined') init();

function init() {
  /* Hero: crossfade lento entre os três sócios */
  const fade = document.querySelector('[data-fade]');
  if (fade && !reduce) {
    const imgs = [...fade.querySelectorAll('img')];
    let i = 0, timer;
    const tick = () => {
      imgs[i].classList.remove('is-on');
      i = (i + 1) % imgs.length;
      imgs[i].classList.add('is-on');
    };
    const start = () => { clearInterval(timer); timer = setInterval(tick, 5600); };
    document.addEventListener('visibilitychange', () => (document.hidden ? clearInterval(timer) : start()));
    start();
  }

  /* Letras do título sobem uma a uma */
  const h1 = document.querySelector('[data-letters]');
  if (h1 && !reduce) {
    const text = h1.textContent;
    h1.setAttribute('aria-label', text);
    h1.innerHTML = [...text].map((c, n) =>
      `<span class="ch" aria-hidden="true" style="animation:stepIn .9s ${200 + n * 45}ms cubic-bezier(.2,.7,.2,1) both">${c === ' ' ? '&nbsp;' : c}</span>`
    ).join('');
  }

  /* Entradas por seção, com escalonamento entre irmãos */
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -12% 0px' });
  document.querySelectorAll('section').forEach((sec) => {
    sec.querySelectorAll('[data-reveal]').forEach((el, n) => { el.style.setProperty('--d', `${n * 80}ms`); io.observe(el); });
  });
  document.querySelectorAll('.person, .verb').forEach((el) => io.observe(el));

  /* Quadro do escritório desliza devagar atrás de cada verbo */
  const drift = [...document.querySelectorAll('[data-drift]')];
  if (!reduce && drift.length) {
    let raf = 0;
    const onScroll = () => {
      raf = 0;
      const vh = innerHeight;
      for (const img of drift) {
        const r = img.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) continue;
        const p = (r.top + r.height / 2 - vh / 2) / vh; // -1..1
        img.style.transform = `translate3d(0, ${p * -6}%, 0) scale(1.04)`;
      }
    };
    addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(onScroll); }, { passive: true });
    onScroll();
  }

  /* Aba do WhatsApp aparece depois do primeiro screen */
  const tab = document.querySelector('.wa-tab');
  const hero = document.querySelector('.hero');
  // some onde já existe um botão de WhatsApp na tela: o quiz e o fechamento
  const covered = new Set();
  let pastHero = false;
  const sync = () => tab.classList.toggle('is-on', pastHero && !covered.size);
  new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting; sync(); }).observe(hero);
  const cover = new IntersectionObserver((entries) => {
    for (const e of entries) e.isIntersecting ? covered.add(e.target) : covered.delete(e.target);
    sync();
  }, { threshold: 0.35 });
  document.querySelectorAll('#analise, .close').forEach((el) => cover.observe(el));

  initQuiz();
}

function initQuiz() {
  const form = document.getElementById('quiz');
  const steps = [...form.querySelectorAll('.step')];
  const status = document.getElementById('quiz-status');
  const chevs = [1, 2, 3].map((n) => document.querySelector(`.chev-${n}`));
  const valor = form.elements.valor;
  let current = 0;

  valor.addEventListener('input', () => { valor.value = formatBRL(valor.value); });

  const errorFor = (step) => step.querySelector('.field-error');
  const valid = (n) => {
    if (n === 0) return form.elements.nome.value.trim().length >= 2;
    if (n === 1) return formatBRL(valor.value) !== '';
    return !!form.elements.banco.value;
  };
  const light = () => chevs.forEach((c, n) => c.classList.toggle('is-lit', n < current || (n === current && valid(n))));

  const show = (n) => {
    steps[current].classList.remove('is-on');
    current = n;
    steps[n].classList.add('is-on');
    status.textContent = `Pergunta ${n + 1} de 3`;
    light();
    const focusable = steps[n].querySelector('input');
    focusable?.focus({ preventScroll: true });
  };

  const tryNext = () => {
    const err = errorFor(steps[current]);
    if (!valid(current)) { err.hidden = false; steps[current].querySelector('input').setAttribute('aria-invalid', 'true'); return false; }
    err.hidden = true; steps[current].querySelector('input').removeAttribute('aria-invalid');
    return true;
  };

  form.addEventListener('click', (e) => {
    if (e.target.closest('[data-next]') && tryNext()) show(current + 1);
    if (e.target.closest('[data-back]')) show(current - 1);
  });
  form.addEventListener('input', light);
  form.addEventListener('change', light);
  // Enter avança em vez de enviar o formulário inteiro
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && current < 2 && e.target.matches('input')) { e.preventDefault(); if (tryNext()) show(current + 1); }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!tryNext()) return;
    const data = { nome: form.elements.nome.value.trim(), valor: formatBRL(valor.value), banco: form.elements.banco.value };
    const url = `https://wa.me/${WA}?text=${encodeURIComponent(buildMessage(data))}`;
    window.gtag?.('event', 'generate_lead', { method: 'whatsapp', golpista_banco: data.banco });
    const win = window.open(url, '_blank');
    if (win) win.opener = null; else location.href = url;
  });
}
