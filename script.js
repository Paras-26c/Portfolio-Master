// Mobile Navigation
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('#navLinks a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// Show admin link if in admin mode
if (new URLSearchParams(window.location.search).has('admin')) {
    const adminLink = document.getElementById('adminLink');
    if (adminLink) {
        adminLink.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Terminal-like typing animation
    const heroHeading = document.querySelector('.hero h1');
    if (heroHeading) {
        const text = heroHeading.textContent;
        heroHeading.textContent = '';
        heroHeading.style.borderRight = '2px solid ' + getComputedStyle(heroHeading).color;
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < text.length) {
                heroHeading.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typingInterval);
                // Keep cursor blinking after typing completes
                setInterval(() => {
                    heroHeading.style.borderRight = heroHeading.style.borderRight === 'none' ? 
                        '2px solid ' + getComputedStyle(heroHeading).color : 'none';
                }, 500);
            }
        }, 100);
    }

    // No skill bars animation needed (removed from design)

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('skills-container')) {
                    animateSkillBars();
                }
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });

    // Observe sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Smooth scrolling for navigation
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });

    // Form submission and response storage
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        console.log('Contact form found in DOM'); // Debug log
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submit event triggered'); // Debug log
            
            try {
                // Verify form elements exist
                if (!this.elements) throw new Error('Form elements not found');
                
                const nameField = this.elements.namedItem('name');
                const emailField = this.elements.namedItem('email'); 
                const messageField = this.elements.namedItem('message');
                
                if (!nameField || !emailField || !messageField) {
                    throw new Error('One or more form fields are missing');
                }

                const formData = {
                    name: nameField.value,
                    email: emailField.value,
                    message: messageField.value,
                    date: new Date().toISOString()
                };
                console.log('Form data collected:', formData); // Debug log

                // Verify localStorage is available
                if (typeof(Storage) === "undefined") {
                    throw new Error('LocalStorage not supported');
                }

                const responses = JSON.parse(localStorage.getItem('contactResponses') || '[]');
                responses.push(formData);
                localStorage.setItem('contactResponses', JSON.stringify(responses));
                console.log('Responses stored:', responses); // Debug log

                alert('Thank you for your message! I will get back to you soon.');
                this.reset();
            } catch (error) {
                console.error('Form submission error:', error); // Debug log
                alert('Error submitting form: ' + error.message);
            }
        });
    } else {
        console.error('Contact form not found in DOM'); // Debug log
    }

    // Admin view for responses (add ?admin=true to URL to access)
    if (new URLSearchParams(window.location.search).has('admin')) {
        const responses = JSON.parse(localStorage.getItem('contactResponses') || '[]');
        const adminView = document.createElement('div');
        adminView.style.position = 'fixed';
        adminView.style.bottom = '20px';
        adminView.style.right = '20px';
        adminView.style.background = 'white';
        adminView.style.padding = '20px';
        adminView.style.borderRadius = '8px';
        adminView.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
        adminView.style.zIndex = '1000';
        adminView.style.maxHeight = '300px';
        adminView.style.overflowY = 'auto';
        
        adminView.innerHTML = `
            <h3>Contact Responses (${responses.length})</h3>
            ${responses.length ? 
                responses.map(r => `
                    <div style="margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                        <p><strong>${r.name}</strong> (${r.email})</p>
                        <p>${r.message}</p>
                        <small>${new Date(r.date).toLocaleString()}</small>
                    </div>
                `).join('') : 
                '<p>No responses yet</p>'
            }
        `;
        
        document.body.appendChild(adminView);
    }
});
