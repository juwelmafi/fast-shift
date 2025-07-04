import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useLoaderData } from "react-router";
import { useState } from "react";

function FlyToDistrict({ districts, searchText }) {
  const map = useMap();

  const matchedDistrict = districts.find((d) =>
    d.district.toLowerCase().includes(searchText.toLowerCase().trim())
  );

  if (matchedDistrict) {
    map.flyTo([matchedDistrict.latitude, matchedDistrict.longitude], 11, {
      duration: 1.5,
    });
  } else if (searchText) {
    alert("No matching district found.");
  }

  return null;
}

export default function Coverege() {
  const defaultPosition = [23.8103, 90.4125]; // Center: Dhaka
  const districts = useLoaderData();

  const [searchText, setSearchText] = useState("");
  const [triggerSearch, setTriggerSearch] = useState(false);

  const handleSearch = () => {
    setTriggerSearch(true);
    setTimeout(() => setTriggerSearch(false), 100); // Reset after triggering
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center p-6">
      <div className="bg-white rounded-xl my-5 w-full max-w-5xl p-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
          We are available in{" "}
          <span className="text-green-600">64 districts</span>
        </h2>

        <div className="flex items-center mb-10 max-w-md mx-auto border border-gray-300 rounded-full overflow-hidden shadow-sm">
          <input
            type="text"
            placeholder="Search district..."
            className="px-4 py-2 w-full outline-none"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button
            className="bg-lime-400 text-white font-semibold px-6 py-2"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          We deliver almost all over Bangladesh
        </h3>

        <div className="w-full h-[400px] rounded-md overflow-hidden">
          <MapContainer
            center={defaultPosition}
            zoom={7}
            scrollWheelZoom={false}
            className="h-full w-full"//j
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {districts.map((district, index) => (
              <Marker
                key={index}
                position={[district.latitude, district.longitude]}
              >
                <Popup>
                  <strong>{district.district}</strong>
                  <br />
                  {district.covered_area.join(", ")}
                </Popup>
              </Marker>
            ))}

            {/* Only render this when search is triggered */}
            {triggerSearch && (
              <FlyToDistrict districts={districts} searchText={searchText} />
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
