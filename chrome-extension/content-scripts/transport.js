// CarbonWise Tracker - Transport Sites (Uber, Ola, RedBus)

(function() {
  'use strict';
  
  const hostname = window.location.hostname.toLowerCase();
  let SITE_NAME = 'Transport';
  let CO2_PER_TRIP = 2.1; // Default for 10km car ride
  let IS_ECO = false;
  
  if (hostname.includes('uber')) {
    SITE_NAME = 'Uber';
    CO2_PER_TRIP = 2.1;
  } else if (hostname.includes('ola')) {
    SITE_NAME = 'Ola';
    CO2_PER_TRIP = 2.1;
  } else if (hostname.includes('redbus')) {
    SITE_NAME = 'RedBus';
    CO2_PER_TRIP = 0.89; // Buses are more eco-friendly
    IS_ECO = true;
  }
  
  console.log(`CarbonWise: Tracking ${SITE_NAME}`);
  
  // Detect ride booking activity
  function detectRideActivity() {
    const bookingKeywords = [
      'confirm',
      'book',
      'request',
      'continue',
      'proceed',
      'pay',
      'select seat',
      'book now'
    ];
    
    // Monitor button clicks
    document.addEventListener('click', (e) => {
      const target = e.target;
      const buttonText = (target.textContent || '').toLowerCase().trim();
      const parentText = (target.closest('button, a, div[role="button"]')?.textContent || '').toLowerCase();
      
      const isBookingButton = bookingKeywords.some(keyword => 
        buttonText.includes(keyword) || parentText.includes(keyword)
      );
      
      if (isBookingButton) {
        handleRideDetected('button_click');
      }
    }, true);
    
    // Monitor URL changes
    let lastUrl = window.location.href;
    const urlObserver = new MutationObserver(() => {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        checkUrlForRideActivity();
      }
    });
    
    urlObserver.observe(document.body, { childList: true, subtree: true });
    checkUrlForRideActivity();
  }
  
  function checkUrlForRideActivity() {
    const url = window.location.href.toLowerCase();
    const rideKeywords = ['booking', 'confirm', 'checkout', 'payment', 'ride'];
    
    if (rideKeywords.some(keyword => url.includes(keyword))) {
      showCarbonIndicator();
    }
  }
  
  function handleRideDetected(trigger) {
    console.log(`CarbonWise: Ride activity detected (${trigger})`);
    
    chrome.runtime.sendMessage({
      type: 'ACTIVITY_DETECTED',
      data: {
        category: 'transport',
        action: 'ride_booked',
        details: {
          site: SITE_NAME,
          trigger,
          isEco: IS_ECO,
          timestamp: new Date().toISOString(),
        }
      }
    });
    
    showCarbonNotification();
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
      ${!IS_ECO ? '<div class="carbonwise-indicator-badge">!</div>' : ''}
    `;
    indicator.title = 'CarbonWise is tracking this page';
    
    indicator.addEventListener('click', showCarbonNotification);
    document.body.appendChild(indicator);
  }
  
  function showCarbonNotification() {
    const existing = document.querySelector('.carbonwise-overlay');
    if (existing) existing.remove();
    
    const impactClass = IS_ECO ? 'positive' : 'negative';
    const message = IS_ECO 
      ? `Great choice! Bus travel is ${Math.round((2.1 - CO2_PER_TRIP) / 2.1 * 100)}% more eco-friendly than car rides.`
      : `A ${SITE_NAME} ride of ~10km generates approximately ${CO2_PER_TRIP} kg of CO2. Consider these alternatives!`;
    
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
          <div class="carbonwise-impact ${impactClass}">
            ${IS_ECO ? '🌱 Eco Choice!' : `~${CO2_PER_TRIP} kg CO2`}
          </div>
          <p class="carbonwise-description">${message}</p>
        </div>
        <div class="carbonwise-actions">
          <button class="carbonwise-btn carbonwise-btn-secondary" data-action="dismiss">Got it</button>
          ${!IS_ECO ? '<button class="carbonwise-btn carbonwise-btn-primary" data-action="tips">Eco Tips</button>' : ''}
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
    
    const tipsBtn = overlay.querySelector('[data-action="tips"]');
    if (tipsBtn) {
      tipsBtn.addEventListener('click', () => {
        showEcoTips();
        overlay.querySelector('.carbonwise-notification').classList.add('hiding');
        setTimeout(() => overlay.remove(), 300);
      });
    }
    
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
      { text: 'Use carpooling options like Uber Pool or Ola Share', icon: '👥' },
      { text: 'Choose electric or CNG vehicles when available', icon: '⚡' },
      { text: 'Consider public transport for longer routes', icon: '🚌' },
      { text: 'Walk or cycle for short distances (< 2km)', icon: '🚶' },
    ];
    
    const overlay = document.createElement('div');
    overlay.className = 'carbonwise-overlay';
    overlay.innerHTML = `
      <div class="carbonwise-notification" style="max-width: 360px;">
        <div class="carbonwise-header">
          <div class="carbonwise-logo">
            <span style="font-size: 20px;">💡</span>
            Eco Transport Tips
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
  
  detectRideActivity();
  showCarbonIndicator();
})();
