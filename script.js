// SCRIPT.JS - Main Application Logic

// 1. DOM ELEMENTS
let currentPage = 'beranda';

// 2. PAGE MANAGEMENT
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const pageElement = document.getElementById(pageId);
    if (pageElement) {
        pageElement.classList.add('active');
        currentPage = pageId;
        
        // Update URL hash
        window.location.hash = pageId;
        
        // Scroll to top
        window.scrollTo(0, 0);
    }
    
    // Update active navigation
    updateActiveNav(pageId);
    
    // Update visualizations if needed
    updatePageVisualizations(pageId);
}

function hideAllPages() {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
}

function updateActiveNav(pageId) {
    // Update desktop nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.page === pageId) {
            btn.classList.add('active');
        }
    });
    
    // Update mobile nav buttons
    document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.page === pageId) {
            btn.classList.add('active');
        }
    });
    
    // Update sidebar buttons
    document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.page === pageId) {
            btn.classList.add('active');
        }
    });
}

function updatePageVisualizations(pageId) {
    switch(pageId) {
        case 'perbandingan':
            // Update triangle visualization with current slider value
            const slider = document.getElementById('angleSlider');
            if (slider) {
                const angle = parseInt(slider.value);
                Components.drawTriangle('triangleCanvas', angle);
            }
            break;
            
        case 'sudut-istimewa':
            // Update unit circle with active angle button
            const activeAngleBtn = document.querySelector('.angle-btn.active');
            if (activeAngleBtn) {
                const angle = parseInt(activeAngleBtn.dataset.angle);
                Components.drawUnitCircle('unitCircleCanvas', angle);
                Components.updateCalculatorDisplay(angle);
            }
            break;
            
        default:
            // No special visualization needed for other pages
            break;
    }
}

// 3. EVENT LISTENERS SETUP
function setupEventListeners() {
    // Desktop navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            showPage(btn.dataset.page);
        });
    });
    
    // Mobile navigation buttons
    document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            showPage(btn.dataset.page);
            // Hide mobile menu after selection
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu) {
                mobileMenu.classList.add('hidden');
            }
        });
    });
    
    // Sidebar navigation buttons
    document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            showPage(btn.dataset.page);
        });
    });
    
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu) {
                mobileMenu.classList.toggle('hidden');
            }
        });
    }
    
    // Calculator button
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', () => {
            const angleInput = document.getElementById('angleInput');
            if (angleInput) {
                const angle = parseFloat(angleInput.value);
                if (!isNaN(angle)) {
                    Components.updateCalculatorDisplay(angle);
                    
                    // Also update triangle visualization if we're on that page
                    if (currentPage === 'perbandingan') {
                        const slider = document.getElementById('angleSlider');
                        if (slider) {
                            slider.value = Math.min(Math.max(angle, 1), 89);
                            document.getElementById('angleValue').textContent = `${slider.value}°`;
                            Components.drawTriangle('triangleCanvas', slider.value);
                        }
                    }
                    
                    // Update unit circle if we're on that page
                    if (currentPage === 'sudut-istimewa') {
                        Components.drawUnitCircle('unitCircleCanvas', angle);
                        
                        // Update angle buttons
                        document.querySelectorAll('.angle-btn').forEach(btn => {
                            btn.classList.remove('active');
                        });
                    }
                }
            }
        });
    }
    
    // Triangle angle slider
    const angleSlider = document.getElementById('angleSlider');
    if (angleSlider) {
        angleSlider.addEventListener('input', () => {
            const angle = parseInt(angleSlider.value);
            document.getElementById('angleValue').textContent = `${angle}°`;
            Components.drawTriangle('triangleCanvas', angle);
            Components.updateCalculatorDisplay(angle);
        });
    }
    
    // Unit circle angle buttons
    document.querySelectorAll('.angle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            document.querySelectorAll('.angle-btn').forEach(b => {
                b.classList.remove('active');
            });
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Update unit circle
            const angle = parseInt(btn.dataset.angle);
            Components.drawUnitCircle('unitCircleCanvas', angle);
            Components.updateCalculatorDisplay(angle);
        });
    });
    
    // Handle URL hash on page load
    window.addEventListener('load', () => {
        const hash = window.location.hash.substring(1);
        const validPages = ['beranda', 'perbandingan', 'identitas', 'sudut-istimewa', 'aturan', 'contoh-soal'];
        
        if (hash && validPages.includes(hash)) {
            showPage(hash);
        } else {
            showPage('beranda');
        }
        
        // Initialize AOS
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                once: true,
                offset: 100
            });
        }
        
        // Initialize visualizations
        Components.initializeVisualizations();
        
        // Initialize MathJax
        if (window.MathJax) {
            MathJax.typesetPromise();
        }
    });

    wwindow.addEventListener('resize', () => {
        Components.handleWindowResize();
    });
    
    // Re-render MathJax when switching pages
    document.querySelectorAll('[data-page]').forEach(btn => {
        btn.addEventListener('click', () => {
            setTimeout(() => {
                if (window.MathJax) {
                    MathJax.typesetPromise();
                }
            }, 100);
        });
    });
    
    // Handle window resize for responsive design
    window.addEventListener('resize', () => {
        // Redraw visualizations on resize
        if (currentPage === 'perbandingan') {
            const slider = document.getElementById('angleSlider');
            if (slider) {
                Components.drawTriangle('triangleCanvas', parseInt(slider.value));
            }
        }
        
        if (currentPage === 'sudut-istimewa') {
            const activeAngleBtn = document.querySelector('.angle-btn.active');
            if (activeAngleBtn) {
                Components.drawUnitCircle('unitCircleCanvas', parseInt(activeAngleBtn.dataset.angle));
            }
        }
    });
}

// 4. FILL FOOTER WITH GROUP MEMBERS
function initializeFooter() {
    // Replace these with actual group member names
    const groupMembers = [
        "Hafidz Rifky P. A.",
        "Reynando Andre A.", 
        "Fajar Kencana M. D.",
        "Satria Anggara P."
    ];
    
    const membersList = document.querySelector('.members-list');
    if (membersList) {
        membersList.innerHTML = '';
        groupMembers.forEach(member => {
            const memberDiv = document.createElement('div');
            memberDiv.className = 'member';
            memberDiv.textContent = member;
            membersList.appendChild(memberDiv);
        });
    }
}

// 5. INITIALIZE APPLICATION
function initializeApp() {
    setupEventListeners();
    initializeFooter();
    
    // Set default page if no hash in URL
    if (!window.location.hash) {
        showPage('beranda');
    }
}

// 6. START THE APPLICATION
document.addEventListener('DOMContentLoaded', initializeApp);

// 7. MAKE FUNCTIONS GLOBALLY AVAILABLE
window.App = {
    showPage,
    hideAllPages,
    updateActiveNav
};
