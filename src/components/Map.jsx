// import React, { useState, useEffect } from 'react';
// import 'leaflet/dist/leaflet.css';
// import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
// import { toast } from 'react-toastify';
// import * as L from 'leaflet';
// import { FaMapMarkerAlt } from "react-icons/fa";
//import api from '../api';

// export default function Map({ readonly, location, onChange }) {
//   return (
//     <div className="map-container">
//       <MapContainer
//         className="map"
//         center={[0, 0]}
//         zoom={1}
//         dragging={!readonly}
//         touchZoom={!readonly}
//         doubleClickZoom={!readonly}
//         scrollWheelZoom={!readonly}
//         boxZoom={!readonly}
//         keyboard={!readonly}
//         attributionControl={false}
//       >
//         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//         <FindButtonAndMarker
//           readonly={readonly}
//           location={location}
//           onChange={onChange}
//         />
//       </MapContainer>
//     </div>
//   );
// }

// function FindButtonAndMarker({ readonly, location, onChange }) {
//   const [position, setPosition] = useState(location);

//   useEffect(() => {
//     if (readonly) {
//       map.setView(position, 13);
//       return;
//     }
//     if (position) onChange(position);
//   }, [position]);

//   const map = useMapEvents({
//     click(e) {
//       !readonly && setPosition(e.latlng);
//     },
//     locationfound(e) {
//       setPosition(e.latlng);
//       map.flyTo(e.latlng, 13);
//     },
//     locationerror(e) {
//       toast.error(e.message);
//     },
//   });

//   const markerIcon = new L.Icon({
//     iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
//     iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
//     shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
//     iconSize: [25, 41],
//     iconAnchor: [12.5, 41],
//     popupAnchor: [0, -41],
//   });
  

//   return (
//     <>
//       {!readonly && (
//         <button
//           type="button"
//           className="find-location bg-customOrange flex items-center"
//           onClick={() => map.locate()}
//         >
//           My Location
//           <FaMapMarkerAlt size={20} />
//         </button>
//       )}

//       {position && (
//         <Marker
//           eventHandlers={{
//             dragend: (e) => {
//               setPosition(e.target.getLatLng());
//             },
//           }}
//           position={position}
//           draggable={!readonly}
//           icon={markerIcon}
//         >
//           {/* <Popup>Shipping Location</Popup> */}
//         </Marker>
//       )}
//     </>
//   );
// }

// // Adding the CSS in the JSX file using inline styles
// const styles = `
//   html, body {
//     margin: 0;
//     padding: 0;
//     height: 100%;
//   }

//   .map-container {
//     width: 100%;
//     height: 50vh; /* Full height of the viewport */

//   }

//   .map {
//     width: 100%;
//     height: 100%;
//     border-radius: 5px;
//   }

//   .find-location {
//     position: absolute;
//     top: 10px;
//     left: 50%;
//     transform: translateX(-50%);
//     z-index: 1000;
//     padding: 10px;
//     background-color: bg-customOrange;
//     color: white;
//     border: none;
//     border-radius: 5px;
//     font-weight: 600;
//   }
// `;

// // Injecting the styles into the document
// const styleSheet = document.createElement('style');
// styleSheet.type = 'text/css';
// styleSheet.innerText = styles;
// document.head.appendChild(styleSheet);

import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { toast } from 'react-toastify';
import * as L from 'leaflet';
import { FaMapMarkerAlt } from "react-icons/fa";
import api from '../api';

export default function Map({ readonly, location, onChange }) {
  const [address, setAddress] = useState(""); // To store the detailed address

  const fetchAddress = async (lat, lng) => {
    try {
      // Use OpenStreetMap's Nominatim API or Google Maps Geocoding API
      const response = await api.get(`https://nominatim.openstreetmap.org/reverse`, {
        params: {
          format: "json",
          lat,
          lon: lng,
        },
      });
      const data = response.data;
      const detailedAddress = data.display_name || "Address not found";
      setAddress(detailedAddress);
      onChange && onChange({ lat, lng, address: detailedAddress }); // Pass the address to the parent component
    } catch (error) {
      console.error("Error fetching address:", error);
      toast.error("Failed to fetch address");
    }
  };

  return (
    <div className="map-container">
      <MapContainer
        className="map"
        center={[0, 0]}
        zoom={1}
        dragging={!readonly}
        touchZoom={!readonly}
        doubleClickZoom={!readonly}
        scrollWheelZoom={!readonly}
        boxZoom={!readonly}
        keyboard={!readonly}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FindButtonAndMarker
          readonly={readonly}
          location={location}
          onPositionChange={(latlng) => {
            if (latlng) {
              fetchAddress(latlng.lat, latlng.lng);
            }
          }}
        />
      </MapContainer>
      {/* {!readonly && address && (
        <p className="mt-2 text-center font-medium">Address: {address}</p>
      )} */}
    </div>
  );
}

function FindButtonAndMarker({ readonly, location, onPositionChange }) {
  const [position, setPosition] = useState(location);

  const map = useMapEvents({
    click(e) {
      if (!readonly) {
        setPosition(e.latlng);
        onPositionChange && onPositionChange(e.latlng); // Notify the parent about the new position
      }
    },
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, 13);
      onPositionChange && onPositionChange(e.latlng); // Notify the parent about the new position
    },
    locationerror(e) {
      toast.error(e.message);
    },
  });

  const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12.5, 41],
    popupAnchor: [0, -41],
  });

  return (
    <>
      {!readonly && (
        <button
          type="button"
          className="find-location bg-customOrange flex items-center"
          onClick={() => map.locate()}
        >
          My Location
          <FaMapMarkerAlt size={20} />
        </button>
      )}

      {position && (
        <Marker
          eventHandlers={{
            dragend: (e) => {
              const latLng = e.target.getLatLng();
              setPosition(latLng);
              onPositionChange && onPositionChange(latLng); // Notify the parent about the new position
            },
          }}
          position={position}
          draggable={!readonly}
          icon={markerIcon}
        />
      )}
    </>
  );
}


// Adding the CSS in the JSX file using inline styles
const styles = `
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
  }

  .map-container {
    width: 100%;
    height: 50vh; /* Full height of the viewport */

  }

  .map {
    width: 100%;
    height: 100%;
    border-radius: 5px;
  }

  .find-location {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    padding: 10px;
    background-color: bg-customOrange;
    color: white;
    border: none;
    border-radius: 5px;
    font-weight: 600;
  }
`;

// Injecting the styles into the document
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
