/* ==========================================================================
   SkillTrace AI — Interactive Landing Page Application Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. Navbar Scroll Effect ─────────────────────────────────────────────
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // ── 2. Interactive FAQ Accordion ────────────────────────────────────────
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other items
      faqItems.forEach(otherItem => otherItem.classList.remove('active'));
      
      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // ── 3. Live Demo Simulator Logic ────────────────────────────────────────
  const sampleData = {
    olympiad: {
      title: "1st Place - National Science Olympiad",
      issuer: "Indian Institute of Technology (IIT)",
      date: "2024-03-15",
      level: "National",
      category: "STEM",
      skills: ["Physics", "Mathematics", "Problem Solving", "Research"],
      confidence: "98.4%",
      stem: 88,
      analytical: 82,
      leadership: 25,
      communication: 35,
      creativity: 30,
      career: "Engineering / Computer Science",
      readiness: "84.2%"
    },
    hackathon: {
      title: "Winner - National Robotics AI Hackathon",
      issuer: "Association for Computing Machinery (ACM)",
      date: "2024-05-20",
      level: "National",
      category: "STEM & Innovation",
      skills: ["Python", "Machine Learning", "Embedded Systems", "Teamwork"],
      confidence: "96.8%",
      stem: 92,
      analytical: 85,
      leadership: 60,
      communication: 45,
      creativity: 75,
      career: "Computer Science (AI Specialization)",
      readiness: "89.6%"
    },
    debate: {
      title: "Best Delegate - International Youth MUN",
      issuer: "United Nations Youth Assembly",
      date: "2024-02-10",
      level: "International",
      category: "Leadership & Debate",
      skills: ["Public Speaking", "Negotiation", "Policy Research", "Leadership"],
      confidence: "97.5%",
      stem: 20,
      analytical: 65,
      leadership: 90,
      communication: 95,
      creativity: 60,
      career: "Business & International Policy",
      readiness: "87.0%"
    }
  };

  const pills = document.querySelectorAll('.sample-pill');
  const demoTitle = document.getElementById('demo-title');
  const demoIssuer = document.getElementById('demo-issuer');
  const demoLevel = document.getElementById('demo-level');
  const demoSkills = document.getElementById('demo-skills');
  const demoConfidence = document.getElementById('demo-confidence');
  const demoCareer = document.getElementById('demo-career');
  const demoReadiness = document.getElementById('demo-readiness');

  const meterStem = document.getElementById('meter-stem');
  const meterAnalytical = document.getElementById('meter-analytical');
  const meterLeadership = document.getElementById('meter-leadership');
  const meterComm = document.getElementById('meter-comm');
  const meterCreativity = document.getElementById('meter-creativity');

  function updateDemo(key) {
    const data = sampleData[key];
    if (!data) return;

    // Update text fields with typing/fade animation effect
    if (demoTitle) demoTitle.textContent = data.title;
    if (demoIssuer) demoIssuer.textContent = data.issuer;
    if (demoLevel) demoLevel.textContent = data.level;
    if (demoConfidence) demoConfidence.textContent = data.confidence;
    if (demoCareer) demoCareer.textContent = data.career;
    if (demoReadiness) demoReadiness.textContent = data.readiness;

    if (demoSkills) {
      demoSkills.innerHTML = data.skills
        .map(s => `<span class="badge" style="font-size:0.75rem; margin-right:4px; margin-bottom:4px;">${s}</span>`)
        .join('');
    }

    // Update Meter Bars
    if (meterStem) meterStem.style.width = `${data.stem}%`;
    if (meterAnalytical) meterAnalytical.style.width = `${data.analytical}%`;
    if (meterLeadership) meterLeadership.style.width = `${data.leadership}%`;
    if (meterComm) meterComm.style.width = `${data.communication}%`;
    if (meterCreativity) meterCreativity.style.width = `${data.creativity}%`;
  }

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const key = pill.getAttribute('data-sample');
      if (key) updateDemo(key);
    });
  });

  // Initial demo state
  updateDemo('olympiad');

  // ── 4. Floating 3D Tilt Micro-Effect for Glass Cards ─────────────────────
  const cards = document.querySelectorAll('.glass-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // ── 5. Smooth Scroll for Anchor Links ──────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

});
