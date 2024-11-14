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

function toggleStartMenu() {
    const startMenu = document.getElementById('startMenu');
    startMenu.style.display = (startMenu.style.display === 'none' || !startMenu.style.display) ? 'block' : 'none';
}

// Hide Start Menu when clicking outside
window.addEventListener('click', function(event) {
    const startMenu = document.getElementById('startMenu');
    const startButton = document.querySelector('.taskbar-start');
    if (event.target !== startButton && !startButton.contains(event.target) && !startMenu.contains(event.target)) {
        startMenu.style.display = 'none';
    }
});

// Define functions for navigation and apps
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

/*
async function browser() {
    console.log("browser");
}

async function fileExplorer() {
    console.log("file explorer");
}*/

function setIframeSrc(iframeId, src) {
    const iframe = document.getElementById(iframeId);
    if (iframe.src !== src) iframe.src = src;
}

// Utility function to clear iframe source
function clearIframeSrc(iframeId) {
    const iframe = document.getElementById(iframeId);
    iframe.src = '';
}

// Function to create and append an iframe dynamically
function createIframe(iframeId, src, width, height) {
    // Check if iframe already exists
    let iframe = document.getElementById(iframeId);
    if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = iframeId;
        iframe.style.display = 'none';
        iframe.style.width = `${width}px`;
        iframe.style.height = `${height}px`;
        iframe.style.position = 'fixed';
        iframe.style.top = '50%';
        iframe.style.left = '50%';
        iframe.style.transform = 'translate(-50%, -50%)';
        iframe.style.zIndex = '1001';
        iframe.style.borderRadius = '10px';
        iframe.style.boxShadow = '0px 4px 12px rgba(0, 0, 0, 0.3)';
        iframe.allowFullscreen = true;

        document.body.appendChild(iframe);
    }
    iframe.src = src;
    return iframe;
}

// Function to remove an iframe
function removeIframe(iframeId) {
    const iframe = document.getElementById(iframeId);
    if (iframe) {
        iframe.parentElement.removeChild(iframe);
    }
}

// Open and close app functions using dynamic iframe creation
async function openApp(iframeId, src, width, height) {
    const iframe = createIframe(iframeId, src, width, height);
    iframe.style.display = 'block';
}

async function closeApp(iframeId) {
    removeIframe(iframeId);
}

// Specific app handlers
async function openSlopeApp() {
    await openApp('slopeAppIframe', '/apps/slopeApp.html', 955, 640);
}

async function closeSlopeApp() {
    await closeApp('slopeAppIframe');
}

async function openSnakeApp() {
    await openApp('snakeAppIframe', '/apps/snakeApp.html', 420, 420);
}

async function closeSnakeApp() {
    await closeApp('snakeAppIframe');
}

async function openPongApp() {
    await openApp('pongAppIframe', '/apps/pongApp.html', 760, 595);
}

async function closePongApp() {
    await closeApp('pongAppIframe');
}

async function openSettingsApp() {
    await openApp('settingsAppIframe', '/apps/settingsApp.html', 600, 400);
}

async function closeSettingsApp() {
    await closeApp('settingsAppIframe');
}




const apps = [
    /*
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
    */
    {
        name: 'Settings',
        icon: '/assets/img/settings.png',
        action: () => openSettingsApp()
    },
    {
        name: 'Pong',
        icon: '/assets/img/pong.png',
        action: () => openPongApp()
    },
    {
        name: 'Snake',
        icon: '/assets/img/snake.png',
        action: () => openSnakeApp()
    },
    {
        name: 'Slope 3',
        icon: '/assets/img/slope.png',
        action: () => openSlopeApp()
    }
];

// Fetch user name and preferences
async function fetchUserName() {
    try {
        const response = await fetch('/api/users/current');
        if (!response.ok) throw new Error('Failed to fetch user');

        const data = await response.json();
        currentUser = data.username;
        setUserName(currentUser);
    } catch (error) {
        console.error(error);
        currentUser = null;
        setUserName('Guest');
    }
}

// Render desktop and Start Menu
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

// Set the user name in the Start Menu
function setUserName(name) {
    document.getElementById('userName').textContent = name;
}

let currentUser = null;
let userPreferences = { background: '/assets/img/background.png', taskbarApps: [] };

async function fetchPreferences() {
    try {
        const response = await fetch('/api/users/getPreferences');
        if (!response.ok) throw new Error('Failed to fetch preferences');
        userPreferences = await response.json();
        applyPreferences();
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

// Context menu for desktop
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
})

// Render taskbar icons based on preferences
function renderTaskbarIcons() {
    const taskbarCenter = document.querySelector('.taskbar-center');
    taskbarCenter.innerHTML = '';

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