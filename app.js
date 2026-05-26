// Dynamic Neural Network Particle Background
const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const maxParticles = 65;
const connectionDistance = 110;
const mouse = { x: null, y: null, radius: 150 };

// Adjust canvas size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Track mouse movement
window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
window.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

// Particle Class
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.radius = Math.random() * 2 + 1.5;
  }

  update() {
    // Wall bounce
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

    // Movement
    this.x += this.vx;
    this.y += this.vy;

    // Mouse interactivity (slight push away)
    if (mouse.x != null && mouse.y != null) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        this.x += Math.cos(angle) * force * 2;
        this.y += Math.sin(angle) * force * 2;
      }
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(245, 158, 11, 0.4)'; // Amber tint nodes
    ctx.fill();
  }
}

// Initialise particles
function initParticles() {
  particles = [];
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }
}
initParticles();

// Animation Loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();

    // Draw connections
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < connectionDistance) {
        const opacity = (1 - dist / connectionDistance) * 0.12;
        ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`; // Indigo connecting lines
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animate);
}
animate();

// --- Interactive Skills Filter ---
const filterButtons = document.querySelectorAll('.filter-btn');
const skillTags = document.querySelectorAll('.skill-tag');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Toggle active class on buttons
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const filterValue = button.getAttribute('data-filter');

    // Filter skill tags
    skillTags.forEach(tag => {
      const category = tag.getAttribute('data-category');
      if (filterValue === 'all' || category === filterValue) {
        tag.classList.remove('fade-out');
      } else {
        tag.classList.add('fade-out');
      }
    });
  });
});

// --- Copy Email to Clipboard Interaction ---
const emailBtn = document.querySelector('.email-btn');
const toast = document.getElementById('toast');

if (emailBtn && toast) {
  emailBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const emailAddress = "adityaorinal@gmail.com";
    
    // Copy logic
    navigator.clipboard.writeText(emailAddress).then(() => {
      // Show toast
      toast.classList.add('show');
      
      // Hide toast after 3 seconds
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  });
}
