// Só melhora a página: sem este arquivo, tudo continua visível e o header nasce escuro.
document.documentElement.classList.add('js');

// Ano do copyright sempre atual (sem JS fica o ano escrito no HTML).
document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

const header = document.querySelector('[data-header]');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 80);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Entrada ao rolar: cada item de uma seção entra 80ms depois do anterior.
document.querySelectorAll('section, .site-footer').forEach((group) => {
  group.querySelectorAll('.reveal').forEach((el, i) => el.style.setProperty('--d', `${i * 80}ms`));
});

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-in');
    io.unobserve(entry.target);
  });
}, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });

document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// Avaliações: repete os cards de cada coluna 4x e a animação sobe 50% (2 voltas), então o loop não
// tem emenda nem buraco, mesmo numa coluna com poucos cards curtos (só se houver movimento).
if (matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  document.querySelectorAll('[data-loop]').forEach((track) => {
    const originals = [...track.children];
    for (let i = 0; i < 3; i++) {
      originals.forEach((card) => {
        const copy = card.cloneNode(true);
        copy.setAttribute('aria-hidden', 'true');
        track.append(copy);
      });
    }
  });
}

// Botão "Pausar movimento": para as avaliações (o hover sozinho não serve no toque e no teclado).
document.querySelectorAll('[data-pause]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const paused = document.documentElement.classList.toggle('motion-paused');
    document.querySelectorAll('[data-pause]').forEach((b) => {
      b.setAttribute('aria-pressed', String(paused));
      b.textContent = paused ? 'Retomar movimento' : 'Pausar movimento';
    });
  });
});

// Menu flutuante (abaixo de 1024px): abre e fecha o painel, fecha ao escolher um item, no Esc ou se a tela crescer.
const menuBtn = document.querySelector('[data-menu-btn]');
const menuPanel = document.getElementById('menu-mobile');
if (menuBtn && menuPanel) {
  const page = [document.querySelector('.site-header'), document.querySelector('main'), document.querySelector('.site-footer')];
  const setMenu = (open) => {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menuPanel.hidden = !open;
    document.documentElement.classList.toggle('menu-open', open);
    page.forEach((el) => { el.inert = open; }); // o foco fica no menu enquanto ele está aberto
    if (open) menuPanel.querySelector('a').focus();
  };
  menuBtn.addEventListener('click', () => setMenu(menuPanel.hidden));
  menuPanel.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menuPanel.hidden) { setMenu(false); menuBtn.focus(); }
  });
  matchMedia('(min-width: 1024px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
}
