// Loading Screen
const loadingScreen = document.getElementById("loading-screen");
const loadingProgress = document.querySelector(".loading-progress");

// Loading Animation
let loadingProgressValue = 0;
const loadingInterval = setInterval(() => {
  loadingProgressValue += Math.random() * 15;
  if (loadingProgressValue >= 100) {
    loadingProgressValue = 100;
    clearInterval(loadingInterval);
    setTimeout(() => {
      loadingScreen.classList.add("loaded");
      setTimeout(() => {
        loadingScreen.style.display = "none";
      }, 500);
    }, 300);
  }
  loadingProgress.style.width = loadingProgressValue + "%";
}, 100);

// Scroll Progress
const scrollProgressBar = document.querySelector(".scroll-progress-bar");

function updateScrollProgress() {
  const scrollTop = window.pageYOffset;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  scrollProgressBar.style.width = scrollPercent + "%";
}

window.addEventListener("scroll", updateScrollProgress);

// Theme Toggle
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const navToggle = document.getElementById("navToggle");
const siteNav = document.getElementById("primaryNav");
const currentYearEl = document.getElementById("currentYear");
let particlesCtx = null; // Will be set when canvas is initialized

const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

const THEMES = {
  LIGHT: "light",
  DARK: "dark",
};

const applyTheme = (theme) => {
  if (theme === THEMES.LIGHT) {
    root.setAttribute("data-theme", "light");
    localStorage.setItem("theme", THEMES.LIGHT);
  } else {
    root.removeAttribute("data-theme");
    localStorage.setItem("theme", THEMES.DARK);
  }
};

const initTheme = () => {
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme) {
    applyTheme(storedTheme);
  } else {
    // Use system preference if no stored theme
    const systemPrefersDark = prefersDarkScheme.matches;
    applyTheme(systemPrefersDark ? THEMES.DARK : THEMES.LIGHT);
  }
};

initTheme();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isLight = root.getAttribute("data-theme") === "light";
    applyTheme(isLight ? THEMES.DARK : THEMES.LIGHT);
  });
}

// Navigation Toggle
const toggleNav = (open) => {
  if (!siteNav || !navToggle) return;
  const shouldOpen = typeof open === "boolean" ? open : !siteNav.classList.contains("is-open");
  
  // Add mobile-nav class on mobile
  if (window.innerWidth < 768) {
    siteNav.classList.add("mobile-nav");
  }
  
  siteNav.classList.toggle("is-open", shouldOpen);
  navToggle.classList.toggle("is-open", shouldOpen);
  navToggle.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
  document.body.style.overflow = shouldOpen ? "hidden" : "";
};

if (navToggle) {
  navToggle.addEventListener("click", () => toggleNav());
}

if (siteNav) {
  siteNav.querySelectorAll("a[href^='#']").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 768) {
        toggleNav(false);
      }
    });
  });
}

// Remove mobile-nav class on desktop resize
window.addEventListener("resize", () => {
  if (window.innerWidth >= 768 && siteNav) {
    siteNav.classList.remove("mobile-nav", "is-open");
    navToggle?.classList.remove("is-open");
    document.body.style.overflow = "";
  }
});

// Loading Screen Animation
window.addEventListener("load", () => {
  setTimeout(() => {
    if (loadingScreen) {
      loadingScreen.classList.add("loaded");
      // Remove from DOM after transition completes
      setTimeout(() => {
        loadingScreen.remove();
      }, 500);
    }
  }, 2000); // Show loading for 2 seconds
});

// Scroll Progress
window.addEventListener("scroll", () => {
  const scrollTop = window.pageYOffset;
  const docHeight = document.body.offsetHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;

  if (scrollProgressBar) {
    scrollProgressBar.style.width = scrollPercent + "%";
  }
});

// Current Year
if (currentYearEl) {
  currentYearEl.textContent = new Date().getFullYear();
}

// Custom Cursor
const cursor = document.querySelector(".cursor");
const cursorFollower = document.querySelector(".cursor-follower");

if (cursor && cursorFollower) {
  let mouseX = 0;
  let mouseY = 0;
  let followerX = 0;
  let followerY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursor.style.left = mouseX + "px";
    cursor.style.top = mouseY + "px";
  });

  const animateFollower = () => {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;

    cursorFollower.style.left = followerX + "px";
    cursorFollower.style.top = followerY + "px";

    requestAnimationFrame(animateFollower);
  };

  animateFollower();

  // Hover effects
  const interactiveElements = document.querySelectorAll("a, button, .project-card, .skill-card, .contact-link");
  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1.5)";
      cursorFollower.style.transform = "translate(-50%, -50%) scale(1.5)";
    });
    el.addEventListener("mouseleave", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1)";
      cursorFollower.style.transform = "translate(-50%, -50%) scale(1)";
    });
  });
}

// Particles Animation
const canvas = document.getElementById("particles");
if (canvas) {
  particlesCtx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = 50;

  const getParticleColor = () => {
    const isLight = root.getAttribute("data-theme") === "light";
    return isLight ? "rgba(8, 145, 178," : "rgba(0, 217, 255,";
  };

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = Math.random() * 0.5 - 0.25;
      this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      if (this.y < 0) this.y = canvas.height;
    }

    draw() {
      particlesCtx.fillStyle = `${getParticleColor()} ${this.opacity})`;
      particlesCtx.beginPath();
      particlesCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      particlesCtx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  const animate = () => {
    particlesCtx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });

    // Connect nearby particles
    particles.forEach((particle, i) => {
      particles.slice(i + 1).forEach((otherParticle) => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          const isLight = root.getAttribute("data-theme") === "light";
          const color = isLight ? "rgba(8, 145, 178," : "rgba(0, 217, 255,";
          particlesCtx.strokeStyle = `${color} ${0.2 * (1 - distance / 150)})`;
          particlesCtx.lineWidth = 1;
          particlesCtx.beginPath();
          particlesCtx.moveTo(particle.x, particle.y);
          particlesCtx.lineTo(otherParticle.x, otherParticle.y);
          particlesCtx.stroke();
        }
      });
    });

    requestAnimationFrame(animate);
  };

  animate();

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// Typing Animation
const typingElements = document.querySelectorAll(".typing-text");
typingElements.forEach((el) => {
  const text = el.getAttribute("data-text");
  if (text) {
    let index = 0;
    el.textContent = "";

    const type = () => {
      if (index < text.length) {
        el.textContent += text.charAt(index);
        index++;
        setTimeout(type, 100);
      }
    };

    setTimeout(type, 500);
  }
});

// Enhanced Scroll Animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Add staggered animation delay
      const delay = index * 0.1;
      setTimeout(() => {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }, delay * 1000);
    }
  });
}, observerOptions);

const animateElements = document.querySelectorAll(
  ".skill-card, .project-card, .about__text, .about__code, .contact__content, .section__header"
);

animateElements.forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(30px)";
  el.style.transition = "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
  observer.observe(el);
});

// Animate skill progress bars
const animateProgressBars = () => {
  const progressBars = document.querySelectorAll(".progress-fill");
  progressBars.forEach((bar, index) => {
    setTimeout(() => {
      const width = bar.style.width;
      bar.style.width = width;
    }, index * 100);
  });
};

// Stagger animations for grid items
const gridItems = document.querySelectorAll(".skills__grid .skill-card, .projects__grid .project-card");
gridItems.forEach((item, index) => {
  item.style.opacity = "0";
  item.style.transform = "translateY(50px)";
  item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
  observer.observe(item);
});

// Trigger progress bar animations when skills section is visible
const skillsSection = document.getElementById("skills");
if (skillsSection) {
  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateProgressBars();
        skillsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  skillsObserver.observe(skillsSection);
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Escape key to close nav
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    toggleNav(false);
  }
});

// EmailJS Configuration
// Replace these with your actual EmailJS service details
const EMAILJS_SERVICE_ID = 'service_38xefip';
const EMAILJS_TEMPLATE_ID = 'template_bepkq19';
const EMAILJS_PUBLIC_KEY = 'DbHlFtL7bZsriJdNa';

// Initialize EmailJS
(function() {
  emailjs.init(EMAILJS_PUBLIC_KEY);
})();

// Custom CAPTCHA System - Text-based with Canvas
let currentCaptchaText = '';

function generateCaptcha() {
  const canvas = document.getElementById('captchaCanvas');
  const ctx = canvas.getContext('2d');
  const input = document.getElementById('captchaAnswer');
  const errorElement = document.getElementById('captchaError');

  // Clear previous state
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  input.value = '';
  errorElement.textContent = '';

  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  const length = Math.floor(Math.random() * 3) + 4; 
  currentCaptchaText = '';

  for (let i = 0; i < length; i++) {
    currentCaptchaText += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  // Draw the CAPTCHA
  drawCaptchaText(ctx, currentCaptchaText, canvas.width, canvas.height);
}

function drawCaptchaText(ctx, text, width, height) {
  // Set canvas background
  ctx.fillStyle = 'rgba(10, 10, 15, 0.8)';
  ctx.fillRect(0, 0, width, height);

  // Add noise lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * width, Math.random() * height);
    ctx.lineTo(Math.random() * width, Math.random() * height);
    ctx.stroke();
  }

  // Add noise dots
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  for (let i = 0; i < 50; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * width, Math.random() * height, 1, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw text with distortions
  ctx.font = 'bold 24px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const colors = ['#00d9ff', '#b026ff', '#ff006e', '#3b82f6', '#10b981', '#f59e0b'];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const x = (width / text.length) * (i + 0.5);
    const y = height / 2 + (Math.random() - 0.5) * 10; // Slight vertical variation

    // Random color for each character
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];

    // Save context for transformations
    ctx.save();

    // Apply random rotation
    const rotation = (Math.random() - 0.5) * 0.5; // -0.25 to 0.25 radians
    ctx.translate(x, y);
    ctx.rotate(rotation);

    // Draw character
    ctx.fillText(char, 0, 0);

    ctx.restore();
  }

  // Add more noise lines on top
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(0, Math.random() * height);
    ctx.lineTo(width, Math.random() * height);
    ctx.stroke();
  }
}

function validateCaptcha() {
  const userInput = document.getElementById('captchaAnswer').value.trim().toUpperCase();
  return userInput === currentCaptchaText.toUpperCase();
}

function checkHoneypot() {
  const honeypotValue = document.getElementById('website').value.trim();
  return honeypotValue === ''; // Should be empty for humans
}

// Initialize CAPTCHA on page load
document.addEventListener('DOMContentLoaded', () => {
  generateCaptcha();
});

// Refresh CAPTCHA button
const refreshCaptchaBtn = document.getElementById('refreshCaptcha');
if (refreshCaptchaBtn) {
  refreshCaptchaBtn.addEventListener('click', generateCaptcha);
}

// Contact Form Handling
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validate CAPTCHA
    if (!validateCaptcha()) {
      const errorElement = document.getElementById('captchaError');
      errorElement.textContent = 'Caractères incorrects. Veuillez réessayer.';
      document.getElementById('captchaAnswer').value = '';
      document.getElementById('captchaAnswer').focus();
      setTimeout(() => {
        generateCaptcha();
      }, 2000);
      return;
    }

    // Check honeypot
    if (!checkHoneypot()) {
      // Silently fail for bots
      showNotification("Message envoyé avec succès !", "success");
      contactForm.reset();
      generateCaptcha();
      return;
    }

    const submitBtn = contactForm.querySelector("button[type='submit']");
    const originalText = submitBtn.innerHTML;

    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span>Envoi en cours...</span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="animate-spin">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" stroke-dasharray="31.416" stroke-dashoffset="31.416">
          <animate attributeName="stroke-dashoffset" dur="1s" repeatCount="indefinite" values="31.416;0"/>
        </circle>
      </svg>
    `;

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    try {
      // Send email using EmailJS
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: data.name,
          from_email: data.email,
          subject: data.subject,
          message: data.message,
          to_name: 'Rahman Turkmen',
        }
      );

      // Show success message
      showNotification("Message envoyé avec succès ! Je vous répondrai bientôt.", "success");

      // Reset form and generate new CAPTCHA
      contactForm.reset();
      generateCaptcha();

    } catch (error) {
      console.error('EmailJS error:', error);
      showNotification("Erreur lors de l'envoi du message. Veuillez réessayer.", "error");
    } finally {
      // Re-enable button
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

// Notification System
const showNotification = (message, type = "info") => {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification");
  existingNotifications.forEach(notification => notification.remove());

  const notification = document.createElement("div");
  notification.className = `notification notification--${type}`;
  notification.innerHTML = `
    <div class="notification__content">
      <span class="notification__message">${message}</span>
      <button class="notification__close" aria-label="Fermer">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  `;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => notification.classList.add("notification--visible"), 10);

  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.classList.remove("notification--visible");
    setTimeout(() => notification.remove(), 300);
  }, 5000);

  // Close button
  const closeBtn = notification.querySelector(".notification__close");
  closeBtn.addEventListener("click", () => {
    notification.classList.remove("notification--visible");
    setTimeout(() => notification.remove(), 300);
  });
};



// Prevent right-click context menu
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

// Prevent keyboard shortcuts for developer tools and view source
document.addEventListener('keydown', (e) => {
  // Prevent Ctrl+Shift+I (Inspect)
  if (e.ctrlKey && e.shiftKey && e.key === 'I') {
    e.preventDefault();
  }
  // Prevent F12 (Developer Tools)
  if (e.key === 'F12') {
    e.preventDefault();
  }
  // Prevent Ctrl+U (View Source)
  if (e.ctrlKey && e.key === 'u') {
    e.preventDefault();
  }
});

// Theme change listener
prefersDarkScheme.addEventListener("change", (event) => {
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme) return;
  applyTheme(event.matches ? THEMES.DARK : THEMES.LIGHT);
});


