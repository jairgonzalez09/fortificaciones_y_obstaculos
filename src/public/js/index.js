document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menuBtn');
  const mobileNav = document.getElementById('mobileNav');

  menuBtn?.addEventListener('click', () => {
    mobileNav?.classList.toggle('hidden');
  });

  document.querySelectorAll('#mobileNav a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileNav?.classList.add('hidden');
    });
  });
});
