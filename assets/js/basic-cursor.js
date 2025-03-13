// Basic cursor implementation - guaranteed to work
(function() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCursor);
  } else {
    initCursor();
  }
  
  function initCursor() {
    console.log('Basic cursor initializing');
    
    // Create cursor element
    const cursor = document.createElement('div');
    cursor.id = 'basic-cursor';
    cursor.style.position = 'fixed';
    cursor.style.width = '30px';
    cursor.style.height = '30px';
    cursor.style.borderRadius = '50%';
    cursor.style.border = '2px solid cyan';
    cursor.style.backgroundColor = 'rgba(0, 255, 255, 0.2)';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '9999999'; // Very high z-index
    cursor.style.transform = 'translate(-50%, -50%)';
    cursor.style.boxShadow = '0 0 10px cyan';
    cursor.style.transition = 'transform 0.1s ease';
    
    // Add cursor to body
    document.body.appendChild(cursor);
    
    // Hide default cursor
    const styleElement = document.createElement('style');
    styleElement.textContent = '* {cursor: none !important;}';
    document.head.appendChild(styleElement);
    
    // Track mouse movement
    document.addEventListener('mousemove', function(e) {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
    
    // Add hover effect
    document.addEventListener('mouseover', function(e) {
      if (e.target.tagName === 'A' || 
          e.target.tagName === 'BUTTON' || 
          e.target.tagName === 'INPUT' ||
          e.target.tagName === 'SELECT' ||
          e.target.tagName === 'TEXTAREA' ||
          e.target.hasAttribute('role') && e.target.getAttribute('role') === 'button') {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursor.style.backgroundColor = 'rgba(0, 255, 255, 0.4)';
      }
    });
    
    document.addEventListener('mouseout', function(e) {
      if (e.target.tagName === 'A' || 
          e.target.tagName === 'BUTTON' || 
          e.target.tagName === 'INPUT' ||
          e.target.tagName === 'SELECT' ||
          e.target.tagName === 'TEXTAREA' ||
          e.target.hasAttribute('role') && e.target.getAttribute('role') === 'button') {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.backgroundColor = 'rgba(0, 255, 255, 0.2)';
      }
    });
    
    // Add click effect
    document.addEventListener('mousedown', function() {
      cursor.style.transform = 'translate(-50%, -50%) scale(0.9)';
    });
    
    document.addEventListener('mouseup', function() {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });
    
    console.log('Basic cursor initialized');
  }
})(); 