"use client";

import { useEffect } from "react";
import { useHilbertStore } from "@/store/useHilbertStore";

export function StoreHydration() {
  useEffect(() => {
    useHilbertStore.persist.rehydrate();
  }, []);
  return null;
}
