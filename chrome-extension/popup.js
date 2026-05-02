// CarbonWise Tracker - Popup Script

// Website configurations with carbon impact data
const SITE_CONFIG = {
  'swiggy.com': { 
    category: 'food', 
    name: 'Swiggy', 
    co2PerOrder: 2.5, 
    icon: '🍔',
    suggestions: [
      { text: 'Choose restaurants nearby to reduce delivery distance', points: 20 },
      { text: 'Opt out of plastic cutlery', points: 15 },
      { text: 'Order vegetarian meals', points: 30 },
    ]
  },
  'zomato.com': { 
    category: 'food', 
    name: 'Zomato', 
    co2PerOrder: 2.5, 
    icon: '🍕',
    suggestions: [
      { text: 'Choose eco-packaging restaurants', points: 25 },
      { text: 'Bundle your orders to reduce trips', points: 20 },
      { text: 'Support local restaurants', points: 15 },
    ]
  },
  'uber.com': { 
    category: 'transport', 
    name: 'Uber', 
    co2PerKm: 0.21, 
    icon: '🚗',
    suggestions: [
      { text: 'Choose Uber Pool to share your ride', points: 40 },
      { text: 'Select Uber Green for electric vehicles', points: 50 },
      { text: 'Consider walking for short distances', points: 30 },
    ]
  },
  'ola.com': { 
    category: 'transport', 
    name: 'Ola', 
    co2PerKm: 0.21, 
    icon: '🚕',
    suggestions: [
      { text: 'Use Ola Share to reduce emissions', points: 40 },
      { text: 'Book electric/CNG vehicles when available', points: 45 },
      { text: 'Use public transport for longer routes', points: 35 },
    ]
  },
  'redbus.in': { 
    category: 'transport', 
    name: 'RedBus', 
    co2PerKm: 0.089, 
    icon: '🚌',
    suggestions: [
      { text: 'Great choice! Buses are eco-friendly', points: 50 },
      { text: 'Choose non-AC buses to save more energy', points: 20 },
      { text: 'Travel during off-peak hours', points: 15 },
    ]
  },
  'myntra.com': { 
    category: 'shopping', 
    name: 'Myntra', 
    co2PerOrder: 3.0, 
    icon: '👕',
    suggestions: [
      { text: 'Buy less, choose quality over quantity', points: 30 },
      { text: 'Check for sustainable fashion brands', points: 40 },
      { text: 'Consolidate orders to reduce packaging', points: 25 },
    ]
  },
  'amazon.in': { 
    category: 'shopping', 
    name: 'Amazon', 
    co2PerOrder: 3.5, 
    icon: '📦',
    suggestions: [
      { text: 'Choose Amazon Day delivery to consolidate', points: 30 },
      { text: 'Buy products with minimal packaging', points: 25 },
      { text: 'Check Climate Pledge Friendly products', points: 40 },
    ]
  },
  'flipkart.com': { 
    category: 'shopping', 
    name: 'Flipkart', 
    co2PerOrder: 3.5, 
    icon: '🛒',
    suggestions: [
      { text: 'Opt for slower, consolidated shipping', points: 25 },
      { text: 'Buy refurbished electronics', points: 50 },
      { text: 'Choose products with eco-friendly packaging', points: 30 },
    ]
  },
  'makemytrip.com': { 
    category: 'flights', 
    name: 'MakeMyTrip', 
    co2PerKm: 0.255, 
    icon: '✈️',
    suggestions: [
      { text: 'Consider trains for domestic travel', points: 60 },
      { text: 'Choose direct flights to reduce emissions', points: 40 },
      { text: 'Offset your flight carbon footprint', points: 50 },
    ]
  },
  'goibibo.com': { 
    category: 'flights', 
    name: 'Goibibo', 
    co2PerKm: 0.255, 
    icon: '🛫',
    suggestions: [
      { text: 'Book economy class (less emissions per person)', points: 30 },
      { text: 'Choose airlines with newer, efficient aircraft', points: 35 },
      { text: 'Travel light to reduce fuel consumption', points: 20 },
    ]
  },
  'youtube.com': { 
    category: 'streaming', 
    name: 'YouTube', 
    co2PerHour: 0.036, 
    icon: '▶️',
    suggestions: [
      { text: 'Watch in lower resolution when possible', points: 10 },
      { text: 'Download videos on WiFi instead of streaming', points: 15 },
      { text: 'Take breaks from screen time', points: 20 },
    ]
  },
  'netflix.com': { 
    category: 'streaming', 
    name: 'Netflix', 
    co2PerHour: 0.055, 
    icon: '🎬',
    suggestions: [
      { text: 'Stream on smaller screens for lower energy', points: 10 },
      { text: 'Download content to watch offline', points: 15 },
      { text: 'Use dark mode themes', points: 5 },
    ]
  },
};

// State
let currentTab = null;
let currentSite = null;

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  await loadStats();
  await checkCurrentPage();
  await loadTodayActivity();
  setupEventListeners();
});

// Load user stats from storage
async function loadStats() {
  const data = await chrome.storage.local.get(['totalPoints', 'totalCO2Saved', 'activities']);
  
  document.getElementById('totalPoints').textContent = data.totalPoints || 0;
  document.getElementById('totalCO2').textContent = (data.totalCO2Saved || 0).toFixed(1);
}

// Check current tab and update UI
async function checkCurrentPage() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTab = tab;
  
  if (!tab.url) {
    showInactivePage();
    return;
  }
  
  const url = new URL(tab.url);
  const hostname = url.hostname.replace('www.', '');
  
  // Check if we're on a tracked site
  const siteKey = Object.keys(SITE_CONFIG).find(key => hostname.includes(key.replace('www.', '')));
  
  if (siteKey) {
    currentSite = SITE_CONFIG[siteKey];
    showTrackingPage(currentSite);
  } else {
    showInactivePage();
  }
}

// Show tracking active state
function showTrackingPage(site) {
  const statusIcon = document.querySelector('.status-icon');
  statusIcon.className = 'status-icon status-tracking';
  statusIcon.innerHTML = `<span style="font-size: 20px;">${site.icon}</span>`;
  
  document.getElementById('pageTitle').textContent = site.name;
  document.getElementById('pageSubtitle').textContent = `Tracking ${site.category} activity`;
  
  // Show suggestions
  const suggestionList = document.getElementById('suggestionList');
  suggestionList.innerHTML = site.suggestions.map(s => `
    <div class="suggestion-item">
      <div class="suggestion-icon">💡</div>
      <span class="suggestion-text">${s.text}</span>
      <span class="suggestion-points">+${s.points} pts</span>
    </div>
  `).join('');
  
  document.getElementById('suggestionsSection').style.display = 'block';
  
  // Check for pending alerts from content script
  checkPendingAlerts();
}

// Show inactive state
function showInactivePage() {
  const statusIcon = document.querySelector('.status-icon');
  statusIcon.className = 'status-icon status-inactive';
  statusIcon.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <path d="M8 12h8"/>
    </svg>
  `;
  
  document.getElementById('pageTitle').textContent = 'Not a tracked site';
  document.getElementById('pageSubtitle').textContent = 'Visit a supported website to track impact';
  document.getElementById('suggestionsSection').style.display = 'none';
}

// Check for pending carbon alerts
async function checkPendingAlerts() {
  const data = await chrome.storage.local.get(['pendingAlert']);
  
  if (data.pendingAlert) {
    showImpactAlert(data.pendingAlert);
  }
}

// Show impact alert
function showImpactAlert(alertData) {
  const alert = document.getElementById('impactAlert');
  document.getElementById('impactValue').textContent = `~${alertData.co2.toFixed(1)} kg CO2`;
  document.getElementById('impactDesc').textContent = alertData.description;
  alert.style.display = 'block';
}

// Hide impact alert
function hideImpactAlert() {
  document.getElementById('impactAlert').style.display = 'none';
  chrome.storage.local.remove(['pendingAlert']);
}

// Load today's activity
async function loadTodayActivity() {
  const data = await chrome.storage.local.get(['activities']);
  const activities = data.activities || [];
  
  // Filter for today
  const today = new Date().toDateString();
  const todayActivities = activities.filter(a => new Date(a.timestamp).toDateString() === today);
  
  const activityList = document.getElementById('activityList');
  
  if (todayActivities.length === 0) {
    activityList.innerHTML = '<p class="empty-state">No activity detected today</p>';
    return;
  }
  
  activityList.innerHTML = todayActivities.slice(0, 5).map(a => `
    <div class="activity-item">
      <div class="activity-info">
        <div class="activity-icon ${a.type === 'positive' ? 'positive' : ''}">${a.icon}</div>
        <div class="activity-details">
          <div class="activity-title">${a.title}</div>
          <div class="activity-time">${formatTime(a.timestamp)}</div>
        </div>
      </div>
      <div class="activity-impact ${a.type}">${a.type === 'positive' ? '+' : ''}${a.co2.toFixed(1)} kg</div>
    </div>
  `).join('');
}

// Format time
function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

// Setup event listeners
function setupEventListeners() {
  document.getElementById('dismissBtn')?.addEventListener('click', hideImpactAlert);
  
  document.getElementById('offsetBtn')?.addEventListener('click', () => {
    // Send message to log an offset action
    chrome.runtime.sendMessage({ type: 'LOG_OFFSET_ACTION' });
    hideImpactAlert();
  });
  
  document.getElementById('openDashboard')?.addEventListener('click', (e) => {
    e.preventDefault();
    // Open the main CarbonWise dashboard (would be the deployed URL)
    chrome.tabs.create({ url: 'https://carbonwise.vercel.app' });
  });
  
  document.getElementById('settingsLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    // Open settings page
    chrome.runtime.openOptionsPage?.() || chrome.tabs.create({ url: 'settings.html' });
  });
  
  // Listen for suggestion clicks
  document.getElementById('suggestionList')?.addEventListener('click', (e) => {
    const item = e.target.closest('.suggestion-item');
    if (item) {
      // Log this as a positive action
      const points = parseInt(item.querySelector('.suggestion-points').textContent);
      chrome.runtime.sendMessage({ 
        type: 'LOG_ECO_TIP', 
        points,
        tip: item.querySelector('.suggestion-text').textContent 
      });
    }
  });
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'ACTIVITY_DETECTED') {
    loadStats();
    loadTodayActivity();
    if (message.showAlert) {
      showImpactAlert(message.alertData);
    }
  }
});
