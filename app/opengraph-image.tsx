import { ImageResponse } from "next/og";
import { profile } from "@/lib/content";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${profile.name} - ${profile.role}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "#0a0b0e",
          padding: 64,
        }}
      >
        {/* terminal window */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            borderRadius: 24,
            border: "1px solid #2c313b",
            background: "#101217",
            overflow: "hidden",
          }}
        >
          {/* title bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "20px 28px",
              borderBottom: "1px solid #20242c",
            }}
          >
            <div style={{ width: 16, height: 16, borderRadius: 99, background: "#ff5f56" }} />
            <div style={{ width: 16, height: 16, borderRadius: 99, background: "#ffbd2e" }} />
            <div style={{ width: 16, height: 16, borderRadius: 99, background: "#27c93f" }} />
            <div style={{ display: "flex", marginLeft: 12, color: "#5d6775", fontSize: 24 }}>
              {`${profile.handle}@${profile.host} - zsh`}
            </div>
          </div>

          {/* body */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "48px 52px",
              flex: 1,
            }}
          >
            <div style={{ display: "flex", color: "#5d6775", fontSize: 30 }}>
              <span style={{ color: "#4ade80" }}>$&nbsp;</span> whoami
            </div>
            <div
              style={{
                display: "flex",
                color: "#e8edf4",
                fontSize: 96,
                fontWeight: 800,
                marginTop: 12,
                letterSpacing: -2,
              }}
            >
              {profile.name}
            </div>
            <div style={{ display: "flex", color: "#99a3b2", fontSize: 38, marginTop: 8 }}>
              {profile.role}
            </div>
            <div
              style={{
                display: "flex",
                color: "#4ade80",
                fontSize: 40,
                marginTop: 40,
              }}
            >
              &quot;{profile.tagline}&quot;
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
