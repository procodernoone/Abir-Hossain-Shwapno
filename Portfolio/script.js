document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.querySelector('.preloader');
    setTimeout(() => {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 1500);

    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Floating navigation
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 300) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Animated text
    const text = document.querySelector('.sec-text');
    const textLoad = () => {
        setTimeout(() => {
            text.textContent = "Student";
        }, 0);
        setTimeout(() => {
            text.textContent = "Developer";
        }, 4000);
        setTimeout(() => {
            text.textContent = "Programmer";
        }, 8000);
    }
    textLoad();
    setInterval(textLoad, 12000);

    // Skill progress bars animation
    const progressBars = document.querySelectorAll('.progress');
    function showProgress() {
        progressBars.forEach(progressBar => {
            const value = progressBar.parentElement.previousElementSibling.children[1].textContent;
            progressBar.style.width = value;
        });
    }
    
    // Counters animation
    const counters = document.querySelectorAll('.exp-number');
    const speed = 200;
    
    function animateCounters() {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-count');
            const count = +counter.textContent;
            const increment = target / speed;
            
            if (count < target) {
                counter.textContent = Math.ceil(count + increment);
                setTimeout(animateCounters, 1);
            } else {
                counter.textContent = target;
            }
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.id === 'skills') {
                    showProgress();
                    animateCounters();
                }
                
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Project Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectsContainer = document.getElementById('projects-container');

    // Sample projects data
    let projects = [
        {
            title: "Lily AI",
            category: "web",
            image: "a.jpg",
            description: "Just a friendly AI.",
            link: "https://lily-ai.onrender.com"
        },
        {
            title: "Medicare+",
            category: "web",
            image: "b.jpg",
            description: "Website Dedicated for Hosppitals.",
            link: "https://test-deployment-e8og.onrender.com/"
        },
        {
            title: "Patholab",
            category: "python",
            image: "c.jpg",
            description: "A weather application that fetches data from a weather API using JavaScript.",
            link: "#"
        },
        {
            title: "Interactive Point Network",
            category: "web",
            image: "d.jpg",
            description: "Just A for Fun Project Where You Control A Network Of Interactive Points.",
            link: "#"
        },
        {
            title: "Quiz Game",
            category: "python",
            image: "https://i.imgur.com/JqYeZoL.png",
            description: "A quiz game with multiple categories and difficulty levels.",
            link: "#"
        },
        {
            title: "Image Gallery",
            category: "js",
            image: "https://i.imgur.com/JqYeZoL.png",
            description: "A responsive image gallery with lightbox functionality.",
            link: "#"
        }
    ];

    // Display projects
    function displayProjects(filter = 'all') {
        projectsContainer.innerHTML = '';
        const filteredProjects = filter === 'all' 
            ? projects 
            : projects.filter(project => project.category === filter);
        
        filteredProjects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.setAttribute('data-category', project.category);
            
            projectCard.innerHTML = `
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}">
                    <div class="project-overlay">
                        <button class="view-project" data-project="${project.title}">
                            View Project <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
                <div class="project-info">
                    <h3 class="project-title">${project.title}</h3>
                    <span class="project-category">${project.category}</span>
                    <p class="project-description">${project.description}</p>
                </div>
            `;
            
            projectsContainer.appendChild(projectCard);
        });
        
        // Add event listeners to project cards
        document.querySelectorAll('.view-project').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const projectTitle = this.getAttribute('data-project');
                openProjectModal(projectTitle);
            });
        });
    }

    // Filter projects
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const filter = this.getAttribute('data-filter');
            displayProjects(filter);
        });
    });

    // Add new project
    const addProjectForm = document.getElementById('add-project-form');
    addProjectForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('project-title').value;
        const category = document.getElementById('project-category').value;
        const image = document.getElementById('project-image').value || "https://i.imgur.com/JqYeZoL.png";
        const description = document.getElementById('project-description').value;
        const link = document.getElementById('project-link').value || "#";
        
        const newProject = {
            title,
            category,
            image,
            description,
            link
        };
        
        projects.push(newProject);
        displayProjects(document.querySelector('.filter-btn.active').getAttribute('data-filter'));
        addProjectForm.reset();
        
        // Show success message
        alert('Project added successfully!');
    });

    // Project Modal
    const projectModal = document.getElementById('projectModal');
    const closeModal = document.querySelector('.close-modal');

    function openProjectModal(title) {
        const project = projects.find(p => p.title === title);
        if (project) {
            document.getElementById('modalImage').src = project.image;
            document.getElementById('modalTitle').textContent = project.title;
            document.getElementById('modalCategory').textContent = project.category;
            document.getElementById('modalDescription').textContent = project.description;
            document.getElementById('modalLink').href = project.link;
            
            projectModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal.addEventListener('click', () => {
        projectModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            projectModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Contact Form
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Here you would typically send the form data to a server
        console.log({ name, email, subject, message });
        
        // Show success message
        alert('Thank you for your message! I will get back to you soon.');
        contactForm.reset();
    });

    // Initialize projects display
    displayProjects();

    // Confetti effect for special interactions
    const confettiCanvas = document.getElementById('confetti-canvas');
    if (confettiCanvas) {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
        
        window.addEventListener('resize', () => {
            confettiCanvas.width = window.innerWidth;
            confettiCanvas.height = window.innerHeight;
        });
    }

    function triggerConfetti() {
        if (confettiCanvas) {
            const confettiSettings = { 
                target: 'confetti-canvas',
                max: 150,
                size: 1.5,
                animate: true,
                props: ['circle', 'square', 'triangle', 'line'],
                colors: [[255,77,90], [43,45,66], [76,201,240], [255,255,255]],
                clock: 25,
                rotate: true,
                start_from_edge: true,
                respawn: true
            };
            
            const confetti = new ConfettiGenerator(confettiSettings);
            confetti.render();
            
            setTimeout(() => {
                confetti.clear();
            }, 3000);
        }
    }

    // Trigger confetti on certain actions
    document.querySelector('.hero-image').addEventListener('click', triggerConfetti);
    document.querySelector('.footer-top').addEventListener('click', triggerConfetti);

});


