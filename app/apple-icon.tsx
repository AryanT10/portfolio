import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "#0b0d11",
          color: "#4ade80",
          fontSize: 120,
          fontWeight: 800,
        }}
      >
        A
      </div>
    ),
    { ...size }
  );
}
