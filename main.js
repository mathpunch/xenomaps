// Base layers
const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
});

const satelliteLayer = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
});

// Initialize map with default view and layers
const map = L.map('map', {
    center: [40.7128, -74.0060],
    zoom: 13,
    layers: [streetLayer]
});

// Layer control
const baseMaps = {
    "Street Map": streetLayer,
    "Satellite": satelliteLayer
};
L.control.layers(baseMaps).addTo(map);

// Store the current marker
let marker;

// Handle search form
document.getElementById('search-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const query = document.getElementById('search-input').value.trim();
    if (!query) return;

    // Use Nominatim for geocoding
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data && data.length > 0) {
        const place = data[0];
        const lat = parseFloat(place.lat);
        const lon = parseFloat(place.lon);

        map.setView([lat, lon], 16);

        // Remove previous marker
        if (marker) map.removeLayer(marker);

        // Place marker
        marker = L.marker([lat, lon]).addTo(map)
            .bindPopup(`<b>${place.display_name}</b>`)
            .openPopup();
    } else {
        alert('Location not found.');
    }
});

// Add marker on map click
map.on('click', function(e) {
    const { lat, lng } = e.latlng;

    // Remove previous marker
    if (marker) map.removeLayer(marker);

    marker = L.marker([lat, lng]).addTo(map)
        .bindPopup(`<b>Marker</b><br>Lat: ${lat.toFixed(5)}<br>Lng: ${lng.toFixed(5)}`)
        .openPopup();
});
