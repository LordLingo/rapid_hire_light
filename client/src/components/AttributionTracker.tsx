import { useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { captureAttribution } from "@/lib/leadAttribution";

export default function AttributionTracker() {
  const [location] = useLocation();
  const search = useSearch();
  useEffect(() => { captureAttribution(window.location.href); }, [location, search]);
  return null;
}
