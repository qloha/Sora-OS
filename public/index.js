// index.js

// Get references to the buttons
const dynamicButton = document.getElementById('dynamicButton');
const aboutButton = document.getElementById('aboutButton');

// Check login status and update button label and functionality
async function updateDynamicButton() {
    try {
        const response = await fetch('/api/users/current');
        if (response.ok) {
            // User is logged in
            dynamicButton.textContent = 'Desktop';
            dynamicButton.onclick = () => {
                window.location.href = '/desktop';
            };
        } else {
            // User is not logged in
            dynamicButton.textContent = 'Login';
            dynamicButton.onclick = () => {
                window.location.href = '/login';
            };
        }
    } catch (error) {
        console.error('Error checking user status:', error);
        dynamicButton.textContent = 'Login';
        dynamicButton.onclick = () => {
            window.location.href = '/login';
        };
    }
}

// About button functionality
aboutButton.addEventListener('click', () => {
    window.location.href = '/about';
});

// Initialize button state on page load
document.addEventListener('DOMContentLoaded', updateDynamicButton);