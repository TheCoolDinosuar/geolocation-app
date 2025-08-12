// Relative Location Tracker Script
class RelativeLocationTracker {
    constructor() {
        this.watchId = null;
        this.currentPosition = null;
        this.startingPosition = null;
        this.relativePosition = { x: 0, y: 0, distance: 0, bearing: 0 };
        this.initializeElements();
        this.bindEvents();
        this.checkGeolocationSupport();
    }

    initializeElements() {
        // Relative position elements
        this.xPositionElement = document.getElementById('xPosition');
        this.yPositionElement = document.getElementById('yPosition');
        this.distanceElement = document.getElementById('distance');
        this.bearingElement = document.getElementById('bearing');
        
        // Additional detail elements
        this.accuracyElement = document.getElementById('accuracy');
        this.timestampElement = document.getElementById('timestamp');
        this.altitudeElement = document.getElementById('altitude');
        this.speedElement = document.getElementById('speed');
        
        // Starting point elements
        this.startLatElement = document.getElementById('startLat');
        this.startLonElement = document.getElementById('startLon');
        
        // Control buttons
        this.setStartBtn = document.getElementById('setStart');
        this.getLocationBtn = document.getElementById('getLocation');
        this.watchLocationBtn = document.getElementById('watchLocation');
        this.stopWatchBtn = document.getElementById('stopWatch');
        this.resetStartBtn = document.getElementById('resetStart');
        this.copyBtn = document.getElementById('copyCoords');
        this.mapsBtn = document.getElementById('openMaps');
        
        // Status element
        this.statusElement = document.getElementById('status');
    }

    bindEvents() {
        this.setStartBtn.addEventListener('click', () => this.setStartingPoint());
        this.getLocationBtn.addEventListener('click', () => this.getCurrentLocation());
        this.watchLocationBtn.addEventListener('click', () => this.startWatchingLocation());
        this.stopWatchBtn.addEventListener('click', () => this.stopWatchingLocation());
        this.resetStartBtn.addEventListener('click', () => this.resetStartingPoint());
        this.copyBtn.addEventListener('click', () => this.copyRelativeCoordinates());
        this.mapsBtn.addEventListener('click', () => this.openInMaps());
    }

    checkGeolocationSupport() {
        if (!navigator.geolocation) {
            this.showStatus('Geolocation is not supported by this browser.', 'error');
            this.disableAllButtons();
        } else {
            this.showStatus('First, set your starting point by clicking "Set Starting Point".', 'success');
        }
    }

    setStartingPoint() {
        this.showStatus('Setting starting point...', 'loading');
        this.setLoadingState(true);

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
            (position) => this.onStartingPointSuccess(position),
            (error) => this.onLocationError(error),
            options
        );
    }

    onStartingPointSuccess(position) {
        this.startingPosition = position;
        this.currentPosition = position;
        
        const coords = position.coords;
        this.startLatElement.textContent = coords.latitude.toFixed(8);
        this.startLonElement.textContent = coords.longitude.toFixed(8);
        
        // Reset relative position to origin
        this.relativePosition = { x: 0, y: 0, distance: 0, bearing: 0 };
        this.updateRelativeDisplay();
        
        this.setLoadingState(false);
        this.showStatus('Starting point set! Now you can track relative movement.', 'success');
        
        // Enable other buttons
        this.getLocationBtn.disabled = false;
        this.watchLocationBtn.disabled = false;
        this.resetStartBtn.disabled = false;
    }

    getCurrentLocation() {
        if (!this.startingPosition) {
            this.showStatus('Please set a starting point first.', 'error');
            return;
        }

        this.showStatus('Getting your relative position...', 'loading');
        this.setLoadingState(true);

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
            (position) => this.onLocationSuccess(position),
            (error) => this.onLocationError(error),
            options
        );
    }

    startWatchingLocation() {
        if (!this.startingPosition) {
            this.showStatus('Please set a starting point first.', 'error');
            return;
        }

        if (this.watchId !== null) {
            this.stopWatchingLocation();
        }

        this.showStatus('Watching your relative position...', 'loading');
        this.setLoadingState(true);

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 1000 // Update more frequently for precise tracking
        };

        this.watchId = navigator.geolocation.watchPosition(
            (position) => this.onLocationSuccess(position, true),
            (error) => this.onLocationError(error),
            options
        );

        this.watchLocationBtn.disabled = true;
        this.stopWatchBtn.disabled = false;
    }

    stopWatchingLocation() {
        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }

        this.watchLocationBtn.disabled = false;
        this.stopWatchBtn.disabled = true;
        this.showStatus('Stopped watching relative position.', 'success');
    }

    resetStartingPoint() {
        this.startingPosition = null;
        this.currentPosition = null;
        this.relativePosition = { x: 0, y: 0, distance: 0, bearing: 0 };
        
        // Clear displays
        this.startLatElement.textContent = '--';
        this.startLonElement.textContent = '--';
        this.updateRelativeDisplay();
        
        // Reset buttons
        this.getLocationBtn.disabled = true;
        this.watchLocationBtn.disabled = true;
        this.resetStartBtn.disabled = true;
        this.copyBtn.disabled = true;
        this.mapsBtn.disabled = true;
        
        if (this.watchId !== null) {
            this.stopWatchingLocation();
        }
        
        this.showStatus('Starting point reset. Set a new starting point to begin tracking.', 'success');
    }

    onLocationSuccess(position, isWatching = false) {
        this.currentPosition = position;
        this.calculateRelativePosition(position);
        this.updateRelativeDisplay();
        this.setLoadingState(false);
        
        const message = isWatching ? 
            'Relative position updated! Continuing to watch...' : 
            'Relative position calculated successfully!';
        this.showStatus(message, 'success');
        
        // Enable action buttons
        this.copyBtn.disabled = false;
        this.mapsBtn.disabled = false;
    }

    onLocationError(error) {
        this.setLoadingState(false);
        let message = 'Error getting location: ';
        
        switch (error.code) {
            case error.PERMISSION_DENIED:
                message += 'Location access denied by user.';
                break;
            case error.POSITION_UNAVAILABLE:
                message += 'Location information is unavailable.';
                break;
            case error.TIMEOUT:
                message += 'Location request timed out.';
                break;
            default:
                message += 'An unknown error occurred.';
                break;
        }
        
        this.showStatus(message, 'error');
    }

    calculateRelativePosition(position) {
        if (!this.startingPosition) return;

        const startCoords = this.startingPosition.coords;
        const currentCoords = position.coords;

        // Calculate relative position in meters using Haversine-based projection
        const relativeMeters = this.calculateRelativeMeters(
            startCoords.latitude, startCoords.longitude,
            currentCoords.latitude, currentCoords.longitude
        );

        this.relativePosition = relativeMeters;
    }

    calculateRelativeMeters(startLat, startLon, currentLat, currentLon) {
        const R = 6371000; // Earth's radius in meters
        
        // Convert to radians
        const lat1Rad = startLat * Math.PI / 180;
        const lat2Rad = currentLat * Math.PI / 180;
        const deltaLatRad = (currentLat - startLat) * Math.PI / 180;
        const deltaLonRad = (currentLon - startLon) * Math.PI / 180;

        // Calculate X (East-West) displacement in meters
        // At the starting latitude, calculate meters per degree longitude
        const metersPerDegreeLon = R * Math.cos(lat1Rad) * Math.PI / 180;
        const x = (currentLon - startLon) * metersPerDegreeLon;

        // Calculate Y (North-South) displacement in meters
        // Meters per degree latitude is approximately constant
        const metersPerDegreeLat = R * Math.PI / 180;
        const y = (currentLat - startLat) * metersPerDegreeLat;

        // Calculate total distance and bearing
        const distance = Math.sqrt(x * x + y * y);
        let bearing = Math.atan2(x, y) * 180 / Math.PI;
        if (bearing < 0) bearing += 360;

        return {
            x: x,           // East-West displacement (positive = East)
            y: y,           // North-South displacement (positive = North)
            distance: distance,
            bearing: bearing
        };
    }

    updateRelativeDisplay() {
        const coords = this.currentPosition ? this.currentPosition.coords : null;
        const timestamp = this.currentPosition ? new Date(this.currentPosition.timestamp) : null;

        // Update relative coordinates with high precision
        this.xPositionElement.textContent = `${this.relativePosition.x.toFixed(2)} m`;
        this.yPositionElement.textContent = `${this.relativePosition.y.toFixed(2)} m`;
        this.distanceElement.textContent = `${this.relativePosition.distance.toFixed(2)} m`;
        this.bearingElement.textContent = `${this.relativePosition.bearing.toFixed(1)}°`;

        // Update additional details
        if (coords) {
            this.accuracyElement.textContent = `±${coords.accuracy.toFixed(1)} m`;
            this.timestampElement.textContent = timestamp.toLocaleString();
            this.altitudeElement.textContent = coords.altitude !== null ? 
                `${coords.altitude.toFixed(2)} m` : 'N/A';
            this.speedElement.textContent = coords.speed !== null ? 
                `${(coords.speed * 3.6).toFixed(2)} km/h` : 'N/A';
        } else {
            this.accuracyElement.textContent = '--';
            this.timestampElement.textContent = '--';
            this.altitudeElement.textContent = '--';
            this.speedElement.textContent = '--';
        }

        // Update compass visualization
        this.updateCompass();
    }

    updateCompass() {
        const positionDot = document.getElementById('position-dot');
        const compassText = document.getElementById('compass-text');
        
        if (!this.startingPosition || !this.currentPosition) {
            positionDot.style.top = '50%';
            positionDot.style.left = '50%';
            compassText.textContent = 'Set starting point to begin tracking';
            return;
        }

        // Scale position to fit in compass (75px radius max)
        const maxRadius = 60; // Max distance from center in pixels
        const scale = Math.min(maxRadius / Math.max(Math.abs(this.relativePosition.x), Math.abs(this.relativePosition.y), 1), maxRadius / 50); // Scale to show movements up to 50m clearly
        
        const scaledX = this.relativePosition.x * scale;
        const scaledY = -this.relativePosition.y * scale; // Negative because CSS Y is inverted
        
        // Position relative to center (50%, 50%)
        const centerX = 50; // 50% of compass width
        const centerY = 50; // 50% of compass height
        
        const dotX = centerX + (scaledX / 75 * 50); // Convert to percentage
        const dotY = centerY + (scaledY / 75 * 50); // Convert to percentage
        
        // Constrain to compass boundary
        const constrainedX = Math.max(5, Math.min(95, dotX));
        const constrainedY = Math.max(5, Math.min(95, dotY));
        
        positionDot.style.left = `${constrainedX}%`;
        positionDot.style.top = `${constrainedY}%`;
        
        // Add animation class
        positionDot.classList.add('updating');
        setTimeout(() => positionDot.classList.remove('updating'), 600);
        
        // Update compass text
        const direction = formatDirection(this.relativePosition.bearing);
        compassText.innerHTML = `
            <strong>Distance:</strong> ${formatDistance(this.relativePosition.distance)}<br>
            <strong>Direction:</strong> ${direction} (${this.relativePosition.bearing.toFixed(1)}°)<br>
            <strong>Position:</strong> ${this.relativePosition.x.toFixed(1)}m E, ${this.relativePosition.y.toFixed(1)}m N
        `;
    }

    copyRelativeCoordinates() {
        if (!this.currentPosition || !this.startingPosition) {
            this.showStatus('No relative position data to copy.', 'error');
            return;
        }

        const text = `Relative Position: X=${this.relativePosition.x.toFixed(2)}m, Y=${this.relativePosition.y.toFixed(2)}m, Distance=${this.relativePosition.distance.toFixed(2)}m, Bearing=${this.relativePosition.bearing.toFixed(1)}°`;
        
        navigator.clipboard.writeText(text).then(() => {
            this.showStatus('Relative coordinates copied to clipboard!', 'success');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showStatus('Relative coordinates copied to clipboard!', 'success');
        });
    }

    openInMaps() {
        if (!this.currentPosition) {
            this.showStatus('No location data available.', 'error');
            return;
        }

        const coords = this.currentPosition.coords;
        const url = `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`;
        window.open(url, '_blank');
        this.showStatus('Opening current location in Google Maps...', 'success');
    }

    showStatus(message, type) {
        this.statusElement.textContent = message;
        this.statusElement.className = `status-message ${type}`;
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                this.statusElement.style.display = 'none';
            }, 5000);
        }
    }

    setLoadingState(isLoading) {
        if (isLoading) {
            document.querySelector('.location-card').classList.add('loading');
            this.setStartBtn.disabled = true;
            this.getLocationBtn.disabled = true;
            if (this.watchId === null) {
                this.watchLocationBtn.disabled = true;
            }
        } else {
            document.querySelector('.location-card').classList.remove('loading');
            this.setStartBtn.disabled = false;
            if (this.startingPosition) {
                this.getLocationBtn.disabled = false;
                if (this.watchId === null) {
                    this.watchLocationBtn.disabled = false;
                }
            }
        }
    }

    disableAllButtons() {
        this.setStartBtn.disabled = true;
        this.getLocationBtn.disabled = true;
        this.watchLocationBtn.disabled = true;
        this.stopWatchBtn.disabled = true;
        this.resetStartBtn.disabled = true;
        this.copyBtn.disabled = true;
        this.mapsBtn.disabled = true;
    }
}

// Additional utility functions for compass and distance calculations
function formatDirection(bearing) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(bearing / 22.5) % 16;
    return directions[index];
}

function formatDistance(meters) {
    if (meters < 1) {
        return `${(meters * 100).toFixed(0)} cm`;
    } else if (meters < 1000) {
        return `${meters.toFixed(2)} m`;
    } else {
        return `${(meters / 1000).toFixed(3)} km`;
    }
}

// Initialize the relative location tracker when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new RelativeLocationTracker();
});

// Service worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
