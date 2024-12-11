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

window.addEventListener('click', function(event) {
    const startMenu = document.getElementById('startMenu');
    const startButton = document.querySelector('.taskbar-start');
    if (event.target !== startButton && !startButton.contains(event.target) && !startMenu.contains(event.target)) {
        startMenu.style.display = 'none';
    }
});

async function home() {
    window.location.href = '${window.location.origin}/';
}

async function lock() {
    window.location.href = '${window.location.origin}/relogin';
}

async function logout() {
    await fetch('${window.location.origin}/api/users/logout', { method: 'POST' });
    window.location.href = '${window.location.origin}/login';
}

function createIframe(iframeId, src, width, height) {
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

function removeIframe(iframeId) {
    const iframe = document.getElementById(iframeId);
    if (iframe) {
        iframe.parentElement.removeChild(iframe);
    }
}

async function openApp(iframeId, src, width, height) {
    const iframe = createIframe(iframeId, src, width, height);
    iframe.style.display = 'block';
}

async function closeApp(iframeId) {
    removeIframe(iframeId);
}

async function openSnakeApp() {
    await openApp('snakeAppIframe', '${window.location.origin}/apps/snakeApp.html', 420, 420);
}

async function closeSnakeApp() {
    await closeApp('snakeAppIframe');
}

async function openPongApp() {
    await openApp('pongAppIframe', '${window.location.origin}/apps/pongApp.html', 760, 600);
}

async function closePongApp() {
    await closeApp('pongAppIframe');
}

async function openSettingsApp() {
    await openApp('settingsAppIframe', '${window.location.origin}/apps/settingsApp.html', 600, 400);
}

async function closeSettingsApp() {
    await closeApp('settingsAppIframe');
}




const apps = [
    {
        name: 'Settings',
        icon: '${window.location.origin}/assets/img/settings.png',
        action: () => openSettingsApp()
    },
    {
        name: 'Pong',
        icon: '${window.location.origin}/assets/img/pong.png',
        action: () => openPongApp()
    },
    {
        name: 'Snake',
        icon: '${window.location.origin}/assets/img/snake.png',
        action: () => openSnakeApp()
    },
];

async function fetchUserName() {
    try {
        const response = await fetch('${window.location.origin}/api/users/current');
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

let currentPage = 0;
const appsPerPage = 6;

function renderStartMenu() {
    const startMenuContainer = document.querySelector('.start-menu-content');
    startMenuContainer.innerHTML = '';

    const start = currentPage * appsPerPage;
    const end = start + appsPerPage;
    const currentApps = apps.slice(start, end);

    currentApps.forEach(app => {
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

    const navigationContainer = document.createElement('div');
    navigationContainer.classList.add('navigation-container');

    if (currentPage > 0) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.onclick = () => {
            currentPage--;
            renderStartMenu();
        };
        navigationContainer.appendChild(prevButton);
    }

    if (end < apps.length) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.onclick = () => {
            currentPage++;
            renderStartMenu();
        };
        navigationContainer.appendChild(nextButton);
    }

    startMenuContainer.appendChild(navigationContainer);

    const divider = document.createElement('hr');
    startMenuContainer.appendChild(divider);

    const userInfo = document.createElement('div');
    userInfo.classList.add('user-info');

    const userAvatar = document.createElement('img');
    userAvatar.src = '${window.location.origin}/assets/img/user.png';
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

function renderDesktopIcons() {
    const desktopIconsContainer = document.querySelector('.icons');
    desktopIconsContainer.innerHTML = '';
}

function renderTaskbarIcons() {
    const taskbarCenter = document.querySelector('.taskbar-center');
    taskbarCenter.innerHTML = '';
}


function setUserName(name) {
    document.getElementById('userName').textContent = name;
}

let currentUser = null;
let userPreferences = { background: '${window.location.origin}/assets/img/background.png', taskbarApps: [] };

async function fetchPreferences() {
    try {
        const response = await fetch('${window.location.origin}/api/users/getPreferences');
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
        openSettingsApp().catch(console.error);
        document.body.removeChild(menu);
    };

    menu.appendChild(settingsOption);
    document.body.appendChild(menu);

    window.addEventListener('click', () => {
        if (document.body.contains(menu)) document.body.removeChild(menu);
    }, { once: true });
})


document.addEventListener('DOMContentLoaded', () => {
    fetchPreferences().catch(console.error);
    renderDesktopIcons();
    renderStartMenu();
    fetchUserName().catch(console.error);
    updateClockAndDate().catch(console.error);
    setInterval(updateClockAndDate, 1000);
});