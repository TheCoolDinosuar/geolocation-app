// Geolocation Website Script
class LocationTracker {
    constructor() {
        this.watchId = null;
        this.currentPosition = null;
        this.initializeElements();
        this.bindEvents();
        this.checkGeolocationSupport();
    }

    initializeElements() {
        // Main coordinate elements
        this.latitudeElement = document.getElementById('latitude');
        this.longitudeElement = document.getElementById('longitude');
        this.accuracyElement = document.getElementById('accuracy');
        this.timestampElement = document.getElementById('timestamp');
        
        // Additional detail elements
        this.altitudeElement = document.getElementById('altitude');
        this.altitudeAccuracyElement = document.getElementById('altitudeAccuracy');
        this.headingElement = document.getElementById('heading');
        this.speedElement = document.getElementById('speed');
        
        // Control buttons
        this.getLocationBtn = document.getElementById('getLocation');
        this.watchLocationBtn = document.getElementById('watchLocation');
        this.stopWatchBtn = document.getElementById('stopWatch');
        this.copyBtn = document.getElementById('copyCoords');
        this.mapsBtn = document.getElementById('openMaps');
        
        // Status element
        this.statusElement = document.getElementById('status');
    }

    bindEvents() {
        this.getLocationBtn.addEventListener('click', () => this.getCurrentLocation());
        this.watchLocationBtn.addEventListener('click', () => this.startWatchingLocation());
        this.stopWatchBtn.addEventListener('click', () => this.stopWatchingLocation());
        this.copyBtn.addEventListener('click', () => this.copyCoordinates());
        this.mapsBtn.addEventListener('click', () => this.openInMaps());
    }

    checkGeolocationSupport() {
        if (!navigator.geolocation) {
            this.showStatus('Geolocation is not supported by this browser.', 'error');
            this.disableAllButtons();
        } else {
            this.showStatus('Click "Get My Location" to retrieve your coordinates.', 'success');
        }
    }

    getCurrentLocation() {
        this.showStatus('Getting your location...', 'loading');
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
        if (this.watchId !== null) {
            this.stopWatchingLocation();
        }

        this.showStatus('Watching your location for changes...', 'loading');
        this.setLoadingState(true);

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 30000
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
        this.showStatus('Stopped watching location.', 'success');
    }

    onLocationSuccess(position, isWatching = false) {
        this.currentPosition = position;
        this.updateLocationDisplay(position);
        this.setLoadingState(false);
        
        const message = isWatching ? 
            'Location updated successfully! Continuing to watch...' : 
            'Location retrieved successfully!';
        this.showStatus(message, 'success');
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

    updateLocationDisplay(position) {
        const coords = position.coords;
        const timestamp = new Date(position.timestamp);

        // Update main coordinates
        this.latitudeElement.textContent = coords.latitude.toFixed(6);
        this.longitudeElement.textContent = coords.longitude.toFixed(6);
        this.accuracyElement.textContent = `±${coords.accuracy.toFixed(0)} meters`;
        this.timestampElement.textContent = timestamp.toLocaleString();

        // Update additional details
        this.altitudeElement.textContent = coords.altitude !== null ? 
            `${coords.altitude.toFixed(2)} m` : 'N/A';
        this.altitudeAccuracyElement.textContent = coords.altitudeAccuracy !== null ? 
            `±${coords.altitudeAccuracy.toFixed(0)} m` : 'N/A';
        this.headingElement.textContent = coords.heading !== null ? 
            `${coords.heading.toFixed(0)}°` : 'N/A';
        this.speedElement.textContent = coords.speed !== null ? 
            `${(coords.speed * 3.6).toFixed(2)} km/h` : 'N/A';

        // Enable action buttons
        this.copyBtn.disabled = false;
        this.mapsBtn.disabled = false;
    }

    copyCoordinates() {
        if (!this.currentPosition) {
            this.showStatus('No location data to copy.', 'error');
            return;
        }

        const coords = this.currentPosition.coords;
        const text = `Latitude: ${coords.latitude.toFixed(6)}, Longitude: ${coords.longitude.toFixed(6)}`;
        
        navigator.clipboard.writeText(text).then(() => {
            this.showStatus('Coordinates copied to clipboard!', 'success');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showStatus('Coordinates copied to clipboard!', 'success');
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
        this.showStatus('Opening location in Google Maps...', 'success');
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
            this.getLocationBtn.disabled = true;
            if (this.watchId === null) {
                this.watchLocationBtn.disabled = true;
            }
        } else {
            document.querySelector('.location-card').classList.remove('loading');
            this.getLocationBtn.disabled = false;
            if (this.watchId === null) {
                this.watchLocationBtn.disabled = false;
            }
        }
    }

    disableAllButtons() {
        this.getLocationBtn.disabled = true;
        this.watchLocationBtn.disabled = true;
        this.stopWatchBtn.disabled = true;
        this.copyBtn.disabled = true;
        this.mapsBtn.disabled = true;
    }
}

// Additional utility functions
function formatCoordinate(coord, type) {
    const degrees = Math.abs(coord);
    const direction = type === 'lat' ? (coord >= 0 ? 'N' : 'S') : (coord >= 0 ? 'E' : 'W');
    return `${degrees.toFixed(6)}° ${direction}`;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Initialize the location tracker when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new LocationTracker();
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
