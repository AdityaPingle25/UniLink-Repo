document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  const contentArea = document.getElementById('content-area');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      // Allow settings/logout links to function normally if needed
      const targetId = item.getAttribute('data-target');
      if (!targetId || targetId === 'settings') return;

      e.preventDefault();

      // Update active nav item status
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      // Hide all current sections
      const sections = contentArea.querySelectorAll('.page-section');
      sections.forEach(sec => sec.classList.remove('active'));

      // Find the target section and show it
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        targetSection.classList.add('active');
        // Update URL hash without jumping
        window.history.pushState(null, null, `#${targetId}`);
      }
    });
  });

  // Handle initial page load based on hash URL
  const hash = window.location.hash.substring(1);
  if (hash) {
    const activeNav = document.querySelector(`.nav-item[data-target="${hash}"]`);
    if (activeNav) {
      activeNav.click();
    }
  }
});
