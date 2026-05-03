// Inject script to capture user ID from dashboard and share with extension

(function() {
  'use strict';
  
  // Check if we're on the dashboard
  if (!window.location.pathname.includes('/dashboard')) {
    return;
  }
  
  // Get user ID from Supabase session
  function captureUserIdFromSupabase() {
    // Try to get from sessionStorage (set by auth)
    const authSession = sessionStorage.getItem('sb-session');
    if (authSession) {
      try {
        const session = JSON.parse(authSession);
        if (session.user?.id) {
          const userId = session.user.id;
          console.log('[CarbonWise] Captured user ID:', userId);
          
          // Store in localStorage for extension to access
          localStorage.setItem('carbonwise_user_id', userId);
          
          // Send to extension
          chrome.runtime.sendMessage({
            type: 'USER_AUTHENTICATED',
            userId: userId
          }).catch(() => {
            // Extension not available, that's fine
          });
          
          return userId;
        }
      } catch (e) {
        console.log('[CarbonWise] Could not parse auth session');
      }
    }
    
    // Fallback: Look for user info in window object
    if (window.__CARBONWISE_USER_ID__) {
      localStorage.setItem('carbonwise_user_id', window.__CARBONWISE_USER_ID__);
      return window.__CARBONWISE_USER_ID__;
    }
    
    return null;
  }
  
  // Capture on page load
  captureUserIdFromSupabase();
  
  // Re-capture when user ID changes
  const observer = new MutationObserver(() => {
    captureUserIdFromSupabase();
  });
  
  observer.observe(document.body, { 
    childList: true, 
    subtree: true, 
    characterData: true 
  });
  
  // Listen for auth changes
  window.addEventListener('storage', (e) => {
    if (e.key === 'sb-session' || e.key === 'SUPABASE_AUTH') {
      setTimeout(captureUserIdFromSupabase, 100);
    }
  });
})();
