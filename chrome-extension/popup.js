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
document.addEventListener('DOMContentLoaded', () => {
  loadStats();
  loadTodayActivity();
  checkCurrentPage();
  setupEventListeners();
  
  // Set up event listeners
  document.getElementById('openDashboard').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'https://carbonwise-dashboard.com/dashboard' });
  });
  
  document.getElementById('settingsLink').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: chrome.runtime.getURL('settings.html') });
  });
  
  // Refresh stats every 5 seconds
  setInterval(() => {
    loadStats();
    loadTodayActivity();
  }, 5000);
  
  // Sync logs to Supabase
  syncLogsToSupabase();
});

// Load user stats from storage
async function loadStats() {
  const data = await chrome.storage.local.get(['carbonLogs']);
  const logs = data.carbonLogs || [];
  
  // Calculate total carbon from all logs
  let totalCO2 = 0;
  logs.forEach(log => {
    if (log.carbonKg) {
      totalCO2 += log.carbonKg;
    }
  });
  
  document.getElementById('totalPoints').textContent = Math.floor(totalCO2 * 100); // Convert to points
  document.getElementById('totalCO2').textContent = totalCO2.toFixed(2);
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
  
  // For ecommerce sites, add a "Log Purchase" button
  if (site.category === 'shopping' || site.category === 'food' || site.category === 'transport') {
    const actionButton = document.createElement('button');
    actionButton.textContent = `Log ${site.category === 'shopping' ? 'Purchase' : site.category === 'food' ? 'Order' : 'Ride'}`;
    actionButton.style.cssText = `
      width: 100%;
      padding: 8px 12px;
      margin-top: 12px;
      background: #059669;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
    `;
    actionButton.addEventListener('click', () => logEcommercePurchase(site));
    
    suggestionList.appendChild(actionButton);
  }
  
  // Check for pending alerts from content script
  checkPendingAlerts();
}

function logEcommercePurchase(site) {
  const purchaseData = {
    type: "ecommerce_purchase",
    platform: site.name,
    label: Object.values(SITE_CONFIG).find(s => s.name === site.name)?.label || site.category,
    carbonKg: site.co2PerOrder || (site.co2PerKm * 5) || 2.5, // Default estimates
    timestamp: new Date().toISOString(),
    date: new Date().toLocaleDateString("en-IN"),
    id: Date.now()
  };
  
  chrome.storage.local.get(["carbonLogs"], (result) => {
    const logs = result.carbonLogs || [];
    logs.push(purchaseData);
    chrome.storage.local.set({ carbonLogs: logs }, () => {
      console.log(`[CarbonWise] Purchase logged:`, purchaseData);
      
      // Show confirmation
      const btn = event.target;
      btn.textContent = '✓ Logged!';
      btn.style.background = '#10b981';
      setTimeout(() => {
        btn.textContent = `Log ${site.category === 'shopping' ? 'Purchase' : 'Order'}`;
        btn.style.background = '#059669';
      }, 2000);
      
      // Update stats
      loadStats();
    });
  });
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

// Load today's activity from extension logs
async function loadTodayActivity() {
  const data = await chrome.storage.local.get(['carbonLogs']);
  const logs = data.carbonLogs || [];
  
  // Filter for today
  const today = new Date();
  const todayStr = today.toLocaleDateString("en-IN");
  const todayLogs = logs.filter(l => l.date === todayStr);
  
  const activityList = document.getElementById('activityList');
  
  if (todayLogs.length === 0) {
    activityList.innerHTML = '<p class="empty-state">No activity today</p>';
    return;
  }
  
  // Calculate totals for today
  let totalMinutes = 0;
  let totalCO2 = 0;
  
  todayLogs.forEach(log => {
    totalMinutes += Math.floor((log.durationSeconds || 0) / 60);
    totalCO2 += log.carbonKg;
  });
  
  // Group by category/type
  const byCategory = {};
  todayLogs.forEach(log => {
    const category = log.category || log.type || 'Other';
    if (!byCategory[category]) {
      byCategory[category] = { count: 0, co2: 0, items: [] };
    }
    byCategory[category].count += 1;
    byCategory[category].co2 += log.carbonKg;
    byCategory[category].items.push(log);
  });
  
  // Show summary
  const summary = `
    <div style="padding: 12px; background: #f0fdf4; border-radius: 8px; margin-bottom: 12px; border-left: 3px solid #10b981;">
      <div style="font-size: 12px; color: #059669; font-weight: 600;">Today's Activity</div>
      <div style="font-size: 14px; color: #047857; margin-top: 4px;">
        ${totalCO2.toFixed(3)} kg CO₂ • ${todayLogs.length} action${todayLogs.length > 1 ? 's' : ''}
      </div>
    </div>
  `;
  
  const categoryList = Object.entries(byCategory).map(([category, data]) => `
    <div class="activity-item" style="padding: 10px; background: #f9fafb; border-radius: 6px; margin-bottom: 8px;">
      <div class="activity-info">
        <div class="activity-icon" style="font-size: 16px;">${getCategoryIcon(category)}</div>
        <div class="activity-details">
          <div class="activity-title" style="font-size: 12px; font-weight: 600;">${formatCategoryName(category)}</div>
          <div class="activity-time" style="font-size: 11px; color: #9ca3af;">${data.count} action${data.count > 1 ? 's' : ''}</div>
        </div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 12px; color: #374151; font-weight: 500;">${data.co2.toFixed(3)} kg</div>
      </div>
    </div>
  `).join('');
  
  activityList.innerHTML = summary + categoryList;
}

function getCategoryIcon(category) {
  const icons = {
    'streaming_session': '▶️',
    'ecommerce_purchase': '🛍️',
    'food': '🍕',
    'shopping': '🛒',
    'transport': '🚗',
    'flights': '✈️',
    'Other': '📡'
  };
  return icons[category] || icons['Other'];
}

function formatCategoryName(category) {
  const names = {
    'streaming_session': 'Streaming',
    'ecommerce_purchase': 'Purchase',
    'food': 'Food',
    'shopping': 'Shopping',
    'transport': 'Transport',
    'flights': 'Flights',
    'Other': 'Other'
  };
  return names[category] || category;
}

// Sync logs to Supabase
async function syncLogsToSupabase() {
  try {
    // Get user ID from localStorage (set when user logs in on dashboard)
    const userIdStored = localStorage.getItem('carbonwise_user_id');
    if (!userIdStored) {
      console.log('[CarbonWise] No user ID stored, skipping sync');
      return;
    }

    // Get unsynced logs from chrome storage
    chrome.storage.local.get(['carbonLogs', 'syncedIds'], async (result) => {
      const logs = result.carbonLogs || [];
      const syncedIds = result.syncedIds || [];

      // Filter unsyned logs
      const unsyncedLogs = logs.filter(log => {
        const logId = log.id?.toString() || '';
        return !syncedIds.includes(logId);
      });

      if (unsyncedLogs.length === 0) {
        console.log('[CarbonWise] No unsynced logs to send');
        return;
      }

      console.log(`[CarbonWise] Syncing ${unsyncedLogs.length} logs to Supabase`);

      try {
        // Send to backend API
        const response = await fetch(
          chrome.runtime.getURL('../../api/carbon-logs'),
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: userIdStored,
              logs: unsyncedLogs
            })
          }
        ).catch(() => {
          // If extension cannot reach API, try direct fetch
          return fetch('https://carbonwise-dashboard.com/api/carbon-logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: userIdStored,
              logs: unsyncedLogs
            })
          });
        });

        if (response?.ok) {
          console.log('[CarbonWise] Logs synced successfully');
          
          // Mark logs as synced
          const syncedLogIds = unsyncedLogs.map(l => l.id?.toString() || '');
          chrome.storage.local.set({
            syncedIds: [...syncedIds, ...syncedLogIds]
          });
        }
      } catch (err) {
        console.log('[CarbonWise] Sync error:', err.message);
      }
    });
  } catch (err) {
    console.log('[CarbonWise] Sync setup error:', err);
  }
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
