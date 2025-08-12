# Relative Position Tracker

A JavaScript website that displays your position relative to a starting point with **meter-level precision** using high-accuracy GPS tracking.

## Features

- **🎯 Set Starting Point**: Establish your reference point with precise GPS coordinates
- **📐 Relative Positioning**: Track X/Y displacement in meters from your starting point
- **🧭 Compass Visualization**: Visual compass showing your position and movement direction
- **📏 Meter-Level Precision**: Display coordinates down to centimeter accuracy
- **👁️ Real-time Tracking**: Continuously monitor position changes with live updates
- **📊 Detailed Metrics**: Distance, bearing, speed, altitude, and GPS accuracy
- **📋 Copy Coordinates**: Export relative position data to clipboard
- **🗺️ Maps Integration**: View current location in Google Maps
- **📱 Mobile Optimized**: Responsive design for smartphones and tablets
- **🔄 Reset & Restart**: Easy reset functionality to change starting points

## Use Cases

- **Surveying & Mapping**: Precise positioning for land surveying
- **Sports & Fitness**: Track movement patterns in running, hiking, or training
- **Research & Science**: Field work requiring accurate positioning
- **Event Management**: Coordinate positions at large outdoor events
- **Search & Rescue**: Track search patterns and team positions
- **Agriculture**: Precision farming and field measurements
- **Construction**: Site positioning and measurements

## Files Structure

```
geolocation-website/
├── index.html      # Main HTML interface
├── styles.css      # CSS styling with compass visualization
├── script.js       # JavaScript relative positioning logic
├── sw.js           # Service worker (PWA)
└── README.md       # This documentation
```

## How to Use

### 🎯 **Step 1: Set Starting Point**
1. Open the website in your browser
2. Grant location permissions when prompted
3. Click **"🎯 Set Starting Point"**
4. Wait for GPS to lock (this becomes your origin: 0,0)

### 📍 **Step 2: Track Relative Movement**
1. Click **"📍 Get Relative Position"** for one-time measurement
2. Or click **"👁️ Watch Position"** for continuous tracking
3. Move around and see your position relative to the starting point

### 📊 **Step 3: View Results**
- **X Position**: East/West displacement (positive = East)
- **Y Position**: North/South displacement (positive = North)
- **Distance**: Total distance from starting point
- **Bearing**: Direction from starting point (0-360°)
- **Compass**: Visual representation of your position

### 🔄 **Step 4: Reset (Optional)**
- Click **"🔄 Reset Start"** to set a new starting point
- All coordinates will reset to 0,0 at the new location

## Precision & Accuracy

### **Coordinate System**
- **X-Axis**: East-West displacement in meters (East = positive)
- **Y-Axis**: North-South displacement in meters (North = positive)
- **Origin**: Your chosen starting point (0, 0)
- **Precision**: Coordinates displayed to 0.01 meter (1 cm) precision

### **GPS Accuracy Factors**
- **Best Case**: 1-3 meters with clear sky view
- **Urban**: 3-5 meters (buildings may affect signal)
- **Indoor**: Limited accuracy or no signal
- **Weather**: Atmospheric conditions can affect precision

### **Calculation Method**
Uses **equirectangular projection** for meter-level accuracy:
- Accounts for Earth's curvature at your latitude
- Accurate for distances up to several kilometers
- Real-time coordinate conversion from GPS to meters

## Browser Requirements

- **Modern Browser**: Chrome, Firefox, Safari, Edge
- **HTTPS Connection**: Required for geolocation access on most browsers
- **GPS/Location**: Device with GPS capability
- **JavaScript**: Must be enabled
- **Permissions**: Location access must be granted

## Local Development & Testing

### **Method 1: Python Server (Recommended)**
```bash
# Navigate to website folder
cd geolocation-website

# Start local server
python -m http.server 8000

# Access from phone: http://[YOUR-IP]:8000
```

### **Method 2: Node.js Server**
```bash
# Install and start http-server
npm install -g http-server
http-server -p 8000
```

### **Method 3: Live Server (VS Code)**
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

## Mobile Usage Tips

### **For Best Accuracy:**
- 🌤️ Use outdoors with clear sky view
- 📱 Hold phone steady during measurements
- ⏱️ Wait for GPS to stabilize before setting start point
- 🔋 Ensure good battery level for sustained tracking

### **Network Setup:**
- 📶 Connect phone and computer to same WiFi
- 🌐 Use computer's IP address to access from phone
- 🔒 HTTPS recommended for full geolocation features

## Advanced Features

### **Compass Visualization**
- Real-time position dot showing your location relative to center
- Scales automatically to show movements clearly
- Animated updates when position changes
- Cardinal directions (N, S, E, W) marked

### **Data Export**
- Copy relative coordinates to clipboard
- Export format: `X=5.23m, Y=-2.41m, Distance=5.77m, Bearing=335.2°`
- Open current location in Google Maps

### **High-Frequency Updates**
- Watch mode updates every 1-2 seconds
- `enableHighAccuracy: true` for GPS precision
- Optimized for real-time tracking scenarios

## Technical Specifications

### **Coordinate Calculations**
```javascript
// East-West displacement (X)
const metersPerDegreeLon = R * Math.cos(startLatRad) * (π/180);
const x = (currentLon - startLon) * metersPerDegreeLon;

// North-South displacement (Y)  
const metersPerDegreeLat = R * (π/180);
const y = (currentLat - startLat) * metersPerDegreeLat;
```

### **Geolocation Options**
```javascript
const options = {
    enableHighAccuracy: true,  // Use GPS for best precision
    timeout: 10000,           // 10 second timeout
    maximumAge: 1000          // Accept 1-second old positions
};
```

## Troubleshooting

### **Common Issues**

**❌ Location Permission Denied**
- Check browser location settings
- Ensure HTTPS connection
- Try incognito/private browsing mode

**❌ Poor GPS Accuracy**
- Move to open area with sky view
- Wait longer for GPS to stabilize
- Check device GPS settings

**❌ No Position Updates**
- Refresh page and retry
- Check network connection
- Verify JavaScript is enabled

**❌ Mobile Access Issues**
- Use computer's IP address, not localhost
- Ensure devices on same network
- Try different browser on mobile

## Security & Privacy

- 🔒 **No Data Storage**: Positions are never saved or transmitted
- 📍 **Local Processing**: All calculations happen in your browser
- 🛡️ **Permission Required**: Must explicitly grant location access
- 🌐 **HTTPS Ready**: Secure connection supported for production use

## Browser Compatibility

- ✅ **Chrome 5+**: Full support
- ✅ **Firefox 3.5+**: Full support  
- ✅ **Safari 5+**: Full support
- ✅ **Edge 12+**: Full support
- ✅ **Mobile Browsers**: iOS Safari, Chrome Mobile

## Future Enhancements

- 📏 Grid overlay for visual measurements
- 📈 Position history and tracking trails
- 📁 Export tracking data to files
- 🎯 Multiple starting point support
- 📊 Movement analytics and statistics

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Contributions welcome! Please:
- Report bugs via issues
- Suggest features and improvements
- Submit pull requests
- Help improve documentation

---

**Note**: This tool provides GPS-based positioning which has inherent limitations. For professional surveying applications, use dedicated surveying equipment for highest accuracy.
