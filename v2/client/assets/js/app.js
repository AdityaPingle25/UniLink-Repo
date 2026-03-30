document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  const contentArea = document.getElementById('content-area');

  // We need to fetch and cache the content for other pages
  const pageCache = {};

  // --- Post-load handlers for dynamically loaded sections ---
  // These run after the section HTML has been injected into the DOM.
  const postLoadHandlers = {
    'announcements': loadAnnouncementsSection,
  };

  // Fetch and render announcements into a container element
  async function loadAnnouncementsSection(section) {
    const container = section.querySelector('#announcementsContainer') || section.querySelector('.announcement-list');
    if (!container) return;

    try {
      const response = await fetch('/api/announcements');
      const result = await response.json();
      container.innerHTML = '';

      if (result.success && result.data.length > 0) {
        result.data.forEach(ann => {
          const dateStr = new Date(ann.createdAt).toLocaleDateString();

          container.innerHTML += `
            <div class="announcement-card unread">
              <div class="announcement-icon bg-indigo"><i class="ph ph-megaphone"></i></div>
              <div class="announcement-content">
                <div class="announcement-header">
                  <h3 class="announcement-title">${ann.title}</h3>
                  <span class="announcement-date">${dateStr}</span>
                </div>
                <p class="announcement-desc">${ann.description}</p>
                <div class="announcement-meta">
                  <span class="badge" style="background: rgba(0,0,0,0.05)">From: ${ann.postedBy} (${ann.department || ''})</span>
                  <span class="badge" style="background: rgba(0,0,0,0.05)">To: ${ann.audience}</span>
                </div>
              </div>
            </div>
          `;
        });
      } else {
        container.innerHTML = '<p style="color: var(--text-muted); padding: 20px;">No announcements found.</p>';
      }
    } catch (err) {
      console.error('Error fetching announcements:', err);
      container.innerHTML = '<p style="color: #e11d48; padding: 20px;">Failed to load announcements from server.</p>';
    }
  }

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
          
          // Extract inner contents minus the top-nav
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

          // Run post-load handler if one is registered for this section
          if (postLoadHandlers[targetId]) {
            postLoadHandlers[targetId](targetSection);
          }

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
