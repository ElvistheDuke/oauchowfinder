import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Eatery from "@/lib/models/eatery";
import { verifyAdmin } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/config/upload";
import { Types } from "mongoose";

interface UpdateEateryPayload {
  name?: string;
  category?: string;
  avg_price?: number;
  coords?: [number, number];
  opening_hours?: Record<string, unknown>;
  menu?: unknown[];
  imageUrl?: string[];
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    // 🔑 Next.js 15 async params
    const { id } = await context.params;

    const adminCheck = await verifyAdmin(request);
    if (!adminCheck.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid eatery ID" }, { status: 400 });
    }

    await connectDB();

    const deletedEatery = await Eatery.findByIdAndDelete(id);

    if (!deletedEatery) {
      return NextResponse.json({ error: "Eatery not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Eatery deleted successfully",
      id,
    });
  } catch (error) {
    console.error("Error deleting eatery:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const adminCheck = await verifyAdmin(request);
    if (!adminCheck.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = await context.params;
    // Check if eatery exists
    const existingEatery = await Eatery.findById(id);
    if (!existingEatery) {
      return NextResponse.json({ error: "Eatery not found" }, { status: 404 });
    }

    const formData = await request.formData();

    const imageFiles = formData.getAll("image") as File[];
    const name = formData.get("name") as string | null;
    const category = formData.get("category") as string | null;
    const avg_price = formData.get("avg_price") as string | null;
    const coordsRaw = formData.get("coords") as string | null;
    const opening_hours = formData.get("opening_hours") as string | null;
    const menuRaw = formData.get("menu") as string | null;

    const updateData: UpdateEateryPayload = {};

    if (name) updateData.name = name;
    if (category) updateData.category = category;
    if (avg_price) updateData.avg_price = Number(avg_price);

    if (coordsRaw) {
      const coords = JSON.parse(coordsRaw);
      updateData.coords = [parseFloat(coords[0]), parseFloat(coords[1])];
    }

    if (opening_hours) {
      updateData.opening_hours = JSON.parse(opening_hours);
    }

    if (menuRaw) {
      updateData.menu = JSON.parse(menuRaw);
    }

    // Handle new image uploads (optional)
    if (imageFiles.length > 0) {
      const uploadPromises = imageFiles.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        return uploadToCloudinary(buffer, "eateries");
      });

      const imageUrls = await Promise.all(uploadPromises);
      updateData.imageUrl = imageUrls;
    }

    const updatedEatery = await Eatery.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedEatery) {
      return NextResponse.json({ error: "Eatery not found" }, { status: 404 });
    }

    return NextResponse.json(updatedEatery);
  } catch (error) {
    console.error("Error updating eatery:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
