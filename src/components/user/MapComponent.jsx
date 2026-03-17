import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const locations = [
  { name: "Đoàn xã Lũng Cú", lat: 23.3587, lng: 105.3114 },
  { name: "Đoàn xã Đồng Văn", lat: 23.2801, lng: 105.3605 },
  { name: "Đoàn xã Phố Bảng", lat: 23.2694, lng: 105.3182 }
];

const defaultPosition = [23.3, 105.3];

// Fix icon Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png"
});

function FlyToLocation({ position }) {
  const map = useMap();

  if (position) {
    map.flyTo(position, 15);
  }

  return null;
}

const MapComponent = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 0) {
      const filtered = locations.filter((loc) =>
        loc.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const goToLocation = (loc) => {
    setSelectedPosition([loc.lat, loc.lng]);
    setQuery(loc.name);
    setSuggestions([]);
  };

  return (
    <div style={{ width: "100%", fontFamily: "sans-serif" }}>
      
      {/* Search */}
      <div style={{ marginBottom: "15px", position: "relative" }}>
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Nhập tên xã để tìm kiếm..."
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px"
          }}
        />

        {suggestions.length > 0 && (
          <ul
            style={{
              position: "absolute",
              zIndex: 1000,
              background: "white",
              width: "100%",
              listStyle: "none",
              padding: 0,
              margin: 0,
              border: "1px solid #ccc",
              borderRadius: "0 0 8px 8px"
            }}
          >
            {suggestions.map((loc, index) => (
              <li
                key={index}
                onClick={() => goToLocation(loc)}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee"
                }}
              >
                📍 {loc.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Map */}
      <MapContainer
        center={defaultPosition}
        zoom={10}
        style={{ height: "600px", borderRadius: "8px" }}
      >
        <TileLayer
          attribution='© OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations.map((loc, index) => (
          <Marker key={index} position={[loc.lat, loc.lng]}>
            <Popup>{loc.name}</Popup>
          </Marker>
        ))}

        {selectedPosition && <FlyToLocation position={selectedPosition} />}
      </MapContainer>
    </div>
  );
};

export default MapComponent;