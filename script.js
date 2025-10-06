// ===== LOADING SCREEN LOGIC =====
const loadingScreen = document.getElementById('loadingScreen');
const loadingPercentage = document.getElementById('loadingPercentage');
const loadingStatus = document.getElementById('loadingStatus');
const loadingBg = document.getElementById('loadingBg');
const mainContent = document.getElementById('mainContent');

// Create floating particles
function createParticles() {
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
        loadingBg.appendChild(particle);
    }
}

createParticles();

// Loading status messages
const statusMessages = [
    'Initializing security protocols...',
    'Loading threat database...',
    'Establishing secure connection...',
    'Analyzing network vulnerabilities...',
    'Configuring simulation environment...',
    'Preparing malware samples...',
    'Activating sandbox mode...',
    'Encrypting data streams...',
    'Finalizing security checks...',
    'System ready. Launching...'
];

let currentProgress = 0;
let messageIndex = 0;

// Animate loading
const loadingInterval = setInterval(() => {
    if (currentProgress < 100) {
        currentProgress += Math.random() * 15;
        if (currentProgress > 100) currentProgress = 100;
        
        loadingPercentage.textContent = Math.floor(currentProgress) + '%';
        
        // Update status message
        if (currentProgress > (messageIndex + 1) * 10) {
            messageIndex++;
            if (messageIndex < statusMessages.length) {
                loadingStatus.style.animation = 'none';
                setTimeout(() => {
                    loadingStatus.textContent = statusMessages[messageIndex];
                    loadingStatus.style.animation = 'statusFade 0.5s ease-in-out';
                }, 50);
            }
        }
    } else {
        clearInterval(loadingInterval);
        
        // Hide loading screen
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            mainContent.classList.add('visible');
            
            // Remove loading screen from DOM after animation
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 800);
        }, 500);
    }
}, 200);

// ===== MAIN APP LOGIC =====
// Matrix Rain Background
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = '01アイウエオカキクケコサシスセソタチツテト';
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
    ctx.fillStyle = 'rgba(10, 15, 30, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#00E0FF';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 35);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Animated counter for stats
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.parentElement.querySelector('.stat-label').textContent.includes('%') ? '' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.3
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                if (counter.textContent === '0') {
                    animateCounter(counter);
                }
            });
        }
    });
}, observerOptions);

const statsBar = document.querySelector('.stats-bar');
if (statsBar) observer.observe(statsBar);

// Navigation Functions
function showSection(sectionName) {
    const sections = ['landing', 'dashboard', 'about', 'simulationView'];
    sections.forEach(section => {
        document.getElementById(section).style.display = 'none';
        document.getElementById(section).classList.remove('active');
    });

    const targetSection = document.getElementById(sectionName);
    targetSection.style.display = 'block';
    targetSection.classList.add('active');

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function backToDashboard() {
    showSection('dashboard');
    resetSimulation();
}

function scrollToFooter() {
    document.querySelector('footer').scrollIntoView({ behavior: 'smooth' });
}

// Simulation Logic
let currentMalware = null;
let simulationRunning = false;
let nodes = [];
let infectedNodes = [];

const malwareData = {
    virus: {
        title: 'VIRUS SIMULATION',
        description: 'A computer virus attaches itself to programs or files and replicates when executed. It requires user action to spread and can corrupt or delete data, modify system files, or steal information.',
        behavior: 'The virus spreads through file sharing and execution. Each infected node can transmit to connected nodes when files are accessed. Propagation is slower but can remain dormant for extended periods.',
        color: '#FF006E',
        spreadDelay: 1500
    },
    worm: {
        title: 'WORM SIMULATION',
        description: 'Worms are self-replicating malware that spread autonomously across networks without user interaction, exploiting vulnerabilities in network protocols and system services.',
        behavior: 'The worm automatically scans for vulnerable systems and spreads rapidly through network connections without requiring user action. It can consume bandwidth and system resources quickly.',
        color: '#00E0FF',
        spreadDelay: 800
    },
    trojan: {
        title: 'TROJAN SIMULATION',
        description: 'Trojans disguise themselves as legitimate software to trick users into installation, then perform malicious actions while appearing normal. They often create backdoors for remote access.',
        behavior: 'The trojan appears as a trusted application but secretly establishes backdoor access and spreads through social engineering. It operates stealthily to avoid detection by security systems.',
        color: '#FFA500',
        spreadDelay: 2000
    }
};

function startSimulation(type) {
    currentMalware = type;
    showSection('simulationView');
    
    const data = malwareData[type];
    document.getElementById('simTitle').textContent = data.title;
    document.getElementById('simDescription').textContent = data.description;
    document.getElementById('simBehavior').textContent = data.behavior;
    
    initializeNetwork();
    logStatus(`Initializing ${type.toUpperCase()} simulation...`, 'success');
}

function initializeNetwork() {
    const canvas = document.getElementById('simCanvas');
    canvas.innerHTML = '';
    nodes = [];
    infectedNodes = [];
    
    const nodeCount = 20;
    const canvasRect = canvas.getBoundingClientRect();
    
    for (let i = 0; i < nodeCount; i++) {
        const node = document.createElement('div');
        node.className = 'network-node';
        node.textContent = i + 1;
        node.style.left = Math.random() * (canvasRect.width - 70) + 10 + 'px';
        node.style.top = Math.random() * (canvasRect.height - 70) + 10 + 'px';
        canvas.appendChild(node);
        nodes.push({element: node, id: i, infected: false});
    }
    
    for (let i = 0; i < nodes.length; i++) {
        const connectCount = Math.floor(Math.random() * 3) + 2;
        for (let j = 0; j < connectCount; j++) {
            const targetIdx = Math.floor(Math.random() * nodes.length);
            if (targetIdx !== i) drawConnection(nodes[i], nodes[targetIdx]);
        }
    }
    
    setTimeout(() => {
        infectNode(0);
        logStatus('Patient zero identified. Infection initiated.', 'warning');
    }, 800);
}

function drawConnection(node1, node2) {
    const canvas = document.getElementById('simCanvas');
    const line = document.createElement('div');
    line.className = 'network-line';
    
    const x1 = parseFloat(node1.element.style.left) + 27.5;
    const y1 = parseFloat(node1.element.style.top) + 27.5;
    const x2 = parseFloat(node2.element.style.left) + 27.5;
    const y2 = parseFloat(node2.element.style.top) + 27.5;
    
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
    
    line.style.width = length + 'px';
    line.style.left = x1 + 'px';
    line.style.top = y1 + 'px';
    line.style.transform = `rotate(${angle}deg)`;
    
    canvas.insertBefore(line, canvas.firstChild);
}

function infectNode(nodeId) {
    if (nodes[nodeId].infected) return;
    
    nodes[nodeId].infected = true;
    nodes[nodeId].element.classList.add('infected');
    infectedNodes.push(nodeId);
    
    const integrity = Math.round((1 - infectedNodes.length / nodes.length) * 100);
    logStatus(`Node ${nodeId + 1} compromised! System integrity: ${integrity}%`, 'error');
    
    if (simulationRunning && infectedNodes.length < nodes.length) {
        const delay = malwareData[currentMalware].spreadDelay;
        setTimeout(spreadInfection, delay);
    } else if (infectedNodes.length === nodes.length) {
        logStatus('⚠️ CRITICAL: All nodes compromised! Network fully infected.', 'error');
        simulationRunning = false;
        document.querySelector('.sim-controls button').textContent = '▶ Play';
    }
}

function spreadInfection() {
    if (!simulationRunning) return;
    
    const uninfectedNodes = nodes.filter(n => !n.infected);
    if (uninfectedNodes.length === 0) {
        logStatus('Network fully compromised. Simulation complete.', 'error');
        return;
    }
    
    const targetNode = uninfectedNodes[Math.floor(Math.random() * uninfectedNodes.length)];
    logStatus(`Scanning node ${targetNode.id + 1}... Vulnerability detected.`, 'warning');
    
    setTimeout(() => infectNode(targetNode.id), 500);
}

function toggleSimulation(event) {
    simulationRunning = !simulationRunning;
    const btn = event.target;
    
    if (simulationRunning) {
        btn.textContent = '⏸ Pause';
        logStatus('Simulation resumed. Monitoring network activity...', 'success');
        if (infectedNodes.length > 0 && infectedNodes.length < nodes.length) {
            spreadInfection();
        }
    } else {
        btn.textContent = '▶ Play';
        logStatus('Simulation paused. Analysis mode active.', 'success');
    }
}

function resetSimulation() {
    simulationRunning = false;
    document.querySelector('.sim-controls button').textContent = '▶ Play';
    const log = document.getElementById('statusLog');
    log.innerHTML = '<div>System reset complete. Ready for new simulation.</div>';
    initializeNetwork();
}

function logStatus(message, type = '') {
    const log = document.getElementById('statusLog');
    const entry = document.createElement('div');
    entry.className = type;
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    entry.textContent = `[${timestamp}] ${message}`;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
    
    if (log.children.length > 50) {
        log.removeChild(log.firstChild);
    }
}