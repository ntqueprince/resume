/**
 * RESUME AI PRO - Main Application Logic
 * Handles state, AI suggestions, preview rendering, and user interactions.
 */

// ==========================================
// 1. DATA & CONFIGURATION
// ==========================================

// Job Profile Data (AI Suggestions)
const JOB_PROFILES = {
    'software-engineer': {
        title: 'Software Engineer',
        summaries: [
            "Innovative Software Engineer with [X] years of experience in full-stack development. Proven track record of building scalable web applications and optimizing system performance. Skilled in JavaScript, React, and Node.js.",
            "Results-driven Developer passionate about writing clean, maintainable code. Experienced in Agile environments and CI/CD pipelines. Seeking to leverage technical skills to drive product success.",
            "Dedicated Engineering professional with a strong foundation in algorithms and data structures. Committed to continuous learning and staying updated with emerging technologies."
        ],
        skills: ["JavaScript", "React", "Node.js", "Python", "SQL", "Git", "AWS", "Docker", "TypeScript", "Agile"],
        bullets: [
            "Developed and maintained scalable web applications using React and Node.js, serving 10k+ daily users.",
            "Optimized database queries, reducing API response time by 40%.",
            "Collaborated with cross-functional teams to define, design, and ship new features.",
            "Implemented automated testing pipelines, increasing code coverage to 90%."
        ]
    },
    'data-analyst': {
        title: 'Data Analyst',
        summaries: [
            "Detail-oriented Data Analyst with expertise in interpreting complex datasets to drive business decisions. Proficient in SQL, Python, and Tableau. Strong analytical and problem-solving skills.",
            "Data professional with a passion for uncovering trends and insights. Experienced in creating automated dashboards and reporting systems. Proven ability to communicate technical findings to non-technical stakeholders."
        ],
        skills: ["SQL", "Python", "Tableau", "Power BI", "Excel", "Statistics", "Data Visualization", "R", "Machine Learning"],
        bullets: [
            "Analyzed large datasets to identify trends, resulting in a 15% increase in operational efficiency.",
            "Created interactive dashboards in Tableau to track key performance indicators (KPIs).",
            "Automated weekly reporting processes using Python, saving 10 hours of manual work per week.",
            "Collaborated with stakeholders to define data requirements and deliver actionable insights."
        ]
    },
    'product-manager': {
        title: 'Product Manager',
        summaries: [
            "Strategic Product Manager with [X] years of experience leading cross-functional teams to deliver user-centric products. Skilled in roadmap planning, market research, and agile methodologies.",
            "Customer-obsessed Product Owner with a track record of increasing user engagement and retention. Experienced in defining product vision and executing go-to-market strategies."
        ],
        skills: ["Product Strategy", "Agile/Scrum", "User Research", "Roadmapping", "Data Analysis", "Jira", "A/B Testing", "Stakeholder Management"],
        bullets: [
            "Led the end-to-end launch of a new mobile app, achieving 50k downloads in the first month.",
            "Conducted user research and usability testing to inform product decisions and improve UX.",
            "Prioritized product backlog based on business value and customer feedback.",
            "Collaborated with engineering and design teams to ensure timely delivery of high-quality features."
        ]
    },
    'marketing': {
        title: 'Marketing Specialist',
        summaries: [
            "Creative Marketing Specialist with a focus on digital growth and brand awareness. Experienced in social media management, SEO, and content strategy. Proven ability to drive traffic and conversions.",
            "Results-oriented Marketer with expertise in campaign management and analytics. Skilled in crafting compelling messaging and optimizing ad spend for maximum ROI."
        ],
        skills: ["Digital Marketing", "SEO/SEM", "Social Media", "Content Strategy", "Google Analytics", "Email Marketing", "Copywriting", "Brand Management"],
        bullets: [
            "Executed multi-channel marketing campaigns that increased website traffic by 30%.",
            "Managed social media accounts with a total following of 100k+, driving consistent engagement.",
            "Optimized email marketing automation flows, resulting in a 20% increase in open rates.",
            "Analyzed campaign performance metrics to refine strategies and improve ROI."
        ]
    },
    // Default fallback
    'other': {
        title: 'Professional',
        summaries: [
            "Motivated professional with [X] years of experience in [Industry]. Proven track record of [Key Achievement]. Skilled in [Skill 1] and [Skill 2].",
            "Dedicated and results-oriented individual seeking to leverage [Skillset] to contribute to [Company Goals]."
        ],
        skills: ["Communication", "Teamwork", "Problem Solving", "Project Management", "Leadership", "Time Management"],
        bullets: [
            "Successfully managed [Project/Task], delivering results ahead of schedule.",
            "Collaborated with team members to achieve departmental goals.",
            "Implemented process improvements that increased efficiency by [X]%.",
            "Demonstrated strong problem-solving skills in resolving complex issues."
        ]
    }
};

// ==========================================
// 2. STATE MANAGEMENT
// ==========================================

const initialState = {
    jobProfile: '',
    personal: {
        fullName: '',
        jobTitle: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        portfolio: '',
        github: '',
        photo: null
    },
    summary: '',
    experience: [],
    education: [],
    skills: '',
    languages: '',
    projects: [],
    certifications: [],
    theme: 'dark',
    currentSection: 'job-profile',
    template: 'modern'
};

// Load state from localStorage or use initial
let state = JSON.parse(localStorage.getItem('resumeState')) || initialState;

// ==========================================
// 3. CORE FUNCTIONS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // Apply theme
    document.documentElement.setAttribute('data-theme', state.theme);

    // Restore form data
    restoreFormData();

    // Render initial preview
    updateResume();

    // Setup event listeners
    setupNavigation();

    // Show initial section
    goToSection(state.currentSection);

    console.log('🚀 Resume AI Pro Initialized');
}

function saveState() {
    localStorage.setItem('resumeState', JSON.stringify(state));
    showAutoSaveIndicator();
    calculateScores();
}

function showAutoSaveIndicator() {
    const indicator = document.getElementById('save-indicator');
    indicator.style.opacity = '1';
    setTimeout(() => {
        indicator.style.opacity = '0.5';
    }, 1000);
}

// ==========================================
// 4. FORM HANDLING & NAVIGATION
// ==========================================

function updateResume() {
    // Update state from DOM
    state.personal.fullName = document.getElementById('fullName').value;
    state.personal.jobTitle = document.getElementById('jobTitle').value;
    state.personal.email = document.getElementById('email').value;
    state.personal.phone = document.getElementById('phone').value;
    state.personal.location = document.getElementById('location').value;
    state.personal.linkedin = document.getElementById('linkedin').value;
    state.personal.portfolio = document.getElementById('portfolio').value;
    state.personal.github = document.getElementById('github').value;

    state.summary = document.getElementById('summary').value;
    state.skills = document.getElementById('skills').value;
    state.languages = document.getElementById('languages').value;

    // Update char counts
    document.getElementById('summary-chars').textContent = state.summary.length;

    // Save & Render
    saveState();
    renderPreview();
}

function goToSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.form-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

    // Show target section
    const target = document.getElementById(`section-${sectionId}`);
    if (target) {
        target.classList.add('active');
        state.currentSection = sectionId;

        // Update sidebar nav
        const navItem = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
        if (navItem) navItem.classList.add('active');

        saveState();
    }
}

function nextSection() {
    const sections = ['job-profile', 'personal', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications'];
    const currentIndex = sections.indexOf(state.currentSection);
    if (currentIndex < sections.length - 1) {
        goToSection(sections[currentIndex + 1]);
    }
}

function prevSection() {
    const sections = ['job-profile', 'personal', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications'];
    const currentIndex = sections.indexOf(state.currentSection);
    if (currentIndex > 0) {
        goToSection(sections[currentIndex - 1]);
    }
}

// ==========================================
// 5. JOB PROFILE & AI SUGGESTIONS
// ==========================================

function selectJobProfile(profileKey) {
    state.jobProfile = profileKey;

    // Visual selection
    document.querySelectorAll('.job-card').forEach(el => el.classList.remove('selected'));
    document.querySelector(`.job-card[data-profile="${profileKey}"]`).classList.add('selected');

    // Trigger AI Suggestions
    const profile = JOB_PROFILES[profileKey] || JOB_PROFILES['other'];

    // Pre-fill job title if empty
    const jobTitleInput = document.getElementById('jobTitle');
    if (!jobTitleInput.value) {
        jobTitleInput.value = profile.title;
        state.personal.jobTitle = profile.title;
    }

    // Populate Summary Suggestions
    const summaryContainer = document.getElementById('summary-suggestion-cards');
    summaryContainer.innerHTML = profile.summaries.map(text => `
        <div class="suggestion-card" onclick="applySummary('${escapeHtml(text)}')">
            <p class="suggestion-text">${text}</p>
            <div class="suggestion-action">+ Use this summary</div>
        </div>
    `).join('');

    // Populate Skill Suggestions
    const skillsContainer = document.getElementById('suggested-skills');
    skillsContainer.innerHTML = profile.skills.map(skill => `
        <button class="skill-chip" onclick="addSkill('${skill}', this)">+ ${skill}</button>
    `).join('');

    document.getElementById('selected-profile-name').textContent = profile.title;

    showToast(`AI Suggestions loaded for ${profile.title}`, 'success');
    updateResume();

    // Auto-advance
    setTimeout(() => nextSection(), 500);
}

function applySummary(text) {
    const textarea = document.getElementById('summary');
    textarea.value = text;
    updateResume();
    showToast('Summary applied!', 'success');
}

function addSkill(skill, btnElement) {
    const textarea = document.getElementById('skills');
    const currentSkills = textarea.value.split(',').map(s => s.trim()).filter(s => s);

    if (!currentSkills.includes(skill)) {
        currentSkills.push(skill);
        textarea.value = currentSkills.join(', ');
        btnElement.classList.add('added');
        updateResume();
    }
}

// ==========================================
// 6. DYNAMIC LISTS (Experience, Education, etc.)
// ==========================================

function createEntryHTML(type, id, data = {}) {
    if (type === 'experience') {
        return `
            <div class="entry-card" id="${id}">
                <div class="entry-header">
                    <span class="entry-title">${data.title || 'New Position'}</span>
                    <button class="btn-remove" onclick="removeEntry('experience', '${id}')">×</button>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Job Title</label>
                        <input type="text" class="exp-title" value="${data.title || ''}" oninput="updateEntry('experience', '${id}')">
                    </div>
                    <div class="form-group">
                        <label>Company</label>
                        <input type="text" class="exp-company" value="${data.company || ''}" oninput="updateEntry('experience', '${id}')">
                    </div>
                    <div class="form-group">
                        <label>Start Date</label>
                        <input type="text" class="exp-start" placeholder="MM/YYYY" value="${data.start || ''}" oninput="updateEntry('experience', '${id}')">
                    </div>
                    <div class="form-group">
                        <label>End Date</label>
                        <input type="text" class="exp-end" placeholder="Present" value="${data.end || ''}" oninput="updateEntry('experience', '${id}')">
                    </div>
                    <div class="form-group full-width">
                        <label>Description</label>
                        <textarea class="exp-desc" rows="3" oninput="updateEntry('experience', '${id}')">${data.description || ''}</textarea>
                        <div class="bullet-suggestions">
                            <small class="text-muted">AI Suggestion: <a href="#" onclick="suggestBullets('${id}'); return false;">Generate bullets</a></small>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (type === 'education') {
        return `
            <div class="entry-card" id="${id}">
                <div class="entry-header">
                    <span class="entry-title">${data.degree || 'New Education'}</span>
                    <button class="btn-remove" onclick="removeEntry('education', '${id}')">×</button>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Degree / Major</label>
                        <input type="text" class="edu-degree" value="${data.degree || ''}" oninput="updateEntry('education', '${id}')">
                    </div>
                    <div class="form-group">
                        <label>School / University</label>
                        <input type="text" class="edu-school" value="${data.school || ''}" oninput="updateEntry('education', '${id}')">
                    </div>
                    <div class="form-group">
                        <label>Year</label>
                        <input type="text" class="edu-year" value="${data.year || ''}" oninput="updateEntry('education', '${id}')">
                    </div>
                </div>
            </div>
        `;
    }
    // Add similar blocks for projects/certifications
    return '';
}

function addExperience(data = null) {
    const id = 'exp_' + Date.now();
    const container = document.getElementById('experience-container');
    container.insertAdjacentHTML('beforeend', createEntryHTML('experience', id, data || {}));

    if (!data) {
        state.experience.push({ id, title: '', company: '', start: '', end: '', description: '' });
        saveState();
    }
}

function addEducation(data = null) {
    const id = 'edu_' + Date.now();
    const container = document.getElementById('education-container');
    container.insertAdjacentHTML('beforeend', createEntryHTML('education', id, data || {}));

    if (!data) {
        state.education.push({ id, degree: '', school: '', year: '' });
        saveState();
    }
}

function removeEntry(type, id) {
    document.getElementById(id).remove();
    state[type] = state[type].filter(item => item.id !== id);
    saveState();
    renderPreview();
}

function updateEntry(type, id) {
    const el = document.getElementById(id);
    const item = state[type].find(x => x.id === id);

    if (type === 'experience') {
        item.title = el.querySelector('.exp-title').value;
        item.company = el.querySelector('.exp-company').value;
        item.start = el.querySelector('.exp-start').value;
        item.end = el.querySelector('.exp-end').value;
        item.description = el.querySelector('.exp-desc').value;
        el.querySelector('.entry-title').textContent = item.title || 'Position';
    } else if (type === 'education') {
        item.degree = el.querySelector('.edu-degree').value;
        item.school = el.querySelector('.edu-school').value;
        item.year = el.querySelector('.edu-year').value;
        el.querySelector('.entry-title').textContent = item.degree || 'Degree';
    }

    saveState();
    renderPreview();
}

function suggestBullets(id) {
    const profile = JOB_PROFILES[state.jobProfile] || JOB_PROFILES['other'];
    const bullets = profile.bullets;
    const el = document.getElementById(id).querySelector('.exp-desc');

    // Append a random bullet
    const randomBullet = bullets[Math.floor(Math.random() * bullets.length)];
    el.value += (el.value ? '\n' : '') + '• ' + randomBullet;

    // Trigger update
    updateEntry('experience', id);
    showToast('AI bullet point added!', 'success');
}

// ==========================================
// 7. PREVIEW RENDERING
// ==========================================

function renderPreview() {
    const container = document.getElementById('resume-preview');
    const { personal, summary, experience, education, skills, languages, template } = state;

    // Template Classes
    container.className = `resume-paper resume-template ${template}`;

    let html = '';

    // --- MODERN TEMPLATE ---
    if (template === 'modern') {
        html = `
            <div class="left-col">
                <div class="profile-section">
                    ${personal.photo ? `<img src="${personal.photo}" class="resume-photo">` : ''}
                    <h1 class="resume-name">${escapeHtml(personal.fullName)}</h1>
                    <p class="resume-title">${escapeHtml(personal.jobTitle)}</p>
                </div>
                
                <div class="contact-section">
                    <div class="section-title">Contact</div>
                    ${personal.email ? `<div class="contact-item">📧 ${escapeHtml(personal.email)}</div>` : ''}
                    ${personal.phone ? `<div class="contact-item">📱 ${escapeHtml(personal.phone)}</div>` : ''}
                    ${personal.location ? `<div class="contact-item">📍 ${escapeHtml(personal.location)}</div>` : ''}
                    ${personal.linkedin ? `<div class="contact-item">💼 ${escapeHtml(personal.linkedin)}</div>` : ''}
                </div>
                
                ${languages ? `
                <div class="languages-section">
                    <div class="section-title">Languages</div>
                    <div class="languages-list">
                        ${languages.split(',').map(l => `<div class="language-item">${escapeHtml(l.trim())}</div>`).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
            
            <div class="right-col">
                ${summary ? `
                <div class="resume-section">
                    <div class="section-title">Professional Summary</div>
                    <p>${escapeHtml(summary)}</p>
                </div>
                ` : ''}
                
                ${skills ? `
                <div class="resume-section">
                    <div class="section-title">Skills</div>
                    <div class="skills-list">
                        ${skills.split(',').map(s => `<span class="skill-tag">${escapeHtml(s.trim())}</span>`).join('')}
                    </div>
                </div>
                ` : ''}
                
                ${experience.length > 0 ? `
                <div class="resume-section">
                    <div class="section-title">Experience</div>
                    ${experience.map(exp => `
                        <div class="experience-item">
                            <div class="item-header">
                                <span class="item-title">${escapeHtml(exp.title)}</span>
                                <span class="item-date">${escapeHtml(exp.start)} - ${escapeHtml(exp.end)}</span>
                            </div>
                            <div class="item-subtitle">${escapeHtml(exp.company)}</div>
                            <div class="item-desc">${formatBullets(exp.description)}</div>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                
                ${education.length > 0 ? `
                <div class="resume-section">
                    <div class="section-title">Education</div>
                    ${education.map(edu => `
                        <div class="education-item">
                            <div class="item-header">
                                <span class="item-title">${escapeHtml(edu.degree)}</span>
                                <span class="item-date">${escapeHtml(edu.year)}</span>
                            </div>
                            <div class="item-subtitle">${escapeHtml(edu.school)}</div>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
            </div>
        `;
    }
    // --- MINIMAL TEMPLATE ---
    else if (template === 'minimal') {
        html = `
            <div class="header">
                <h1 class="resume-name">${escapeHtml(personal.fullName)}</h1>
                <p class="resume-title">${escapeHtml(personal.jobTitle)}</p>
                <div class="contact-row">
                    ${personal.email ? `<span>${escapeHtml(personal.email)}</span>` : ''}
                    ${personal.phone ? `<span> • ${escapeHtml(personal.phone)}</span>` : ''}
                    ${personal.location ? `<span> • ${escapeHtml(personal.location)}</span>` : ''}
                </div>
            </div>
            
            ${summary ? `
            <div class="resume-section">
                <div class="section-title">Summary</div>
                <p>${escapeHtml(summary)}</p>
            </div>
            ` : ''}
            
            ${experience.length > 0 ? `
            <div class="resume-section">
                <div class="section-title">Experience</div>
                ${experience.map(exp => `
                    <div class="experience-item">
                        <div class="item-header">
                            <span class="item-title">${escapeHtml(exp.title)}</span>
                            <span class="item-date">${escapeHtml(exp.start)} - ${escapeHtml(exp.end)}</span>
                        </div>
                        <div class="item-subtitle">${escapeHtml(exp.company)}</div>
                        <div class="item-desc">${formatBullets(exp.description)}</div>
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            ${education.length > 0 ? `
            <div class="resume-section">
                <div class="section-title">Education</div>
                ${education.map(edu => `
                    <div class="education-item">
                        <div class="item-header">
                            <span class="item-title">${escapeHtml(edu.school)}</span>
                            <span class="item-date">${escapeHtml(edu.year)}</span>
                        </div>
                        <div class="item-subtitle">${escapeHtml(edu.degree)}</div>
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            ${skills ? `
            <div class="resume-section">
                <div class="section-title">Skills</div>
                <p>${escapeHtml(skills)}</p>
            </div>
            ` : ''}
        `;
    }
    // --- PROFESSIONAL TEMPLATE ---
    else if (template === 'professional') {
        html = `
            <div class="header">
                <h1 class="resume-name" style="color: #2c3e50; border-bottom: 2px solid #2c3e50; padding-bottom: 10px;">${escapeHtml(personal.fullName)}</h1>
                <p class="resume-title" style="color: #7f8c8d; margin-top: 10px;">${escapeHtml(personal.jobTitle)}</p>
                <div class="contact-row" style="margin-top: 15px; font-size: 0.9rem;">
                    ${personal.email ? `<span>📧 ${escapeHtml(personal.email)}</span>` : ''}
                    ${personal.phone ? `<span> • 📱 ${escapeHtml(personal.phone)}</span>` : ''}
                    ${personal.location ? `<span> • 📍 ${escapeHtml(personal.location)}</span>` : ''}
                </div>
            </div>
            
            <div class="main-content" style="padding: 2rem 0;">
                ${summary ? `
                <div class="resume-section">
                    <div class="section-title" style="background: #ecf0f1; padding: 5px 10px; color: #2c3e50; font-weight: bold;">Professional Summary</div>
                    <p style="margin-top: 10px;">${escapeHtml(summary)}</p>
                </div>
                ` : ''}
                
                ${experience.length > 0 ? `
                <div class="resume-section">
                    <div class="section-title" style="background: #ecf0f1; padding: 5px 10px; color: #2c3e50; font-weight: bold;">Work Experience</div>
                    ${experience.map(exp => `
                        <div class="experience-item" style="margin-top: 15px; border-left: 3px solid #bdc3c7; padding-left: 15px;">
                            <div class="item-header" style="display: flex; justify-content: space-between;">
                                <span class="item-title" style="font-weight: bold; color: #2c3e50;">${escapeHtml(exp.title)}</span>
                                <span class="item-date" style="font-style: italic;">${escapeHtml(exp.start)} - ${escapeHtml(exp.end)}</span>
                            </div>
                            <div class="item-subtitle" style="color: #7f8c8d; font-weight: 600;">${escapeHtml(exp.company)}</div>
                            <div class="item-desc" style="margin-top: 5px;">${formatBullets(exp.description)}</div>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
            </div>
        `;
    }
    // --- CREATIVE TEMPLATE ---
    else if (template === 'creative') {
        html = `
            <div style="display: flex; height: 100%;">
                <div style="width: 30%; background: #ff6b6b; color: white; padding: 2rem; text-align: center;">
                    ${personal.photo ? `<img src="${personal.photo}" style="width: 120px; height: 120px; border-radius: 50%; border: 4px solid white; margin-bottom: 20px;">` : ''}
                    <h1 style="font-size: 1.8rem; margin-bottom: 10px;">${escapeHtml(personal.fullName)}</h1>
                    <p style="font-size: 1rem; opacity: 0.9; margin-bottom: 30px;">${escapeHtml(personal.jobTitle)}</p>
                    
                    <div style="text-align: left;">
                        <div style="margin-bottom: 20px;">
                            <div style="font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.5); padding-bottom: 5px; margin-bottom: 10px;">CONTACT</div>
                            <div style="font-size: 0.85rem; margin-bottom: 5px;">${escapeHtml(personal.email)}</div>
                            <div style="font-size: 0.85rem; margin-bottom: 5px;">${escapeHtml(personal.phone)}</div>
                            <div style="font-size: 0.85rem;">${escapeHtml(personal.location)}</div>
                        </div>
                        
                        ${skills ? `
                        <div>
                            <div style="font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.5); padding-bottom: 5px; margin-bottom: 10px;">SKILLS</div>
                            <div style="display: flex; flex-wrap: wrap; gap: 5px;">
                                ${skills.split(',').map(s => `<span style="background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">${escapeHtml(s.trim())}</span>`).join('')}
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
                <div style="width: 70%; padding: 3rem; background: #f7f7f7;">
                    ${summary ? `
                    <div style="margin-bottom: 30px;">
                        <h2 style="color: #ff6b6b; font-size: 1.2rem; border-bottom: 2px solid #ff6b6b; display: inline-block; padding-bottom: 5px; margin-bottom: 15px;">PROFILE</h2>
                        <p style="color: #555;">${escapeHtml(summary)}</p>
                    </div>
                    ` : ''}
                    
                    ${experience.length > 0 ? `
                    <div>
                        <h2 style="color: #ff6b6b; font-size: 1.2rem; border-bottom: 2px solid #ff6b6b; display: inline-block; padding-bottom: 5px; margin-bottom: 15px;">EXPERIENCE</h2>
                        ${experience.map(exp => `
                            <div style="margin-bottom: 20px;">
                                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                                    <h3 style="font-size: 1.1rem; color: #333; margin: 0;">${escapeHtml(exp.title)}</h3>
                                    <span style="font-size: 0.9rem; color: #888;">${escapeHtml(exp.start)} - ${escapeHtml(exp.end)}</span>
                                </div>
                                <div style="color: #ff6b6b; font-weight: 600; margin-bottom: 5px;">${escapeHtml(exp.company)}</div>
                                <div style="color: #666; font-size: 0.95rem;">${formatBullets(exp.description)}</div>
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
    // --- ATS TEMPLATE ---
    else if (template === 'ats') {
        html = `
            <div style="font-family: 'Times New Roman', Times, serif; color: black; padding: 2rem;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="font-size: 24px; text-transform: uppercase; margin-bottom: 5px;">${escapeHtml(personal.fullName)}</h1>
                    <p style="margin-bottom: 5px;">${escapeHtml(personal.location)} | ${escapeHtml(personal.phone)} | ${escapeHtml(personal.email)}</p>
                    <p>${escapeHtml(personal.linkedin)}</p>
                </div>
                
                ${summary ? `
                <div style="margin-bottom: 15px;">
                    <h2 style="font-size: 16px; text-transform: uppercase; border-bottom: 1px solid black; margin-bottom: 10px;">Professional Summary</h2>
                    <p>${escapeHtml(summary)}</p>
                </div>
                ` : ''}
                
                ${skills ? `
                <div style="margin-bottom: 15px;">
                    <h2 style="font-size: 16px; text-transform: uppercase; border-bottom: 1px solid black; margin-bottom: 10px;">Skills</h2>
                    <p>${escapeHtml(skills)}</p>
                </div>
                ` : ''}
                
                ${experience.length > 0 ? `
                <div style="margin-bottom: 15px;">
                    <h2 style="font-size: 16px; text-transform: uppercase; border-bottom: 1px solid black; margin-bottom: 10px;">Experience</h2>
                    ${experience.map(exp => `
                        <div style="margin-bottom: 10px;">
                            <div style="display: flex; justify-content: space-between; font-weight: bold;">
                                <span>${escapeHtml(exp.company)}</span>
                                <span>${escapeHtml(exp.start)} – ${escapeHtml(exp.end)}</span>
                            </div>
                            <div style="font-style: italic; margin-bottom: 5px;">${escapeHtml(exp.title)}</div>
                            <div>${formatBullets(exp.description)}</div>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                
                ${education.length > 0 ? `
                <div style="margin-bottom: 15px;">
                    <h2 style="font-size: 16px; text-transform: uppercase; border-bottom: 1px solid black; margin-bottom: 10px;">Education</h2>
                    ${education.map(edu => `
                        <div style="display: flex; justify-content: space-between;">
                            <span><strong>${escapeHtml(edu.school)}</strong>, ${escapeHtml(edu.degree)}</span>
                            <span>${escapeHtml(edu.year)}</span>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
            </div>
        `;
    }

    container.innerHTML = html;
}

// ==========================================
// 8. SMART QUESTIONS SYSTEM
// ==========================================

const SMART_QUESTIONS = [
    {
        id: 'role',
        question: "Describe your main role and responsibilities",
        hints: ["Led a team of...", "Managed project...", "Developed features..."]
    },
    {
        id: 'achievement',
        question: "What was your biggest achievement?",
        hints: ["Increased revenue by...", "Reduced costs by...", "Launched product..."]
    },
    {
        id: 'challenge',
        question: "Describe a challenge you overcame",
        hints: ["Resolved critical bug...", "Handled difficult client...", "Met tight deadline..."]
    }
];

function openAIHelper() {
    const modal = document.getElementById('ai-helper-modal');
    const questionEl = document.getElementById('helper-question');
    const variationsEl = document.getElementById('helper-variations');

    // Pick a random question for demo purposes
    const q = SMART_QUESTIONS[Math.floor(Math.random() * SMART_QUESTIONS.length)];

    questionEl.textContent = q.question;

    // Generate variations based on current profile
    const profile = JOB_PROFILES[state.jobProfile] || JOB_PROFILES['other'];
    const variations = [
        `Successfully ${q.hints[0].toLowerCase()} in a high-paced environment.`,
        `Demonstrated ability to ${q.hints[1].toLowerCase().replace('...', '')} resulting in improved performance.`,
        `Key player in ${q.hints[2].toLowerCase().replace('...', '')} ensuring high quality delivery.`
    ];

    variationsEl.innerHTML = variations.map(text => `
        <div class="suggestion-card" onclick="useAIHelperText('${escapeHtml(text)}')">
            <p class="suggestion-text">${text}</p>
            <div class="suggestion-action">+ Insert</div>
        </div>
    `).join('');

    modal.classList.add('show');
}

function closeAIHelper() {
    document.getElementById('ai-helper-modal').classList.remove('show');
}

function useAIHelperText(text) {
    const summary = document.getElementById('summary');
    summary.value += (summary.value ? ' ' : '') + text;
    updateResume();
    closeAIHelper();
    showToast('Text inserted!', 'success');
}

// ==========================================
// 9. PHOTO & GALLERY LOGIC
// ==========================================

function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            state.personal.photo = e.target.result;

            // Update UI
            document.getElementById('photo-img').src = e.target.result;
            document.getElementById('photo-img').style.display = 'block';
            document.querySelector('.photo-placeholder').style.display = 'none';
            document.getElementById('remove-photo-btn').style.display = 'inline-block';

            saveState();
            renderPreview();
        };
        reader.readAsDataURL(file);
    }
}

function removePhoto() {
    state.personal.photo = null;
    document.getElementById('photo-input').value = '';
    document.getElementById('photo-img').src = '';
    document.getElementById('photo-img').style.display = 'none';
    document.querySelector('.photo-placeholder').style.display = 'block';
    document.getElementById('remove-photo-btn').style.display = 'none';

    saveState();
    renderPreview();
}

function openTemplateGallery() {
    const modal = document.getElementById('template-modal');
    const grid = document.getElementById('template-gallery-grid');
    const templates = ['modern', 'minimal', 'professional', 'creative', 'ats'];

    grid.innerHTML = templates.map(t => `
        <div class="job-card ${state.template === t ? 'selected' : ''}" onclick="selectTemplate('${t}')">
            <div style="height: 150px; background: #eee; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; color: #888;">
                ${t.charAt(0).toUpperCase() + t.slice(1)} Preview
            </div>
            <h3>${t.charAt(0).toUpperCase() + t.slice(1)}</h3>
        </div>
    `).join('');

    modal.classList.add('show');
}

function closeTemplateGallery() {
    document.getElementById('template-modal').classList.remove('show');
}

function selectTemplate(t) {
    state.template = t;
    document.getElementById('template-selector').value = t;
    saveState();
    renderPreview();
    closeTemplateGallery();
    showToast(`${t.charAt(0).toUpperCase() + t.slice(1)} template selected!`);
}

// ==========================================
// 10. PHOTO CROP FUNCTIONALITY
// ==========================================

let originalImageData = null;
let cropZoom = 100;
let cropOffsetX = 0;
let cropOffsetY = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;

function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            originalImageData = e.target.result;
            openCropModal(e.target.result);
        };
        reader.readAsDataURL(file);
    }
}

function openCropModal(imageSrc) {
    const modal = document.getElementById('crop-modal');
    const cropImage = document.getElementById('crop-image');

    cropImage.src = imageSrc;
    cropZoom = 100;
    cropOffsetX = 0;
    cropOffsetY = 0;
    document.getElementById('crop-zoom').value = 100;

    updateCropTransform();

    // Setup drag events
    setupDragEvents();

    modal.classList.add('show');
}

function setupDragEvents() {
    const cropImage = document.getElementById('crop-image');
    const wrapper = document.getElementById('crop-wrapper');

    // Mouse events
    cropImage.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', endDrag);

    // Touch events for mobile
    cropImage.addEventListener('touchstart', startDragTouch);
    document.addEventListener('touchmove', onDragTouch);
    document.addEventListener('touchend', endDrag);
}

function startDrag(e) {
    e.preventDefault();
    isDragging = true;
    dragStartX = e.clientX - cropOffsetX;
    dragStartY = e.clientY - cropOffsetY;
}

function startDragTouch(e) {
    if (e.touches.length === 1) {
        isDragging = true;
        dragStartX = e.touches[0].clientX - cropOffsetX;
        dragStartY = e.touches[0].clientY - cropOffsetY;
    }
}

function onDrag(e) {
    if (!isDragging) return;
    e.preventDefault();
    cropOffsetX = e.clientX - dragStartX;
    cropOffsetY = e.clientY - dragStartY;
    updateCropTransform();
}

function onDragTouch(e) {
    if (!isDragging || e.touches.length !== 1) return;
    e.preventDefault();
    cropOffsetX = e.touches[0].clientX - dragStartX;
    cropOffsetY = e.touches[0].clientY - dragStartY;
    updateCropTransform();
}

function endDrag() {
    isDragging = false;
}

function updateCropTransform() {
    const cropImage = document.getElementById('crop-image');
    cropImage.style.transform = `translate(${cropOffsetX}px, ${cropOffsetY}px) scale(${cropZoom / 100})`;
}

function closeCropModal() {
    document.getElementById('crop-modal').classList.remove('show');
    isDragging = false;
}

function updateCropZoom(value) {
    cropZoom = parseInt(value);
    updateCropTransform();
}

function applyCrop() {
    const img = document.getElementById('crop-image');

    // Create canvas for cropping
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set output size
    const outputSize = 200;
    canvas.width = outputSize;
    canvas.height = outputSize;

    // Calculate the visible area based on zoom and offset
    const scale = cropZoom / 100;
    const containerSize = 300; // crop-preview-area size
    const circleSize = 200; // crop circle overlay size

    // Center of the container
    const centerX = containerSize / 2;
    const centerY = containerSize / 2;

    // Where the image is positioned
    const imgDisplayWidth = img.naturalWidth * scale;
    const imgDisplayHeight = img.naturalHeight * scale;

    // Image center position with offset
    const imgCenterX = centerX + cropOffsetX;
    const imgCenterY = centerY + cropOffsetY;

    // Calculate source coordinates (what part of original image to crop)
    const cropCenterX = (centerX - imgCenterX + imgDisplayWidth / 2) / scale;
    const cropCenterY = (centerY - imgCenterY + imgDisplayHeight / 2) / scale;

    const cropSize = circleSize / scale;
    const sx = cropCenterX - cropSize / 2;
    const sy = cropCenterY - cropSize / 2;

    // Draw circular crop
    ctx.beginPath();
    ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(img, sx, sy, cropSize, cropSize, 0, 0, outputSize, outputSize);

    // Get cropped data URL
    const croppedImage = canvas.toDataURL('image/jpeg', 0.9);

    // Update state and UI
    state.personal.photo = croppedImage;

    document.getElementById('photo-img').src = croppedImage;
    document.getElementById('photo-img').style.display = 'block';
    document.querySelector('.photo-placeholder').style.display = 'none';
    document.getElementById('remove-photo-btn').style.display = 'inline-block';

    saveState();
    renderPreview();
    closeCropModal();
    showToast('Photo cropped successfully!', 'success');
}

function removePhoto() {
    state.personal.photo = null;
    originalImageData = null;
    document.getElementById('photo-input').value = '';
    document.getElementById('photo-img').src = '';
    document.getElementById('photo-img').style.display = 'none';
    document.querySelector('.photo-placeholder').style.display = 'block';
    document.getElementById('remove-photo-btn').style.display = 'none';

    saveState();
    renderPreview();
}

// ==========================================
// 9. UTILITIES & HELPERS
// ==========================================

function restoreFormData() {
    const p = state.personal;
    document.getElementById('fullName').value = p.fullName;
    document.getElementById('jobTitle').value = p.jobTitle;
    document.getElementById('email').value = p.email;
    document.getElementById('phone').value = p.phone;
    document.getElementById('location').value = p.location;
    document.getElementById('linkedin').value = p.linkedin;
    document.getElementById('portfolio').value = p.portfolio;
    document.getElementById('github').value = p.github;

    document.getElementById('summary').value = state.summary;
    document.getElementById('skills').value = state.skills;
    document.getElementById('languages').value = state.languages;

    // Restore dynamic lists
    state.experience.forEach(item => addExperience(item));
    state.education.forEach(item => addEducation(item));

    // Restore Job Profile Selection
    if (state.jobProfile) {
        const card = document.querySelector(`.job-card[data-profile="${state.jobProfile}"]`);
        if (card) card.classList.add('selected');
    }
}

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatBullets(text) {
    if (!text) return '';
    return text.split('\n').map(line => {
        if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
            return `<div>${escapeHtml(line)}</div>`;
        }
        return `<div>${escapeHtml(line)}</div>`;
    }).join('');
}

function calculateScores() {
    let score = 0;
    if (state.personal.fullName) score += 10;
    if (state.personal.email) score += 10;
    if (state.summary.length > 50) score += 15;
    if (state.experience.length > 0) score += 25;
    if (state.education.length > 0) score += 15;
    if (state.skills.length > 10) score += 15;
    if (state.personal.linkedin) score += 10;

    // Update Circle
    const circle = document.getElementById('score-circle');
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (score / 100) * circumference;

    circle.style.strokeDashoffset = offset;
    document.getElementById('score-number').textContent = score;

    // Update ATS Score (Simulated)
    const atsScore = Math.min(100, Math.floor(score * 0.9 + (state.skills.split(',').length * 2)));
    document.getElementById('ats-score').textContent = atsScore + '%';
    document.getElementById('ats-fill').style.width = atsScore + '%';
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${type === 'success' ? '✅' : '⚠️'}</span> ${message}`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
    saveState();
}

function downloadResume() {
    const element = document.getElementById('resume-preview');
    const filename = state.personal.fullName ?
        `${state.personal.fullName.replace(/\s+/g, '_')}_Resume.pdf` :
        'Resume.pdf';

    const opt = {
        margin: [0, 0, 0, 0],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true
        },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        },
        pagebreak: {
            mode: ['avoid-all', 'css', 'legacy'],
            before: '.page-break-before',
            after: '.page-break-after',
            avoid: ['.experience-item', '.education-item', '.resume-section']
        }
    };

    showToast('Generating PDF...', 'success');

    html2pdf()
        .set(opt)
        .from(element)
        .save()
        .then(() => {
            showToast('PDF downloaded successfully!', 'success');
        })
        .catch(err => {
            showToast('Error generating PDF', 'error');
            console.error(err);
        });
}

function changeTemplate() {
    const selector = document.getElementById('template-selector');
    state.template = selector.value;
    saveState();
    renderPreview();
}

// ==========================================
// 11. PANEL TOGGLE (Expand/Collapse)
// ==========================================

function togglePanel(panelName) {
    const appMain = document.getElementById('app-main');
    const panelId = `${panelName}-panel`;
    const panel = document.getElementById(panelId);

    if (!panel) return;

    const isCollapsed = panel.classList.contains('collapsed');

    if (isCollapsed) {
        // Expand
        panel.classList.remove('collapsed');
        appMain.classList.remove(`${panelName}-collapsed`);
    } else {
        // Collapse
        panel.classList.add('collapsed');
        appMain.classList.add(`${panelName}-collapsed`);
    }

    // Update button icon
    const btn = panel.querySelector('.panel-toggle-btn');
    if (btn) {
        if (panelName === 'sidebar') {
            btn.textContent = isCollapsed ? '◀' : '▶';
        } else if (panelName === 'preview') {
            btn.textContent = isCollapsed ? '▶' : '◀';
        }
    }
}

// ==========================================
// 12. RESIZABLE PANELS
// ==========================================

let isResizing = false;
let currentDivider = null;
let startX = 0;
let startWidths = { sidebar: 280, form: 0, preview: 0 };

function startResize(e, dividerId) {
    e.preventDefault();
    isResizing = true;
    currentDivider = dividerId;
    startX = e.clientX;

    const appMain = document.getElementById('app-main');
    const sidebar = document.getElementById('sidebar-panel');
    const form = document.getElementById('form-panel');
    const preview = document.getElementById('preview-panel');

    startWidths = {
        sidebar: sidebar.offsetWidth,
        form: form.offsetWidth,
        preview: preview.offsetWidth
    };

    document.getElementById(dividerId).classList.add('dragging');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    document.addEventListener('mousemove', onResize);
    document.addEventListener('mouseup', stopResize);
}

function onResize(e) {
    if (!isResizing) return;

    const appMain = document.getElementById('app-main');
    const deltaX = e.clientX - startX;
    const totalWidth = appMain.offsetWidth - 12; // Subtract divider widths

    let sidebarWidth = startWidths.sidebar;
    let formWidth = startWidths.form;
    let previewWidth = startWidths.preview;

    if (currentDivider === 'divider-1') {
        // Resizing between sidebar and form
        sidebarWidth = Math.max(150, Math.min(400, startWidths.sidebar + deltaX));
        const remaining = totalWidth - sidebarWidth;
        const ratio = startWidths.form / (startWidths.form + startWidths.preview);
        formWidth = remaining * ratio;
        previewWidth = remaining * (1 - ratio);
    } else if (currentDivider === 'divider-2') {
        // Resizing between form and preview
        formWidth = Math.max(200, startWidths.form + deltaX);
        previewWidth = Math.max(200, startWidths.preview - deltaX);
    }

    // Apply new widths
    appMain.style.gridTemplateColumns = `${sidebarWidth}px 6px ${formWidth}px 6px ${previewWidth}px`;
}

function stopResize() {
    if (!isResizing) return;

    isResizing = false;
    document.getElementById(currentDivider).classList.remove('dragging');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';

    document.removeEventListener('mousemove', onResize);
    document.removeEventListener('mouseup', stopResize);

    currentDivider = null;
}