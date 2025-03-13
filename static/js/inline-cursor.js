// Inline cursor script - can be included directly in any page
(function() {
  // Add cursor styles
  const style = document.createElement('style');
  style.textContent = `
    * {
      cursor: none !important;
    }
    
    #inline-cursor {
      position: fixed;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999999;
      transform: translate(-50%, -50%);
      border: 2px solid cyan;
      background-color: rgba(0, 255, 255, 0.2);
      box-shadow: 0 0 10px cyan;
      transition: transform 0.1s ease, background-color 0.1s ease;
      top: 0;
      left: 0;
    }
  `;
  document.head.appendChild(style);
  
  // Create cursor element
  const cursor = document.createElement('div');
  cursor.id = 'inline-cursor';
  document.body.appendChild(cursor);
  
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
})(); 