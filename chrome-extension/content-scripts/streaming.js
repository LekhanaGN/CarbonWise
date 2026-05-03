// CarbonWise Tracker - Streaming Sites (YouTube, Netflix, Prime Video, Hotstar)

(function() {
  'use strict';
  
  const hostname = window.location.hostname.toLowerCase();
  
  let SITE_NAME = 'Streaming';
  if (hostname.includes('youtube')) SITE_NAME = 'YouTube';
  else if (hostname.includes('netflix')) SITE_NAME = 'Netflix';
  else if (hostname.includes('primevideo') || hostname.includes('amazon')) SITE_NAME = 'Prime Video';
  else if (hostname.includes('hotstar') || hostname.includes('jiohotstar')) SITE_NAME = 'Hotstar';
  
  const CO2_PER_HOUR = 0.036; // kg CO2 per hour (conservative HD streaming estimate)
  
  let sessionStart = Date.now();
  let isTracking = false;
  let accumulatedSeconds = 0;
  let trackingInterval = null;
  let lastActivityTime = Date.now();
  
  console.log(`[CarbonWise] Tracking ${SITE_NAME} streaming`);
  
  function detectPlatform() {
    return SITE_NAME;
  }
  
  function calculateStreamingCarbon(seconds) {
    const hours = seconds / 3600;
    return parseFloat((hours * CO2_PER_HOUR).toFixed(4));
  }
  
  function startTracking() {
    if (trackingInterval) return;
    
    sessionStart = Date.now();
    accumulatedSeconds = 0;
    isTracking = true;
    lastActivityTime = Date.now();
    
    console.log(`[CarbonWise] Started tracking ${SITE_NAME}`);
    
    // Increment accumulated seconds every 5 seconds
    trackingInterval = setInterval(() => {
      if (isTracking) {
        accumulatedSeconds += 5;
        updateIndicatorBadge();
      }
    }, 5000);
  }
  
  function stopTracking() {
    if (trackingInterval) {
      clearInterval(trackingInterval);
      trackingInterval = null;
    }
    isTracking = false;
  }
  
  function saveSession() {
    // Only save if watched for at least 10 seconds
    if (accumulatedSeconds < 10) {
      console.log(`[CarbonWise] Session too short (${accumulatedSeconds}s), not saving`);
      stopTracking();
      return;
    }
    
    const sessionData = {
      type: "streaming_session",
      platform: detectPlatform(),
      durationSeconds: accumulatedSeconds,
      carbonKg: calculateStreamingCarbon(accumulatedSeconds),
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString("en-IN"),
      id: Date.now() // Unique ID for this session
    };
    
    console.log(`[CarbonWise] Saving session:`, sessionData);
    
    // Save to chrome.storage.local
    chrome.storage.local.get(["carbonLogs"], (result) => {
      const logs = result.carbonLogs || [];
      logs.push(sessionData);
      chrome.storage.local.set({ carbonLogs: logs }, () => {
        console.log(`[CarbonWise] Session saved. Total logs: ${logs.length}`);
      });
    });
    
    stopTracking();
  }
  
  // Detect video play/pause
  function detectStreamingActivity() {
    const checkVideo = () => {
      const video = document.querySelector('video');
      
      if (video) {
        if (!video.paused && !isTracking) {
          startTracking();
        } else if (video.paused && isTracking) {
          stopTracking();
        }
        lastActivityTime = Date.now();
      }
    };
    
    // Check every 2 seconds
    setInterval(checkVideo, 2000);
    
    // Listen for play/pause events
    document.addEventListener('play', () => {
      if (!isTracking) startTracking();
      lastActivityTime = Date.now();
    }, true);
    
    document.addEventListener('pause', () => {
      if (isTracking) stopTracking();
    }, true);
  }
  
  function updateIndicatorBadge() {
    const badge = document.querySelector('.carbonwise-indicator-badge');
    if (badge) {
      const hours = Math.floor(accumulatedSeconds / 3600);
      const minutes = Math.floor((accumulatedSeconds % 3600) / 60);
      const secs = accumulatedSeconds % 60;
      
      if (hours > 0) {
        badge.textContent = `${hours}h ${minutes}m`;
      } else if (minutes > 0) {
        badge.textContent = `${minutes}m ${secs}s`;
      } else {
        badge.textContent = `${secs}s`;
      }
    }
  }
  
  function showCarbonIndicator() {
    const existing = document.querySelector('.carbonwise-indicator');
    if (existing) return;
    
    const indicator = document.createElement('div');
    indicator.className = 'carbonwise-indicator';
    indicator.innerHTML = `
      <div style="display: flex; align-items: center; gap: 4px;">
        <span style="font-size: 16px;">🌿</span>
        <div class="carbonwise-indicator-badge" style="font-size: 11px; font-weight: 600;">0s</div>
      </div>
    `;
    indicator.title = 'CarbonWise - Tracking streaming time';
    
    indicator.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 999999;
      padding: 8px 12px;
      background: linear-gradient(135deg, #059669 0%, #10b981 100%);
      color: white;
      border-radius: 24px;
      font-size: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      cursor: pointer;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    indicator.addEventListener('click', showCarbonNotification);
    document.body.appendChild(indicator);
  }
  
  function showCarbonNotification() {
    const existing = document.querySelector('.carbonwise-overlay');
    if (existing) return;
    
    const currentCO2 = calculateStreamingCarbon(accumulatedSeconds).toFixed(3);
    const hours = Math.floor(accumulatedSeconds / 3600);
    const minutes = Math.floor((accumulatedSeconds % 3600) / 60);
    const timeStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes} min`;
    
    const overlay = document.createElement('div');
    overlay.className = 'carbonwise-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    const notification = document.createElement('div');
    notification.style.cssText = `
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.2);
      max-width: 360px;
      width: 90%;
    `;
    
    notification.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 20px;">🌿</span>
          <span style="font-size: 16px; font-weight: 600; color: #059669;">CarbonWise</span>
        </div>
        <button class="close-btn" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #9ca3af;">×</button>
      </div>
      
      <div style="margin-bottom: 16px;">
        <div style="font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 8px;">
          ${isTracking ? '▶️ Streaming' : '⏸️ Paused'} - ${timeStr}
        </div>
        <p style="font-size: 13px; color: #6b7280; line-height: 1.5; margin: 0;">
          Streaming generates ~${CO2_PER_HOUR * 1000}g CO₂ per hour from data centers and networks.
          ${accumulatedSeconds > 0 ? `You have generated ~${currentCO2} kg CO₂ this session.` : 'Start watching to track impact.'}
        </p>
      </div>
      
      <div style="display: flex; gap: 8px;">
        <button class="dismiss-btn" style="flex: 1; padding: 8px 12px; border: 1px solid #d1d5db; background: white; border-radius: 6px; cursor: pointer; font-size: 13px; color: #374151;">Got it</button>
        <button class="log-btn" style="flex: 1; padding: 8px 12px; background: #059669; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500;">Log Session</button>
      </div>
    `;
    
    overlay.appendChild(notification);
    
    overlay.querySelector('.close-btn').addEventListener('click', () => {
      overlay.remove();
    });
    
    overlay.querySelector('.dismiss-btn').addEventListener('click', () => {
      overlay.remove();
    });
    
    overlay.querySelector('.log-btn').addEventListener('click', () => {
      saveSession();
      showSessionLoggedNotification();
      overlay.remove();
    });
    
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.remove();
      }
    });
    
    document.body.appendChild(overlay);
  }
  
  function showSessionLoggedNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999999;
      background: #10b981;
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    notification.textContent = '✓ Session logged successfully!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
  
  // Save session on tab close or navigation
  window.addEventListener('beforeunload', () => {
    if (isTracking && accumulatedSeconds >= 10) {
      // Use sendBeacon for reliability
      const sessionData = {
        type: "streaming_session",
        platform: detectPlatform(),
        durationSeconds: accumulatedSeconds,
        carbonKg: calculateStreamingCarbon(accumulatedSeconds),
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString("en-IN"),
        id: Date.now()
      };
      
      chrome.storage.local.get(["carbonLogs"], (result) => {
        const logs = result.carbonLogs || [];
        logs.push(sessionData);
        chrome.storage.local.set({ carbonLogs: logs });
      });
    }
  });
  
  // Detect visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopTracking();
    } else {
      // Resume if video is playing
      const video = document.querySelector('video');
      if (video && !video.paused) {
        startTracking();
      }
    }
  });
  
  // Initialize
  showCarbonIndicator();
  detectStreamingActivity();
})();
