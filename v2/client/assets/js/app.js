document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  const contentArea = document.getElementById('content-area');

  // We need to fetch and cache the content for other pages
  const pageCache = {};

  // --- Post-load handlers for dynamically loaded sections ---
  // These run after the section HTML has been injected into the DOM.
  const postLoadHandlers = {
    'announcements': loadAnnouncementsSection,
    'scholarships': loadScholarshipsSection,
    'internships': loadInternshipsSection,
  };

  // Fetch and render scholarships into a container element
  async function loadScholarshipsSection(section) {
    const container = section.querySelector('#scholarshipsGrid');
    if (!container) return;

    try {
      const response = await fetch('http://localhost:3000/api/scholarships');
      const data = await response.json();
      container.innerHTML = '';

      if (data.success && data.data.length > 0) {
        data.data.forEach(item => {
          const bgColors = ['bg-indigo', 'bg-emerald', 'bg-rose', 'bg-amber', 'bg-sky', 'bg-purple'];
          const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)];

          container.innerHTML += `
            <div class="card">
              <div class="card-header">
                <div class="card-icon ${randomBg}"><i class="ph ph-bank"></i></div>
                <h2 class="card-title">${item.title}</h2>
              </div>
              <p class="card-desc">${item.description}</p>
              <div class="card-meta" style="flex-direction: column; align-items: flex-start; gap: 12px; width: 100%;">
                <div style="display: flex; justify-content: space-between; width: 100%; font-size: 13px;">
                  <span style="color: var(--text-muted);">Amount</span>
                  <span style="font-weight: 600;">${item.amount}</span>
                </div>
                <div style="display: flex; justify-content: space-between; width: 100%; font-size: 13px;">
                  <span style="color: var(--text-muted);">Deadline</span>
                  <span style="font-weight: 600;">${new Date(item.deadline).toLocaleDateString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; width: 100%; font-size: 13px;">
                  <span style="color: var(--text-muted);">Category</span>
                  <span style="font-weight: 600; color: var(--primary);">${item.category}</span>
                </div>
                <a href="${item.applyLink}" target="_blank" class="primary-btn" style="width: 100%; justify-content: center; text-decoration: none;">Apply Now</a>
              </div>
            </div>
          `;
        });
      } else {
        container.innerHTML = '<p style="color: var(--text-muted); grid-column: 1 / -1; text-align: center; padding: 40px 0;">No active scholarships found.</p>';
      }
    } catch (err) {
      console.error('Error fetching scholarships:', err);
      container.innerHTML = '<p style="color: #e11d48; grid-column: 1 / -1; text-align: center; padding: 40px 0;">Failed to load scholarships from server.</p>';
    }
  }

  // Fetch and render internships into a container element
  async function loadInternshipsSection(section) {
    const container = section.querySelector('#internshipsGrid');
    if (!container) return;

    try {
      const response = await fetch('http://localhost:3000/api/internships');
      const data = await response.json();
      container.innerHTML = '';

      if (data.success && data.data.length > 0) {
        data.data.forEach(item => {
          const colors = ['#ea4335', '#0f9d58', '#4285f4', '#f4b400', '#000', '#6366f1'];
          const cName = item.company ? item.company.charAt(0).toUpperCase() : 'C';
          const randColor = colors[Math.floor(Math.random() * colors.length)];
          let borderTop = item.type === 'Hackathon' ? 'border-top: 4px solid var(--primary);' : '';

          container.innerHTML += `
            <div class="job-card" style="${borderTop}">
              <div class="job-header">
                <div class="company-logo" style="background: ${randColor}; color: #fff;">${cName}</div>
                <div class="job-titles">
                  <h3>${item.title}</h3>
                  <span class="company-name">${item.company}</span>
                </div>
              </div>
              <div class="job-tags">
                <span class="tag bg-indigo-light color-indigo">${item.type}</span>
              </div>
              <p class="job-desc">${item.description}</p>
              <div class="job-footer">
                <span class="apply-deadline">Deadline: ${new Date(item.deadline).toLocaleDateString()}</span>
                <a href="${item.applyLink}" target="_blank" class="apply-btn" style="text-decoration: none; display: inline-flex; justify-content: center;">Apply Now</a>
              </div>
            </div>
          `;
        });
      } else {
        container.innerHTML = '<p style="color: var(--text-muted); grid-column: 1 / -1; text-align: center; padding: 40px 0;">No active opportunities right now.</p>';
      }
    } catch (err) {
      console.error('Error fetching internships:', err);
      container.innerHTML = '<p style="color: #e11d48; grid-column: 1 / -1; text-align: center; padding: 40px 0;">Failed to load internships from server.</p>';
    }
  }

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
