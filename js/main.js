const WA = '5591933009749'; // WhatsApp profissional que recebe os leads
const LEADS = 'https://formsubmit.co/ajax/mks.advogados01@gmail.com'; // mesmo e-mail do formulário do site institucional
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Telefone com DDD: (91) 98888-7777 ou (91) 3222-1111 */
function formatPhone(raw) {
  const d = String(raw).replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '').slice(0, 11);
  if (d.length <= 2) return d ? `(${d}` : '';
  const mid = d.length === 11 ? 7 : 6;
  return `(${d.slice(0, 2)}) ${d.slice(2, mid)}${d.length > mid ? '-' + d.slice(mid) : ''}`;
}
const phoneOk = (v) => /^\d{10,11}$/.test(String(v).replace(/\D/g, ''));

function buildMessage({ nome, whatsapp, valor, quando, banco }) {
  return [
    'Olá! Vim pelo site da MKS Advogados. Caí no golpe do Pix da falsa central.',
    `Nome: ${nome}`,
    `WhatsApp: ${whatsapp}`,
    `Valor perdido: ${valor}`,
    `Quando ocorreu: ${quando}`,
    `Banco: ${banco}`,
    'Quero recuperar meu dinheiro.',
  ].join('\n');
}

if (typeof document !== 'undefined') init();

function init() {
  /* Entradas por seção, com escalonamento entre irmãos */
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -12% 0px' });
  document.querySelectorAll('section').forEach((sec) => {
    sec.querySelectorAll('[data-reveal]').forEach((el, n) => { el.style.setProperty('--d', `${n * 80}ms`); io.observe(el); });
  });
  

  /* Topo fica branco quando sai de cima da foto */
  const top = document.querySelector('.top');
  const solid = () => top.classList.toggle('is-solid', scrollY > 40);
  addEventListener('scroll', solid, { passive: true });
  solid();

  /* Aba do WhatsApp aparece depois do hero */
  const tab = document.querySelector('.wa-tab');
  const hero = document.querySelector('.hero');
  // some no quiz e no fechamento (já têm botão) e nas dúvidas (não cobre as perguntas)
  const covered = new Set();
  let pastHero = false;
  const sync = () => tab.classList.toggle('is-on', pastHero && !covered.size);
  new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting; sync(); }).observe(hero);
  const cover = new IntersectionObserver((entries) => {
    for (const e of entries) e.isIntersecting ? covered.add(e.target) : covered.delete(e.target);
    sync();
  }, { threshold: 0.35 });
  document.querySelectorAll('#analise, .faq, .close').forEach((el) => cover.observe(el));

  initQuiz();
}

function initQuiz() {
  const form = document.getElementById('quiz');
  const el = form.elements;
  const steps = [...form.querySelectorAll('.step[data-step]')];
  const status = document.getElementById('quiz-status');
  const chevs = [1, 2, 3].map((n) => document.querySelector(`.chev-${n}`));
  let current = 0;

  el.whatsapp.addEventListener('input', () => { el.whatsapp.value = formatPhone(el.whatsapp.value); });

  // cada etapa: [campo, válido?, id do erro]
  const checks = [
    [[el.nome, () => el.nome.value.trim().split(/\s+/).length >= 2, 'nome-erro'],
     [el.whatsapp, () => phoneOk(el.whatsapp.value), 'whatsapp-erro']],
    [[el.valor[0], () => !!el.valor.value, 'valor-erro'],
     [el.quando[0], () => !!el.quando.value, 'quando-erro']],
    [[el.banco, () => el.banco.value.trim().length >= 2, 'banco-erro']],
  ];
  const valid = (n) => checks[n].every(([, ok]) => ok());
  const light = () => chevs.forEach((c, n) => c.classList.toggle('is-lit', n < current || (n === current && valid(n))));

  const show = (n) => {
    steps[current].classList.remove('is-on');
    current = n;
    steps[n].classList.add('is-on');
    status.textContent = `Etapa ${n + 1} de 3`;
    light();
    steps[n].querySelector('input')?.focus({ preventScroll: true });
  };

  const tryNext = () => {
    let first = null;
    for (const [input, ok, errId] of checks[current]) {
      const bad = !ok();
      document.getElementById(errId).hidden = !bad;
      bad ? input.setAttribute('aria-invalid', 'true') : input.removeAttribute('aria-invalid');
      if (bad && !first) first = input;
    }
    first?.focus();
    return !first;
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
    const data = {
      nome: el.nome.value.trim(), whatsapp: el.whatsapp.value,
      valor: el.valor.value, quando: el.quando.value, banco: el.banco.value.trim(),
    };
    // cópia do lead por e-mail; não bloqueia a ida ao WhatsApp
    fetch(LEADS, {
      method: 'POST', keepalive: true,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...data, _subject: 'Novo lead: golpe do Pix', _template: 'table' }),
    }).catch(() => {});
    window.gtag?.('event', 'generate_lead', { method: 'whatsapp', valor: data.valor, quando: data.quando });
    const url = `https://wa.me/${WA}?text=${encodeURIComponent(buildMessage(data))}`;
    const win = window.open(url, '_blank');
    if (win) win.opener = null; else location.href = url;
  });
}
