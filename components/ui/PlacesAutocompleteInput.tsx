"use client";

import { useEffect, useRef } from "react";

// Text input enhanced with Google Places Autocomplete (restricted to Kenya).
// Degrades gracefully: if NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing or the
// Maps script fails to load, it behaves as a plain text input.

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// Singleton loader so multiple inputs share one script tag.
let mapsPromise: Promise<boolean> | null = null;

function loadMapsScript(): Promise<boolean> {
  if (typeof window === "undefined" || !MAPS_KEY) return Promise.resolve(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  if (w.google?.maps?.places) return Promise.resolve(true);
  if (mapsPromise) return mapsPromise;

  mapsPromise = new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&libraries=places`;
    script.async = true;
    script.onload = () => resolve(!!w.google?.maps?.places);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
  return mapsPromise;
}

interface PlacesAutocompleteInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  id?: string;
  name?: string;
}

export default function PlacesAutocompleteInput({
  value,
  onChange,
  placeholder = "",
  className = "",
  required = false,
  id,
  name,
}: PlacesAutocompleteInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let autocomplete: any = null;

    loadMapsScript().then((ok) => {
      if (!ok || cancelled || !inputRef.current) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;
      autocomplete = new w.google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: "ke" },
        fields: ["formatted_address", "name"],
      });
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        const text = place?.formatted_address || place?.name || inputRef.current?.value || "";
        if (text) onChangeRef.current(text);
      });
    });

    return () => {
      cancelled = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;
      if (autocomplete && w.google?.maps?.event) {
        w.google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, []);

  return (
    <input
      ref={inputRef}
      id={id}
      name={name}
      required={required}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={className}
      autoComplete="off"
    />
  );
}
