// Edge Runtime compatible JWT functions (for middleware)
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";

export interface JWTPayload {
  userId: string;
  email: string;
}

// Convert string secret to Uint8Array for jose
function getSecretKey(): Uint8Array {
  return new TextEncoder().encode(JWT_SECRET);
}

export async function verifyTokenEdge(token: string): Promise<JWTPayload> {
  try {
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as JWTPayload;
  } catch (error) {
    throw new Error("Invalid token");
  }
}

