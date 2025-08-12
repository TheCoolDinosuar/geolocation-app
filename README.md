# Device Location Tracker

A JavaScript website that displays the longitude and latitude of the user's device using the Geolocation API.

## Features

- **Real-time Location Tracking**: Get current longitude and latitude coordinates
- **Watch Location**: Continuously monitor location changes
- **Detailed Information**: Display accuracy, altitude, heading, speed, and more
- **Copy Coordinates**: One-click copying to clipboard
- **Open in Maps**: Direct link to view location in Google Maps
- **Responsive Design**: Works on desktop and mobile devices
- **PWA Ready**: Includes service worker for offline functionality

## Files Structure

```
geolocation-website/
├── index.html      # Main HTML file
├── styles.css      # CSS styling
├── script.js       # JavaScript functionality
├── sw.js           # Service worker (PWA)
└── README.md       # This file
```

## How to Use

1. **Open the Website**: 
   - Open `index.html` in a web browser
   - Or serve the files using a local web server

2. **Grant Location Permission**:
   - When prompted, allow location access
   - The website needs this permission to function

3. **Get Location**:
   - Click "Get My Location" for a one-time location request
   - Click "Watch Location" to continuously monitor location changes
   - Click "Stop Watching" to stop continuous monitoring

4. **Additional Features**:
   - Click "Copy Coordinates" to copy lat/lng to clipboard
   - Click "Open in Maps" to view location in Google Maps
   - Expand "More Location Details" for additional information

## Browser Requirements

- Modern web browser with Geolocation API support
- HTTPS connection (required for geolocation on most browsers)
- JavaScript enabled

## Local Development

To run locally with HTTPS (recommended):

### Using Python:
```bash
# Python 3
python -m http.server 8000

# Then visit: http://localhost:8000
```

### Using Node.js (with http-server):
```bash
npm install -g http-server
http-server

# For HTTPS:
http-server -S -C cert.pem -K key.pem
```

### Using Live Server (VS Code extension):
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## Security Notes

- **Location Privacy**: The website only displays location data locally
- **No Data Storage**: Coordinates are not stored or transmitted anywhere
- **HTTPS Required**: Most browsers require HTTPS for geolocation access
- **Permission Required**: Users must explicitly grant location permission

## Browser Compatibility

- ✅ Chrome 5+
- ✅ Firefox 3.5+
- ✅ Safari 5+
- ✅ Edge 12+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Error Handling

The application handles various error scenarios:
- Location permission denied
- Location unavailable
- Request timeout
- Browser not supporting geolocation

## Customization

### Geolocation Options
Modify the `options` object in `script.js`:
```javascript
const options = {
    enableHighAccuracy: true,  // Use GPS if available
    timeout: 10000,           // Timeout in milliseconds
    maximumAge: 0             // Maximum age of cached position
};
```

### Styling
Customize the appearance by modifying `styles.css`. The design uses:
- CSS Grid and Flexbox for layout
- CSS gradients for visual appeal
- Responsive design principles
- Modern font stack

## PWA Features

The website includes basic Progressive Web App features:
- Service worker for offline caching
- Responsive design for mobile devices
- App-like interface

To enhance PWA capabilities, add:
- Web app manifest file
- App icons
- Install prompts

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Feel free to contribute by:
- Reporting bugs
- Suggesting new features
- Submitting pull requests
- Improving documentation

## Support

For issues or questions:
1. Check browser console for error messages
2. Ensure location permissions are granted
3. Verify HTTPS is being used
4. Test in different browsers
