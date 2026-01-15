import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Eatery from "@/lib/models/eatery";
import { verifyAdmin } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/config/upload";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const eateries = await Eatery.find({});
    return NextResponse.json(eateries);
  } catch (error) {
    console.error("Error fetching eateries:", error);
    return NextResponse.json(
      { error: "Failed to fetch eateries" },
      { status: 500 }
    );
  }
}

// export async function POST(request: NextRequest) {
//   try {
//     // Verify admin
//     const adminCheck = await verifyAdmin(request);
//     if (!adminCheck.authenticated) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     await connectDB();
//     console.log("Connected to DB");
//     const formData = await request.formData();

//     // Extract fields
//     const name = formData.get("name") as string;
//     const category = formData.get("category") as string;
//     const avg_price = formData.get("avg_price") as string;
//     const coordsRaw = formData.get("coords") as string; // Sent as stringified JSON
//     const opening_hours = formData.get("opening_hours") as string;
//     const imageFiles = formData.getAll("image") as File[];
//     const menuRaw = formData.get("menu") as string; // Optional
//     console.log("Menu raw:", menuRaw);
//     const menu = menuRaw ? JSON.parse(menuRaw) : [];
//     console.log("Parsed menu:", menu);

//     // Basic validation
//     if (!name || !category || !imageFiles.length || !avg_price || !coordsRaw) {
//       return NextResponse.json(
//         { error: "Missing required fields or image" },
//         { status: 400 }
//       );
//     }

//     // Upload images to Cloudinary

//     // let imageUrls: string[] = [];

//     // if (imageFile && Array.isArray(imageFile)) {
//     //   imageUrls = await Promise.all(
//     //     imageFile.map((file) => uploadToCloudinary(file.buffer, "products"))
//     //   );
//     // }

//     // 2. Process images correctly for Cloudinary
//     const uploadPromises = imageFiles.map(async (file) => {
//       const arrayBuffer = await file.arrayBuffer();
//       const buffer = Buffer.from(arrayBuffer);
//       return uploadToCloudinary(buffer, "eateries"); // Ensure your util handles Buffer
//     });
//     const imageUrls = await Promise.all(uploadPromises);

//     const coords = JSON.parse(coordsRaw || "[]");

//     const eatery = new Eatery({
//       name,
//       category,
//       avg_price: Number(avg_price),
//       coords: [Number.parseFloat(coords[0]), Number.parseFloat(coords[1])],
//       opening_hours: JSON.parse(opening_hours || "{}"),
//       imageUrl: imageUrls,
//       menu,
//     });

//     await eatery.save();
//     return NextResponse.json(eatery, { status: 201 });
//   } catch (error) {
//     console.error("Error creating eatery:", error);
//     return NextResponse.json(
//       { error: "Failed to create eatery" },
//       { status: 500 }
//     );
//   }
// }

export async function POST(request: NextRequest) {
  try {
    const adminCheck = await verifyAdmin(request);
    if (!adminCheck.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const formData = await request.formData();

    // 1. Use getAll for multiple images
    const imageFiles = formData.getAll("image") as File[];
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const avg_price = formData.get("avg_price") as string;
    const coordsRaw = formData.get("coords") as string;
    const opening_hours = formData.get("opening_hours") as string;
    const menuRaw = formData.get("menu") as string;

    if (!name || !category || imageFiles.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 2. Process images correctly for Cloudinary
    const uploadPromises = imageFiles
      .filter((file) => file instanceof Blob) // Safety check: Ensure it's a file, not a string
      .map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return uploadToCloudinary(buffer, "eateries");
      });

    const imageUrls = await Promise.all(uploadPromises);

    // 3. Safe Parsing
    const coords = JSON.parse(coordsRaw || "[0, 0]");
    const menu = menuRaw ? JSON.parse(menuRaw) : [];

    const eatery = new Eatery({
      name,
      category,
      avg_price: Number(avg_price),
      coords: [parseFloat(coords[0]), parseFloat(coords[1])],
      opening_hours: JSON.parse(opening_hours || "{}"),
      imageUrl: imageUrls, // Now an array of strings
      menu,
    });

    await eatery.save();
    return NextResponse.json(eatery, { status: 201 });
  } catch (error) {
    console.error("Error creating eatery:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
