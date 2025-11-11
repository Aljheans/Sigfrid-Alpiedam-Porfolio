/* ================================
   Data arrays (projects + skills)
   ================================ */
const skills = [
  { name: 'Python', level: 95 },
  { name: 'Django', level: 90 },
  { name: 'JavaScript', level: 85 },
  { name: 'HTML/CSS', level: 95 },
  { name: 'PostgreSQL', level: 80 },
  { name: 'System Admin', level: 85 }
];

/* projects: each project can have multiple images and a github link */
const projects = [
  {
    year: '2024',
    title: 'E-Commerce Platform',
    role: 'Full-Stack Developer',
    description: 'Built a complete e-commerce solution with Django backend, featuring user authentication, payment integration, and inventory management system.',
    tech: ['Django', 'Python', 'PostgreSQL', 'JavaScript'],
    images: ['assets/pics/ecommerce-1.jpg','assets/pics/ecommerce-2.jpg'],
    github: '#'
  },
  {
    year: '2023-24',
    title: 'Custom Gaming Systems',
    role: 'Hardware Specialist',
    description: 'Designed and built high-performance PC systems optimized for gaming and content creation.',
    tech: ['Hardware Assembly', 'Performance Tuning'],
    images: ['assets/pics/gaming-1.jpg'],
    github: '#'
  },
  {
    year: '2023',
    title: 'Python Automation Suite',
    role: 'Software Developer',
    description: 'Developed custom Python applications for workflow automation and system optimization.',
    tech: ['Python', 'GUI Development', 'Automation'],
    images: ['assets/pics/automation-1.jpg'],
    github: '#'
  }
];

/* ================================
   Build UI: skills & projects
   ================================ */
document.addEventListener('DOMContentLoaded', () => {
  const skillsGrid = document.getElementById('skillsGrid');
  skills.forEach((s) => {
    const skill = document.createElement('div');
    skill.className = 'skill reveal';
    skill.innerHTML = `
      <div class="meta">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:44px;height:44px;border-radius:10px;background:linear-gradient(135deg,var(--primary),var(--secondary));display:flex;align-items:center;justify-content:center">${s.name[0]}</div>
          <div><div style="font-weight:600">${s.name}</div><div class="muted" style="font-size:12px">Proficiency</div></div>
        </div>
        <div style="font-weight:700;color:var(--primary)">${s.level}%</div>
      </div>
      <div class="progress-bar"><div class="progress-inner" data-level="${s.level}"></div></div>
    `;
    skillsGrid.appendChild(skill);
  });

  const projectsList = document.getElementById('projectsList');
  projects.forEach((p, idx) => {
    const row = document.createElement('div');
    row.className = 'project-row reveal';
    row.innerHTML = `
      <div class="project-image" aria-hidden="true">
        <img src="${p.images[0]}" alt="${p.title} screenshot">
      </div>
      <div class="project-meta">
        <div class="muted">${p.year}</div>
        <h3>${p.title}</h3>
        <div style="color:var(--secondary);font-weight:600">${p.role}</div>
        <p class="muted" style="margin-top:12px">${p.description}</p>
        <div class="project-tags" aria-hidden="false">
          ${p.tech.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
        <div style="margin-top:14px">
          <button class="btn view-details" data-idx="${idx}" aria-expanded="false" aria-controls="modalBackdrop">View Details</button>
        </div>
      </div>
    `;
    projectsList.appendChild(row);
  });

  initInteractions();
});

/* ================================
   Modal + Gallery logic
   ================================ */
let currentProject = null;
let currentSlide = 0;
let lastFocusedElement = null;

const modalBackdrop = document.getElementById('modalBackdrop');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalYear = document.getElementById('modalYear');
const modalRole = document.getElementById('modalRole');
const modalDesc = document.getElementById('modalDesc');
const modalTags = document.getElementById('modalTags');
const modalGithub = document.getElementById('modalGithub');
const carouselIndicators = document.getElementById('carouselIndicators');
const prevSlideBtn = document.getElementById('prevSlide');
const nextSlideBtn = document.getElementById('nextSlide');
const modalClose = document.getElementById('modalClose');
const modalClose2 = document.getElementById('modalClose2');

/* Utility: get focusable elements inside an element */
function getFocusable(el){
  return Array.from(el.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'))
    .filter(e => e.offsetWidth || e.offsetHeight || e.getClientRects().length);
}

function openModal(idx){
  lastFocusedElement = document.activeElement;
  const p = projects[idx];
  currentProject = p;
  currentSlide = 0;

  modalTitle.textContent = p.title;
  modalYear.textContent = p.year;
  modalRole.textContent = p.role;
  modalDesc.textContent = p.description;
  modalTags.innerHTML = p.tech.map(t => `<span class="tag" style="margin-right:6px">${t}</span>`).join('');
  modalGithub.href = p.github || '#';
  modalGithub.setAttribute('aria-label', `Open ${p.title} on GitHub in a new tab`);

  setCarouselImages(p.images);

  modalBackdrop.style.display = 'flex';
  modalBackdrop.setAttribute('aria-hidden','false');
  document.documentElement.style.overflow = 'hidden';
  setTimeout(()=> modalBackdrop.style.opacity = '1', 10);

  const focusables = getFocusable(modalBackdrop);
  if(focusables.length) focusables[0].focus();
  trapFocus(modalBackdrop);
}

function closeModal(){
  modalBackdrop.style.opacity = 0;
  modalBackdrop.setAttribute('aria-hidden','true');
  document.documentElement.style.overflow = '';
  setTimeout(()=> {
    modalBackdrop.style.display = 'none';
    currentProject = null;
    carouselIndicators.innerHTML = '';
    if(lastFocusedElement) lastFocusedElement.focus();
  }, 230);
}

function setCarouselImages(images){
  if(!images || images.length === 0) {
    modalImage.src = '';
    carouselIndicators.innerHTML = '';
    return;
  }
  modalImage.src = images[0];
  carouselIndicators.innerHTML = '';
  images.forEach((img, i) => {
    const btn = document.createElement('button');
    btn.setAttribute('aria-label','Go to image '+(i+1));
    btn.setAttribute('role','tab');
    if(i === 0) btn.classList.add('active');
    btn.addEventListener('click', ()=> {
      goToSlide(i);
    });
    carouselIndicators.appendChild(btn);
  });
}

function goToSlide(i){
  if(!currentProject) return;
  const images = currentProject.images;
  if(i < 0) i = images.length - 1;
  if(i >= images.length) i = 0;
  currentSlide = i;
  modalImage.src = images[i];
  Array.from(carouselIndicators.children).forEach((b, idx) => {
    b.classList.toggle('active', idx === i);
  });
}

/* ================================
   Wire interactions & accessibility
   ================================ */
function initInteractions(){
  // view-details buttons (delegated after DOM created)
  document.querySelectorAll('.view-details').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = Number(btn.dataset.idx);
      btn.setAttribute('aria-expanded','true');
      openModal(idx);
    });
  });

  // modal close
  modalClose.addEventListener('click', closeModal);
  if(modalClose2) modalClose2.addEventListener('click', closeModal);

  // backdrop click to close
  modalBackdrop.addEventListener('click', (e) => {
    if(e.target === modalBackdrop) closeModal();
  });

  // prev/next
  prevSlideBtn.addEventListener('click', ()=> { if(currentProject) goToSlide(currentSlide - 1); });
  nextSlideBtn.addEventListener('click', ()=> { if(currentProject) goToSlide(currentSlide + 1); });

  // keyboard: Esc to close, left/right for slides
  document.addEventListener('keydown', (e) => {
    if(modalBackdrop.style.display === 'flex' && modalBackdrop.getAttribute('aria-hidden') === 'false') {
      if(e.key === 'Escape') { e.preventDefault(); closeModal(); }
      if(e.key === 'ArrowLeft') { e.preventDefault(); if(currentProject) goToSlide(currentSlide - 1); }
      if(e.key === 'ArrowRight') { e.preventDefault(); if(currentProject) goToSlide(currentSlide + 1); }
    }
  });

  // focus trap
  function trapFocus(modalEl){
    const focusables = getFocusable(modalEl);
    if(focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    function handleTab(e){
      if(e.key !== 'Tab') return;
      if(e.shiftKey && document.activeElement === first){
        e.preventDefault();
        last.focus();
      } else if(!e.shiftKey && document.activeElement === last){
        e.preventDefault();
        first.focus();
      }
    }

    modalEl.addEventListener('keydown', handleTab);
    modalEl.addEventListener('DOMNodeRemoved', () => modalEl.removeEventListener('keydown', handleTab));
  }

  const themeToggle = document.getElementById('themeToggle');
  function setTheme(theme){
    if(theme === 'light'){
      document.documentElement.classList.add('light');
      themeToggle.setAttribute('aria-pressed','true');
      localStorage.setItem('theme','light');
    } else {
      document.documentElement.classList.remove('light');
      themeToggle.setAttribute('aria-pressed','false');
      localStorage.setItem('theme','dark');
    }
  }
  const saved = localStorage.getItem('theme') || 'dark';
  setTheme(saved);
  themeToggle.addEventListener('click', ()=>{
    const isLight = document.documentElement.classList.toggle('light');
    setTheme(isLight ? 'light' : 'dark');
  });

  // scroll spy & smooth scroll
  const sections = ['home','about','skills','work','contact'];
  function scrollToSection(id){
    const el = document.getElementById(id);
    if(!el) return;
    const top = el.offsetTop - 90;
    window.scrollTo({top,behavior:'smooth'});
  }
  window.scrollToSection = scrollToSection;

  document.getElementById('navLinks').addEventListener('click', (e) => {
    const sec = e.target.dataset.section;
    if(sec) scrollToSection(sec);
  });
  document.getElementById('floatingNav').addEventListener('click', (e) => {
    const sec = e.target.dataset.section;
    if(sec) scrollToSection(sec);
  });

  const spyOptions = {root:null,rootMargin:'-40% 0px -40% 0px',threshold:0};
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const id = entry.target.id;
        document.querySelectorAll('#navLinks button').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.floating-nav button').forEach(b => b.classList.remove('active'));
        const navBtn = document.querySelector(`#navLinks button[data-section="${id}"]`);
        const floatBtn = document.querySelector(`.floating-nav button[data-section="${id}"]`);
        if(navBtn) navBtn.classList.add('active');
        if(floatBtn) floatBtn.classList.add('active');
      }
    });
  }, spyOptions);
  sections.forEach(s => { const el = document.getElementById(s); if(el) spy.observe(el); });

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.querySelectorAll('.progress-inner').forEach(el=>{
          const level = el.dataset.level;
          el.style.width = level + '%';
        });
      }
    });
  }, {threshold:0.25});
  document.querySelectorAll('.skill').forEach(s => skillObserver.observe(s));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.remove('reveal');
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0px)';
      }
    });
  }, {threshold:0.08});
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  const heroLeft = document.getElementById('heroLeft');
  function heroParallax(){
    const hero = document.querySelector('.hero');
    if(!hero || !heroLeft) return;
    const rect = hero.getBoundingClientRect();
    const h = window.innerHeight;
    const progress = Math.min(Math.max((h - rect.top) / (h + rect.height), 0), 1);
    const p = Math.min(progress / 0.3, 1);
    const y = -100 * p;
    const o = 1 - p;
    heroLeft.style.transform = `translateY(${y}px)`;
    heroLeft.style.opacity = o;
  }
  window.addEventListener('scroll', heroParallax, {passive:true});
  window.addEventListener('resize', heroParallax);
  heroParallax();

  document.getElementById('hireBtn').addEventListener('click', ()=>scrollToSection('contact'));

  (function(){
    let hadKeyboardEvent = true;
    const handleKeyDown = (e) => { hadKeyboardEvent = true; };
    const handlePointerDown = (e) => { hadKeyboardEvent = false; };
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('focusin', (e) => {
      if(hadKeyboardEvent) e.target.classList.add('focus-visible');
    });
    document.addEventListener('focusout', (e) => {
      e.target.classList.remove('focus-visible');
    });
  })();

  function adjustOrbs(){
    if(window.innerWidth < 600){
      document.querySelectorAll('.orb').forEach(o => o.style.filter = 'blur(24px)');
    } else {
      document.querySelectorAll('.orb').forEach(o => o.style.filter = 'blur(40px)');
    }
  }
  window.addEventListener('resize', adjustOrbs);
  adjustOrbs();
}
