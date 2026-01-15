"use client";

import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { DivIcon } from "leaflet";
// import restaurants from "@/public/restaurants.json";
import Image from "next/image";
import logo from "../public/transparent-logo.png";
import { ClockIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import type { Eatery } from "@/lib/models/eatery";
import samplerestaurant from "../public/sample restaurant.jpg";

/* ============================
   Dynamic React-Leaflet imports
   ============================ */
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);

const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), {
  ssr: false,
});

// const typedRestaurants = restaurants as Restaurant[];

/* ============================
   Component
   ============================ */
export default function MapView() {
  const [icon, setIcon] = useState<DivIcon | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const [infoModal, setInfoModal] = useState(false);
  // const [activeRestaurant, setActiveRestaurant] = useState<Restaurant | null>(
  //   null
  // );
  const [activeEatery, setActiveEatery] = useState<Eatery | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [eateries, setEateries] = useState<Eatery[]>([]);

  // Fetch eateries
  useEffect(() => {
    fetchEateries();
  }, []);

  const fetchEateries = async () => {
    try {
      const response = await fetch("/api/eateries");
      // console.log("Fetch response:", response);
      const data = await response.json();
      console.log("Fetched eateries:", data);
      setEateries(data);
    } catch (error) {
      console.error("Failed to fetch eateries:", error);
    }
  };

  // Forces Leaflet to fully remount on Fast Refresh
  const mapKey = useRef(`map-${Date.now()}`);

  /* ============================
     Load Leaflet ONLY on client
     ============================ */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = await import("leaflet");
      if (cancelled) return;

      const customIcon = L.divIcon({
        className: "customMarker",
        html: `<div></div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      });

      setIcon(customIcon);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative" }}>
      {/* ============================
          Map
         ============================ */}
      <MapContainer
        key={mapKey.current} // 🔥 CRITICAL FIX
        center={[7.5186, 4.5241]}
        zoom={20}
        style={{ height: "100%", width: "100%" }}
        whenReady={() => setMapReady(true)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {mapReady &&
          icon &&
          eateries.map((eatery) => (
            <Marker
              key={eatery._id}
              position={[eatery.coords[0], eatery.coords[1]]}
              icon={icon}
              eventHandlers={{
                click: () => {
                  setActiveEatery(eatery);
                  setInfoModal(!infoModal);
                },
              }}
            />
          ))}
      </MapContainer>

      {/* ============================
          Modal (above map)
         ============================ */}
      <div className="absolute top-0 right-0 max-w-screen overflow-y-scroll custom-scrollbar w-[420px] z-999 flex flex-col gap-4 pt-4 pb-4 px-2">
        <div className="bg-white p-4  rounded shadow-lg shadow-black/20">
          <div className="flex gap-1 items-center">
            <Image
              src={logo}
              alt="Oauchow Finder Logo"
              width={40}
              height={40}
            />
            <h1 className="text-xl font-bold">
              <span className="text-[#1F455F]">OAU</span>{" "}
              <span className="text-[#D49851]">ChowFinder</span>
            </h1>
          </div>

          {/* <p>Click on a marker to see restaurant details.</p> */}
        </div>

        {infoModal && activeEatery && (
          <div
            className="
                     bg-white rounded shadow-lg shadow-black/20
                     transition-opacity duration-300
                   "
          >
            <div className="relative w-full h-40 overflow-hidden rounded mb-2">
              <Image
                src={
                  activeEatery.imageUrl[currentImageIndex]
                    ? activeEatery.imageUrl[currentImageIndex]
                    : samplerestaurant
                }
                alt={`${activeEatery.name} image ${currentImageIndex + 1}`}
                fill
                style={{ objectFit: "cover", objectPosition: "center" }}
                className="rounded"
                loading="lazy"
              />

              {/* Arrows */}
              <button
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded"
                onClick={() =>
                  setCurrentImageIndex(
                    (currentImageIndex - 1 + activeEatery.imageUrl.length) %
                      activeEatery.imageUrl.length
                  )
                }
              >
                ‹
              </button>
              <button
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded"
                onClick={() =>
                  setCurrentImageIndex(
                    (currentImageIndex + 1) % activeEatery.imageUrl.length
                  )
                }
              >
                ›
              </button>
            </div>

            <div className="p-4 pt-0">
              <h2 className="text-2xl mb-2">{activeEatery.name}</h2>
              <div className="flex items-center text-sm">
                <ClockIcon className="w-5 h-5 inline-block mr-1 text-gray-600" />
                <p>
                  {" "}
                  {`${activeEatery.opening_hours.open} - ${activeEatery.opening_hours.close}`}
                </p>
                <StarIcon className="w-5 h-5 inline-block ml-4 mr-1 text-yellow-500" />
                <p>{activeEatery.rating} / 5</p>
              </div>
              <p className="mb-1 text-sm">
                <strong>Average Cost:</strong> ₦{activeEatery.avg_price}
              </p>

              {/* Menu */}
              <div>
                <h3 className="font-semibold text-foreground ">Menu</h3>
                <div className="space-y-2">
                  {activeEatery.menu && activeEatery.menu.length > 0 ? (
                    activeEatery.menu.map(
                      (item: { item: string; price: number }, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between py-2 text-sm border-b border-border last:border-0"
                        >
                          <span className="text-foreground ">{item.item}</span>
                          <span className="">₦{item.price}</span>
                        </div>
                      )
                    )
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No menu items available
                    </p>
                  )}
                </div>
              </div>

              {/* Open in Google Maps button */}
              <button
                className="mt-2 px-3 py-1 bg-blue-600 text-white rounded w-full"
                onClick={() => {
                  const { latitude, longitude } = activeEatery.coords.reduce(
                    (acc, coord, index) => {
                      if (index === 0) acc.latitude = coord;
                      if (index === 1) acc.longitude = coord;
                      return acc;
                    },
                    { latitude: 0, longitude: 0 }
                  );
                  const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
                  window.open(url, "_blank"); // opens in a new tab
                }}
              >
                Open in Google Maps
              </button>
              <button
                className="mt-2 px-3 py-1 bg-black text-white rounded"
                onClick={() => setInfoModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
