async function loadUserPreferences() {
    try {
        const response = await fetch('/api/users/getPreferences');
        if (!response.ok) throw new Error('Failed to load preferences');

        const { background } = await response.json();
        document.getElementById('background').value = background || '/assets/img/background.png';
    } catch (error) {
        console.error(error);
    }
}

async function applyDesktopSettings() {
    const background = document.getElementById('background').value;
    const feedback = document.getElementById('desktopFeedback');

    try {
        await fetch('/api/users/savePreferences', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ background })
        });
        parent.document.body.style.backgroundImage = `url(${background})`; // Set background on parent
        feedback.textContent = 'Applied!';
        feedback.style.color = 'green';
    } catch (error) {
        feedback.textContent = 'Failed to apply.';
        feedback.style.color = 'red';
    }
}

// Show specific settings content (only Desktop now)
function showSettingsContent(tab) {
    document.querySelectorAll('.content-section').forEach(section => section.style.display = 'none');
    document.getElementById(tab).style.display = 'block';
}

document.addEventListener('DOMContentLoaded', loadUserPreferences);
