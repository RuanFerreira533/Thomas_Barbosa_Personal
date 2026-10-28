// Só melhora a página: sem este arquivo, tudo continua visível e as perguntas abrem do mesmo jeito.
document.documentElement.classList.add('js');

// Ano do copyright sempre atual (sem JS fica o ano escrito no HTML).
document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

// Entrada ao rolar: cada item de uma seção entra 80ms depois do anterior.
document.querySelectorAll('section').forEach((group) => {
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

// Menu do celular (abaixo de 1024px): o botão fica no topo, então o topo continua ativo e só o resto da página fica inert.
const menuBtn = document.querySelector('[data-menu-btn]');
const menuPanel = document.getElementById('menu-mobile');
if (menuBtn && menuPanel) {
  const page = [document.querySelector('main'), document.querySelector('.site-footer')];
  const setMenu = (open) => {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menuPanel.hidden = !open;
    document.documentElement.classList.toggle('menu-open', open);
    page.forEach((el) => { el.inert = open; });
    if (open) menuPanel.querySelector('a').focus();
  };
  menuBtn.addEventListener('click', () => setMenu(menuPanel.hidden));
  menuPanel.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menuPanel.hidden) { setMenu(false); menuBtn.focus(); }
  });
  matchMedia('(min-width: 1024px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
}
