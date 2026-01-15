import mongoose from "mongoose";

interface MenuItem {
  item: string;
  price: number;
}

export interface Eatery {
  _id?: string;
  name: string;
  category: "Buka" | "Fast Food" | "Cafe";
  avg_price: number;
  coords: [number, number];
  opening_hours: { open: string; close: string };
  menu: MenuItem[];
  imageUrl: string[];
  rating: number;
  imageFiles?: File[];
}

const eaterySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Buka", "Fast Food", "Cafe"],
      required: true,
    },
    avg_price: {
      type: Number,
      required: true,
    },
    coords: {
      type: [Number], // [latitude, longitude]
      required: true,
    },
    menu: [
      {
        item: String,
        price: Number,
      },
    ],
    opening_hours: {
      open: String,
      close: String,
    },
    imageUrl: [String],
    rating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Eatery = mongoose.models.Eatery || mongoose.model("Eatery", eaterySchema);

export default Eatery;
