// CarbonWise Tracker - Food Delivery Sites (Swiggy, Zomato)

(function() {
  'use strict';
  
  const SITE_NAME = window.location.hostname.includes('swiggy') ? 'Swiggy' : 'Zomato';
  const CO2_PER_ORDER = 2.5; // kg
  
  console.log(`CarbonWise: Tracking ${SITE_NAME}`);
  
  // Detect order placement by monitoring buttons and URLs
  function detectOrderActivity() {
    // Keywords that indicate ordering activity
    const orderKeywords = [
      'place order',
      'proceed to pay',
      'pay now',
      'confirm order',
      'checkout',
      'add to cart',
      'order now'
    ];
    
    // Monitor all button clicks
    document.addEventListener('click', (e) => {
      const target = e.target;
      const buttonText = (target.textContent || '').toLowerCase().trim();
      const parentText = (target.closest('button, a, div[role="button"]')?.textContent || '').toLowerCase();
      
      // Check if it's an order-related button
      const isOrderButton = orderKeywords.some(keyword => 
        buttonText.includes(keyword) || parentText.includes(keyword)
      );
      
      if (isOrderButton) {
        handleOrderDetected('button_click');
      }
    }, true);
    
    // Monitor URL changes for checkout pages
    let lastUrl = window.location.href;
    const urlObserver = new MutationObserver(() => {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        checkUrlForOrderActivity();
      }
    });
    
    urlObserver.observe(document.body, { childList: true, subtree: true });
    
    // Check initial URL
    checkUrlForOrderActivity();
  }
  
  function checkUrlForOrderActivity() {
    const url = window.location.href.toLowerCase();
    const checkoutKeywords = ['checkout', 'cart', 'payment', 'order'];
    
    if (checkoutKeywords.some(keyword => url.includes(keyword))) {
      showCarbonIndicator();
    }
  }
  
  // Handle detected order
  function handleOrderDetected(trigger) {
    console.log(`CarbonWise: Order activity detected (${trigger})`);
    
    // Send message to background script
    chrome.runtime.sendMessage({
      type: 'ACTIVITY_DETECTED',
      data: {
        category: 'food',
        action: 'order_placed',
        details: {
          site: SITE_NAME,
          trigger,
          timestamp: new Date().toISOString(),
        }
      }
    });
    
    // Show notification overlay
    showCarbonNotification();
  }
  
  // Show carbon indicator
  function showCarbonIndicator() {
    // Remove existing indicator
    const existing = document.querySelector('.carbonwise-indicator');
    if (existing) return;
    
    const indicator = document.createElement('div');
    indicator.className = 'carbonwise-indicator';
    indicator.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    `;
    indicator.title = 'CarbonWise is tracking this page';
    
    indicator.addEventListener('click', () => {
      showCarbonNotification();
    });
    
    document.body.appendChild(indicator);
  }
  
  // Show carbon notification overlay
  function showCarbonNotification() {
    // Remove existing notification
    const existing = document.querySelector('.carbonwise-overlay');
    if (existing) existing.remove();
    
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
          <div class="carbonwise-impact negative">~${CO2_PER_ORDER} kg CO2</div>
          <p class="carbonwise-description">
            Food delivery orders generate carbon emissions from cooking, packaging, and delivery. Consider these eco-friendly alternatives!
          </p>
        </div>
        <div class="carbonwise-actions">
          <button class="carbonwise-btn carbonwise-btn-secondary" data-action="dismiss">Got it</button>
          <button class="carbonwise-btn carbonwise-btn-primary" data-action="tips">Eco Tips</button>
        </div>
      </div>
    `;
    
    // Add event listeners
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
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      if (document.body.contains(overlay)) {
        overlay.querySelector('.carbonwise-notification').classList.add('hiding');
        setTimeout(() => overlay.remove(), 300);
      }
    }, 10000);
  }
  
  // Show eco tips
  function showEcoTips() {
    const tips = [
      { text: 'Choose restaurants nearby to reduce delivery distance', icon: '📍' },
      { text: 'Opt out of plastic cutlery and napkins', icon: '🍴' },
      { text: 'Order vegetarian meals - they have lower carbon footprint', icon: '🥗' },
      { text: 'Consolidate orders with friends or family', icon: '👥' },
    ];
    
    const overlay = document.createElement('div');
    overlay.className = 'carbonwise-overlay';
    overlay.innerHTML = `
      <div class="carbonwise-notification" style="max-width: 360px;">
        <div class="carbonwise-header">
          <div class="carbonwise-logo">
            <span style="font-size: 20px;">💡</span>
            Eco Tips
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
  
  // Initialize
  detectOrderActivity();
  showCarbonIndicator();
})();
