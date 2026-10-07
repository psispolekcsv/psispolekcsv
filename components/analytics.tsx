"use client";

import { useEffect } from "react";

export function AnalyticsInit() {
  useEffect(() => {
    const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;
    if (!measurementId) return;
    let active = true;
    (async () => {
      const { getAnalytics, isSupported } = await import("firebase/analytics");
      const { getFirebaseApp } = await import("@/lib/firebase/client");
      if (!active || !(await isSupported())) return;
      getAnalytics(getFirebaseApp());
    })().catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);
  return null;
}
