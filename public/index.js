const dynamicButton = document.getElementById('dynamicButton');
const aboutButton = document.getElementById('aboutButton');

async function updateDynamicButton() {
    try {
        const response = await fetch(`${window.location.origin}/api/users/current`);
        if (response.ok) {
            dynamicButton.textContent = 'Desktop';
            dynamicButton.onclick = () => {
                window.location.href = '/desktop';
            };
        } else {
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

aboutButton.addEventListener('click', () => {
    window.location.href = '/about';
});

document.addEventListener('DOMContentLoaded', updateDynamicButton);