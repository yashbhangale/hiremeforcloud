document.addEventListener('DOMContentLoaded', function() {
  console.log('Custom cursor script loaded');
  
  // Create cursor elements
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.style.position = 'fixed';
  cursor.style.pointerEvents = 'none';
  cursor.style.zIndex = '99999';
  cursor.style.width = '30px';
  cursor.style.height = '30px';
  
  const cursorDot = document.createElement('div');
  cursorDot.className = 'cursor-dot';
  
  const cursorRing = document.createElement('div');
  cursorRing.className = 'cursor-ring';
  
  const cursorGlow = document.createElement('div');
  cursorGlow.className = 'cursor-glow';
  
  // Append cursor elements
  cursor.appendChild(cursorDot);
  cursor.appendChild(cursorRing);
  cursor.appendChild(cursorGlow);
  document.body.appendChild(cursor);
  
  console.log('Cursor elements created and appended to body');
  
  // Make sure cursor is visible initially
  cursor.style.opacity = '1';
  
  // Set initial position to center of screen
  cursor.style.top = '50%';
  cursor.style.left = '50%';
  cursor.style.transform = 'translate(-50%, -50%)';
  
  // Variables for cursor trail
  const trailCount = 8; // Increased trail count for more futuristic effect
  const trails = [];
  
  // Create trail elements
  for (let i = 0; i < trailCount; i++) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    cursor.appendChild(trail);
    trails.push({
      element: trail,
      x: 0,
      y: 0,
      delay: i * 2,
      size: 5 - (i * 0.5) // Decreasing size for trail elements
    });
  }
  
  // Variables for cursor position
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  let velocity = { x: 0, y: 0 }; // Track velocity for more dynamic movement
  
  // Update cursor position with smooth animation
  function updateCursorPosition() {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    
    // Update velocity with easing
    velocity.x = velocity.x * 0.8 + dx * 0.2;
    velocity.y = velocity.y * 0.8 + dy * 0.2;
    
    cursorX += velocity.x * 0.15;
    cursorY += velocity.y * 0.15;
    
    // Direct positioning instead of transform
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    cursor.style.transform = 'translate(-50%, -50%)';
    
    // Rotate cursor based on movement direction for futuristic effect
    if (Math.abs(velocity.x) > 0.1 || Math.abs(velocity.y) > 0.1) {
      const angle = Math.atan2(velocity.y, velocity.x) * 180 / Math.PI;
      cursorRing.style.transform = `rotate(${angle}deg)`;
    }
    
    // Update trail positions with delay
    trails.forEach((trail, index) => {
      if (index % trail.delay === 0) {
        const trailFactor = index / trailCount;
        trail.x = mouseX - (velocity.x * (index * 2));
        trail.y = mouseY - (velocity.y * (index * 2));
        
        trail.element.style.transform = `translate(${trail.x - cursorX}px, ${trail.y - cursorY}px) scale(${1 - trailFactor})`;
        trail.element.style.opacity = 0.7 - (trailFactor * 0.7);
      }
    });
    
    requestAnimationFrame(updateCursorPosition);
  }
  
  // Track mouse movement
  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    console.log('Mouse moved to:', mouseX, mouseY);
  });
  
  // Handle mouse enter/leave document
  document.addEventListener('mouseenter', function() {
    cursor.style.opacity = 1;
    console.log('Mouse entered document');
  });
  
  document.addEventListener('mouseleave', function() {
    cursor.style.opacity = 0;
    console.log('Mouse left document');
  });
  
  // Handle click animation
  document.addEventListener('mousedown', function(e) {
    cursor.classList.add('cursor-click');
    console.log('Mouse clicked');
    
    // Create ripple effect on click
    const ripple = document.createElement('div');
    ripple.className = 'cursor-ripple';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    document.body.appendChild(ripple);
    
    // Remove ripple after animation completes
    setTimeout(() => {
      ripple.remove();
      cursor.classList.remove('cursor-click');
    }, 500);
  });
  
  // Start animation loop
  updateCursorPosition();
  console.log('Animation loop started');
  
  // Add hover effect for interactive elements
  const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, [role="button"]');
  interactiveElements.forEach(el => {
    el.classList.add('clickable');
    
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-hover');
      // Add slight magnetic effect
      el.addEventListener('mousemove', magneticEffect);
    });
    
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover');
      // Remove magnetic effect
      el.removeEventListener('mousemove', magneticEffect);
    });
  });
  
  // Magnetic effect for interactive elements
  function magneticEffect(e) {
    const rect = this.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from mouse to center of element
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    
    // Apply slight magnetic pull (subtle effect)
    mouseX = e.clientX - (distX * 0.2);
    mouseY = e.clientY - (distY * 0.2);
  }
  
  // Add a fallback cursor in case the custom one fails
  document.body.style.cursor = 'none';
}); 