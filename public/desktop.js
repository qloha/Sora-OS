async function updateClockAndDate() {
    const now = new Date();

    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    const timeString = `${hours}:${minutes} ${ampm}`;
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const dateString = now.toLocaleDateString(undefined, options);

    document.getElementById('clock').textContent = timeString;
    document.getElementById('date').textContent = dateString;
}

async function toggleStartMenu() {
    const startMenu = document.getElementById('startMenu');
    startMenu.style.display = startMenu.style.display === 'none' || !startMenu.style.display ? 'block' : 'none';
}

window.addEventListener('click', function(event) {
    const startMenu = document.getElementById('startMenu');
    const startButton = document.querySelector('.taskbar-start');
    if (event.target !== startButton && !startButton.contains(event.target) && !startMenu.contains(event.target)) {
        startMenu.style.display = 'none';
    }
});


async function home() {
    window.location.href = '/';
}

async function lock() {
    window.location.href = '/relogin';
}

async function logout() {
    await fetch('/api/users/logout', { method: 'POST' });
    window.location.href = '/login';
}

async function browser() {
    console.log("browser");
}

async function fileExplorer() {
    console.log("file explorer");
}

async function flappyBird() {
    console.log("flappy bird");
}

async function openSettingsApp() {
    document.getElementById('settingsApp').style.display = 'flex';
    showSettingsContent('general'); // Default to General tab

    // Load saved user preferences
    await loadUserPreferences();
}

// Close the Settings App
function closeSettingsApp() {
    document.getElementById('settingsApp').style.display = 'none';
}

// Show specific settings content based on tab clicked
function showSettingsContent(tab) {
    document.querySelectorAll('.content-section').forEach(section => section.style.display = 'none');
    document.getElementById(tab).style.display = 'block';
}

async function loadUserPreferences() {
    try {
        const response = await fetch('/api/users/getPreferences');
        if (!response.ok) throw new Error('Failed to load preferences');
        const { background, username, password } = await response.json();

        // Set input fields with fetched or default values
        document.getElementById('username').value = username || 'Guest';
        document.getElementById('password').value = password || '';
        document.getElementById('background').value = background || '/assets/img/background.png';
    } catch (error) {
        console.error(error);
    }
}

// Save General Settings
async function saveGeneralSettings() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const feedback = document.getElementById('generalFeedback');

    try {
        await fetch('/api/users/savePreferences', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        feedback.textContent = 'Saved!';
        feedback.style.color = 'green';
    } catch (error) {
        feedback.textContent = 'Failed to save.';
        feedback.style.color = 'red';
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
        document.body.style.backgroundImage = `url(${background})`;
        feedback.textContent = 'Applied!';
        feedback.style.color = 'green';
    } catch (error) {
        feedback.textContent = 'Failed to apply.';
        feedback.style.color = 'red';
    }
}

// Update the apps array to include the Settings app
const apps = [
    {
        name: 'Browser',
        icon: '/assets/img/browser.png',
        action: () => browser()
    },
    {
        name: 'File Explorer',
        icon: '/assets/img/file-explorer.png',
        action: () => fileExplorer()
    },
    {
        name: 'Flappy Bird',
        icon: '/assets/img/flappy-bird.png',
        action: () => flappyBird()
    },
    {
        name: 'Settings',
        icon: '/assets/img/settings.png', // Use an appropriate settings icon
        action: () => openSettingsApp()
    }
];

async function fetchUserName() {
    try {
        const response = await fetch('/api/users/current');
        if (!response.ok) throw new Error('Failed to fetch user');

        const data = await response.json();
        setUserName(data.username);
    } catch (error) {
        console.error(error);
        setUserName('Guest'); // Fallback if not logged in
    }
}

// Function to render desktop and Start Menu
function renderDesktopIcons() {
    const desktopIconsContainer = document.querySelector('.icons');
    desktopIconsContainer.innerHTML = '';

    apps.forEach(app => {
        const iconElement = document.createElement('div');
        iconElement.classList.add('icon');
        iconElement.onclick = app.action;

        const imgElement = document.createElement('img');
        imgElement.src = app.icon;
        imgElement.alt = `${app.name} Icon`;

        const spanElement = document.createElement('span');
        spanElement.textContent = app.name;

        iconElement.appendChild(imgElement);
        iconElement.appendChild(spanElement);
        desktopIconsContainer.appendChild(iconElement);
    });
}

function renderStartMenu() {
    const startMenuContainer = document.querySelector('.start-menu-content');
    startMenuContainer.innerHTML = '';

    apps.forEach(app => {
        const menuItem = document.createElement('div');
        menuItem.classList.add('start-menu-item');
        menuItem.onclick = app.action;

        const imgElement = document.createElement('img');
        imgElement.src = app.icon;
        imgElement.alt = `${app.name} Icon`;

        const spanElement = document.createElement('span');
        spanElement.textContent = app.name;

        menuItem.appendChild(imgElement);
        menuItem.appendChild(spanElement);
        startMenuContainer.appendChild(menuItem);
    });

    const divider = document.createElement('hr');
    startMenuContainer.appendChild(divider);

    const userInfo = document.createElement('div');
    userInfo.classList.add('user-info');

    const userAvatar = document.createElement('img');
    userAvatar.src = '/assets/img/user.png';
    userAvatar.alt = 'User Avatar';
    userAvatar.classList.add('user-avatar');

    const userNameSpan = document.createElement('span');
    userNameSpan.id = 'userName';

    userInfo.appendChild(userAvatar);
    userInfo.appendChild(userNameSpan);
    startMenuContainer.appendChild(userInfo);

    const powerOptions = document.createElement('div');
    powerOptions.classList.add('power-options');

    const homeButton = document.createElement('button');
    homeButton.textContent = 'Home';
    homeButton.onclick = home;

    const lockButton = document.createElement('button');
    lockButton.textContent = 'Lock';
    lockButton.onclick = lock;

    const logoutButton = document.createElement('button');
    logoutButton.textContent = 'Log Out';
    logoutButton.onclick = logout;

    powerOptions.appendChild(homeButton);
    powerOptions.appendChild(lockButton);
    powerOptions.appendChild(logoutButton);

    startMenuContainer.appendChild(powerOptions);
}

function setUserName(name) {
    document.getElementById('userName').textContent = name;
}

let userPreferences = { background: '/assets/img/background.png', taskbarApps: [] };
async function fetchPreferences() {
    try {
        const response = await fetch('/api/users/getPreferences');
        if (!response.ok) throw new Error('Failed to fetch preferences');
        userPreferences = await response.json();
        applyPreferences(); // Call applyPreferences after userPreferences is updated
    } catch (error) {
        console.error(error);
    }
}

function applyPreferences() {
    if (userPreferences.background) {
        document.body.style.backgroundImage = `url(${userPreferences.background})`;
    }
    if (userPreferences.taskbarApps) {
        renderTaskbarIcons();
    }
}

window.onload = fetchPreferences;

document.addEventListener('contextmenu', (event) => {
    const isDesktop = event.target.classList.contains('desktop') || event.target === document.body;
    if (!isDesktop) return;

    event.preventDefault();

    const menu = document.createElement('div');
    menu.classList.add('context-menu');
    menu.style.left = `${event.pageX}px`;
    menu.style.top = `${event.pageY}px`;

    const settingsOption = document.createElement('div');
    settingsOption.classList.add('context-menu-item');
    settingsOption.textContent = 'Settings';
    settingsOption.onclick = () => {
        openSettingsApp();
        document.body.removeChild(menu);
    };

    menu.appendChild(settingsOption);
    document.body.appendChild(menu);

    window.addEventListener('click', () => {
        if (document.body.contains(menu)) document.body.removeChild(menu);
    }, { once: true });
});

// Render taskbar icons based on user preferences
function renderTaskbarIcons() {
    const taskbarCenter = document.querySelector('.taskbar-center');
    taskbarCenter.innerHTML = ''; // Clear existing icons

    userPreferences.taskbarApps.forEach(appName => {
        const app = apps.find(app => app.name === appName);
        if (!app) return;

        const img = document.createElement('img');
        img.src = app.icon;
        img.alt = `${app.name} Icon`;
        img.classList.add('taskbar-app');
        img.onclick = app.action;
        taskbarCenter.appendChild(img);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchPreferences();
    renderDesktopIcons();
    renderStartMenu();
    fetchUserName();
    updateClockAndDate();
    setInterval(updateClockAndDate, 1000);
});