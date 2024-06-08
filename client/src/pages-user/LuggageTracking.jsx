import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon, divIcon } from "leaflet";
import { format } from "date-fns";

import greenMarker from "../assets/green_marker.png";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const luggageIcon = new Icon({
  iconUrl: greenMarker,
  iconSize: [40, 40],
});

const createClusterCustomIcon = (cluster) => {
  return divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className:
      "flex items-center justify-center bg-gray-900 h-8 w-8 text-white rounded-full text-lg shadow-lg",
    iconSize: [33, 33],
  });
};

const RelativeTime = ({ shipmentDate }) => {
  const [relativeTime, setRelativeTime] = useState("");

  useEffect(() => {
    const calculateRelativeTime = () => {
      const now = new Date();
      const shipmentDateTime = new Date(shipmentDate);
      const timeDifference = now - shipmentDateTime;
      const secondsDifference = Math.floor(timeDifference / 1000);

      if (secondsDifference < 60) {
        setRelativeTime("Last updated Now");
      } else if (secondsDifference < 3600) {
        const minutes = Math.floor(secondsDifference / 60);
        setRelativeTime(
          `${
            minutes === 1
              ? "Last updated a minute"
              : `Last updated ${minutes} minutes`
          } ago`
        );
      } else if (secondsDifference < 86400) {
        const hours = Math.floor(secondsDifference / 3600);
        setRelativeTime(
          `${
            hours === 1 ? "Last updated an hour" : `Last updated ${hours} hours`
          } ago`
        );
      } else if (secondsDifference < 2592000) {
        const days = Math.floor(secondsDifference / 86400);
        setRelativeTime(
          `${
            days === 1 ? "Last updated a day" : `Last updated ${days} days`
          } ago`
        );
      } else {
        setRelativeTime("Last updated a while ago");
      }
    };

    calculateRelativeTime();
    const interval = setInterval(calculateRelativeTime, 60000);
    return () => clearInterval(interval);
  }, [shipmentDate]);

  return <span>{relativeTime}</span>;
};

const LuggageTracking = () => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [trackLocation, setTrackLocation] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [luggageDeets, setLuggageDeets] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [userId, setUserId] = useState();
  const [showAddModal, setShowAddModal] = useState(false);
  const markerRefs = useRef([]);
  const itemRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.defaults.withCredentials = true;
  }, []);

  useEffect(() => {
    const fetchCurrentLocations = async () => {
      try {
        const updatedLuggageDeets = await Promise.all(
          luggageDeets.map(async (luggageLoc) => {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${luggageLoc.latitude}&lon=${luggageLoc.longitude}&format=json`
            );
            const data = await response.json();
            return { ...luggageLoc, currentLocation: data.display_name };
          })
        );
        setLuggageDeets(updatedLuggageDeets);
      } catch (error) {
        console.error("Error fetching locations: ", error);
      }
    };

    fetchCurrentLocations();
  }, [luggageDeets]);

  const LocationMarker = ({ trackLocation }) => {
    const [position, setPosition] = useState(null);
    const map = useMapEvents({
      locationfound(e) {
        if (trackLocation) {
          setPosition(e.latlng);
        }
      },
    });

    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    );
  };

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const datas = await axios.get("http://localhost:3000/auth/users");
        setUsersData(datas.data);
      } catch (error) {
        console.error("Error fetching users data:", error);
      }
    };

    fetchUsersData();
  }, []);

  useEffect(() => {
    const fetchLuggageData = async () => {
      try {
        const datas = await axios.get(
          "http://localhost:3000/luggage-router/luggage"
        );
        setLuggageDeets(datas.data);
      } catch (error) {
        console.error("Error fetching luggage data:", error);
      }
    };

    fetchLuggageData();
  }, []);

  const handleMarkerClick = (luggage, index) => {
    setSelectedMarker(luggage);
    markerRefs.current[index].openPopup();
  };

  const formatStationarySince = (timestamp) => {
    const date = new Date(timestamp);
    const isToday = date.toDateString() === new Date().toDateString();
    return isToday
      ? `Since ${format(date, "p")}`
      : `Since ${format(date, "p EEEE")}`;
  };

  const handleAddNewLuggage = async (newLuggage) => {
    console.log("clicked");
    try {
      const response = await axios.post(
        "http://localhost:3000/luggage-router/addluggage",
        newLuggage
      );
      setLuggageDeets([...luggageDeets, newLuggage]);
      console.log("New Luggage Details: ", newLuggage);
      setShowAddModal(false);
    } catch (error) {
      console.log("error adding luggage", error);
    }
  };

  return (
    <>
      <NavBar />
      <div className="relative w-full h-full z-0 rounded">
        <MapContainer
          center={[14.5092, 121.0144]}
          zoom={13}
          style={{ height: "100vh", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            attribution={`&copy; 
            <a href="https://www.openstreetmap.org/copyright" className="bg-black text-white">OpenStreetMap</a> 
            contributors`}
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
          />
          <LocationMarker trackLocation={trackLocation} />
          <MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={createClusterCustomIcon}
            maxClusterRadius={8}
          >
            {luggageDeets.map((luggage, index) => (
              <Marker
                key={luggage._id}
                position={[luggage.latitude, luggage.longitude]}
                icon={luggageIcon}
                ref={(el) => (markerRefs.current[index] = el)}
                eventHandlers={{
                  click: () => handleMarkerClick(luggage, index),
                }}
              >
                <Popup>
                  {usersData && luggage.user_id && (
                    <>
                      <span className="text-lg font-bold font-poppins">
                        {luggage.luggage_custom_name}
                      </span>
                      <br />
                      <span className="font-poppins">
                        Tracking Number: {luggage.luggage_tag_number}
                      </span>{" "}
                      <br />
                      <span className="font-poppins">
                        Location: {luggage.currentLocation}
                      </span>{" "}
                      <br />
                      <span className="font-poppins">
                        Destination: {luggage.destination}{" "}
                      </span>
                      <br />
                      <span
                        className={`font-poppins ${
                          luggage.status === "In Range"
                            ? "text-green-500"
                            : luggage.status === "Out of Range"
                            ? "text-yellow-500"
                            : "text-red-500"
                        }`}
                      >
                        Status: {luggage.status}
                      </span>
                    </>
                  )}
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>

        {selectedMarker && (
          <div className="z-100 absolute bottom-0 left-0 right-0">
            <div className="bg-green-900 rounded-t-lg p-4 w-full mx-auto">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">
                  {selectedMarker.luggage_custom_name}
                </h2>
                <button
                  onClick={() => setSelectedMarker(null)}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                >
                  Close
                </button>
              </div>
              <div className="mt-2">
                <p className="text-white">
                  Tracking Number: {selectedMarker.luggage_tag_number}
                </p>
                <p className="text-white">
                  Location: {selectedMarker.currentLocation}
                </p>
                <p className="text-white">
                  Destination: {selectedMarker.destination}
                </p>
                <p className="text-white">
                  <RelativeTime shipmentDate={selectedMarker.updatedAt} />
                </p>
                <p
                  className={`${
                    selectedMarker.status === "In Range"
                      ? "text-green-500"
                      : selectedMarker.status === "Out of Range"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  Status: {selectedMarker.status}
                </p>
                {selectedMarker.status === "Stationary" && (
                  <p className="text-white">
                    {formatStationarySince(selectedMarker.lastMoved)}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LuggageTracking;
