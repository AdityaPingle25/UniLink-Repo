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
    'internships': loadInternshipsSection,
    'events': loadEventsSection,
    'deadlines': loadDeadlinesSection,
  };

  // Fetch and render scholarships into a container element
  async function loadScholarshipsSection(section) {
    const container = section.querySelector('#scholarshipsGrid');
    if (!container) return;

    let allScholarships = [];

    function renderScholarships(items) {
      container.innerHTML = '';
      if (items.length > 0) {
        items.forEach(item => {
          const bgColors = ['bg-indigo', 'bg-emerald', 'bg-rose', 'bg-amber', 'bg-sky', 'bg-purple'];
          const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)];
          const category = item.category || item.department || 'General';

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
                  <span style="font-weight: 600; color: var(--primary);">${category}</span>
                </div>
                <a href="${item.applyLink}" target="_blank" class="primary-btn" style="width: 100%; justify-content: center; text-decoration: none;">Apply Now</a>
              </div>
            </div>
          `;
        });
      } else {
        container.innerHTML = '<p style="color: var(--text-muted); grid-column: 1 / -1; text-align: center; padding: 40px 0;">No active scholarships found.</p>';
      }
    }

    try {
      const response = await fetch('/api/scholarships');
      const data = await response.json();
      if (data.success) {
        allScholarships = data.data;
        renderScholarships(allScholarships);
      } else {
        container.innerHTML = '<p style="color: var(--text-muted); grid-column: 1 / -1; text-align: center; padding: 40px 0;">No active scholarships found.</p>';
      }
    } catch (err) {
      console.error('Error fetching scholarships:', err);
      container.innerHTML = '<p style="color: #e11d48; grid-column: 1 / -1; text-align: center; padding: 40px 0;">Failed to load scholarships from server.</p>';
    }

    // Filter tabs
    const filterTabs = section.querySelectorAll('#categoryFilters .filter-tab');
    if (filterTabs.length > 0 && !section.hasAttribute('data-filters-attached')) {
      section.setAttribute('data-filters-attached', 'true');
      filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          filterTabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          const filter = tab.dataset.filter;
          if (filter === 'All') {
            renderScholarships(allScholarships);
          } else {
            renderScholarships(allScholarships.filter(s => (s.category || s.department) === filter));
          }
        });
      });
    }

    // Currency Converter Logic
    const convBtn = section.querySelector('#convBtn');
    if (convBtn && !convBtn.hasAttribute('data-listener-attached')) {
      convBtn.setAttribute('data-listener-attached', 'true');
      convBtn.addEventListener('click', async () => {
        const amt = section.querySelector('#convAmt').value;
        const from = section.querySelector('#convFrom').value;
        const to = section.querySelector('#convTo').value;
        const resEl = section.querySelector('#convRes');
        
        if(from === to) { resEl.textContent = 'Select different currencies'; return; }
        resEl.textContent = 'Converting...';
        
        try {
          const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
          const data = await res.json();
          if(data.rates && data.rates[to]) {
            resEl.textContent = `${amt} ${from} = ${(amt * data.rates[to]).toFixed(2)} ${to}`;
          } else {
            resEl.textContent = 'Conversion error';
          }
        } catch(e) {
          resEl.textContent = 'Network Error';
        }
      });
    }
  }

  // Fetch and render internships into a container element
  async function loadInternshipsSection(section) {
    const container = section.querySelector('#internshipsGrid');
    if (!container) return;

    let allInternships = [];

    function renderInternships(items) {
      container.innerHTML = '';
      if (items.length > 0) {
        items.forEach(item => {
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
                <div style="display: flex; gap: 8px;">
                  <button 
                    data-title="${item.title.replace(/"/g, '&quot;')}" 
                    data-desc="${item.description.replace(/"/g, '&quot;')}" 
                    data-fileurl="${item.fileUrl || ''}" 
                    data-filename="${item.fileName || ''}"
                    class="primary-btn info-btn" style="background: transparent; color: var(--text-main); border: 1px solid var(--border-color); cursor: pointer;">Details</button>
                  <a href="${item.applyLink}" target="_blank" class="apply-btn" style="text-decoration: none; display: inline-flex; justify-content: center;">Apply Now</a>
                </div>
              </div>
            </div>
          `;
        });
      } else {
        container.innerHTML = '<p style="color: var(--text-muted); grid-column: 1 / -1; text-align: center; padding: 40px 0;">No active opportunities right now.</p>';
      }
    }

    try {
      const response = await fetch('/api/internships');
      const data = await response.json();

      if (data.success) {
        allInternships = data.data;
        renderInternships(allInternships);
      } else {
        container.innerHTML = '<p style="color: var(--text-muted); grid-column: 1 / -1; text-align: center; padding: 40px 0;">No active opportunities right now.</p>';
      }
    } catch (err) {
      console.error('Error fetching internships:', err);
      container.innerHTML = '<p style="color: #e11d48; grid-column: 1 / -1; text-align: center; padding: 40px 0;">Failed to load internships from server.</p>';
    }

    // Filter tabs
    const typeFilters = section.querySelectorAll('#typeFilters .filter-tab');
    if (typeFilters.length > 0 && !section.hasAttribute('data-internship-filters-attached')) {
      section.setAttribute('data-internship-filters-attached', 'true');
      typeFilters.forEach(tab => {
        tab.addEventListener('click', () => {
          typeFilters.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          const filter = tab.dataset.filter;
          if (filter === 'All') {
            renderInternships(allInternships);
          } else {
            renderInternships(allInternships.filter(i => i.type === filter));
          }
        });
      });
    }

    // Modal Logic
    const infoModal = section.querySelector('#infoModal');
    if (infoModal && !section.hasAttribute('data-modal-attached')) {
      section.setAttribute('data-modal-attached', 'true');
      const closeInfoModal = section.querySelector('#closeInfoModal');
      if (closeInfoModal) {
        closeInfoModal.addEventListener('click', () => infoModal.style.display = 'none');
      }
      infoModal.addEventListener('click', (e) => { if (e.target === infoModal) infoModal.style.display = 'none'; });

      container.addEventListener('click', (e) => {
        if (e.target.classList.contains('info-btn')) {
           const title = e.target.getAttribute('data-title');
           const desc = e.target.getAttribute('data-desc');
           const fileUrl = e.target.getAttribute('data-fileurl');
           const fileName = e.target.getAttribute('data-filename');

           section.querySelector('#infoModalTitle').textContent = title;
           section.querySelector('#infoModalBody').textContent = desc;
           
           // Handle attachment download button
           let footer = section.querySelector('.modal-footer-btns');
           if (!footer) {
             footer = document.createElement('div');
             footer.className = 'modal-footer-btns';
             section.querySelector('.modal-content').appendChild(footer);
           }
           
           if (fileUrl) {
             footer.innerHTML = `
               <a href="${fileUrl}" download="${fileName}" class="attachment-btn">
                 <i class="ph ph-file-arrow-down"></i> Download Attachment (${fileName})
               </a>
             `;
             footer.style.display = 'flex';
           } else {
             footer.style.display = 'none';
           }

           infoModal.style.display = 'flex';
        }
      });
    }
  }

  // Fetch and render events into a container element
  async function loadEventsSection(section) {
    const container = section.querySelector('#eventsContainer');
    if (!container) return;

    // Move modal to body to prevent stacking context clipping from .page-section animations
    let regModal = document.getElementById('regModal');
    const sectionModal = section.querySelector('#regModal');
    if (sectionModal) {
      document.body.appendChild(sectionModal);
      regModal = document.getElementById('regModal');
    }

    // Attach global event listener for the form once
    const regForm = document.getElementById('regForm');
    if (regForm && !regForm.hasAttribute('data-listener-attached')) {
      regForm.setAttribute('data-listener-attached', 'true');
      regForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const eventId = document.getElementById('regEventId').value;
        const teamMembers = [];
        document.querySelectorAll('#regModal .team-member-row').forEach(row => {
          teamMembers.push({
            name: row.querySelector('.tm-name').value,
            email: row.querySelector('.tm-email').value,
            phone: row.querySelector('.tm-phone').value
          });
        });

        const payload = {
          studentName: document.getElementById('regName').value,
          studentEmail: document.getElementById('regEmail').value,
          studentPhone: document.getElementById('regPhone').value,
          teamMembers
        };

        try {
          const res = await fetch(`/api/events/${eventId}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const result = await res.json();
          if (result.success) {
            alert('Successfully registered!');
            document.getElementById('regModal').classList.remove('active');
            regForm.reset();
            loadEventsSection(section); // reload after registration
          } else {
            alert(result.message || 'Registration failed');
          }
        } catch (err) {
          alert('Error registering. Make sure server is running.');
        }
      });
      
      const cancelBtn = document.querySelector('#regModal .btn-cancel');
      if (cancelBtn) {
        cancelBtn.onclick = () => {
          document.getElementById('regModal').classList.remove('active');
          regForm.reset();
        };
      }
    }

    // Attach listener for dynamic register buttons
    if (!container.hasAttribute('data-listener-attached')) {
      container.setAttribute('data-listener-attached', 'true');
      container.addEventListener('click', (e) => {
        if (!document.getElementById('regModal')) return; // Sanity check
        const btn = e.target.closest('.reg-btn');
        if (btn) {
          const eventId = btn.getAttribute('data-id');
          const eventTitle = btn.getAttribute('data-title');
          const teamSize = parseInt(btn.getAttribute('data-teamsize')) || 1;

          document.getElementById('regEventId').value = eventId;
          document.getElementById('modalTitle').innerText = 'Register: ' + eventTitle;
          document.getElementById('modalSubtitle').innerText = teamSize > 1 ? `Team of up to ${teamSize} (others optional)` : 'Individual registration';
          
          const teamSection = document.getElementById('teamSection');
          const teamContainer = document.getElementById('teamMembersContainer');
          teamContainer.innerHTML = '';

          if (teamSize > 1) {
            teamSection.style.display = 'block';
            for (let i = 1; i < teamSize; i++) {
              teamContainer.innerHTML += `
                <div class="team-member-row">
                  <h4>Member ${i + 1} (Optional)</h4>
                  <div class="form-group"><label>Name</label><input type="text" class="tm-name" placeholder="Full name"></div>
                  <div class="form-group"><label>Email</label><input type="email" class="tm-email" placeholder="Email"></div>
                  <div class="form-group"><label>Phone</label><input type="tel" class="tm-phone" placeholder="Phone"></div>
                </div>
              `;
            }
          } else {
            teamSection.style.display = 'none';
          }

          document.getElementById('regModal').classList.add('active');
        }
      });
    }

    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      container.innerHTML = '';

      if (data.success && data.data.length > 0) {
        for (const ev of data.data) {
          try {
            const countRes = await fetch(`/api/events/${ev._id}/count`);
            const countData = await countRes.json();
            const regCount = countData.count || 0;
            const spotsLeft = ev.maxRegistrations - regCount;

            const categoryColors = { 'Technical': 'bg-purple', 'Cultural': 'bg-rose', 'Workshop': 'bg-sky', 'Sports': 'bg-emerald', 'Seminar': 'bg-amber' };
            const colorClass = categoryColors[ev.category] || 'bg-indigo';

            const eventDate = new Date(ev.eventDate);
            const month = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();
            const day = eventDate.getDate();

            container.innerHTML += `
              <div class="event-card">
                <div class="event-date-box ${colorClass}">
                  <span class="month">${month}</span>
                  <span class="day">${day}</span>
                </div>
                <div class="event-content">
                  <div class="event-header">
                    <h3>${ev.title}</h3>
                    <span class="badge ${colorClass}-light color-${colorClass.replace('bg-','')}">${ev.category}</span>
                  </div>
                  <p class="event-details"><i class="ph ph-map-pin"></i> ${ev.venue} • <i class="ph ph-clock"></i> ${ev.eventTime}${ev.teamSize > 1 ? ' • <i class="ph ph-users"></i> Team of ' + ev.teamSize : ''}</p>
                  <p class="event-desc">${ev.description}</p>
                </div>
                <div class="event-action">
                  <div class="spots-left" ${spotsLeft <= 5 ? 'style="color: #e11d48;"' : ''}>${spotsLeft > 0 ? spotsLeft + ' Spots Left' : 'Event Full'}</div>
                  <a href="../public/event_details.html?id=${ev._id}" class="primary-btn" style="text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
                    ${spotsLeft > 0 ? '<i class="ph ph-arrow-right"></i> View & Register' : '<i class="ph ph-eye"></i> View Details'}
                  </a>
                </div>
              </div>
            `;
          } catch(e) {}
        }
      } else {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 40px 0;">No events available right now. Check back soon!</p>';
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      document.getElementById('eventsContainer').innerHTML = '<p style="color: #e11d48; text-align: center; padding: 40px 0;">Failed to load events. Make sure the server is running.</p>';
    }

    // Image Grid Filtering Logic
    const gFilters = section.querySelectorAll('#galleryFilters .filter-tab');
    const gItems = section.querySelectorAll('.g-item');
    if(gFilters.length > 0 && !section.hasAttribute('data-gallery-filters-attached')) {
      section.setAttribute('data-gallery-filters-attached', 'true');
      gFilters.forEach(btn => {
        btn.addEventListener('click', () => {
          gFilters.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const filter = btn.getAttribute('data-gfilter');
          gItems.forEach(item => {
            if(filter === 'all' || item.classList.contains(filter)) item.style.display = '';
            else item.style.display = 'none';
          });
        });
      });
    }
  }

  // Fetch and render assignment deadlines
  async function loadDeadlinesSection(section) {
    const colDueSoon = section.querySelector('#colDueSoon');
    const colUpcoming = section.querySelector('#colUpcoming');
    const colDone = section.querySelector('#colDone');
    const countDueSoon = section.querySelector('#countDueSoon');
    const countUpcoming = section.querySelector('#countUpcoming');
    const countDone = section.querySelector('#countDone');
    
    // Only proceed if columns exist (i.e. 'deadlines' section active)
    if (!colDueSoon || !colUpcoming || !colDone) return;

    try {
      const studentName = document.getElementById('navUserName') ? document.getElementById('navUserName').innerText : localStorage.getItem('userName') || 'Student';
      const [response, subResponse] = await Promise.all([
        fetch('/api/assignments'),
        fetch(`/api/assignments/student/${encodeURIComponent(studentName)}/submissions`)
      ]);
      const data = await response.json();
      let mySubmissions = {};
      try {
        const subData = await subResponse.json();
        if (subData.success) {
          subData.data.forEach(s => {
            mySubmissions[s.assignmentId] = s;
          });
        }
      } catch(e) {}
      
      colDueSoon.innerHTML = '';
      colUpcoming.innerHTML = '';
      colDone.innerHTML = '';
      let dueSoonCount = 0;
      let upcomingCount = 0;
      let doneCount = 0;

      if (data.success && data.data.length > 0) {
        const now = new Date();
        const threeDaysMs = 3 * 24 * 60 * 60 * 1000;

        data.data.forEach(item => {
          const deadline = new Date(item.deadline);
          const isPast = deadline < now;
          const isDueSoon = !isPast && (deadline - now) <= threeDaysMs;

          const submission = mySubmissions[item._id];
          const isDone = !!submission;

          const teamBadge = item.isTeamProject ? `<span class="badge" style="margin-left: 8px;">Team Project</span>` : '';
          const formattedDate = deadline.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
          let timeIcon = '<i class="ph ph-calendar"></i>';
          let colorClass = 'class="task-date"';
          
          let statusBadge = '';
          
          if (isDone) {
            statusBadge = submission.status === 'Late' ? `<span class="badge bg-amber-light" style="color: #d97706; margin-left: 8px;">Done Late</span>` : `<span class="badge bg-emerald-light" style="color: #059669; margin-left: 8px;">Turned In</span>`;
          } else {
            if (isPast) {
               statusBadge = `<span class="badge bg-rose-light color-rose" style="margin-left: 8px;">Missing</span>`;
               colorClass = 'class="task-date color-rose"';
               timeIcon = '<i class="ph ph-warning-circle"></i>';
            } else if (isDueSoon) {
               colorClass = 'class="task-date color-rose"';
               timeIcon = '<i class="ph ph-clock"></i>';
            }
          }

          const cardHtml = `
            <div class="task-card ${isDueSoon && !isDone ? 'urgent' : ''}" ${(isPast && !isDone) ? 'style="border-left: 4px solid #e11d48;"' : ''}>
              <div style="display: flex; justify-content: space-between;">
                <div class="task-subject">${item.subject}</div>
                <div style="font-size: 11px; color: var(--text-muted); font-weight: 500;">By: ${item.postedBy}</div>
              </div>
              <h4 class="task-title" ${isDone ? 'style="text-decoration: line-through; opacity: 0.7;"' : ''}>${item.title}</h4>
              <div class="task-footer" style="padding-bottom: ${!isDone ? '10px' : '0'}; display: flex; flex-direction: column; align-items: flex-start; gap: 8px;">
                <span ${colorClass}>${timeIcon} ${isPast && !isDone ? 'Past Due (' : ''}${formattedDate}${isPast && !isDone ? ')' : ''}</span>
                <div style="display: flex; align-items: center;">
                  ${statusBadge} ${teamBadge}
                </div>
              </div>
              ${!isDone ? `<button onclick="window.submitAssignment('${item._id}')" class="primary-btn" style="width: 100%; justify-content: center; font-size: 13px;">Submit Assignment</button>` : ''}
            </div>
          `;

          if (isDone) {
             colDone.innerHTML += cardHtml;
             doneCount++;
          } else if (isDueSoon || isPast) {
             colDueSoon.innerHTML += cardHtml;
             dueSoonCount++;
          } else {
             colUpcoming.innerHTML += cardHtml;
             upcomingCount++;
          }
        });
      }

      if (dueSoonCount === 0) colDueSoon.innerHTML = '<p style="color: var(--text-muted); font-size: 14px; text-align: center; padding: 20px 0;">No immediate tasks!</p>';
      if (upcomingCount === 0) colUpcoming.innerHTML = '<p style="color: var(--text-muted); font-size: 14px; text-align: center; padding: 20px 0;">No upcoming tasks yet.</p>';
      if (doneCount === 0) colDone.innerHTML = '<p style="color: var(--text-muted); font-size: 14px; text-align: center; padding: 20px 0;">No completed tasks.</p>';

      if (countDueSoon) countDueSoon.innerText = dueSoonCount;
      if (countUpcoming) countUpcoming.innerText = upcomingCount;
      if (countDone) countDone.innerText = doneCount;
      
    } catch (err) {
      console.error('Error fetching assignments:', err);
      colDueSoon.innerHTML = '<p style="color: #e11d48; font-size: 13px;">Error loading data.</p>';
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

          let fileHtml = '';
          if (ann.fileName && ann.fileUrl) {
            fileHtml = `<div class="announcement-attachment" style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(0,0,0,0.05);">
              <i class="ph ph-paperclip"></i>
              <a href="${ann.fileUrl}" download="${ann.fileName}" style="color: var(--primary); text-decoration: none; font-size: 13px; font-weight: 500;">
                Download Attached File: ${ann.fileName}
              </a>
            </div>`;
          }

          container.innerHTML += `
            <div class="announcement-card unread" onclick="this.classList.toggle('expanded')">
              <div class="announcement-icon bg-indigo"><i class="ph ph-megaphone"></i></div>
              <div class="announcement-content">
                <div class="announcement-header">
                  <h3 class="announcement-title">${ann.title}</h3>
                  <span class="announcement-date">${dateStr}</span>
                </div>
                <p class="announcement-desc">${ann.description}</p>
                ${fileHtml}
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
      const targetId = item.getAttribute('data-target');
      if (!targetId || targetId === 'settings') return; // Skip settings/hash links for now
      
      e.preventDefault();

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
            'scholarships': '../common/scholarships.html'
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

  // Global function for submitting assignments
  window.submitAssignment = async (id) => {
    const link = prompt("Enter your submission link (Drive, Github, etc):");
    if (link !== null) {
      if (link.trim() === '') {
         alert('Submission link cannot be empty.');
         return;
      }
      try {
        const studentName = document.getElementById('navUserName') ? document.getElementById('navUserName').innerText : localStorage.getItem('userName') || 'Student';
        const res = await fetch(`/api/assignments/${id}/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentName, submissionLink: link })
        });
        const data = await res.json();
        if (data.success) {
          alert('Assignment submitted successfully!');
          const deadlinesSection = document.getElementById('deadlines');
          if (deadlinesSection) {
            loadDeadlinesSection(deadlinesSection);
          }
        } else {
          alert('Submission failed: ' + data.message);
        }
      } catch (err) {
        alert('Error submitting assignment. Ensure backend is running.');
      }
    }
  };
});
