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

// 3. FUNGSI UNTUK MENANGANI INPUT KALKULATOR
function setupCalculatorInput() {
    const angleInput = document.getElementById('angleInput');
    const incrementBtn = document.querySelector('.increment-btn');
    const decrementBtn = document.querySelector('.decrement-btn');
    const calculateBtn = document.getElementById('calculateBtn');

    if (!angleInput) return;

    // Fungsi untuk memvalidasi dan memperbarui nilai
    function validateAndUpdate() {
        let value = angleInput.value.trim();
        
        // Jika kosong, set ke 30 (default)
        if (value === '') {
            angleInput.value = '30';
            value = '30';
        }
        
        // Konversi ke angka
        let num = Number(value);
        
        // Jika bukan angka, set ke default
        if (isNaN(num)) {
            angleInput.value = '30';
            num = 30;
        }
        
        // Batasi range antara 1 dan 360
        if (num < 1) {
            angleInput.value = '1';
            num = 1;
        } else if (num > 360) {
            angleInput.value = '360';
            num = 360;
        }
        
        // Perbarui kalkulator
        Components.updateCalculatorDisplay(num);
        
        // Perbarui visualisasi jika diperlukan
        if (currentPage === 'perbandingan') {
            const slider = document.getElementById('angleSlider');
            if (slider) {
                // Untuk segitiga, batasi antara 1-89 derajat
                const triangleAngle = Math.min(Math.max(num, 1), 89);
                slider.value = triangleAngle;
                document.getElementById('angleValue').textContent = `${triangleAngle}°`;
                Components.drawTriangle('triangleCanvas', triangleAngle);
            }
        }
        
        if (currentPage === 'sudut-istimewa') {
            Components.drawUnitCircle('unitCircleCanvas', num);
        }
    }

    // Event untuk input biasa
    angleInput.addEventListener('input', function() {
        // Biarkan user mengetik angka apa saja
        // Validasi akan dilakukan saat kehilangan fokus
    });

    // Event saat kehilangan fokus (blur)
    angleInput.addEventListener('blur', validateAndUpdate);

    // Event untuk tombol Enter
    angleInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            validateAndUpdate();
        }
    });

    // Tombol increment
    if (incrementBtn) {
        incrementBtn.addEventListener('click', function(e) {
            e.preventDefault();
            let currentValue = Number(angleInput.value) || 30;
            if (currentValue < 360) {
                angleInput.value = currentValue + 1;
                validateAndUpdate();
            }
        });
    }

    // Tombol decrement
    if (decrementBtn) {
        decrementBtn.addEventListener('click', function(e) {
            e.preventDefault();
            let currentValue = Number(angleInput.value) || 30;
            if (currentValue > 1) {
                angleInput.value = currentValue - 1;
                validateAndUpdate();
            }
        });
    }

    // Tombol hitung
    if (calculateBtn) {
        calculateBtn.addEventListener('click', validateAndUpdate);
    }

    // Tombol keyboard atas/bawah
    angleInput.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            let currentValue = Number(angleInput.value) || 30;
            if (currentValue < 360) {
                angleInput.value = currentValue + 1;
                validateAndUpdate();
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            let currentValue = Number(angleInput.value) || 30;
            if (currentValue > 1) {
                angleInput.value = currentValue - 1;
                validateAndUpdate();
            }
        }
    });
}

// 4. EVENT LISTENERS SETUP
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
    
    // Setup calculator input dengan benar
    setupCalculatorInput();
    
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

    window.addEventListener('resize', () => {
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

// 5. FILL FOOTER WITH GROUP MEMBERS
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

// 6. INITIALIZE APPLICATION
function initializeApp() {
    setupEventListeners();
    initializeFooter();
    
    // Set default page if no hash in URL
    if (!window.location.hash) {
        showPage('beranda');
    }
}

// 7. START THE APPLICATION
document.addEventListener('DOMContentLoaded', initializeApp);

// 8. MAKE FUNCTIONS GLOBALLY AVAILABLE
window.App = {
    showPage,
    hideAllPages,
    updateActiveNav
};
