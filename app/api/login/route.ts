import { NextResponse } from "next/server";
import { getAdminToken } from "@/lib/auth"; // Adjust path as needed

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "elvis123";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    // 1. Validate the password
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 2. Generate the JWT using the 'jose' logic we wrote earlier
    const token = await getAdminToken();

    // 3. Return the token
    // You can also set the cookie directly here if you prefer
    const response = NextResponse.json({
      success: true,
      ok: true,
      token,
    });

    // Optional: Set the cookie automatically on the server side
    response.cookies.set("admin_token", token, {
      httpOnly: true, // Prevents JS access (more secure)
      secure: process.env.NODE_MIT !== "development",
      sameSite: "strict",
      maxAge: 60 * 60 * 2, // 2 hours
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
