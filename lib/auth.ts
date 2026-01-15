import { NextRequest } from "next/server";
import { jwtVerify, SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "a_very_long_and_secure_random_secret_key"
);

// export async function verifyAdmin(request: NextRequest) {
//   const authHeader = request.headers.get("authorization");

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return { authenticated: false };
//   }

//   const token = authHeader.substring(7);

//   try {
//     // Verify the token and check for "admin" role
//     const { payload } = await jwtVerify(token, JWT_SECRET);

//     if (payload.role === "admin") {
//       return { authenticated: true, user: payload };
//     }
//   } catch (error) {
//     // Token is expired, invalid, or tampered with
//     console.error("JWT Verification failed:", error);
//   }

//   return { authenticated: false };
// }

export async function verifyAdmin(request: NextRequest) {
  // Get the token directly from cookies
  const token = request.cookies.get("admin_token")?.value;

  if (!token) {
    return { authenticated: false };
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (payload.role === "admin") {
      return { authenticated: true, user: payload };
    }
  } catch (error) {
    // Token is expired or tampered with
  }

  return { authenticated: false };
}

export async function getAdminToken(): Promise<string> {
  // We sign a token with a 2-hour expiration
  return await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("4h")
    .sign(JWT_SECRET);
}
