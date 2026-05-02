// CarbonWise Tracker - Background Service Worker

// Carbon impact values (simulated for MVP)
const CARBON_VALUES = {
  food: { 
    orderValue: 500, // INR
    co2: 2.5, // kg CO2 per order
  },
  transport: {
    distance: 10, // km
    co2PerKm: 0.21, // kg CO2 per km for cars
  },
  shopping: {
    orderValue: 1000, // INR
    co2: 3.5, // kg CO2 per order
  },
  flights: {
    distance: 300, // km
    co2PerKm: 0.255, // kg CO2 per km for flights
  },
  streaming: {
    hoursPerDay: 2,
    co2PerHour: 0.05, // kg CO2 per hour
  },
};

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('CarbonWise Tracker installed');
  
  // Set default storage values
  chrome.storage.local.set({
    totalPoints: 0,
    totalCO2Saved: 0,
    totalCO2Generated: 0,
    activities: [],
    settings: {
      notifications: true,
      autoTrack: true,
    }
  });
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'ACTIVITY_DETECTED':
      handleActivityDetected(message.data, sender.tab);
      break;
      
    case 'ORDER_PLACED':
      handleOrderPlaced(message.data, sender.tab);
      break;
      
    case 'LOG_OFFSET_ACTION':
      logOffsetAction();
      break;
      
    case 'LOG_ECO_TIP':
      logEcoTip(message.points, message.tip);
      break;
      
    case 'GET_STATS':
      getStats().then(sendResponse);
      return true; // Keep channel open for async response
  }
});

// Handle activity detection from content scripts
async function handleActivityDetected(data, tab) {
  const { category, action, details } = data;
  
  // Calculate carbon impact based on category
  let co2Impact = 0;
  let description = '';
  
  switch (category) {
    case 'food':
      co2Impact = CARBON_VALUES.food.co2;
      description = `Food order on ${details.site}`;
      break;
      
    case 'transport':
      co2Impact = CARBON_VALUES.transport.distance * CARBON_VALUES.transport.co2PerKm;
      description = `Ride booking on ${details.site}`;
      break;
      
    case 'shopping':
      co2Impact = CARBON_VALUES.shopping.co2;
      description = `Shopping order on ${details.site}`;
      break;
      
    case 'flights':
      co2Impact = CARBON_VALUES.flights.distance * CARBON_VALUES.flights.co2PerKm;
      description = `Flight booking on ${details.site}`;
      break;
      
    case 'streaming':
      co2Impact = CARBON_VALUES.streaming.co2PerHour;
      description = `Streaming on ${details.site}`;
      break;
  }
  
  // Save activity
  const activity = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    category,
    action,
    site: details.site,
    co2: co2Impact,
    type: 'negative',
    icon: getCategoryIcon(category),
    title: description,
  };
  
  await saveActivity(activity);
  
  // Update total CO2 generated
  const data_stored = await chrome.storage.local.get(['totalCO2Generated']);
  await chrome.storage.local.set({
    totalCO2Generated: (data_stored.totalCO2Generated || 0) + co2Impact,
  });
  
  // Create pending alert for popup
  await chrome.storage.local.set({
    pendingAlert: {
      co2: co2Impact,
      description,
      category,
    }
  });
  
  // Show notification if enabled
  const settings = await chrome.storage.local.get(['settings']);
  if (settings.settings?.notifications) {
    chrome.notifications?.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Carbon Impact Detected',
      message: `${description} generates ~${co2Impact.toFixed(1)} kg CO2. Tap to see eco alternatives!`,
    });
  }
  
  // Send update to popup if open
  chrome.runtime.sendMessage({
    type: 'ACTIVITY_DETECTED',
    showAlert: true,
    alertData: {
      co2: co2Impact,
      description,
    }
  }).catch(() => {}); // Ignore if popup is not open
}

// Handle order placement
async function handleOrderPlaced(data, tab) {
  handleActivityDetected(data, tab);
}

// Log an offset action
async function logOffsetAction() {
  const points = 25;
  const co2Offset = 1.5;
  
  const activity = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    category: 'offset',
    action: 'offset_logged',
    site: 'CarbonWise',
    co2: co2Offset,
    type: 'positive',
    icon: '🌱',
    title: 'Offset action logged',
  };
  
  await saveActivity(activity);
  
  // Update points and CO2 saved
  const data = await chrome.storage.local.get(['totalPoints', 'totalCO2Saved']);
  await chrome.storage.local.set({
    totalPoints: (data.totalPoints || 0) + points,
    totalCO2Saved: (data.totalCO2Saved || 0) + co2Offset,
  });
  
  // Notify popup
  chrome.runtime.sendMessage({ type: 'ACTIVITY_DETECTED' }).catch(() => {});
}

// Log an eco tip as completed
async function logEcoTip(points, tip) {
  const activity = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    category: 'tip',
    action: 'tip_completed',
    site: 'CarbonWise',
    co2: 0.5, // Small CO2 saving for following tips
    type: 'positive',
    icon: '💡',
    title: `Followed eco tip: ${tip.substring(0, 30)}...`,
  };
  
  await saveActivity(activity);
  
  // Update points
  const data = await chrome.storage.local.get(['totalPoints', 'totalCO2Saved']);
  await chrome.storage.local.set({
    totalPoints: (data.totalPoints || 0) + points,
    totalCO2Saved: (data.totalCO2Saved || 0) + 0.5,
  });
  
  // Notify popup
  chrome.runtime.sendMessage({ type: 'ACTIVITY_DETECTED' }).catch(() => {});
}

// Save activity to storage
async function saveActivity(activity) {
  const data = await chrome.storage.local.get(['activities']);
  const activities = data.activities || [];
  
  // Keep only last 100 activities
  activities.unshift(activity);
  if (activities.length > 100) {
    activities.pop();
  }
  
  await chrome.storage.local.set({ activities });
}

// Get current stats
async function getStats() {
  const data = await chrome.storage.local.get([
    'totalPoints', 
    'totalCO2Saved', 
    'totalCO2Generated',
    'activities'
  ]);
  
  return {
    totalPoints: data.totalPoints || 0,
    totalCO2Saved: data.totalCO2Saved || 0,
    totalCO2Generated: data.totalCO2Generated || 0,
    activityCount: (data.activities || []).length,
  };
}

// Get category icon
function getCategoryIcon(category) {
  const icons = {
    food: '🍔',
    transport: '🚗',
    shopping: '🛒',
    flights: '✈️',
    streaming: '▶️',
    offset: '🌱',
    tip: '💡',
  };
  return icons[category] || '📊';
}

// Listen for tab updates to detect navigation
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Notify any open popup about page change
    chrome.runtime.sendMessage({ type: 'TAB_UPDATED', url: tab.url }).catch(() => {});
  }
});
