/**
 * Level 1 Task 1 - Collapsible Sidebar
 * Interactive sidebar with navigation and responsive design
 */

class CollapsibleSidebar {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.hamburgerToggle = document.getElementById('hamburgerToggle');
        this.overlay = document.getElementById('overlay');
        this.mainContent = document.getElementById('mainContent');
        this.pageTitle = document.getElementById('pageTitle');
        this.contentBody = document.getElementById('contentBody');
        
        this.isCollapsed = false;
        this.isMobile = window.innerWidth <= 1024;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.handleResize();
        this.setInitialState();
        this.addKeyboardShortcuts();
    }
    
    bindEvents() {
        // Hamburger toggle
        this.hamburgerToggle.addEventListener('click', () => this.toggleSidebar());
        
        // Overlay click
        this.overlay.addEventListener('click', () => this.closeMobileSidebar());
        
        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });
        
        // Window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Escape key to close mobile sidebar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMobile) {
                this.closeMobileSidebar();
            }
        });
    }
    
    setInitialState() {
        // Set initial active navigation
        const firstNavLink = document.querySelector('.nav-link');
        if (firstNavLink) {
            firstNavLink.classList.add('active');
        }
        
        // Load initial content
        this.loadPageContent('dashboard');
    }
    
    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 1024;
        
        if (wasMobile !== this.isMobile) {
            if (this.isMobile) {
                this.sidebar.classList.remove('collapsed');
                this.sidebar.classList.remove('open');
                this.overlay.classList.remove('active');
            } else {
                this.sidebar.classList.remove('open');
                this.overlay.classList.remove('active');
            }
        }
    }
    
    toggleMobileSidebar() {
        if (this.sidebar.classList.contains('open')) {
            this.closeMobileSidebar();
        } else {
            this.openMobileSidebar();
        }
    }
    
    openMobileSidebar() {
        this.sidebar.classList.add('open');
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Animate mobile toggle icon
        this.mobileToggle.innerHTML = '<i class="fas fa-times"></i>';
    }
    
    closeMobileSidebar() {
        this.sidebar.classList.remove('open');
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset hamburger toggle
        this.hamburgerToggle.classList.remove('active');
    }
    
    toggleSidebar() {
        this.isCollapsed = !this.isCollapsed;
        
        if (this.isCollapsed) {
            this.sidebar.classList.add('collapsed');
            this.mainContent.classList.add('expanded');
            this.hamburgerToggle.classList.add('active');
        } else {
            this.sidebar.classList.remove('collapsed');
            this.mainContent.classList.remove('expanded');
            this.hamburgerToggle.classList.remove('active');
        }
        
        localStorage.setItem('sidebarCollapsed', this.isCollapsed);
    }
    
    handleNavigation(e) {
        e.preventDefault();
        
        const link = e.currentTarget;
        const page = link.dataset.page;
        
        // Update active state
        document.querySelectorAll('.nav-link').forEach(navLink => {
            navLink.classList.remove('active');
        });
        link.classList.add('active');
        
        // Load page content
        this.loadPageContent(page);
        
        // Close mobile sidebar after navigation
        if (this.isMobile) {
            setTimeout(() => this.closeMobileSidebar(), 300);
        }
        
        // Add navigation animation
        this.animateNavigation(link);
    }
    
    animateNavigation(link) {
        // Add ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(102, 126, 234, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        const rect = link.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.marginLeft = -size/2 + 'px';
        ripple.style.marginTop = -size/2 + 'px';
        
        link.style.position = 'relative';
        link.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
    
    loadPageContent(page) {
        const pageData = this.getPageData(page);
        
        // Update page title with animation
        this.pageTitle.style.opacity = '0';
        this.pageTitle.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            this.pageTitle.innerHTML = pageData.title;
            this.pageTitle.style.opacity = '1';
            this.pageTitle.style.transform = 'translateY(0)';
        }, 150);
        
        // Update content with animation
        this.contentBody.style.opacity = '0';
        this.contentBody.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            this.contentBody.innerHTML = pageData.content;
            this.contentBody.style.opacity = '1';
            this.contentBody.style.transform = 'translateY(0)';
            
            // Initialize page-specific functionality
            this.initPageSpecificFeatures(page);
        }, 200);
    }
    
    getPageData(page) {
        const pages = {
            dashboard: {
                title: '<i class="fas fa-home"></i> Dashboard Overview',
                content: this.getDashboardContent()
            },
            projects: {
                title: '<i class="fas fa-folder-open"></i> My Projects',
                content: this.getProjectsContent()
            },
            tasks: {
                title: '<i class="fas fa-tasks"></i> Active Tasks',
                content: this.getTasksContent()
            },
            progress: {
                title: '<i class="fas fa-chart-line"></i> Progress Tracking',
                content: this.getProgressContent()
            },
            resources: {
                title: '<i class="fas fa-book"></i> Learning Resources',
                content: this.getResourcesContent()
            },
            mentors: {
                title: '<i class="fas fa-users"></i> Mentors & Support',
                content: this.getMentorsContent()
            },
            profile: {
                title: '<i class="fas fa-user"></i> My Profile',
                content: this.getProfileContent()
            },
            settings: {
                title: '<i class="fas fa-cog"></i> Settings',
                content: this.getSettingsContent()
            },
            help: {
                title: '<i class="fas fa-question-circle"></i> Help & Support',
                content: this.getHelpContent()
            }
        };
        
        return pages[page] || pages.dashboard;
    }
    
    getDashboardContent() {
        return `
            <div class="dashboard-content">
                <div class="welcome-section">
                    <h2>Welcome to Your Internship Portal!</h2>
                    <p>Track your progress, manage tasks, and connect with mentors all in one place.</p>
                </div>

                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-calendar-check"></i>
                        </div>
                        <div class="stat-info">
                            <h3 class="stat-number" data-target="14">0</h3>
                            <p class="stat-label">Days Remaining</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-tasks"></i>
                        </div>
                        <div class="stat-info">
                            <h3 class="stat-number" data-target="12">0</h3>
                            <p class="stat-label">Active Tasks</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-trophy"></i>
                        </div>
                        <div class="stat-info">
                            <h3 class="stat-number" data-target="3">0</h3>
                            <p class="stat-label">Completed Projects</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div class="stat-info">
                            <h3 class="stat-number" data-target="85">0</h3>
                            <p class="stat-label">Overall Progress (%)</p>
                        </div>
                    </div>
                </div>

                <div class="progress-section">
                    <h3>Internship Progress</h3>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 0%" data-width="85"></div>
                    </div>
                    <p class="progress-text">85% Complete - Keep up the great work!</p>
                </div>

                <div class="recent-activity">
                    <h3>Recent Activity</h3>
                    <div class="activity-list">
                        <div class="activity-item">
                            <div class="activity-icon">
                                <i class="fas fa-check-circle"></i>
                            </div>
                            <div class="activity-content">
                                <h4>Task Completed</h4>
                                <p>Level 1 - Collapsible Sidebar</p>
                                <span class="activity-time">2 hours ago</span>
                            </div>
                        </div>
                        <div class="activity-item">
                            <div class="activity-icon">
                                <i class="fas fa-file-alt"></i>
                            </div>
                            <div class="activity-content">
                                <h4>New Assignment</h4>
                                <p>Level 2 - Task Management App</p>
                                <span class="activity-time">1 day ago</span>
                            </div>
                        </div>
                        <div class="activity-item">
                            <div class="activity-icon">
                                <i class="fas fa-comments"></i>
                            </div>
                            <div class="activity-content">
                                <h4>Mentor Feedback</h4>
                                <p>Great work on the responsive design!</p>
                                <span class="activity-time">2 days ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    getProjectsContent() {
        return `
            <div class="projects-content">
                <div class="content-header-section">
                    <h2>My Projects Portfolio</h2>
                    <p>Track your internship projects and their progress</p>
                </div>
                
                <div class="projects-grid">
                    <div class="project-card">
                        <div class="project-header">
                            <h3>Level 1 - Collapsible Sidebar</h3>
                            <span class="project-status completed">Completed</span>
                        </div>
                        <p>Interactive sidebar with responsive design and smooth animations.</p>
                        <div class="project-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 100%"></div>
                            </div>
                            <span>100% Complete</span>
                        </div>
                        <div class="project-tech">
                            <span class="tech-tag">HTML</span>
                            <span class="tech-tag">CSS</span>
                            <span class="tech-tag">JavaScript</span>
                        </div>
                    </div>
                    
                    <div class="project-card">
                        <div class="project-header">
                            <h3>Level 2 - Task Management</h3>
                            <span class="project-status in-progress">In Progress</span>
                        </div>
                        <p>Advanced task management application with CRUD operations.</p>
                        <div class="project-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 65%"></div>
                            </div>
                            <span>65% Complete</span>
                        </div>
                        <div class="project-tech">
                            <span class="tech-tag">HTML</span>
                            <span class="tech-tag">CSS</span>
                            <span class="tech-tag">JavaScript</span>
                            <span class="tech-tag">Local Storage</span>
                        </div>
                    </div>
                    
                    <div class="project-card">
                        <div class="project-header">
                            <h3>Level 3 - Dashboard</h3>
                            <span class="project-status pending">Pending</span>
                        </div>
                        <p>Professional dashboard with charts and advanced features.</p>
                        <div class="project-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 10%"></div>
                            </div>
                            <span>10% Complete</span>
                        </div>
                        <div class="project-tech">
                            <span class="tech-tag">HTML</span>
                            <span class="tech-tag">CSS</span>
                            <span class="tech-tag">JavaScript</span>
                            <span class="tech-tag">Chart.js</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
                .projects-content { max-width: 1200px; margin: 0 auto; }
                .content-header-section { text-align: center; margin-bottom: 3rem; color: white; }
                .content-header-section h2 { font-size: 2.5rem; margin-bottom: 1rem; text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); }
                .projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem; }
                .project-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); border-radius: 15px; padding: 2rem; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); border: 1px solid rgba(255, 255, 255, 0.3); transition: all 0.3s ease; }
                .project-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15); }
                .project-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
                .project-header h3 { color: #333; margin: 0; }
                .project-status { padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; }
                .project-status.completed { background: #e8f5e8; color: #2ed573; }
                .project-status.in-progress { background: #fff3e0; color: #ffa502; }
                .project-status.pending { background: #e3f2fd; color: #1976d2; }
                .project-progress { margin: 1rem 0; }
                .project-progress span { font-size: 0.9rem; color: #6c757d; }
                .project-tech { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem; }
                .tech-tag { background: #e3f2fd; color: #1976d2; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem; font-weight: 500; }
            </style>
        `;
    }
    
    getTasksContent() {
        return `
            <div class="tasks-content">
                <div class="content-header-section">
                    <h2>Active Tasks & Assignments</h2>
                    <p>Manage your internship tasks and deadlines</p>
                </div>
                
                <div class="tasks-list">
                    <div class="task-item high-priority">
                        <div class="task-header">
                            <h3>Complete Level 2 Task Management App</h3>
                            <span class="priority-badge high">High Priority</span>
                        </div>
                        <p>Build a comprehensive task management application with CRUD operations, filtering, and local storage.</p>
                        <div class="task-meta">
                            <span class="due-date"><i class="fas fa-calendar"></i> Due: Aug 30, 2025</span>
                            <span class="progress"><i class="fas fa-chart-pie"></i> 65% Complete</span>
                        </div>
                    </div>
                    
                    <div class="task-item medium-priority">
                        <div class="task-header">
                            <h3>Design Level 3 Dashboard Components</h3>
                            <span class="priority-badge medium">Medium Priority</span>
                        </div>
                        <p>Develop and style reusable frontend components for the advanced dashboard.</p>
                        <div class="task-meta">
                            <span class="due-date"><i class="fas fa-calendar"></i> Due: Sep 1, 2025</span>
                            <span class="progress"><i class="fas fa-chart-pie"></i> 25% Complete</span>
                        </div>
                    </div>
                    
                    <div class="task-item low-priority completed">
                        <div class="task-header">
                            <h3>Submit Level 1 Collapsible Sidebar</h3>
                            <span class="priority-badge completed">Completed</span>
                        </div>
                        <p>Successfully implemented responsive collapsible sidebar with smooth animations.</p>
                        <div class="task-meta">
                            <span class="due-date"><i class="fas fa-check-circle"></i> Completed: Aug 25, 2025</span>
                            <span class="progress"><i class="fas fa-chart-pie"></i> 100% Complete</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
                .tasks-content { max-width: 800px; margin: 0 auto; }
                .content-header-section { text-align: center; margin-bottom: 3rem; color: white; }
                .content-header-section h2 { font-size: 2.5rem; margin-bottom: 1rem; text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); }
                .tasks-list { display: flex; flex-direction: column; gap: 1.5rem; }
                .task-item { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); border-radius: 15px; padding: 2rem; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); border: 1px solid rgba(255, 255, 255, 0.3); border-left: 4px solid; transition: all 0.3s ease; }
                .task-item:hover { transform: translateX(5px); box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15); }
                .task-item.high-priority { border-left-color: #ff4757; }
                .task-item.medium-priority { border-left-color: #ffa502; }
                .task-item.low-priority { border-left-color: #2ed573; }
                .task-item.completed { border-left-color: #667eea; opacity: 0.8; }
                .task-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
                .task-header h3 { color: #333; margin: 0; }
                .priority-badge { padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; }
                .priority-badge.high { background: #ffe6e6; color: #ff4757; }
                .priority-badge.medium { background: #fff3e0; color: #ffa502; }
                .priority-badge.completed { background: #e3f2fd; color: #667eea; }
                .task-meta { display: flex; gap: 2rem; margin-top: 1rem; color: #6c757d; font-size: 0.9rem; }
                .task-meta i { margin-right: 0.5rem; }
            </style>
        `;
    }
    
    getProgressContent() {
        return `
            <div class="progress-content">
                <div class="content-header-section">
                    <h2>Progress Tracking & Analytics</h2>
                    <p>Monitor your internship progress and achievements</p>
                </div>
                
                <div class="progress-overview">
                    <div class="overall-progress">
                        <h3>Overall Internship Progress</h3>
                        <div class="circular-progress">
                            <div class="progress-circle" data-percent="85">
                                <span class="progress-percent">85%</span>
                            </div>
                        </div>
                        <p>Excellent progress! You're on track to complete all requirements.</p>
                    </div>
                    
                    <div class="skills-progress">
                        <h3>Skills Development</h3>
                        <div class="skill-item">
                            <span>HTML/CSS</span>
                            <div class="skill-bar">
                                <div class="skill-fill" style="width: 90%">90%</div>
                            </div>
                        </div>
                        <div class="skill-item">
                            <span>JavaScript</span>
                            <div class="skill-bar">
                                <div class="skill-fill" style="width: 80%">80%</div>
                            </div>
                        </div>
                        <div class="skill-item">
                            <span>Responsive Design</span>
                            <div class="skill-bar">
                                <div class="skill-fill" style="width: 85%">85%</div>
                            </div>
                        </div>
                        <div class="skill-item">
                            <span>Problem Solving</span>
                            <div class="skill-bar">
                                <div class="skill-fill" style="width: 75%">75%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
                .progress-content { max-width: 1000px; margin: 0 auto; }
                .content-header-section { text-align: center; margin-bottom: 3rem; color: white; }
                .content-header-section h2 { font-size: 2.5rem; margin-bottom: 1rem; text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); }
                .progress-overview { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
                .overall-progress, .skills-progress { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); border-radius: 15px; padding: 2rem; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); border: 1px solid rgba(255, 255, 255, 0.3); }
                .overall-progress { text-align: center; }
                .circular-progress { margin: 2rem 0; }
                .progress-circle { width: 120px; height: 120px; border-radius: 50%; background: conic-gradient(#667eea 0deg 306deg, #e9ecef 306deg 360deg); margin: 0 auto; display: flex; align-items: center; justify-content: center; position: relative; }
                .progress-circle::before { content: ''; position: absolute; width: 80px; height: 80px; background: white; border-radius: 50%; }
                .progress-percent { position: relative; z-index: 1; font-size: 1.5rem; font-weight: bold; color: #667eea; }
                .skills-progress h3 { margin-bottom: 2rem; color: #333; }
                .skill-item { margin-bottom: 1.5rem; }
                .skill-item span { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #333; }
                .skill-bar { background: #e9ecef; border-radius: 10px; height: 10px; overflow: hidden; }
                .skill-fill { height: 100%; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 10px; display: flex; align-items: center; justify-content: flex-end; padding-right: 0.5rem; color: white; font-size: 0.8rem; font-weight: bold; transition: width 1s ease; }
                @media (max-width: 768px) { .progress-overview { grid-template-columns: 1fr; } }
            </style>
        `;
    }
    
    getResourcesContent() {
        return `
            <div class="resources-content">
                <div class="content-header-section">
                    <h2>Learning Resources & Materials</h2>
                    <p>Access helpful resources to enhance your skills</p>
                </div>
                
                <div class="resources-grid">
                    <div class="resource-category">
                        <h3><i class="fas fa-code"></i> Frontend Development</h3>
                        <ul class="resource-list">
                            <li><a href="#" target="_blank">MDN Web Docs - HTML/CSS/JS</a></li>
                            <li><a href="#" target="_blank">CSS-Tricks - Advanced CSS</a></li>
                            <li><a href="#" target="_blank">JavaScript.info - Modern JS</a></li>
                            <li><a href="#" target="_blank">Can I Use - Browser Compatibility</a></li>
                        </ul>
                    </div>
                    
                    <div class="resource-category">
                        <h3><i class="fas fa-tools"></i> Development Tools</h3>
                        <ul class="resource-list">
                            <li><a href="#" target="_blank">VS Code - Code Editor</a></li>
                            <li><a href="#" target="_blank">Chrome DevTools Guide</a></li>
                            <li><a href="#" target="_blank">Git & GitHub Tutorial</a></li>
                            <li><a href="#" target="_blank">Figma - Design Tool</a></li>
                        </ul>
                    </div>
                    
                    <div class="resource-category">
                        <h3><i class="fas fa-palette"></i> Design Resources</h3>
                        <ul class="resource-list">
                            <li><a href="#" target="_blank">Google Fonts</a></li>
                            <li><a href="#" target="_blank">Font Awesome Icons</a></li>
                            <li><a href="#" target="_blank">Unsplash - Free Photos</a></li>
                            <li><a href="#" target="_blank">Coolors - Color Palettes</a></li>
                        </ul>
                    </div>
                    
                    <div class="resource-category">
                        <h3><i class="fas fa-graduation-cap"></i> Learning Platforms</h3>
                        <ul class="resource-list">
                            <li><a href="#" target="_blank">freeCodeCamp</a></li>
                            <li><a href="#" target="_blank">Codecademy</a></li>
                            <li><a href="#" target="_blank">YouTube - Web Dev Channels</a></li>
                            <li><a href="#" target="_blank">Stack Overflow</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <style>
                .resources-content { max-width: 1000px; margin: 0 auto; }
                .content-header-section { text-align: center; margin-bottom: 3rem; color: white; }
                .content-header-section h2 { font-size: 2.5rem; margin-bottom: 1rem; text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); }
                .resources-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
                .resource-category { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); border-radius: 15px; padding: 2rem; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); border: 1px solid rgba(255, 255, 255, 0.3); transition: all 0.3s ease; }
                .resource-category:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15); }
                .resource-category h3 { color: #333; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem; }
                .resource-category h3 i { color: #667eea; }
                .resource-list { list-style: none; }
                .resource-list li { margin-bottom: 0.8rem; }
                .resource-list a { color: #667eea; text-decoration: none; font-weight: 500; transition: all 0.3s ease; }
                .resource-list a:hover { color: #764ba2; text-decoration: underline; }
            </style>
        `;
    }
    
    getMentorsContent() {
        return `
            <div class="mentors-content">
                <div class="content-header-section">
                    <h2>Mentors & Support Team</h2>
                    <p>Connect with your mentors and get the support you need</p>
                </div>
                
                <div class="mentors-grid">
                    <div class="mentor-card">
                        <div class="mentor-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <h3>Serge MPARIRWA NYIRIGIRA</h3>
                        <p class="mentor-title">Senior Software Engineer</p>
                        <p class="mentor-description">Specializes in Java, TypeScript, Quarkus, NodeJs, AWS, and React. Available for technical guidance and code reviews.</p>
                        <div class="mentor-contact">
                            <button class="contact-btn"><i class="fas fa-envelope"></i> Message</button>
                            <button class="contact-btn"><i class="fas fa-video"></i> Video Call</button>
                        </div>
                    </div>
                    
                    <div class="mentor-card">
                        <div class="mentor-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <h3>Lambert NDACYAYISABA</h3>
                        <p class="mentor-title">Data Scientist</p>
                        <p class="mentor-description">Specializes in data mining, predictive modeling, A/B testing, and dashboard development. Available for turning complex data into actionable business insights.</p>
                        <div class="mentor-contact">
                            <button class="contact-btn"><i class="fas fa-envelope"></i> Message</button>
                            <button class="contact-btn"><i class="fas fa-video"></i> Video Call</button>
                        </div>
                    </div>
                    
                    <div class="mentor-card">
                        <div class="mentor-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <h3>Eric MANIRAGUHA</h3>
                        <p class="mentor-title">Project Manager & Lecturer</p>
                        <p class="mentor-description">Oversees internship progress and provides career guidance. Available for project planning and goal setting.</p>
                        <div class="mentor-contact">
                            <button class="contact-btn"><i class="fas fa-envelope"></i> Message</button>
                            <button class="contact-btn"><i class="fas fa-video"></i> Video Call</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
                .mentors-content { max-width: 1000px; margin: 0 auto; }
                .content-header-section { text-align: center; margin-bottom: 3rem; color: white; }
                .content-header-section h2 { font-size: 2.5rem; margin-bottom: 1rem; text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); }
                .mentors-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
                .mentor-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); border-radius: 15px; padding: 2rem; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); border: 1px solid rgba(255, 255, 255, 0.3); text-align: center; transition: all 0.3s ease; }
                .mentor-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15); }
                .mentor-avatar { width: 80px; height: 80px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem; }
                .mentor-card h3 { color: #333; margin-bottom: 0.5rem; }
                .mentor-title { color: #667eea; font-weight: 600; margin-bottom: 1rem; }
                .mentor-description { color: #6c757d; margin-bottom: 2rem; line-height: 1.6; }
                .mentor-contact { display: flex; gap: 1rem; justify-content: center; }
                .contact-btn { background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; font-size: 0.9rem; transition: all 0.3s ease; }
                .contact-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3); }
            </style>
        `;
    }
    
    getProfileContent() {
        return `
            <div class="profile-content">
                <div class="content-header-section">
                    <h2>My Profile</h2>
                    <p>Manage your profile information and preferences</p>
                </div>
                
                <div class="profile-sections">
                    <div class="profile-info">
                        <div class="profile-header">
                            <div class="profile-picture">
                                <span>DS</span>
                            </div>
                            <div class="profile-details">
                                <h3>Derrick SHEMA</h3>
                                <p>Frontend Development Intern</p>
                                <p>Elevvo • Started: August 20, 2025</p>
                            </div>
                        </div>
                        
                        <div class="profile-stats">
                            <div class="stat">
                                <span class="stat-value">14</span>
                                <span class="stat-label">Days Active</span>
                            </div>
                            <div class="stat">
                                <span class="stat-value">3</span>
                                <span class="stat-label">Projects</span>
                            </div>
                            <div class="stat">
                                <span class="stat-value">12</span>
                                <span class="stat-label">Tasks Completed</span>
                            </div>
                            <div class="stat">
                                <span class="stat-value">85%</span>
                                <span class="stat-label">Progress</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="profile-form">
                        <h3>Edit Profile</h3>
                        <form class="form-grid">
                            <div class="form-group">
                                <label>Full Name</label>
                                <input type="text" placeholder="Enter your full name" readonly>
                            </div>
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" value="example@elevvo.com" readonly>
                            </div>
                            <div class="form-group">
                                <label>Phone</label>
                                <input type="tel" placeholder="Enter phone number">
                            </div>
                            <div class="form-group">
                                <label>LinkedIn</label>
                                <input type="url" placeholder="LinkedIn profile URL">
                            </div>
                            <div class="form-group full-width">
                                <label>Bio</label>
                                <textarea placeholder="Tell us about yourself..."></textarea>
                            </div>
                            <div class="form-actions full-width">
                                <button type="submit" class="save-btn">Save Changes</button>
                                <button type="button" class="cancel-btn">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            
            <style>
                .profile-content { max-width: 1000px; margin: 0 auto; }
                .content-header-section { text-align: center; margin-bottom: 3rem; color: white; }
                .content-header-section h2 { font-size: 2.5rem; margin-bottom: 1rem; text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); }
                .profile-sections { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
                .profile-info, .profile-form { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); border-radius: 15px; padding: 2rem; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); border: 1px solid rgba(255, 255, 255, 0.3); }
                .profile-header { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2rem; }
                .profile-picture { width: 80px; height: 80px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: bold; }
                .profile-details h3 { color: #333; margin-bottom: 0.5rem; }
                .profile-details p { color: #6c757d; margin-bottom: 0.3rem; }
                .profile-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
                .stat { text-align: center; padding: 1rem; background: #f8f9fa; border-radius: 10px; }
                .stat-value { display: block; font-size: 1.5rem; font-weight: bold; color: #667eea; }
                .stat-label { font-size: 0.9rem; color: #6c757d; }
                .profile-form h3 { color: #333; margin-bottom: 1.5rem; }
                .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
                .form-group.full-width { grid-column: 1 / -1; }
                .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #333; }
                .form-group input, .form-group textarea { width: 100%; padding: 0.75rem; border: 2px solid #e9ecef; border-radius: 8px; font-size: 0.9rem; transition: border-color 0.3s ease; }
                .form-group input:focus, .form-group textarea:focus { outline: none; border-color: #667eea; }
                .form-group textarea { resize: vertical; min-height: 80px; }
                .form-actions { display: flex; gap: 1rem; margin-top: 1rem; }
                .save-btn, .cancel-btn { padding: 0.75rem 1.5rem; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
                .save-btn { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
                .save-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3); }
                .cancel-btn { background: #f8f9fa; color: #6c757d; border: 2px solid #e9ecef; }
                .cancel-btn:hover { background: #e9ecef; }
                @media (max-width: 768px) { .profile-sections { grid-template-columns: 1fr; } .form-grid { grid-template-columns: 1fr; } }
            </style>
        `;
    }
    
    getSettingsContent() {
        return `
            <div class="settings-content">
                <div class="content-header-section">
                    <h2>Settings & Preferences</h2>
                    <p>Customize your portal experience</p>
                </div>
                
                <div class="settings-sections">
                    <div class="settings-category">
                        <h3><i class="fas fa-bell"></i> Notifications</h3>
                        <div class="setting-item">
                            <label class="setting-label">
                                <input type="checkbox" checked>
                                <span class="checkmark"></span>
                                Email notifications for new tasks
                            </label>
                        </div>
                        <div class="setting-item">
                            <label class="setting-label">
                                <input type="checkbox" checked>
                                <span class="checkmark"></span>
                                Push notifications for deadlines
                            </label>
                        </div>
                        <div class="setting-item">
                            <label class="setting-label">
                                <input type="checkbox">
                                <span class="checkmark"></span>
                                Weekly progress reports
                            </label>
                        </div>
                    </div>
                    
                    <div class="settings-category">
                        <h3><i class="fas fa-palette"></i> Appearance</h3>
                        <div class="setting-item">
                            <label>Theme Preference</label>
                            <select class="setting-select">
                                <option>Auto (System)</option>
                                <option>Light</option>
                                <option>Dark</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label>Sidebar Behavior</label>
                            <select class="setting-select">
                                <option>Auto-collapse on mobile</option>
                                <option>Always expanded</option>
                                <option>Always collapsed</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="settings-category">
                        <h3><i class="fas fa-lock"></i> Privacy & Security</h3>
                        <div class="setting-item">
                            <label class="setting-label">
                                <input type="checkbox" checked>
                                <span class="checkmark"></span>
                                Two-factor authentication
                            </label>
                        </div>
                        <div class="setting-item">
                            <label class="setting-label">
                                <input type="checkbox">
                                <span class="checkmark"></span>
                                Share progress with mentors
                            </label>
                        </div>
                        <div class="setting-item">
                            <button class="danger-btn">Change Password</button>
                        </div>
                    </div>
                    
                    <div class="settings-category">
                        <h3><i class="fas fa-download"></i> Data & Storage</h3>
                        <div class="setting-item">
                            <button class="export-btn">Export My Data</button>
                            <p class="setting-description">Download all your internship data and progress</p>
                        </div>
                        <div class="setting-item">
                            <button class="clear-btn">Clear Local Storage</button>
                            <p class="setting-description">Remove all locally stored preferences</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
                .settings-content { max-width: 800px; margin: 0 auto; }
                .content-header-section { text-align: center; margin-bottom: 3rem; color: white; }
                .content-header-section h2 { font-size: 2.5rem; margin-bottom: 1rem; text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); }
                .settings-sections { display: flex; flex-direction: column; gap: 2rem; }
                .settings-category { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); border-radius: 15px; padding: 2rem; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); border: 1px solid rgba(255, 255, 255, 0.3); }
                .settings-category h3 { color: #333; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem; }
                .settings-category h3 i { color: #667eea; }
                .setting-item { margin-bottom: 1.5rem; }
                .setting-item:last-child { margin-bottom: 0; }
                .setting-label { display: flex; align-items: center; cursor: pointer; font-weight: 500; color: #333; }
                .setting-label input[type="checkbox"] { display: none; }
                .checkmark { width: 20px; height: 20px; border: 2px solid #667eea; border-radius: 4px; margin-right: 1rem; position: relative; transition: all 0.3s ease; }
                .setting-label input[type="checkbox"]:checked + .checkmark { background: #667eea; }
                .setting-label input[type="checkbox"]:checked + .checkmark::after { content: '✓'; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 0.8rem; }
                .setting-item label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #333; }
                .setting-select { width: 100%; padding: 0.75rem; border: 2px solid #e9ecef; border-radius: 8px; background: white; font-size: 0.9rem; }
                .setting-select:focus { outline: none; border-color: #667eea; }
                .export-btn, .clear-btn, .danger-btn { padding: 0.75rem 1.5rem; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
                .export-btn { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
                .export-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3); }
                .clear-btn { background: #f8f9fa; color: #6c757d; border: 2px solid #e9ecef; }
                .clear-btn:hover { background: #e9ecef; }
                .danger-btn { background: #ff4757; color: white; }
                .danger-btn:hover { background: #ff3742; transform: translateY(-2px); }
                .setting-description { font-size: 0.85rem; color: #6c757d; margin-top: 0.5rem; }
            </style>
        `;
    }
    
    getHelpContent() {
        return `
            <div class="help-content">
                <div class="content-header-section">
                    <h2>Help & Support</h2>
                    <p>Get assistance and find answers to common questions</p>
                </div>
                
                <div class="help-sections">
                    <div class="faq-section">
                        <h3>Frequently Asked Questions</h3>
                        <div class="faq-list">
                            <div class="faq-item">
                                <div class="faq-question">How do I submit my completed tasks?</div>
                                <div class="faq-answer">Navigate to the Tasks section, click on the completed task, and use the "Submit" button. Make sure all requirements are met before submission.</div>
                            </div>
                            <div class="faq-item">
                                <div class="faq-question">Can I collaborate with other interns?</div>
                                <div class="faq-answer">Yes! Use the Mentors section to connect with other interns and mentors. You can also join our Slack workspace for real-time collaboration.</div>
                            </div>
                            <div class="faq-item">
                                <div class="faq-question">How is my progress tracked?</div>
                                <div class="faq-answer">Your progress is automatically tracked based on task completion, time spent, and quality of submissions. Check the Progress section for detailed analytics.</div>
                            </div>
                            <div class="faq-item">
                                <div class="faq-question">What if I'm stuck on a task?</div>
                                <div class="faq-answer">Don't hesitate to reach out! Contact your assigned mentor, check the Resources section for helpful materials, or use the support chat below.</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="support-section">
                        <h3>Get Support</h3>
                        <div class="support-options">
                            <div class="support-option">
                                <i class="fas fa-comments"></i>
                                <h4>Live Chat</h4>
                                <p>Chat with our support team in real-time</p>
                                <button class="support-btn">Start Chat</button>
                            </div>
                            <div class="support-option">
                                <i class="fas fa-envelope"></i>
                                <h4>Email Support</h4>
                                <p>Send us a detailed message about your issue</p>
                                <button class="support-btn">Send Email</button>
                            </div>
                            <div class="support-option">
                                <i class="fas fa-phone"></i>
                                <h4>Phone Support</h4>
                                <p>Speak directly with a support representative</p>
                                <button class="support-btn">Call Now</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="contact-section">
                        <h3>Contact Information</h3>
                        <div class="contact-details">
                            <div class="contact-item">
                                <i class="fas fa-envelope"></i>
                                <span>supportteam@elevvo.com</span>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-phone"></i>
                                <span>+250 (787) 777-777</span>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>KK 23 St, Kigali City, Rwanda</span>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-clock"></i>
                                <span>Support Hours: Mon-Fri 9AM-6PM EST</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
                .help-content { max-width: 1000px; margin: 0 auto; }
                .content-header-section { text-align: center; margin-bottom: 3rem; color: white; }
                .content-header-section h2 { font-size: 2.5rem; margin-bottom: 1rem; text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); }
                .help-sections { display: flex; flex-direction: column; gap: 2rem; }
                .faq-section, .support-section, .contact-section { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); border-radius: 15px; padding: 2rem; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); border: 1px solid rgba(255, 255, 255, 0.3); }
                .faq-section h3, .support-section h3, .contact-section h3 { color: #333; margin-bottom: 1.5rem; }
                .faq-list { display: flex; flex-direction: column; gap: 1rem; }
                .faq-item { border: 1px solid #e9ecef; border-radius: 8px; overflow: hidden; }
                .faq-question { background: #f8f9fa; padding: 1rem; font-weight: 600; color: #333; cursor: pointer; transition: background 0.3s ease; }
                .faq-question:hover { background: #e9ecef; }
                .faq-answer { padding: 1rem; color: #6c757d; line-height: 1.6; display: none; }
                .faq-item.active .faq-answer { display: block; }
                .support-options { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; }
                .support-option { text-align: center; padding: 1.5rem; border: 2px solid #e9ecef; border-radius: 10px; transition: all 0.3s ease; }
                .support-option:hover { border-color: #667eea; transform: translateY(-5px); }
                .support-option i { font-size: 2rem; color: #667eea; margin-bottom: 1rem; }
                .support-option h4 { color: #333; margin-bottom: 0.5rem; }
                .support-option p { color: #6c757d; margin-bottom: 1rem; }
                .support-btn { background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
                .support-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3); }
                .contact-details { display: flex; flex-direction: column; gap: 1rem; }
                .contact-item { display: flex; align-items: center; gap: 1rem; color: #333; }
                .contact-item i { color: #667eea; width: 20px; }
            </style>
        `;
    }
    
    initPageSpecificFeatures(page) {
        // Initialize features specific to each page
        switch (page) {
            case 'dashboard':
                this.animateCounters();
                this.animateProgressBars();
                break;
            case 'help':
                this.initFAQ();
                break;
        }
    }
    
    animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current);
            }, 20);
        });
    }
    
    animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill[data-width]');
        progressBars.forEach(bar => {
            const width = bar.dataset.width;
            setTimeout(() => {
                bar.style.width = width + '%';
            }, 500);
        });
    }
    
    initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                // Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                // Toggle current item
                item.classList.toggle('active');
            });
        });
    }
    
    addKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Alt + numbers for quick navigation
            if (e.altKey && !e.ctrlKey && !e.shiftKey) {
                const navLinks = document.querySelectorAll('.nav-link');
                const keyNum = parseInt(e.key);
                if (keyNum >= 1 && keyNum <= navLinks.length) {
                    e.preventDefault();
                    navLinks[keyNum - 1].click();
                }
            }
            
            // Ctrl + B to toggle sidebar (desktop only)
            if (e.ctrlKey && e.key === 'b' && !this.isMobile) {
                e.preventDefault();
                this.toggleSidebar(); // <-- fix: use correct method
            }
        });
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#2ed573' : type === 'error' ? '#ff4757' : '#667eea'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            z-index: 2000;
            transform: translateX(400px);
            transition: all 0.3s ease;
            font-weight: 500;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Add CSS animation for ripple effect
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the sidebar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CollapsibleSidebar();
    
    // Show welcome message
    setTimeout(() => {
        console.log('🚀 Level 1 Task 1 - Collapsible Sidebar Loaded!');
        console.log('💡 Keyboard Shortcuts:');
        console.log('   Alt + 1-9: Quick navigation');
        console.log('   Ctrl + B: Toggle sidebar (desktop)');
        console.log('   Escape: Close mobile sidebar');
    }, 1000);
});
