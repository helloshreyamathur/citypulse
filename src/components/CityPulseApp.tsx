"use client";

import { useState } from "react";
import NeighborhoodMap, { type Selection } from "./NeighborhoodMap";
import SidePanel from "./SidePanel";

export default function CityPulseApp() {
  const [selected, setSelected] = useState<Selection | null>(null);

  return (
    <div className="flex h-dvh w-full">
      {/* Map is the spine: ~2/3 of the layout. */}
      <div className="relative h-full basis-2/3">
        <NeighborhoodMap selected={selected} onSelect={setSelected} />
      </div>
      {/* Side panel: ~1/3. */}
      <div className="h-full basis-1/3">
        <SidePanel selected={selected} />
      </div>
    </div>
  );
}
