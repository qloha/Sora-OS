// lock.js

const unlockButton = document.getElementById('unlockButton');
const logoutButton = document.getElementById('logoutButton');
const passwordInput = document.getElementById('passwordInput');
const errorMessage = document.getElementById('errorMessage');

unlockButton.addEventListener('click', async () => {
    const password = passwordInput.value;
    try {
        const response = await fetch('/api/users/verifyPassword', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });

        if (response.ok) {
            window.location.href = '/desktop'; // Redirect to the desktop if password is correct
        } else {
            errorMessage.textContent = 'Incorrect password. Please try again.';
        }
    } catch (error) {
        console.error('Error verifying password:', error);
        errorMessage.textContent = 'An error occurred. Please try again.';
    }
});

logoutButton.addEventListener('click', async () => {
    await fetch('/api/users/logout', { method: 'POST' });
    window.location.href = '/login'; // Redirect to the login page after logging out
});
