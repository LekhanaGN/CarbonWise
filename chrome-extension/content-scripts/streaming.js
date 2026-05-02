// CarbonWise Tracker - Streaming Sites (YouTube, Netflix)

(function() {
  'use strict';
  
  const hostname = window.location.hostname.toLowerCase();
  let SITE_NAME = hostname.includes('youtube') ? 'YouTube' : 'Netflix';
  const CO2_PER_HOUR = SITE_NAME === 'YouTube' ? 0.036 : 0.055; // kg CO2 per hour
  
  let watchTime = 0;
  let lastUpdate = Date.now();
  let isTracking = false;
  
  console.log(`CarbonWise: Tracking ${SITE_NAME}`);
  
  // Detect streaming activity
  function detectStreamingActivity() {
    // For YouTube - detect video playing
    if (SITE_NAME === 'YouTube') {
      detectYouTubeActivity();
    } else {
      detectNetflixActivity();
    }
    
    // Show indicator
    showCarbonIndicator();
    
    // Update watch time periodically
    setInterval(updateWatchTime, 60000); // Every minute
  }
  
  function detectYouTubeActivity() {
    // Monitor video player state
    const checkVideo = () => {
      const video = document.querySelector('video');
      if (video && !video.paused) {
        if (!isTracking) {
          isTracking = true;
          lastUpdate = Date.now();
          updateIndicatorState(true);
        }
      } else {
        if (isTracking) {
          isTracking = false;
          updateIndicatorState(false);
        }
      }
    };
    
    // Check periodically
    setInterval(checkVideo, 5000);
    
    // Also listen for play/pause events
    document.addEventListener('play', () => {
      isTracking = true;
      lastUpdate = Date.now();
      updateIndicatorState(true);
    }, true);
    
    document.addEventListener('pause', () => {
      isTracking = false;
      updateIndicatorState(false);
    }, true);
  }
  
  function detectNetflixActivity() {
    // Netflix video detection
    const checkVideo = () => {
      const video = document.querySelector('video');
      if (video && !video.paused) {
        if (!isTracking) {
          isTracking = true;
          lastUpdate = Date.now();
          updateIndicatorState(true);
        }
      } else {
        if (isTracking) {
          isTracking = false;
          updateIndicatorState(false);
        }
      }
    };
    
    setInterval(checkVideo, 5000);
  }
  
  function updateWatchTime() {
    if (isTracking) {
      const now = Date.now();
      const elapsed = (now - lastUpdate) / 1000 / 3600; // Convert to hours
      watchTime += elapsed;
      lastUpdate = now;
      
      // Send update to background
      const co2Generated = watchTime * CO2_PER_HOUR;
      
      if (watchTime >= 0.5) { // After 30 minutes, send an update
        chrome.runtime.sendMessage({
          type: 'ACTIVITY_DETECTED',
          data: {
            category: 'streaming',
            action: 'streaming_session',
            details: {
              site: SITE_NAME,
              duration: watchTime,
              co2: co2Generated,
              timestamp: new Date().toISOString(),
            }
          }
        });
      }
      
      updateIndicatorBadge();
    }
  }
  
  function updateIndicatorState(active) {
    const indicator = document.querySelector('.carbonwise-indicator');
    if (indicator) {
      indicator.style.background = active 
        ? 'linear-gradient(135deg, #f59e0b 0%, #eab308 100%)'
        : 'linear-gradient(135deg, #166534 0%, #22c55e 100%)';
    }
  }
  
  function updateIndicatorBadge() {
    const badge = document.querySelector('.carbonwise-indicator-badge');
    if (badge) {
      const hours = Math.floor(watchTime);
      const minutes = Math.floor((watchTime - hours) * 60);
      badge.textContent = hours > 0 ? `${hours}h` : `${minutes}m`;
    }
  }
  
  function showCarbonIndicator() {
    const existing = document.querySelector('.carbonwise-indicator');
    if (existing) return;
    
    const indicator = document.createElement('div');
    indicator.className = 'carbonwise-indicator';
    indicator.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
      <div class="carbonwise-indicator-badge" style="font-size: 9px;">0m</div>
    `;
    indicator.title = 'CarbonWise - Tracking streaming time';
    
    indicator.addEventListener('click', showCarbonNotification);
    document.body.appendChild(indicator);
  }
  
  function showCarbonNotification() {
    const existing = document.querySelector('.carbonwise-overlay');
    if (existing) existing.remove();
    
    const currentCO2 = (watchTime * CO2_PER_HOUR).toFixed(3);
    const hours = Math.floor(watchTime);
    const minutes = Math.floor((watchTime - hours) * 60);
    const timeStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes} minutes`;
    
    const overlay = document.createElement('div');
    overlay.className = 'carbonwise-overlay';
    overlay.innerHTML = `
      <div class="carbonwise-notification">
        <div class="carbonwise-header">
          <div class="carbonwise-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            CarbonWise
          </div>
          <button class="carbonwise-close">&times;</button>
        </div>
        <div class="carbonwise-content">
          <div class="carbonwise-impact" style="font-size: 18px;">
            ${isTracking ? '▶️ Streaming' : '⏸️ Paused'} - ${timeStr}
          </div>
          <p class="carbonwise-description">
            Streaming generates ~${CO2_PER_HOUR * 1000}g CO2 per hour from data centers and network infrastructure. 
            ${watchTime > 0 ? `You have generated ~${currentCO2} kg CO2 this session.` : 'Start watching to track impact.'}
          </p>
        </div>
        <div class="carbonwise-actions">
          <button class="carbonwise-btn carbonwise-btn-secondary" data-action="dismiss">Got it</button>
          <button class="carbonwise-btn carbonwise-btn-primary" data-action="tips">Save Energy</button>
        </div>
      </div>
    `;
    
    overlay.querySelector('.carbonwise-close').addEventListener('click', () => {
      overlay.querySelector('.carbonwise-notification').classList.add('hiding');
      setTimeout(() => overlay.remove(), 300);
    });
    
    overlay.querySelector('[data-action="dismiss"]').addEventListener('click', () => {
      overlay.querySelector('.carbonwise-notification').classList.add('hiding');
      setTimeout(() => overlay.remove(), 300);
    });
    
    overlay.querySelector('[data-action="tips"]').addEventListener('click', () => {
      showEcoTips();
      overlay.querySelector('.carbonwise-notification').classList.add('hiding');
      setTimeout(() => overlay.remove(), 300);
    });
    
    document.body.appendChild(overlay);
    
    setTimeout(() => {
      if (document.body.contains(overlay)) {
        overlay.querySelector('.carbonwise-notification').classList.add('hiding');
        setTimeout(() => overlay.remove(), 300);
      }
    }, 10000);
  }
  
  function showEcoTips() {
    const tips = [
      { text: 'Watch in lower resolution (720p) - uses 50% less energy', icon: '📺' },
      { text: 'Download videos on WiFi to watch offline', icon: '📥' },
      { text: 'Use dark mode themes to save screen energy', icon: '🌙' },
      { text: 'Take breaks - good for you and the planet!', icon: '☕' },
      { text: 'Stream on smaller screens when possible', icon: '📱' },
    ];
    
    const overlay = document.createElement('div');
    overlay.className = 'carbonwise-overlay';
    overlay.innerHTML = `
      <div class="carbonwise-notification" style="max-width: 360px;">
        <div class="carbonwise-header">
          <div class="carbonwise-logo">
            <span style="font-size: 20px;">💡</span>
            Energy Saving Tips
          </div>
          <button class="carbonwise-close">&times;</button>
        </div>
        <div class="carbonwise-content" style="margin-bottom: 0;">
          ${tips.map(tip => `
            <div style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px;">
              <span style="font-size: 18px;">${tip.icon}</span>
              <span style="font-size: 13px; line-height: 1.4;">${tip.text}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    overlay.querySelector('.carbonwise-close').addEventListener('click', () => {
      overlay.querySelector('.carbonwise-notification').classList.add('hiding');
      setTimeout(() => overlay.remove(), 300);
    });
    
    document.body.appendChild(overlay);
  }
  
  detectStreamingActivity();
})();
