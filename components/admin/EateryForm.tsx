"use client";

import type React from "react";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import type { Eatery } from "@/lib/models/eatery";

interface MenuItem {
  item: string;
  price: number;
}

interface EateryFormProps {
  eatery?: Eatery | null;
  onSuccess: () => void;
}

type FormData = {
  name: string;
  category: "Buka" | "Fast Food" | "Cafe";
  avg_price: number;
  coords: [number, number];
  opening_hours: {
    open: string;
    close: string;
  };
  menu: MenuItem[];
  imageUrl: string[];
  imageFiles?: File[];
};

// const GeoSurveyMap = dynamic(() => import("./geo-survey-map"), {
//   ssr: false,
//   loading: () => <div className="w-full h-64 bg-muted flex items-center justify-center">Loading map...</div>,
// })

export default function EateryForm({ eatery, onSuccess }: EateryFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    category: "Buka" as "Buka" | "Fast Food" | "Cafe",
    avg_price: 3000,
    coords: [7.2519, 4.0137] as [number, number],
    opening_hours: { open: "08:00", close: "18:00" },
    menu: [] as MenuItem[],
    imageUrl: [] as string[],
    imageFiles: [],
  });

  const [newMenuItem, setNewMenuItem] = useState({ item: "", price: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("Eatery for edit:", eatery);
    if (eatery) {
      setFormData(eatery);
    }
  }, [eatery]);

  const handleInputChange = (
    field: string,
    value:
      | string
      | number
      | [number, number]
      | { open: string; close: string }
      | MenuItem[]
      | string[]
      | File
      | File[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddMenuItem = () => {
    if (newMenuItem.item && newMenuItem.price > 0) {
      setFormData((prev) => ({
        ...prev,
        menu: [...prev.menu, newMenuItem],
      }));
      setNewMenuItem({ item: "", price: 0 });
    }
  };

  const handleRemoveMenuItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      menu: prev.menu.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formDetails = new FormData();
    formDetails.append("name", formData.name);
    formDetails.append("category", formData.category);
    formDetails.append("avg_price", formData.avg_price.toString());
    formDetails.append("coords", JSON.stringify(formData.coords));
    formDetails.append("opening_hours", JSON.stringify(formData.opening_hours));
    // formData.imageUrl.forEach((url) => formDetails.append("image", url));
    if (formData.imageFiles) {
      formData.imageFiles.forEach((file: File) => {
        formDetails.append("image", file);
      });
    }
    formDetails.append(
      "menu",
      formData.menu.length ? JSON.stringify(formData.menu) : ""
    );

    try {
      const url = eatery ? `/api/eateries/${eatery._id}` : "/api/eateries";
      const method = eatery ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formDetails,
      });

      if (response.ok) {
        onSuccess();
      } else {
        console.log("Failed to save eatery");
        console.log(await response.text());
        alert("Failed to save eatery here");
      }
    } catch (error) {
      console.error("Error saving eatery:", error);
      alert("Error saving eatery");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Eatery Name
          </label>
          <Input
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="e.g., Uncle Wisdom Buka"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
          >
            <option value="Buka">Buka</option>
            <option value="Fast Food">Fast Food</option>
            <option value="Cafe">Cafe</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Average Plate Price (₦)
          </label>
          <Input
            type="number"
            value={formData.avg_price}
            onChange={(e) =>
              handleInputChange("avg_price", Number.parseFloat(e.target.value))
            }
            min="0"
            required
          />
        </div>
      </div>

      <div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Location Coordinates (Latitude, Longitude)
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={formData.coords[0]}
              onChange={(e) =>
                handleInputChange("coords", [
                  Number.parseFloat(e.target.value),
                  formData.coords[1],
                ])
              }
              placeholder="Latitude"
              step="0.000001"
              className="w-1/2"
              required
            />
            <Input
              type="number"
              value={formData.coords[1]}
              onChange={(e) =>
                handleInputChange("coords", [
                  formData.coords[0],
                  Number.parseFloat(e.target.value),
                ])
              }
              placeholder="Longitude"
              step="0.000001"
              className="w-1/2"
              required
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Eatery Images
        </label>
        <Input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            const files = e.target.files;
            if (files) {
              const fileArray = Array.from(files);
              handleInputChange("imageFiles", fileArray);

              const urls = Array.from(files).map((file) =>
                URL.createObjectURL(file)
              );
              handleInputChange("imageUrl", urls);
            }
          }}
        />
        <div className="mt-4 flex flex-wrap gap-4">
          {formData.imageUrl.map((url, idx) => (
            <Image
              width={400}
              height={400}
              key={idx}
              src={url}
              alt={`Eatery Image ${idx + 1}`}
              className="w-24 h-24 object-cover rounded-md border border-border"
            />
          ))}
        </div>
      </div>

      {/* Geo-Survey Map */}
      {/* <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Location (Click on map to set)
        </label>
        <GeoSurveyMap
          initialCoords={formData.coords}
          onLocationSelect={(coords) => handleInputChange("coords", coords)}
        />
        <p className="text-xs text-muted-foreground mt-2">
          Latitude: {formData.coords[0].toFixed(6)}, Longitude:{" "}
          {formData.coords[1].toFixed(6)}
        </p>
      </div> */}

      {/* Opening Hours */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Opening Time
          </label>
          <Input
            type="time"
            value={formData.opening_hours.open}
            onChange={(e) =>
              handleInputChange("opening_hours", {
                ...formData.opening_hours,
                open: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Closing Time
          </label>
          <Input
            type="time"
            value={formData.opening_hours.close}
            onChange={(e) =>
              handleInputChange("opening_hours", {
                ...formData.opening_hours,
                close: e.target.value,
              })
            }
          />
        </div>
      </div>

      {/* Menu Items */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Menu Items
        </label>

        {/* Add Menu Item */}
        <div className="bg-muted/50 p-4 rounded-lg mb-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={newMenuItem.item}
              onChange={(e) =>
                setNewMenuItem((prev) => ({ ...prev, item: e.target.value }))
              }
              placeholder="Item name"
            />
            <Input
              type="number"
              value={newMenuItem.price || ""}
              onChange={(e) =>
                setNewMenuItem((prev) => ({
                  ...prev,
                  price: Number.parseFloat(e.target.value) || 0,
                }))
              }
              placeholder="Price"
              min="0"
            />
          </div>
          <Button
            type="button"
            onClick={handleAddMenuItem}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Add Item
          </Button>
        </div>

        {/* Menu List */}
        <div className="space-y-2">
          {formData.menu.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div>
                <p className="font-medium text-foreground">{item.item}</p>
                <p className="text-sm text-muted-foreground">₦{item.price}</p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveMenuItem(idx)}
                className="p-2 hover:bg-destructive/10 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {loading ? "Saving..." : eatery ? "Update Eatery" : "Create Eatery"}
      </Button>
    </form>
  );
}
