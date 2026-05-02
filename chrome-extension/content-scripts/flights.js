// CarbonWise Tracker - Flight Booking Sites (MakeMyTrip, Goibibo)

(function() {
  'use strict';
  
  const hostname = window.location.hostname.toLowerCase();
  let SITE_NAME = hostname.includes('makemytrip') ? 'MakeMyTrip' : 'Goibibo';
  const CO2_PER_FLIGHT = 76.5; // 300km * 0.255 kg/km - High impact!
  
  console.log(`CarbonWise: Tracking ${SITE_NAME}`);
  
  // Detect flight booking activity
  function detectFlightActivity() {
    const flightKeywords = [
      'book now',
      'continue',
      'proceed',
      'confirm booking',
      'pay now',
      'complete booking',
      'review booking',
      'select flight'
    ];
    
    // Monitor button clicks
    document.addEventListener('click', (e) => {
      const target = e.target;
      const buttonText = (target.textContent || '').toLowerCase().trim();
      const parentText = (target.closest('button, a, div[role="button"]')?.textContent || '').toLowerCase();
      
      const isFlightButton = flightKeywords.some(keyword => 
        buttonText.includes(keyword) || parentText.includes(keyword)
      );
      
      if (isFlightButton) {
        handleFlightDetected('button_click');
      }
    }, true);
    
    // Monitor URL changes
    let lastUrl = window.location.href;
    const urlObserver = new MutationObserver(() => {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        checkUrlForFlightActivity();
      }
    });
    
    urlObserver.observe(document.body, { childList: true, subtree: true });
    checkUrlForFlightActivity();
  }
  
  function checkUrlForFlightActivity() {
    const url = window.location.href.toLowerCase();
    const flightKeywords = ['flight', 'booking', 'review', 'payment', 'itinerary'];
    
    if (flightKeywords.some(keyword => url.includes(keyword))) {
      showCarbonIndicator();
    }
  }
  
  function handleFlightDetected(trigger) {
    console.log(`CarbonWise: Flight activity detected (${trigger})`);
    
    chrome.runtime.sendMessage({
      type: 'ACTIVITY_DETECTED',
      data: {
        category: 'flights',
        action: 'flight_booked',
        details: {
          site: SITE_NAME,
          trigger,
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
      <div class="carbonwise-indicator-badge">!</div>
    `;
    indicator.title = 'CarbonWise - High carbon impact detected';
    
    indicator.addEventListener('click', showCarbonNotification);
    document.body.appendChild(indicator);
  }
  
  function showCarbonNotification() {
    const existing = document.querySelector('.carbonwise-overlay');
    if (existing) existing.remove();
    
    const overlay = document.createElement('div');
    overlay.className = 'carbonwise-overlay';
    overlay.innerHTML = `
      <div class="carbonwise-notification" style="background: linear-gradient(135deg, #dc2626 0%, #f97316 100%);">
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
          <div class="carbonwise-impact" style="color: #fef3c7;">
            ⚠️ ~${CO2_PER_FLIGHT} kg CO2
          </div>
          <p class="carbonwise-description">
            <strong>High Impact Alert!</strong> Flying is one of the most carbon-intensive activities. A short domestic flight (~300km) generates as much CO2 as driving 300+ km alone.
          </p>
        </div>
        <div class="carbonwise-actions">
          <button class="carbonwise-btn carbonwise-btn-secondary" data-action="dismiss">Got it</button>
          <button class="carbonwise-btn carbonwise-btn-primary" data-action="tips">Alternatives</button>
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
    }, 15000);
  }
  
  function showEcoTips() {
    const tips = [
      { text: 'Consider trains for domestic routes - 90% less emissions!', icon: '🚂' },
      { text: 'Choose direct flights - takeoff uses the most fuel', icon: '✈️' },
      { text: 'Fly economy class - more passengers = shared emissions', icon: '💺' },
      { text: 'Pack light - every kg matters for fuel efficiency', icon: '🧳' },
      { text: 'Offset your carbon footprint through verified programs', icon: '🌱' },
    ];
    
    const overlay = document.createElement('div');
    overlay.className = 'carbonwise-overlay';
    overlay.innerHTML = `
      <div class="carbonwise-notification" style="max-width: 360px;">
        <div class="carbonwise-header">
          <div class="carbonwise-logo">
            <span style="font-size: 20px;">💡</span>
            Eco Travel Alternatives
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
  
  detectFlightActivity();
  showCarbonIndicator();
})();
