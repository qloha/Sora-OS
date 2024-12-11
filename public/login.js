const backButton = document.getElementById('backButton');
backButton.addEventListener('click', () => {
    window.location.href = '/';
});

document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = event.target.username.value;
    const password = event.target.password.value;

    const response = await fetch(`${window.location.origin}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    const errorMessageContainer = document.getElementById('error-message');

    if (response.ok) {
        window.location.href = '/desktop';
    } else {
        errorMessageContainer.style.display = 'block';

        if (result.message === 'Username not found') {
            errorMessageContainer.textContent = 'Username is incorrect';
        } else if (result.message === 'Incorrect password') {
            errorMessageContainer.textContent = 'Password is incorrect';
        } else {
            errorMessageContainer.textContent = 'Password & username incorrect';
        }
    }
});
