import React, { useEffect, useRef, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
interface Position {
  lng: number;
  lat: number;
}
import axios from 'axios';

const userPositionIcon = L.divIcon({
  className: 'custom-icon',
  html: `<svg width="28" height="33" viewBox="0 0 13 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M3.17846 0.843094C5.14483 -0.299453 7.56183 -0.279483 9.50975 0.895405C11.4385 2.09422 12.6108 4.23376 12.5999 6.5353C12.555 8.82174 11.298 10.971 9.72673 12.6325C8.81985 13.5958 7.80535 14.4475 6.70396 15.1704C6.59053 15.236 6.46628 15.2799 6.33734 15.3C6.21324 15.2947 6.09239 15.258 5.98568 15.1933C4.30418 14.1071 2.829 12.7206 1.6311 11.1006C0.628731 9.74823 0.0592531 8.11441 1.99923e-06 6.42098C-0.00129925 4.11502 1.21209 1.98564 3.17846 0.843094ZM4.31507 7.37541C4.64584 8.19086 5.42658 8.72276 6.29276 8.72277C6.86021 8.72684 7.40569 8.49955 7.80765 8.09153C8.20961 7.68352 8.43465 7.12868 8.43264 6.55065C8.43567 5.66834 7.91623 4.87119 7.11686 4.5314C6.31748 4.19162 5.39586 4.37622 4.78231 4.99902C4.16875 5.62182 3.9843 6.55996 4.31507 7.37541Z" fill="#0F00BA"/>
<ellipse opacity="0.4" cx="6.29956" cy="17.0999" rx="4.5" ry="0.9" fill="#0F00BA"/>
</svg>
`,
  iconSize: [30, 30],
});

const markerPositionIcon = L.divIcon({
  className: 'selected-icon',
  html: `<svg width="28" height="33" viewBox="0 0 13 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M3.17846 0.843094C5.14483 -0.299453 7.56183 -0.279483 9.50975 0.895405C11.4385 2.09422 12.6108 4.23376 12.5999 6.5353C12.555 8.82174 11.298 10.971 9.72673 12.6325C8.81985 13.5958 7.80535 14.4475 6.70396 15.1704C6.59053 15.236 6.46628 15.2799 6.33734 15.3C6.21324 15.2947 6.09239 15.258 5.98568 15.1933C4.30418 14.1071 2.829 12.7206 1.6311 11.1006C0.628731 9.74823 0.0592531 8.11441 1.99923e-06 6.42098C-0.00129925 4.11502 1.21209 1.98564 3.17846 0.843094ZM4.31507 7.37541C4.64584 8.19086 5.42658 8.72276 6.29276 8.72277C6.86021 8.72684 7.40569 8.49955 7.80765 8.09153C8.20961 7.68352 8.43465 7.12868 8.43264 6.55065C8.43567 5.66834 7.91623 4.87119 7.11686 4.5314C6.31748 4.19162 5.39586 4.37622 4.78231 4.99902C4.16875 5.62182 3.9843 6.55996 4.31507 7.37541Z" fill="#BA0000"/>
<ellipse opacity="0.4" cx="6.29956" cy="17.0999" rx="4.5" ry="0.9" fill="#BA0000"/>
</svg>
`,
  iconSize: [30, 30],
});

// Api

const getLocation = async ({ lat, lng }: Position) => {
  const response =
    await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&accept-language=fa&extratags=1&namedetails=1&polygon_geojson=1
`);
  if (response.data.address) {
    const address = [
      response.data.address.road,
      response.data.address.suburb,
      response.data.address.neighbourhood,
      response.data.address.city,
      response.data.address.country,
    ]
      .filter(Boolean)
      .join(', ');
    return address;
  } else {
    throw new Error('آدرس وجود ندارد');
  }
};

const getSearchLocation = async (query: string) => {
  const response = await axios.get(
    `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&accept-language=fa`
  );
  if (response.data.length > 0) {
    const { lat, lon } = response.data[0];
    return { lat: parseFloat(lat), lng: parseFloat(lon) };
  } else {
    throw new Error('موقعیت پیدا نشد');
  }
};

const Page: React.FC = () => {
  const [userPosition, setUserPosition] = useState<Position>({
    lng: 51.3347,
    lat: 35.7219,
  });

  const [markerPosition, setMarkerPosition] = useState<Position | null>();

  const mapRef = useRef<L.Map | null>();

  const [address, setAddress] = useState('');

  const [query, setQuery] = useState('');

  const LocationMarkerPosition = ({
    setMarkerPosition,
  }: {
    setMarkerPosition: React.Dispatch<
      React.SetStateAction<Position | null | undefined>
    >;
  }) => {
    const map = useMap();

    useEffect(() => {
      mapRef.current = map;
    }, [map]);

    useMapEvents({
      click(e: L.LeafletMouseEvent) {
        const newPosition = {
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        };
        setMarkerPosition(newPosition);
      },
    });
    return null;
  };

  const handleNewUserPosition = () => {
    markerPosition && setUserPosition(markerPosition);
    setMarkerPosition(null);
  };
  const handleSearchLocation = async () => {
    const { lat, lng } = await getSearchLocation(query);
    mapRef.current?.flyTo({ lat, lng }, 14);
  };

  useEffect(() => {
    getLocation(userPosition).then((response) => {
      setAddress(response);
    });
  }, [userPosition]);

  return (
    <section className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border-2 rounded flex-1 px-4 py-2"
        />
        <button
          onClick={handleSearchLocation}
          className="px-4 py-2 bg-green-500 hover:bg-green-700 rounded text-white"
        >
          جستجو
        </button>
      </div>
      <section className="w-full h-[800px]">
        <MapContainer
          center={userPosition}
          zoom={13}
          scrollWheelZoom={true}
          style={{
            height: '100%',
            width: '100%',
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarkerPosition setMarkerPosition={setMarkerPosition} />

          <Marker position={userPosition} icon={userPositionIcon}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
          {markerPosition && (
            <Marker position={markerPosition} icon={markerPositionIcon}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </section>
      <button
        onClick={handleNewUserPosition}
        className="px-4 py-2 bg-green-500 hover:bg-green-700 text-white"
      >
        تایید موقعیت کاربری
      </button>
      <p>{address}</p>
    </section>
  );
};

export default Page;
