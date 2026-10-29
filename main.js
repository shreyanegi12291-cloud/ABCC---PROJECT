/* ===================================================================
   SHREYA'S PORTFOLIO - MODERN INTERACTIVE JAVASCRIPT
   Features: Particle Mesh Canvas, Dynamic Typewriter, Scroll Reveal,
   Theme Switcher, Project Filter, Project & Resume Modals, Toast Alerts
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initThemeToggle();
  initTypewriter();
  initParticles();
  initScrollReveal();
  initProjectFilter();
  initContactForm();
  initBackToTop();
});

/* ----------------- 1. NAVBAR & MOBILE DRAWER ----------------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Navbar background change on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightActiveNavLink();
  });

  // Mobile menu toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      mobileToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu when clicking any nav link
    navItems.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active section spy
  function highlightActiveNavLink() {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (targetLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetLink.classList.add('active');
        } else {
          targetLink.classList.remove('active');
        }
      }
    });
  }
}

/* ----------------- 2. DARK & LIGHT THEME TOGGLE ----------------- */
function initThemeToggle() {
  const themeToggleBtn = document.querySelector('.theme-toggle-btn');
  if (!themeToggleBtn) return;

  // Retrieve saved preference or default to dark
  const savedTheme = localStorage.getItem('shreya_portfolio_theme') || 'dark';
  applyTheme(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('shreya_portfolio_theme', newTheme);
  });

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
      themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
      themeToggleBtn.setAttribute('aria-label', 'Switch to Dark Mode');
    } else {
      document.documentElement.removeAttribute('data-theme');
      themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
      themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
      themeToggleBtn.setAttribute('aria-label', 'Switch to Light Mode');
    }
  }
}

/* ----------------- 3. DYNAMIC TYPEWRITER EFFECT ----------------- */
function initTypewriter() {
  const typewriterElement = document.getElementById('typewriter');
  if (!typewriterElement) return;

  const roles = [
    'BCA Undergraduate Student',
    'C Language Enthusiast',
    'ACM Student Member',
    'National Level Hackathon Participant',
    '10th & 12th School Topper',
    'Aspiring Software Engineer'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 90;
  const deletingSpeed = 45;
  const pauseEnd = 2000;
  const pauseStart = 400;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentRole.length) {
      delay = pauseEnd;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = pauseStart;
    }

    setTimeout(type, delay);
  }

  type();
}

/* ----------------- 4. INTERACTIVE PARTICLES CANVAS ----------------- */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouse = {
    x: null,
    y: null,
    radius: 120
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.baseX = this.x;
      this.baseY = this.y;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.speedY = (Math.random() - 0.5) * 0.8;
      this.color = Math.random() > 0.5 ? 'rgba(139, 92, 246, 0.45)' : 'rgba(6, 182, 212, 0.45)';
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > width) this.speedX *= -1;
      if (this.y < 0 || this.y > height) this.speedY *= -1;

      // Mouse interactive reaction
      if (mouse.x && mouse.y) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const maxDistance = mouse.radius;
          const force = (maxDistance - distance) / maxDistance;
          const directionX = forceDirectionX * force * 3;
          const directionY = forceDirectionY * force * 3;

          this.x -= directionX;
          this.y -= directionY;
        }
      }
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  let particleArray = [];
  function createParticles() {
    particleArray = [];
    const count = Math.min(Math.floor((width * height) / 14000), 75);
    for (let i = 0; i < count; i++) {
      particleArray.push(new Particle());
    }
  }

  function connectParticles() {
    for (let a = 0; a < particleArray.length; a++) {
      for (let b = a + 1; b < particleArray.length; b++) {
        const dx = particleArray[a].x - particleArray[b].x;
        const dy = particleArray[a].y - particleArray[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 110) {
          const opacity = (1 - distance / 110) * 0.22;
          ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particleArray[a].x, particleArray[a].y);
          ctx.lineTo(particleArray[b].x, particleArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  createParticles();

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particleArray.length; i++) {
      particleArray[i].update();
      particleArray[i].draw();
    }
    connectParticles();
    requestAnimationFrame(animate);
  }

  animate();
}

/* ----------------- 5. SCROLL REVEAL ANIMATIONS ----------------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // If the element has skill bars, animate them
        const skillBars = entry.target.querySelectorAll('.skill-bar-fill');
        skillBars.forEach(bar => {
          const width = bar.getAttribute('data-width');
          if (width) {
            bar.style.width = width;
          }
        });
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));
}

/* ----------------- 6. PROJECT FILTER ----------------- */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active class on buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ----------------- 7. PROJECT DETAILS MODAL DATA ----------------- */
const projectDetailsData = {
  'c-student-db': {
    title: 'Student Record Management System',
    category: 'C Programming & Data Structures',
    badge: 'C Language Project',
    icon: 'fa-solid fa-database',
    description: 'A high-performance command-line record management system designed in C to store, index, sort, and query student academic records with optimized dynamic memory management.',
    features: [
      'Implemented dynamically linked lists and binary search tree indexing for instant student record lookups.',
      'Binary file I/O operations (`fread`, `fwrite`) for permanent persistence and fast read/write throughput.',
      'Comprehensive validation preventing duplicate roll numbers, memory leaks (verified using Valgrind), and buffer overflows.',
      'Sort records alphabetically or by grade point average (GPA) using custom Quicksort implementation.'
    ],
    techStack: ['C Language', 'Data Structures (Linked Lists, BST)', 'File I/O', 'Dynamic Memory (malloc/free)', 'GCC'],
    codeSnippet: `// Structure definition and memory allocation
typedef struct Student {
    int rollNumber;
    char name[50];
    float gpa;
    struct Student* next;
} Student;

Student* createStudent(int roll, const char* name, float gpa) {
    Student* newStudent = (Student*)malloc(sizeof(Student));
    if (!newStudent) return NULL;
    newStudent->rollNumber = roll;
    strncpy(newStudent->name, name, 49);
    newStudent->gpa = gpa;
    newStudent->next = NULL;
    return newStudent;
}`,
    githubLink: 'https://github.com/shreya-dev',
    demoText: 'CLI Terminal Executable'
  },
  'hackathon-smartcampus': {
    title: 'CampusPulse - Smart Campus Portal',
    category: 'National Level Hackathon Project',
    badge: 'Hackathon Prototype',
    icon: 'fa-solid fa-bolt',
    description: 'Developed during a grueling 36-hour National Level Hackathon with an interdisciplinary team. CampusPulse solves campus event discovery, lost-and-found matching, and peer study room allocation.',
    features: [
      'Rapidly prototyped and presented to a panel of senior industry judges and university mentors.',
      'Built interactive UI cards for real-time club events, announcements, and peer study group formation.',
      'Engineered an instant search filter and category tagger for rapid resource discovery.',
      'Recognized for exceptional teamwork, crisp technical pitch, and rapid problem decomposition.'
    ],
    techStack: ['Hackathon Prototype', 'HTML5', 'CSS3', 'JavaScript', 'ACM Team Collaboration', 'Git'],
    codeSnippet: `// Real-time Event Filter Mechanism
function filterCampusEvents(category) {
  const events = document.querySelectorAll('.event-card');
  return Array.from(events).filter(card => {
    return category === 'all' || card.dataset.category === category;
  });
}`,
    githubLink: 'https://github.com/shreya-dev',
    demoText: 'Hackathon Showcase Ready'
  },
  'c-arcade-matrix': {
    title: 'Matrix Compute & Terminal Mini-Arcade',
    category: 'C Programming & Logic',
    badge: 'C Language Project',
    icon: 'fa-solid fa-gamepad',
    description: 'A modular multi-utility console suite built in C combining multi-dimensional matrix linear algebra algorithms (multiplication, transpose, determinant) with an interactive ASCII game.',
    features: [
      'Handles arbitrary NxN matrix arithmetic with 2D pointer arrays and strict boundary checking.',
      'Modular clean architecture with separate header (.h) definitions and source files (.c).',
      'Smooth keyboard event polling for console games with ANSI escape color sequences.',
      'Interactive menu system with foolproof input sanitation avoiding infinite loops on bad input.'
    ],
    techStack: ['C Language', '2D Arrays & Pointers', 'Matrix Linear Algebra', 'Modular C Headers', 'ANSI Graphics'],
    codeSnippet: `// 2D Matrix Multiplication in C
void multiplyMatrices(int r1, int c1, int A[r1][c1], int r2, int c2, int B[r2][c2], int C[r1][c2]) {
    for (int i = 0; i < r1; i++) {
        for (int j = 0; j < c2; j++) {
            C[i][j] = 0;
            for (int k = 0; k < c1; k++) {
                C[i][j] += A[i][k] * B[k][j];
            }
        }
    }
}`,
    githubLink: 'https://github.com/shreya-dev',
    demoText: 'CLI Terminal Executable'
  },
  'web-portfolio': {
    title: 'Modern Responsive Developer Portfolio',
    category: 'Web Technologies',
    badge: 'Personal Web Project',
    icon: 'fa-solid fa-laptop-code',
    description: 'The very website you are browsing! Engineered with modern vanilla web standards, sleek glassmorphic aesthetics, zero runtime dependencies, and responsive design.',
    features: [
      'Custom HTML5 Canvas constellation particles that interactively track cursor physics.',
      'Adaptive Dark / Light mode switcher with persistent user preference storage in localStorage.',
      'Accessible semantic structure, responsive mobile navigation drawer, and animated timeline.',
      'Interactive project modal viewer and one-click contact & email copy functionality.'
    ],
    techStack: ['HTML5', 'Modern CSS3', 'JavaScript (ES6+)', 'Glassmorphism UI', 'Responsive Design'],
    codeSnippet: `// Dynamic Theme persistence
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);`,
    githubLink: 'https://github.com/shreya-dev',
    demoText: 'Live Interactive Website'
  },
  'c-dsa-visualizer': {
    title: 'DSA Sorting & Search Benchmark Suite',
    category: 'C Programming & Algorithms',
    badge: 'Algorithms & Complexity',
    icon: 'fa-solid fa-chart-line',
    description: 'An algorithmic performance comparator written in C that measures and displays step-by-step executions of Bubble Sort, Selection Sort, Insertion Sort, and Quicksort across randomized datasets.',
    features: [
      'Tracks exact CPU clock cycles and iteration counts for comparison against theoretical Big-O.',
      'Textual visualizer rendering ASCII bar charts of array elements during intermediate passes.',
      'Memory safe allocation and automated test-case generators for sorted, reversed, and random arrays.'
    ],
    techStack: ['C Programming', 'Algorithms (Big-O)', 'Performance Benchmarking', 'Terminal Visualizer'],
    codeSnippet: `// QuickSort Partition in C
int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return (i + 1);
}`,
    githubLink: 'https://github.com/shreya-dev',
    demoText: 'Benchmarking CLI Tool'
  }
};

// Open Project Modal
window.openProjectModal = function(projectId) {
  const data = projectDetailsData[projectId];
  if (!data) return;

  const modalOverlay = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-dynamic-content');

  modalContent.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.8rem; margin-bottom: 0.6rem;">
      <span class="accolade-badge-tag tag-cyan">${data.badge}</span>
      <span style="font-size: 0.8rem; color: var(--text-subtle);">${data.category}</span>
    </div>
    <h2 style="font-size: 1.6rem; font-weight: 800; margin-bottom: 1rem; color: var(--text-main);">${data.title}</h2>
    <p style="color: var(--text-muted); font-size: 0.98rem; line-height: 1.7; margin-bottom: 1.5rem;">${data.description}</p>
    
    <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.8rem; color: var(--text-main);">Key Highlights & Implementation</h4>
    <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1.6rem;">
      ${data.features.map(f => `
        <li style="display: flex; align-items: flex-start; gap: 0.6rem; font-size: 0.92rem; color: var(--text-muted); line-height: 1.5;">
          <i class="fa-solid fa-circle-check" style="color: var(--accent-emerald); margin-top: 4px; font-size: 0.85rem;"></i>
          <span>${f}</span>
        </li>
      `).join('')}
    </ul>

    <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.8rem; color: var(--text-main);">Technologies Used</h4>
    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.8rem;">
      ${data.techStack.map(t => `<span class="tech-tag" style="padding: 0.3rem 0.7rem; font-size: 0.8rem;">${t}</span>`).join('')}
    </div>

    ${data.codeSnippet ? `
      <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.8rem; color: var(--text-main);">Code Architecture Preview</h4>
      <div style="background: #06090f; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.8rem; overflow-x: auto;">
        <pre style="font-family: var(--font-mono); font-size: 0.82rem; color: #38bdf8; margin: 0; line-height: 1.6;"><code>${escapeHTML(data.codeSnippet)}</code></pre>
      </div>
    ` : ''}

    <div style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; padding-top: 1.2rem; border-top: 1px solid var(--border-color);">
      <a href="${data.githubLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
        <i class="fa-brands fa-github"></i> View GitHub Repository
      </a>
      <span style="font-size: 0.85rem; color: var(--text-subtle); display: flex; align-items: center; gap: 0.4rem;">
        <i class="fa-solid fa-circle-info"></i> ${data.demoText}
      </span>
    </div>
  `;

  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeProjectModal = function() {
  const modalOverlay = document.getElementById('project-modal');
  if (modalOverlay) {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
};

// Close modal when clicking outside content
document.addEventListener('click', (e) => {
  const modalOverlay = document.getElementById('project-modal');
  if (modalOverlay && e.target === modalOverlay) {
    window.closeProjectModal();
  }
  const resumeModal = document.getElementById('resume-modal');
  if (resumeModal && e.target === resumeModal) {
    window.closeResumeModal();
  }
});

// Resume Modal Open / Close
window.openResumeModal = function() {
  const resumeModal = document.getElementById('resume-modal');
  if (resumeModal) {
    resumeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeResumeModal = function() {
  const resumeModal = document.getElementById('resume-modal');
  if (resumeModal) {
    resumeModal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

function escapeHTML(str) {
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}

/* ----------------- 8. CONTACT FORM & EMAIL COPY ----------------- */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all required fields.', 'fa-triangle-exclamation');
        return;
      }

      // Submit feedback simulation
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

      setTimeout(() => {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        showToast('Thank you! Your message has been sent successfully.', 'fa-circle-check');
      }, 1200);
    });
  }
}

// Copy Email Utility
window.copyEmailToClipboard = function(emailStr) {
  navigator.clipboard.writeText(emailStr).then(() => {
    showToast(`Email copied: ${emailStr}`, 'fa-copy');
  }).catch(() => {
    showToast(`Contact: ${emailStr}`, 'fa-envelope');
  });
};

// Toast Notification System
function showToast(message, iconClass = 'fa-circle-check') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast-container';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fa-solid ${iconClass} toast-icon"></i> <span>${message}</span>`;
  toast.classList.add('active');

  setTimeout(() => {
    toast.classList.remove('active');
  }, 3500);
}

/* ----------------- 9. BACK TO TOP BUTTON ----------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

