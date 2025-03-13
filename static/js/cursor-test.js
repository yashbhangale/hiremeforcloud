// This is a standalone test script for the custom cursor
console.log('Cursor test script loaded');

// Create a test cursor element
const testCursor = document.createElement('div');
testCursor.id = 'test-cursor';
testCursor.style.position = 'fixed';
testCursor.style.width = '20px';
testCursor.style.height = '20px';
testCursor.style.backgroundColor = 'red';
testCursor.style.borderRadius = '50%';
testCursor.style.pointerEvents = 'none';
testCursor.style.zIndex = '999999';
testCursor.style.transform = 'translate(-50%, -50%)';
document.body.appendChild(testCursor);

// Track mouse movement
document.addEventListener('mousemove', function(e) {
  testCursor.style.left = e.clientX + 'px';
  testCursor.style.top = e.clientY + 'px';
  console.log('Test cursor moved to:', e.clientX, e.clientY);
});

// Add a message to the page
const message = document.createElement('div');
message.style.position = 'fixed';
message.style.top = '10px';
message.style.left = '10px';
message.style.padding = '10px';
message.style.backgroundColor = 'rgba(0,0,0,0.7)';
message.style.color = 'white';
message.style.zIndex = '999998';
message.style.fontFamily = 'Arial, sans-serif';
message.textContent = 'Test cursor active (red dot)';
document.body.appendChild(message);

// Check if the main custom cursor exists
setTimeout(function() {
  const customCursor = document.querySelector('.custom-cursor');
  if (customCursor) {
    message.textContent += ' - Custom cursor found!';
    message.style.backgroundColor = 'rgba(0,128,0,0.7)';
  } else {
    message.textContent += ' - Custom cursor NOT found!';
    message.style.backgroundColor = 'rgba(255,0,0,0.7)';
  }
}, 2000); 