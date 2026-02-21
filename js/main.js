// ========================================
// MAIN.JS - Core Functionality
// ========================================

// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// ========================================
// PARTICLE BACKGROUND ANIMATION
// ========================================

function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 1;
            this.vy = (Math.random() - 0.5) * 1;
            this.size = Math.random() * 2 + 0.5;
            this.opacity = Math.random() * 0.5 + 0.25;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.fillStyle = `rgba(0, 240, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ========================================
// PORTFOLIO SECTION INITIALIZATION
// ========================================

// Extract first frame from video as thumbnail
function getVideoThumbnail(filename) {
    return new Promise((resolve) => {
        const video = document.createElement('video');
        video.src = `videos/${filename}`;
        video.crossOrigin = 'anonymous';
        
        video.addEventListener('loadedmetadata', () => {
            video.currentTime = 0;
        });
        
        video.addEventListener('seeked', () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);
            resolve(canvas.toDataURL('image/jpeg', 0.8));
        });
        
        video.addEventListener('error', () => {
            // Fallback gradient if video fails to load
            resolve('linear-gradient(135deg, #3b82f6, #1e40af)');
        });
    });
}

async function initPortfolio() {
    const portfolioGrid = document.getElementById('portfolioGrid');
    if (!portfolioGrid) return;

    try {
        // Load videos from JSON
        const response = await fetch('data/videos.json');
        const portfolioItems = await response.json();

        // Create cards for each video
        for (const item of portfolioItems) {
            const card = document.createElement('div');
            card.className = 'video-card';
            card.style.cursor = 'pointer';
            card.onclick = () => playVideo(item.filename);
            
            // Get video thumbnail
            const thumbnail = await getVideoThumbnail(item.filename);
            
            card.innerHTML = `
                <div class="video-thumbnail" style="background-image: url('${thumbnail}'); background-size: cover; background-position: center;">
                    <div class="play-overlay"></div>
                    <div class="video-duration">${item.duration}</div>
                </div>
                <div class="video-info">
                    <h3>${item.title}</h3>
                </div>
            `;
            portfolioGrid.appendChild(card);
        }
    } catch (error) {
        console.log('Error loading videos:', error);
        console.log('Make sure videos.json exists in the /data/ folder');
    }
}

// Play video in modal
function playVideo(filename) {
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
        <div class="video-modal-content">
            <button class="modal-close">&times;</button>
            <video width="100%" height="100%" controls autoplay>
                <source src="videos/${filename}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    const closeModal = () => {
        modal.remove();
        document.body.style.overflow = 'auto';
    };
    
    const closeButton = modal.querySelector('.modal-close');
    closeButton.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// ========================================
// DOWNLOADS PAGE INITIALIZATION
// ========================================

function initDownloads() {
    const downloadsGrid = document.getElementById('downloadsGrid');
    if (!downloadsGrid) return;

    const downloadItems = [
        {
            title: "After Effects 2025",
            category: "Editing Apps",
            description: "Industry-standard video editing and motion graphics software. Essential for professional editing workflows."
        },
        {
            title: "Topaz Video Enhance AI",
            category: "Plugins",
            description: "AI-powered upscaling and enhancement software. Includes professional settings for cinematic quality output."
        },
        {
            title: "Handbrake",
            category: "Editing Apps",
            description: "Free, open-source video transcoder with professional export profiles for optimal compression and quality."
        },
        {
            title: "DaVinci Resolve",
            category: "Editing Apps",
            description: "Professional color grading and editing suite. Includes advanced color correction tools and effects."
        },
        {
            title: "Cinematic Text Presets",
            category: "Preset Packs",
            description: "40+ professional text animation presets ready to use in After Effects. Includes kinetic typography and modern effects."
        },
        {
            title: "Export Settings Pack",
            category: "Preset Packs",
            description: "Complete collection of export presets optimized for YouTube, Vimeo, social media, and broadcast quality."
        }
    ];

    // Simulate load delay
    setTimeout(() => {
        downloadItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'download-card';
            card.innerHTML = `
                <h3>${item.title}</h3>
                <span class="category">${item.category}</span>
                <p>${item.description}</p>
                <button class="download-btn">Download</button>
            `;
            downloadsGrid.appendChild(card);
        });

        const loader = document.getElementById('downloadsLoader');
        if (loader) loader.style.display = 'none';
        downloadsGrid.style.display = 'grid';
    }, 300);
}

// ========================================
// CONTACT FORM HANDLING
// ========================================

function initContactForm() {
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Store in localStorage
        const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        messages.push({
            name,
            email,
            message,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('contactMessages', JSON.stringify(messages));

        // Show success message
        formMessage.className = 'form-message success';
        formMessage.textContent = 'Message sent successfully! We\'ll get back to you soon.';
        formMessage.style.display = 'block';

        // Reset form
        form.reset();

        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    });
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

function initScrollAnimations() {
    // Animate portfolio cards on scroll
    gsap.utils.toArray('.portfolio-card').forEach(card => {
        gsap.to(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            duration: 0.8,
            opacity: 1,
            y: 0,
            ease: 'power2.out'
        });
    });
}

// ========================================
// FLOATING DOCK ACTIVE STATE
// ========================================

function initDock() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const dockItems = document.querySelectorAll('.dock-item');

    dockItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === currentPage || 
            (currentPage === '' && item.getAttribute('href') === 'index.html')) {
            item.classList.add('active');
        }
    });
}

// ========================================
// SMOOTH PAGE TRANSITIONS
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '1';
});

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initPortfolio();
    initDownloads();
    initContactForm();
    initScrollAnimations();
    initDock();
});

// Re-initialize particles on window resize
window.addEventListener('resize', () => {
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});
