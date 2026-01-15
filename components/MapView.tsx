"use client";

import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import type { DivIcon } from "leaflet";
// import restaurants from "@/public/restaurants.json";
import Image from "next/image";
// import logo from "../public/transparent-logo.png";
import { ClockIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import type { Eatery } from "@/lib/models/eatery";
import samplerestaurant from "../public/sample restaurant.jpg";
import { ChevronLeft, ChevronRight, MapPinIcon } from "lucide-react";
import BudgetFilter from "./BudgetFilter";
import AppHeader from "./AppHeader";

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
  const [maxBudget, setMaxBudget] = useState<number>(3000);

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

  // useMemo prevents recalculating on every re-render unless budget or data changes
  const filteredEateries = useMemo(() => {
    return eateries.filter((res) => res.avg_price <= maxBudget);
  }, [maxBudget, eateries]);

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
          filteredEateries.map((eatery) => (
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

      <BudgetFilter onBudgetChange={(val: number) => setMaxBudget(val)} />
      <AppHeader />

      {/* ============================
          Modal (above map)
         ============================ */}
      <div className="absolute top-0 right-0 max-w-sm overflow-y-scroll custom-scrollbar w-[90%] z-999 flex flex-col gap-4 pt-4 pb-4 px-2">
        {infoModal && activeEatery && (
          <div className="bg-white mt-18 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 border border-gray-100 max-w-sm">
            {/* Image Header Section */}
            <div className="relative w-full h-52 overflow-hidden group">
              <Image
                src={
                  activeEatery.imageUrl?.[currentImageIndex] || samplerestaurant
                }
                alt={`${activeEatery.name}`}
                fill
                className="object-cover"
                priority // Ensures the first image loads immediately
              />

              {/* Dark Overlay for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Price Tag Badge */}
              <div className="absolute bottom-3 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                Avg. ₦{activeEatery.avg_price}
              </div>

              {/* FIXED NAVIGATION BUTTONS */}
              {activeEatery.imageUrl?.length > 1 && (
                <>
                  <button
                    type="button" // Prevents accidental form submission
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 backdrop-blur-sm text-white w-8 h-8 rounded-full flex items-center justify-center transition-all z-10"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents clicking the card background
                      setCurrentImageIndex((prev) =>
                        prev === 0 ? activeEatery.imageUrl.length - 1 : prev - 1
                      );
                    }}
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 backdrop-blur-sm text-white w-8 h-8 rounded-full flex items-center justify-center transition-all z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(
                        (prev) => (prev + 1) % activeEatery.imageUrl.length
                      );
                    }}
                  >
                    <ChevronRight size={20} />
                  </button>

                  {/* Pagination Dots (Visual Feedback) */}
                  <div className="absolute bottom-3 right-4 flex gap-1.5 z-10">
                    {activeEatery.imageUrl.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          idx === currentImageIndex
                            ? "w-4 bg-orange-500"
                            : "w-1.5 bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Content Section */}
            <div className="p-5">
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-extrabold text-[#1A365D] tracking-tight">
                  {activeEatery.name}
                </h2>
                <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                  <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-xs font-bold text-yellow-700">
                    {activeEatery.rating}
                  </span>
                </div>
              </div>

              {/* Info Row */}
              <div className="flex items-center text-gray-500 text-sm mb-5 gap-4">
                <div className="flex items-center">
                  <ClockIcon className="w-4 h-4 mr-1 text-[#889E73]" />
                  <span>
                    {activeEatery.opening_hours.open} -{" "}
                    {activeEatery.opening_hours.close}
                  </span>
                </div>
                <div className="flex items-center text-[#889E73] font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                  Open Now
                </div>
              </div>

              {/* Menu Section */}
              <div className="mb-6">
                <h3 className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-3">
                  Today&apos;s Menu
                </h3>
                <div className="bg-gray-50 rounded-2xl p-3 space-y-1">
                  {activeEatery.menu && activeEatery.menu.length > 0 ? (
                    activeEatery.menu.slice(0, 3).map(
                      (
                        item,
                        idx // Show first 3 items for clean UI
                      ) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between py-2 text-sm"
                        >
                          <span className="text-gray-700 font-medium">
                            {item.item}
                          </span>
                          <span className="text-[#1A365D] font-bold">
                            ₦{item.price}
                          </span>
                        </div>
                      )
                    )
                  ) : (
                    <p className="text-gray-400 text-xs italic py-2">
                      No menu available
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  className="flex-1 bg-[#1A365D] hover:bg-[#132a4a] text-white py-3 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                  onClick={() => {
                    const [lat, lng] = activeEatery.coords;
                    window.open(
                      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
                      "_blank"
                    );
                  }}
                >
                  <MapPinIcon className="w-4 h-4" />
                  Get Directions
                </button>

                <button
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-bold text-sm transition-all"
                  onClick={() => setInfoModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
