"use client";

import { useEffect } from "react";
import { useEngagementStore } from "@/store/useEngagementStore";

export function StoreHydration() {
  useEffect(() => {
    useEngagementStore.persist.rehydrate();
  }, []);
  return null;
}
