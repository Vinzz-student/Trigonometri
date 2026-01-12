// COMPONENTS.JS - Reusable Components and Visualization Functions

// 1. DEGREE/RADIAN CONVERSION
function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}

function radToDeg(radians) {
    return radians * (180 / Math.PI);
}

// 2. TRIGONOMETRIC CALCULATIONS
function calculateTrigValues(angleDeg) {
    const angleRad = degToRad(angleDeg);
    
    // Handle special cases
    if (angleDeg % 90 === 0) {
        const sin = Math.sin(angleRad);
        const cos = Math.cos(angleRad);
        let tan;
        
        if (angleDeg % 180 === 90) {
            tan = angleDeg % 360 === 90 ? Infinity : -Infinity;
        } else {
            tan = Math.tan(angleRad);
        }
        
        return {
            sin: roundValue(sin),
            cos: roundValue(cos),
            tan: tan === Infinity || tan === -Infinity ? "∞" : roundValue(tan)
        };
    }
    
    return {
        sin: roundValue(Math.sin(angleRad)),
        cos: roundValue(Math.cos(angleRad)),
        tan: roundValue(Math.tan(angleRad))
    };
}

function roundValue(value, decimals = 3) {
    if (typeof value !== 'number') return value;
    const multiplier = Math.pow(10, decimals);
    return Math.round(value * multiplier) / multiplier;
}

// 3. CREATE MATH FORMULA COMPONENT
function createMathFormula(tex, size = 'normal') {
    const div = document.createElement('div');
    div.className = `math-formula ${size === 'large' ? 'large' : ''}`;
    div.textContent = tex;
    return div;
}

// 4. FUNGSI UNTUK MEMASTIKAN CANVAS SELALU UKURAN YANG TEPAT
function ensureProperCanvasSize(canvasId, desiredWidth = 400, desiredHeight = 350) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const container = canvas.parentElement;
    if (!container) return;
    
    // Jika container belum memiliki dimensi, tunggu sedikit
    if (container.clientWidth === 0 || container.clientHeight === 0) {
        setTimeout(() => ensureProperCanvasSize(canvasId, desiredWidth, desiredHeight), 50);
        return;
    }
    
    // Get computed style
    const style = getComputedStyle(container);
    const paddingX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    const paddingY = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    
    // Calculate available space
    const availableWidth = container.clientWidth - paddingX;
    const availableHeight = container.clientHeight - paddingY;
    
    // Hitung skala yang sesuai
    const widthScale = availableWidth / desiredWidth;
    const heightScale = availableHeight / desiredHeight;
    const scale = Math.min(widthScale, heightScale, 1); // Jangan lebih besar dari 1
    
    // Set canvas size
    canvas.width = desiredWidth * scale;
    canvas.height = desiredHeight * scale;
    canvas.style.width = (desiredWidth * scale) + 'px';
    canvas.style.height = (desiredHeight * scale) + 'px';
    
    // Return scale untuk digunakan dalam drawing
    return scale;
}

// 5. DRAW TRIANGLE VISUALIZATION - YANG SELALU TINGGI
function drawTriangle(canvasId, angleDeg) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    // Pastikan ukuran canvas sudah benar
    const scale = ensureProperCanvasSize(canvasId, 400, 350);
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas dengan background sesuai theme
    ctx.clearRect(0, 0, width, height);
    
    // Convert angle to radians
    const angleRad = degToRad(angleDeg);
    
    // Calculate triangle dimensions - beri ruang yang cukup
    const padding = Math.min(width, height) * 0.15; // 15% padding
    const maxTriangleHeight = (height - padding * 2) * 0.85; // 85% dari tinggi tersedia
    const triangleHeight = Math.sin(angleRad) * maxTriangleHeight;
    const triangleBase = Math.cos(angleRad) * maxTriangleHeight;
    
    // Starting point (center horizontally, cukup tinggi dari bawah)
    const startX = width / 2 - triangleBase / 2;
    const startY = height - padding - 30;
    
    // Triangle points
    const points = [
        { x: startX, y: startY }, // Bottom left (B)
        { x: startX + triangleBase, y: startY }, // Bottom right (C)
        { x: startX, y: startY - triangleHeight } // Top left (A)
    ];
    
    // Draw triangle
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.lineTo(points[2].x, points[2].y);
    ctx.closePath();
    
    // Fill triangle
    ctx.fillStyle = 'rgba(138, 43, 226, 0.15)';
    ctx.fill();
    
    // Draw triangle outline
    ctx.strokeStyle = '#8A2BE2';
    ctx.lineWidth = 2 * (scale || 1);
    ctx.stroke();
    
    // Draw right angle indicator
    ctx.beginPath();
    const angleSize = 15 * (scale || 1);
    ctx.moveTo(startX, startY - angleSize);
    ctx.lineTo(startX, startY);
    ctx.lineTo(startX + angleSize, startY);
    ctx.strokeStyle = '#FF6B6B';
    ctx.lineWidth = 1.5 * (scale || 1);
    ctx.stroke();
    
    // Label sides dengan font size yang sesuai
    ctx.fillStyle = '#E6E6FA';
    const baseFontSize = 14 * (scale || 1);
    ctx.font = `${Math.max(12, baseFontSize)}px Poppins`;
    ctx.textAlign = 'center';
    
    // Label opposite side
    const oppositeMidX = startX + 12 * (scale || 1);
    const oppositeMidY = startY - triangleHeight / 2;
    ctx.save();
    ctx.translate(oppositeMidX, oppositeMidY);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('depan', 0, 0);
    ctx.restore();
    
    // Label adjacent side
    const adjacentMidX = startX + triangleBase / 2;
    const adjacentMidY = startY + 25 * (scale || 1);
    ctx.fillText('samping', adjacentMidX, adjacentMidY);
    
    // Label hypotenuse
    const hypMidX = startX + triangleBase / 2;
    const hypMidY = startY - triangleHeight / 2 - 25 * (scale || 1);
    const hypAngle = Math.atan2(triangleHeight, triangleBase);
    ctx.save();
    ctx.translate(hypMidX, hypMidY);
    ctx.rotate(hypAngle);
    ctx.fillText('miring', 0, 0);
    ctx.restore();
    
    // Draw angle arc
    const arcRadius = 35 * (scale || 1);
    ctx.beginPath();
    ctx.arc(startX, startY, arcRadius, 0, angleRad, false);
    ctx.strokeStyle = '#FF6B6B';
    ctx.lineWidth = 2 * (scale || 1);
    ctx.stroke();
    
    // Label angle
    ctx.fillStyle = '#FF6B6B';
    ctx.font = `bold ${Math.max(14, 16 * (scale || 1))}px Poppins`;
    ctx.textAlign = 'left';
    const labelX = startX + arcRadius * Math.cos(angleRad / 2);
    const labelY = startY - arcRadius * Math.sin(angleRad / 2) - 10 * (scale || 1);
    ctx.fillText('θ', labelX, labelY);
    
    // Label points
    ctx.fillStyle = '#E6E6FA';
    ctx.font = `bold ${Math.max(12, 14 * (scale || 1))}px Poppins`;
    ctx.fillText('A', points[2].x - 20 * (scale || 1), points[2].y - 15 * (scale || 1));
    ctx.fillText('B', points[0].x - 25 * (scale || 1), points[0].y + 30 * (scale || 1));
    ctx.fillText('C', points[1].x + 15 * (scale || 1), points[1].y + 30 * (scale || 1));
    
    // Show current angle
    ctx.fillStyle = '#B0B0D0';
    ctx.font = `${Math.max(11, 12 * (scale || 1))}px Roboto Mono`;
    ctx.textAlign = 'right';
    ctx.fillText(`θ = ${angleDeg}°`, width - padding / 2, height - padding / 2);
}

// 6. DRAW UNIT CIRCLE VISUALIZATION
function drawUnitCircle(canvasId, angleDeg) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    // Pastikan ukuran canvas sudah benar
    const scale = ensureProperCanvasSize(canvasId, 350, 350);
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 25 * (scale || 1);
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Convert angle to radians
    const angleRad = degToRad(angleDeg);
    
    // Draw circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(192, 192, 224, 0.3)';
    ctx.lineWidth = 2 * (scale || 1);
    ctx.stroke();
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(centerX - radius - 15 * (scale || 1), centerY);
    ctx.lineTo(centerX + radius + 15 * (scale || 1), centerY);
    ctx.moveTo(centerX, centerY - radius - 15 * (scale || 1));
    ctx.lineTo(centerX, centerY + radius + 15 * (scale || 1));
    ctx.strokeStyle = 'rgba(176, 176, 208, 0.5)';
    ctx.lineWidth = 1 * (scale || 1);
    ctx.stroke();
    
    // Draw angle line
    const pointX = centerX + radius * Math.cos(angleRad);
    const pointY = centerY - radius * Math.sin(angleRad);
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(pointX, pointY);
    ctx.strokeStyle = '#8A2BE2';
    ctx.lineWidth = 2 * (scale || 1);
    ctx.stroke();
    
    // Draw point on circle
    ctx.beginPath();
    ctx.arc(pointX, pointY, 6 * (scale || 1), 0, 2 * Math.PI);
    ctx.fillStyle = '#8A2BE2';
    ctx.fill();
    
    // Draw angle arc
    const arcRadius = radius * 0.3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, arcRadius, 0, angleRad, false);
    ctx.strokeStyle = '#FF6B6B';
    ctx.lineWidth = 2 * (scale || 1);
    ctx.stroke();
    
    // Draw triangle for sin/cos visualization
    ctx.beginPath();
    ctx.moveTo(pointX, pointY);
    ctx.lineTo(pointX, centerY);
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    ctx.strokeStyle = 'rgba(138, 43, 226, 0.3)';
    ctx.fillStyle = 'rgba(138, 43, 226, 0.1)';
    ctx.lineWidth = 1 * (scale || 1);
    ctx.stroke();
    ctx.fill();
    
    // Label cos (adjacent)
    const cosX = (centerX + pointX) / 2;
    const cosY = centerY + 20 * (scale || 1);
    ctx.fillStyle = '#00CED1';
    ctx.font = `bold ${Math.max(12, 13 * (scale || 1))}px Roboto Mono`;
    ctx.textAlign = 'center';
    ctx.fillText('cos θ', cosX, cosY);
    
    // Label sin (opposite)
    const sinX = pointX + 18 * (scale || 1);
    const sinY = (centerY + pointY) / 2;
    ctx.fillText('sin θ', sinX, sinY);
    
    // Label point coordinates
    const cosValue = roundValue(Math.cos(angleRad));
    const sinValue = roundValue(Math.sin(angleRad));
    ctx.fillStyle = '#B0B0D0';
    ctx.font = `${Math.max(11, 12 * (scale || 1))}px Roboto Mono`;
    ctx.fillText(`(${cosValue}, ${sinValue})`, pointX, pointY - 20 * (scale || 1));
    
    // Label angle
    ctx.fillStyle = '#FF6B6B';
    ctx.font = `bold ${Math.max(14, 16 * (scale || 1))}px Poppins`;
    const labelX = centerX + arcRadius * Math.cos(angleRad / 2) * 1.2;
    const labelY = centerY - arcRadius * Math.sin(angleRad / 2) * 1.2;
    ctx.fillText(`${angleDeg}°`, labelX, labelY);
    
    // Draw axes labels
    ctx.fillStyle = '#8A8AAA';
    ctx.font = `bold ${Math.max(11, 12 * (scale || 1))}px Poppins`;
    ctx.fillText('1', centerX + radius + 22 * (scale || 1), centerY + 6 * (scale || 1));
    ctx.fillText('-1', centerX - radius - 25 * (scale || 1), centerY + 6 * (scale || 1));
    ctx.fillText('1', centerX - 6 * (scale || 1), centerY - radius - 15 * (scale || 1));
    ctx.fillText('-1', centerX - 12 * (scale || 1), centerY + radius + 25 * (scale || 1));
    ctx.fillText('0', centerX + 6 * (scale || 1), centerY + 20 * (scale || 1));
}

// 7. UPDATE CALCULATOR DISPLAY
function updateCalculatorDisplay(angleDeg) {
    const trigValues = calculateTrigValues(angleDeg);
    
    document.getElementById('sinValue').textContent = trigValues.sin;
    document.getElementById('cosValue').textContent = trigValues.cos;
    document.getElementById('tanValue').textContent = trigValues.tan;
    
    // Update unit circle info if elements exist
    const circleSin = document.getElementById('circleSin');
    const circleCos = document.getElementById('circleCos');
    const circleCoords = document.getElementById('circleCoords');
    
    if (circleSin && circleCos && circleCoords) {
        circleSin.textContent = trigValues.sin;
        circleCos.textContent = trigValues.cos;
        circleCoords.textContent = `(${trigValues.cos}, ${trigValues.sin})`;
    }
}

// 8. CREATE CARD COMPONENT
function createCard(title, content, icon = 'fas fa-info-circle', color = 'blue') {
    const colors = {
        blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' },
        coral: { bg: 'bg-coral-50', border: 'border-coral-200', text: 'text-coral' },
        green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600' }
    };
    
    const colorSet = colors[color] || colors.blue;
    
    const cardHTML = `
        <div class="card ${colorSet.bg} ${colorSet.border} border-l-4">
            <div class="card-header">
                <i class="${icon} ${colorSet.text}"></i>
                <h3>${title}</h3>
            </div>
            <div class="card-body">
                ${content}
            </div>
        </div>
    `;
    
    return cardHTML;
}

// 9. FUNCTION UNTUK INISIALISASI VISUALISASI DENGAN UKURAN YANG BENAR
function initializeVisualizations() {
    // Set timeout untuk memastikan DOM sudah sepenuhnya render
    setTimeout(() => {
        // Inisialisasi triangle canvas
        const triangleCanvas = document.getElementById('triangleCanvas');
        if (triangleCanvas) {
            ensureProperCanvasSize('triangleCanvas', 400, 350);
            drawTriangle('triangleCanvas', 30);
        }
        
        // Inisialisasi unit circle canvas
        const unitCircleCanvas = document.getElementById('unitCircleCanvas');
        if (unitCircleCanvas) {
            ensureProperCanvasSize('unitCircleCanvas', 350, 350);
            drawUnitCircle('unitCircleCanvas', 0);
        }
        
        // Update calculator display
        updateCalculatorDisplay(30);
    }, 100);
}

// 10. FUNCTION UNTUK MENGUPDATE VISUALISASI KETIKA PAGE BERUBAH
function updatePageVisualizations(pageId) {
    setTimeout(() => {
        if (pageId === 'perbandingan') {
            // Pastikan triangle canvas ukurannya benar
            ensureProperCanvasSize('triangleCanvas', 400, 350);
            
            // Update triangle visualization dengan current slider value
            const slider = document.getElementById('angleSlider');
            if (slider) {
                const angle = parseInt(slider.value);
                drawTriangle('triangleCanvas', angle);
            }
        }
        
        if (pageId === 'sudut-istimewa') {
            // Pastikan unit circle canvas ukurannya benar
            ensureProperCanvasSize('unitCircleCanvas', 350, 350);
            
            // Update unit circle dengan active angle button
            const activeAngleBtn = document.querySelector('.angle-btn.active');
            if (activeAngleBtn) {
                drawUnitCircle('unitCircleCanvas', parseInt(activeAngleBtn.dataset.angle));
            } else {
                // Default jika tidak ada yang aktif
                drawUnitCircle('unitCircleCanvas', 0);
            }
        }
    }, 50);
}

// 11. FUNCTION UNTUK HANDLE RESIZE WINDOW
function handleWindowResize() {
    // Update triangle jika di page perbandingan
    const triangleCanvas = document.getElementById('triangleCanvas');
    if (triangleCanvas && triangleCanvas.closest('.page.active')?.id === 'perbandingan') {
        ensureProperCanvasSize('triangleCanvas', 400, 350);
        const slider = document.getElementById('angleSlider');
        if (slider) {
            drawTriangle('triangleCanvas', parseInt(slider.value));
        }
    }
    
    // Update unit circle jika di page sudut-istimewa
    const unitCircleCanvas = document.getElementById('unitCircleCanvas');
    if (unitCircleCanvas && unitCircleCanvas.closest('.page.active')?.id === 'sudut-istimewa') {
        ensureProperCanvasSize('unitCircleCanvas', 350, 350);
        const activeAngleBtn = document.querySelector('.angle-btn.active');
        if (activeAngleBtn) {
            drawUnitCircle('unitCircleCanvas', parseInt(activeAngleBtn.dataset.angle));
        }
    }
}

// 12. EXPORT FUNCTIONS
window.Components = {
    degToRad,
    radToDeg,
    calculateTrigValues,
    createMathFormula,
    drawTriangle,
    drawUnitCircle,
    updateCalculatorDisplay,
    createCard,
    initializeVisualizations,
    updatePageVisualizations,
    ensureProperCanvasSize,
    handleWindowResize
};

// HAPUS SEMUA KODE DI BAWAH INI YANG MEMBUAT KONFLIK:
// ----------------------------------------------------
// SOLUSI ALTERNATIF - SEMUANYA DI SATU TEMPAT
// document.addEventListener('DOMContentLoaded', function() {
//     ... (HAPUS SEMUA KODE DI DALAM INI) ...
// });

// SOLUSI EKSTREM - Reset semua event listeners
// function resetCalculatorInput() {
//     ... (HAPUS SEMUA KODE DI DALAM INI) ...
// }
// ----------------------------------------------------
