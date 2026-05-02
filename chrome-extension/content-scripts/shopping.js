// CarbonWise Tracker - Shopping Sites (Amazon, Flipkart, Myntra)

(function() {
  'use strict';
  
  const hostname = window.location.hostname.toLowerCase();
  let SITE_NAME = 'Shopping';
  let CO2_PER_ORDER = 3.5;
  
  if (hostname.includes('amazon')) {
    SITE_NAME = 'Amazon';
    CO2_PER_ORDER = 3.5;
  } else if (hostname.includes('flipkart')) {
    SITE_NAME = 'Flipkart';
    CO2_PER_ORDER = 3.5;
  } else if (hostname.includes('myntra')) {
    SITE_NAME = 'Myntra';
    CO2_PER_ORDER = 3.0; // Fashion typically has slightly lower shipping weight
  }
  
  console.log(`CarbonWise: Tracking ${SITE_NAME}`);
  
  // Detect shopping activity
  function detectShoppingActivity() {
    const shoppingKeywords = [
      'place order',
      'buy now',
      'proceed to checkout',
      'proceed to pay',
      'confirm order',
      'place your order',
      'continue to payment',
      'add to cart',
      'add to bag'
    ];
    
    // Monitor button clicks
    document.addEventListener('click', (e) => {
      const target = e.target;
      const buttonText = (target.textContent || '').toLowerCase().trim();
      const inputValue = target.value?.toLowerCase() || '';
      const parentText = (target.closest('button, a, input[type="submit"], span')?.textContent || '').toLowerCase();
      
      const isShoppingButton = shoppingKeywords.some(keyword => 
        buttonText.includes(keyword) || parentText.includes(keyword) || inputValue.includes(keyword)
      );
      
      if (isShoppingButton) {
        handleShoppingDetected('button_click');
      }
    }, true);
    
    // Monitor URL changes
    let lastUrl = window.location.href;
    const urlObserver = new MutationObserver(() => {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        checkUrlForShoppingActivity();
      }
    });
    
    urlObserver.observe(document.body, { childList: true, subtree: true });
    checkUrlForShoppingActivity();
  }
  
  function checkUrlForShoppingActivity() {
    const url = window.location.href.toLowerCase();
    const shoppingKeywords = ['cart', 'checkout', 'payment', 'order', 'buy'];
    
    if (shoppingKeywords.some(keyword => url.includes(keyword))) {
      showCarbonIndicator();
    }
  }
  
  function handleShoppingDetected(trigger) {
    console.log(`CarbonWise: Shopping activity detected (${trigger})`);
    
    chrome.runtime.sendMessage({
      type: 'ACTIVITY_DETECTED',
      data: {
        category: 'shopping',
        action: 'order_placed',
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
    `;
    indicator.title = 'CarbonWise is tracking this page';
    
    indicator.addEventListener('click', showCarbonNotification);
    document.body.appendChild(indicator);
  }
  
  function showCarbonNotification() {
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
            Online shopping generates carbon through packaging, warehousing, and delivery. Small changes can make a big difference!
          </p>
        </div>
        <div class="carbonwise-actions">
          <button class="carbonwise-btn carbonwise-btn-secondary" data-action="dismiss">Got it</button>
          <button class="carbonwise-btn carbonwise-btn-primary" data-action="tips">Eco Tips</button>
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
    const tips = SITE_NAME === 'Myntra' ? [
      { text: 'Buy quality over quantity - choose durable items', icon: '👔' },
      { text: 'Look for sustainable fashion brands', icon: '🌿' },
      { text: 'Consider second-hand or vintage alternatives', icon: '♻️' },
      { text: 'Avoid fast fashion - it has high carbon cost', icon: '🚫' },
    ] : [
      { text: 'Consolidate orders to reduce deliveries', icon: '📦' },
      { text: 'Choose slower shipping - it is more efficient', icon: '🚚' },
      { text: 'Buy refurbished electronics when possible', icon: '♻️' },
      { text: 'Check for minimal or recyclable packaging', icon: '🌱' },
    ];
    
    const overlay = document.createElement('div');
    overlay.className = 'carbonwise-overlay';
    overlay.innerHTML = `
      <div class="carbonwise-notification" style="max-width: 360px;">
        <div class="carbonwise-header">
          <div class="carbonwise-logo">
            <span style="font-size: 20px;">💡</span>
            Eco Shopping Tips
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
  
  detectShoppingActivity();
  showCarbonIndicator();
})();
