# CarbonWise Tracker - Chrome Extension

A Chrome Extension (Manifest V3) that tracks user actions on popular websites and provides real-time carbon footprint feedback.

## Features

- **Real-time Tracking**: Monitors activity on food delivery, transport, shopping, flights, and streaming sites
- **Carbon Impact Alerts**: Shows estimated CO2 emissions for detected activities
- **Eco Suggestions**: Provides actionable tips to reduce your carbon footprint
- **Points System**: Earn points for following eco-friendly suggestions
- **Activity History**: Track your daily carbon impact

## Supported Websites

### Food Delivery
- Swiggy (swiggy.com)
- Zomato (zomato.com)

### Transport
- Uber (uber.com)
- Ola (ola.com)
- RedBus (redbus.in) - Eco-friendly option!

### Shopping
- Amazon India (amazon.in)
- Flipkart (flipkart.com)
- Myntra (myntra.com)

### Flights (High Impact)
- MakeMyTrip (makemytrip.com)
- Goibibo (goibibo.com)

### Streaming
- YouTube (youtube.com)
- Netflix (netflix.com)

## Installation

1. Clone or download this extension folder
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right)
4. Click "Load unpacked"
5. Select the `chrome-extension` folder

## Setup Icons

Before loading the extension, create icon files:

1. Create an `icons` folder in the extension directory
2. Add the following icon files:
   - `icon16.png` (16x16 pixels)
   - `icon48.png` (48x48 pixels)
   - `icon128.png` (128x128 pixels)

You can use any leaf/eco-themed icon or create a simple green circle with a leaf symbol.

## How It Works

### Detection (Simulated for MVP)
The extension detects activity based on:
- Button clicks with keywords like "order", "book", "checkout"
- URL changes to checkout/payment pages
- Video playback for streaming sites

### Carbon Values (Demo)
For MVP, we use fixed estimated values:
- Food order: ~2.5 kg CO2
- Ride (10 km): ~2.1 kg CO2
- Shopping order: ~3.5 kg CO2
- Flight (300 km): ~76.5 kg CO2
- Streaming: ~0.05 kg CO2/hour

### Eco Points
Users earn points by:
- Following eco-friendly suggestions
- Choosing eco-friendly options (like RedBus)
- Logging offset actions

## File Structure

```
chrome-extension/
├── manifest.json         # Extension configuration
├── popup.html           # Popup UI
├── popup.css            # Popup styles
├── popup.js             # Popup logic
├── background.js        # Service worker
├── content-scripts/
│   ├── overlay.css      # Notification styles
│   ├── food.js          # Swiggy, Zomato tracking
│   ├── transport.js     # Uber, Ola, RedBus tracking
│   ├── shopping.js      # Amazon, Flipkart, Myntra tracking
│   ├── flights.js       # MakeMyTrip, Goibibo tracking
│   └── streaming.js     # YouTube, Netflix tracking
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Privacy

This extension:
- Only tracks activity on listed websites
- Stores data locally in Chrome storage
- Does not send data to external servers (MVP version)
- Does not collect personal information

## Development

To modify or extend:

1. Edit content scripts to add new detection patterns
2. Update `SITE_CONFIG` in popup.js for new sites
3. Add new entries in manifest.json host_permissions
4. Create new content scripts for additional categories

## Future Enhancements

- Integration with CarbonWise dashboard
- Sync data across devices
- Community leaderboards
- Carbon offset partnerships
- More accurate carbon calculations using real data
- Browser notifications for daily/weekly summaries
