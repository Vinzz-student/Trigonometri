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

// 4. DRAW TRIANGLE VISUALIZATION
function drawTriangle(canvasId, angleDeg) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Convert angle to radians
    const angleRad = degToRad(angleDeg);
    
    // Calculate triangle dimensions
    const triangleHeight = Math.sin(angleRad) * (width - padding * 2);
    const triangleBase = Math.cos(angleRad) * (width - padding * 2);
    
    // Starting point (bottom left)
    const startX = padding;
    const startY = height - padding;
    
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
    ctx.fillStyle = 'rgba(37, 99, 235, 0.1)';
    ctx.fill();
    
    // Draw triangle outline
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw right angle indicator
    ctx.beginPath();
    const angleSize = 15;
    ctx.moveTo(startX, startY - angleSize);
    ctx.lineTo(startX, startY);
    ctx.lineTo(startX + angleSize, startY);
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // Label sides
    ctx.fillStyle = '#1e293b';
    ctx.font = '14px Roboto Mono';
    ctx.textAlign = 'center';
    
    // Label opposite side
    const oppositeMidX = startX + 10;
    const oppositeMidY = startY - triangleHeight / 2;
    ctx.save();
    ctx.translate(oppositeMidX, oppositeMidY);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('depan', 0, 0);
    ctx.restore();
    
    // Label adjacent side
    const adjacentMidX = startX + triangleBase / 2;
    const adjacentMidY = startY + 15;
    ctx.fillText('samping', adjacentMidX, adjacentMidY);
    
    // Label hypotenuse
    const hypMidX = startX + triangleBase / 2;
    const hypMidY = startY - triangleHeight / 2 - 15;
    const hypAngle = Math.atan2(triangleHeight, triangleBase);
    ctx.save();
    ctx.translate(hypMidX, hypMidY);
    ctx.rotate(hypAngle);
    ctx.fillText('miring', 0, 0);
    ctx.restore();
    
    // Draw angle arc
    const arcRadius = 30;
    ctx.beginPath();
    ctx.arc(startX, startY, arcRadius, 0, angleRad, false);
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Label angle
    ctx.fillStyle = '#ff6b6b';
    ctx.font = 'bold 16px Poppins';
    ctx.textAlign = 'left';
    const labelX = startX + arcRadius * Math.cos(angleRad / 2);
    const labelY = startY - arcRadius * Math.sin(angleRad / 2) - 5;
    ctx.fillText('θ', labelX, labelY);
    
    // Label points
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 14px Poppins';
    ctx.fillText('A', points[2].x - 15, points[2].y - 10);
    ctx.fillText('B', points[0].x - 20, points[0].y + 20);
    ctx.fillText('C', points[1].x + 10, points[1].y + 20);
    
    // Show current angle
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Roboto Mono';
    ctx.textAlign = 'right';
    ctx.fillText(`θ = ${angleDeg}°`, width - padding, height - padding);
}

// 5. DRAW UNIT CIRCLE VISUALIZATION
function drawUnitCircle(canvasId, angleDeg) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Convert angle to radians
    const angleRad = degToRad(angleDeg);
    
    // Draw circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(centerX - radius - 10, centerY);
    ctx.lineTo(centerX + radius + 10, centerY);
    ctx.moveTo(centerX, centerY - radius - 10);
    ctx.lineTo(centerX, centerY + radius + 10);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Draw angle line
    const pointX = centerX + radius * Math.cos(angleRad);
    const pointY = centerY - radius * Math.sin(angleRad); // Negative because canvas Y increases downward
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(pointX, pointY);
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw point on circle
    ctx.beginPath();
    ctx.arc(pointX, pointY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#2563eb';
    ctx.fill();
    
    // Draw angle arc
    const arcRadius = radius * 0.3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, arcRadius, 0, angleRad, false);
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw triangle for sin/cos visualization
    ctx.beginPath();
    ctx.moveTo(pointX, pointY);
    ctx.lineTo(pointX, centerY);
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    ctx.strokeStyle = 'rgba(37, 99, 235, 0.3)';
    ctx.fillStyle = 'rgba(37, 99, 235, 0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fill();
    
    // Label cos (adjacent)
    const cosX = (centerX + pointX) / 2;
    const cosY = centerY + 15;
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 12px Roboto Mono';
    ctx.textAlign = 'center';
    ctx.fillText('cos θ', cosX, cosY);
    
    // Label sin (opposite)
    const sinX = pointX + 15;
    const sinY = (centerY + pointY) / 2;
    ctx.fillText('sin θ', sinX, sinY);
    
    // Label point coordinates
    const cosValue = roundValue(Math.cos(angleRad));
    const sinValue = roundValue(Math.sin(angleRad));
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Roboto Mono';
    ctx.fillText(`(${cosValue}, ${sinValue})`, pointX, pointY - 15);
    
    // Label angle
    ctx.fillStyle = '#ff6b6b';
    ctx.font = 'bold 14px Poppins';
    const labelX = centerX + arcRadius * Math.cos(angleRad / 2) * 1.2;
    const labelY = centerY - arcRadius * Math.sin(angleRad / 2) * 1.2;
    ctx.fillText(`${angleDeg}°`, labelX, labelY);
    
    // Draw axes labels
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 12px Poppins';
    ctx.fillText('1', centerX + radius + 15, centerY + 5);
    ctx.fillText('-1', centerX - radius - 20, centerY + 5);
    ctx.fillText('1', centerX - 5, centerY - radius - 10);
    ctx.fillText('-1', centerX - 10, centerY + radius + 20);
    ctx.fillText('0', centerX + 5, centerY + 15);
}

// 6. UPDATE CALCULATOR DISPLAY
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

// 7. CREATE CARD COMPONENT
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

// 8. INITIALIZE VISUALIZATIONS
function initializeVisualizations() {
    // Initial triangle drawing
    const initialAngle = 30;
    drawTriangle('triangleCanvas', initialAngle);
    
    // Initial unit circle drawing
    drawUnitCircle('unitCircleCanvas', 0);
    
    // Initial calculator display
    updateCalculatorDisplay(30);
}

// 9. EXPORT FUNCTIONS (if using modules)
// For now, we'll make them available globally
window.Components = {
    degToRad,
    radToDeg,
    calculateTrigValues,
    createMathFormula,
    drawTriangle,
    drawUnitCircle,
    updateCalculatorDisplay,
    createCard,
    initializeVisualizations
};

// Tambahkan fungsi untuk resize canvas di components.js
function resizeCanvasToContainer(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const container = canvas.parentElement;
    if (!container) return;
    
    // Get computed style to account for padding
    const style = getComputedStyle(container);
    const paddingX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    const paddingY = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    
    // Calculate available space
    const availableWidth = container.clientWidth - paddingX;
    const availableHeight = container.clientHeight - paddingY;
    
    // Set canvas size (maintain aspect ratio for visualizations)
    if (canvasId === 'triangleCanvas') {
        const aspectRatio = 400 / 300; // Original aspect ratio
        const width = Math.min(availableWidth, 400);
        const height = width / aspectRatio;
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
    } else if (canvasId === 'unitCircleCanvas') {
        const size = Math.min(availableWidth, 350);
        canvas.width = size;
        canvas.height = size;
        canvas.style.width = size + 'px';
        canvas.style.height = size + 'px';
    }
}

// Update initializeVisualizations function
function initializeVisualizations() {
    // Initial triangle drawing
    const initialAngle = 30;
    resizeCanvasToContainer('triangleCanvas');
    drawTriangle('triangleCanvas', initialAngle);
    
    // Initial unit circle drawing
    resizeCanvasToContainer('unitCircleCanvas');
    drawUnitCircle('unitCircleCanvas', 0);
    
    // Initial calculator display
    updateCalculatorDisplay(30);
}

// Add resize listener
window.addEventListener('resize', () => {
    if (currentPage === 'perbandingan') {
        resizeCanvasToContainer('triangleCanvas');
        const slider = document.getElementById('angleSlider');
        if (slider) {
            drawTriangle('triangleCanvas', parseInt(slider.value));
        }
    }
    
    if (currentPage === 'sudut-istimewa') {
        resizeCanvasToContainer('unitCircleCanvas');
        const activeAngleBtn = document.querySelector('.angle-btn.active');
        if (activeAngleBtn) {
            drawUnitCircle('unitCircleCanvas', parseInt(activeAngleBtn.dataset.angle));
        }
    }
});