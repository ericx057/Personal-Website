// Ink Fluid Animation with Cursor Disruption
// Creates a dynamic ink disruption effect around the cursor

(function() {
    'use strict';
    
    // Create cursor disruption element
    const cursorDisruption = document.createElement('div');
    cursorDisruption.className = 'cursor-disruption';
    document.body.appendChild(cursorDisruption);
    
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    
    // Track mouse movement
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth animation using requestAnimationFrame
    function animate() {
        // Smooth following with easing
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;
        
        // Update cursor disruption position
        cursorDisruption.style.left = currentX + 'px';
        cursorDisruption.style.top = currentY + 'px';
        
        requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
    
    // Hide disruption when cursor leaves the window
    document.addEventListener('mouseleave', function() {
        cursorDisruption.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', function() {
        cursorDisruption.style.opacity = '1';
    });
})();
