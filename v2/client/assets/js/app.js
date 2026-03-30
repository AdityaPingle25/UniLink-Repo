document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  const contentArea = document.getElementById('content-area');

  // We need to fetch and cache the content for other pages
  const pageCache = {};

  navItems.forEach(item => {
    item.addEventListener('click', async (e) => {
      e.preventDefault();
      
      const targetId = item.getAttribute('data-target');
      if (!targetId || targetId === 'settings') return; // Skip settings/hash links for now

      // Update active nav item
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      // Hide all current sections
      const sections = contentArea.querySelectorAll('.page-section');
      sections.forEach(sec => sec.classList.remove('active'));

      // Check if section already exists in DOM
      let targetSection = document.getElementById(targetId);
      
      if (!targetSection) {
        // We need to fetch the content from the respective HTML file
        // For local development without a server, fetch() might fail due to CORS. 
        // We will assume it's running via a local server (like Live Server or python -m http.server).
        try {
          // Map target ID to filename
          const fileMap = {
            'dashboard': 'student_dashboard.html',
            'announcements': '../common/announcements.html',
            'deadlines': 'deadlines.html',
            'internships': '../common/internships.html',
            'events': '../common/events.html',
            'scholarships': '../common/scholarships.html',
            'news': '../common/news.html',
            'ask-seniors': 'ask_seniors.html'
          };

          const fileName = fileMap[targetId];
          const response = await fetch(fileName);
          const html = await response.text();

          // Parse the HTML to extract just the main content we want
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          
          // Get the contents AFTER the top-nav (we don't want to duplicate the top-nav)
          const mainWrapperHtml = doc.querySelector('.main-wrapper').innerHTML;
          
          // We need to carefully extract the inner contents minus the top-nav.
          // Since all our pages have top-nav, we can find elements after it.
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = mainWrapperHtml;
          const topNav = tempDiv.querySelector('.top-nav');
          if (topNav) {
             tempDiv.removeChild(topNav);
          }

          // Create the section
          targetSection = document.createElement('div');
          targetSection.id = targetId;
          targetSection.className = 'page-section';
          targetSection.innerHTML = tempDiv.innerHTML;
          
          contentArea.appendChild(targetSection);

        } catch (error) {
          console.error("Error loading page content:", error);
          contentArea.innerHTML += `<div id="${targetId}" class="page-section active" style="padding: 40px; text-align: center;">Error loading content. Please ensure you are running a local server.</div>`;
          targetSection = document.getElementById(targetId);
        }
      }

      // Show the selected section
      if (targetSection) {
        targetSection.classList.add('active');
        // Update URL hash without jumping
        window.history.pushState(null, null, `#${targetId}`);
      }
    });
  });

  // Handle initial load based on hash URL
  const hash = window.location.hash.substring(1);
  if (hash) {
    const activeNav = document.querySelector(`.nav-item[data-target="${hash}"]`);
    if (activeNav) {
      activeNav.click();
    }
  }
});
