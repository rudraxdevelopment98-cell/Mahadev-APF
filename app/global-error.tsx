"use client";

import { useEffect } from "react";

/**
 * Last-resort boundary for errors thrown in the root layout itself.
 * Must render its own <html>/<body>.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0e0e10",
          color: "#f5f4f0",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "1.5rem",
        }}
      >
        <h1 style={{ fontSize: "1.75rem", margin: 0 }}>Something went wrong</h1>
        <p style={{ color: "#a8a29e", maxWidth: 420, marginTop: 12 }}>
          Sorry — the page failed to load. Please try again.
        </p>
        <button
          onClick={() => reset()}
          style={{
            marginTop: 24,
            borderRadius: 999,
            border: "none",
            background: "#d4af37",
            color: "#0e0e10",
            padding: "10px 24px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
        {error.digest && (
          <p style={{ color: "#6b6b6b", fontSize: 12, marginTop: 24 }}>
            Reference: {error.digest}
          </p>
        )}
      </body>
    </html>
  );
}
