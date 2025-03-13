// Simple cursor fallback
document.addEventListener('DOMContentLoaded', function() {
  console.log('Simple cursor script loaded');
  
  // Create cursor element
  const cursor = document.createElement('div');
  cursor.className = 'simple-cursor';
  cursor.style.position = 'fixed';
  cursor.style.width = '30px';
  cursor.style.height = '30px';
  cursor.style.borderRadius = '50%';
  cursor.style.backgroundColor = 'rgba(0, 255, 255, 0.3)';
  cursor.style.border = '2px solid cyan';
  cursor.style.pointerEvents = 'none';
  cursor.style.zIndex = '999999';
  cursor.style.transform = 'translate(-50%, -50%)';
  cursor.style.transition = 'width 0.3s, height 0.3s, background-color 0.3s';
  cursor.style.boxShadow = '0 0 10px cyan';
  document.body.appendChild(cursor);
  
  // Track mouse movement
  document.addEventListener('mousemove', function(e) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
  
  // Hide default cursor
  document.body.style.cursor = 'none';
  
  // Add hover effect for interactive elements
  const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, [role="button"]');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '50px';
      cursor.style.height = '50px';
      cursor.style.backgroundColor = 'rgba(0, 255, 255, 0.5)';
    });
    
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '30px';
      cursor.style.height = '30px';
      cursor.style.backgroundColor = 'rgba(0, 255, 255, 0.3)';
    });
  });
  
  // Add click effect
  document.addEventListener('mousedown', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(0.9)';
  });
  
  document.addEventListener('mouseup', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
  });
}); 