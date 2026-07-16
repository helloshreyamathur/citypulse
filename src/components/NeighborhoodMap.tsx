"use client";

import { useEffect, useRef } from "react";
import maplibregl, { type StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { curatedByDatasetName } from "@/lib/neighborhoods";

export type Selection = {
  priNeigh: string;
  display: string;
  curated: boolean;
};

type Props = {
  selected: Selection | null;
  onSelect: (s: Selection) => void;
};

// Frame on the city; MapLibre fits this box once the style is ready.
const CHICAGO_BOUNDS: [[number, number], [number, number]] = [
  [-87.94, 41.64],
  [-87.52, 42.03],
];

// Keyless, OSM-based raster basemap (CARTO Positron). No Mapbox/Google billing.
const BASEMAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    carto: {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        "https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      ],
      tileSize: 256,
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
    },
  },
  layers: [{ id: "carto", type: "raster", source: "carto" }],
};

const CURATED_FILL = "#6366f1"; // indigo-500
const QUIET_FILL = "#64748b"; // slate-500
const SELECTED_FILL = "#4338ca"; // indigo-700

/** Run `cb` once the style spec is parsed and ready for addSource/addLayer.
 *  Gated on the base layer existing, NOT on `isStyleLoaded()`/`load` — those wait
 *  for raster tiles to finish, which needlessly blocks the overlay (and hangs if
 *  tiles are slow). `getLayer` resolves as soon as the style JSON is parsed. */
function whenStyleReady(map: maplibregl.Map, cb: () => void) {
  if (map.getLayer("carto")) cb();
  else map.once("styledata", () => whenStyleReady(map, cb));
}

/** Rough label anchor: centre of a feature's bounding box. Good enough for pills. */
function bboxCenter(geometry: GeoJSON.Geometry): [number, number] | null {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  const visit = (coords: unknown): void => {
    const arr = coords as unknown[];
    if (typeof arr[0] === "number") {
      const [x, y] = arr as number[];
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
      return;
    }
    arr.forEach(visit);
  };
  if ("coordinates" in geometry) visit(geometry.coordinates);
  if (minX === Infinity) return null;
  return [(minX + maxX) / 2, (minY + maxY) / 2];
}

export default function NeighborhoodMap({ selected, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  // Init map once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: BASEMAP_STYLE,
      bounds: CHICAGO_BOUNDS,
      fitBoundsOptions: { padding: 24 },
      attributionControl: { compact: true },
    });
    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    whenStyleReady(map, async () => {
      // Container is measured by now; frame the whole city.
      map.resize();
      map.fitBounds(CHICAGO_BOUNDS, { padding: 24, animate: false });

      let gj: GeoJSON.FeatureCollection;
      try {
        const res = await fetch("/data/neighborhoods.geojson");
        gj = (await res.json()) as GeoJSON.FeatureCollection;
      } catch {
        return; // basemap still renders; overlay just won't
      }
      if (!mapRef.current) return; // unmounted while fetching

      // Annotate each feature with curated flag + display name.
      for (const f of gj.features) {
        const pri = (f.properties?.pri_neigh as string) ?? "";
        const c = curatedByDatasetName(pri);
        f.properties = { ...f.properties, curated: !!c, display: c?.display ?? pri };
      }

      map.addSource("nbhd", { type: "geojson", data: gj });

      map.addLayer({
        id: "nbhd-fill",
        type: "fill",
        source: "nbhd",
        paint: {
          "fill-color": ["case", ["get", "curated"], CURATED_FILL, QUIET_FILL],
          "fill-opacity": ["case", ["get", "curated"], 0.35, 0.08],
        },
      });
      map.addLayer({
        id: "nbhd-line",
        type: "line",
        source: "nbhd",
        paint: {
          "line-color": ["case", ["get", "curated"], CURATED_FILL, QUIET_FILL],
          "line-width": ["case", ["get", "curated"], 1.2, 0.5],
          "line-opacity": 0.5,
        },
      });
      map.addLayer({
        id: "nbhd-selected",
        type: "fill",
        source: "nbhd",
        filter: ["==", ["get", "pri_neigh"], selected?.priNeigh ?? ""],
        paint: { "fill-color": SELECTED_FILL, "fill-opacity": 0.55 },
      });

      // Curated labels as non-interactive HTML pills.
      for (const f of gj.features) {
        if (!f.properties?.curated || !f.geometry) continue;
        const center = bboxCenter(f.geometry);
        if (!center) continue;
        const el = document.createElement("div");
        el.textContent = f.properties.display as string;
        el.style.cssText =
          "pointer-events:none;font:600 11px/1.2 system-ui,sans-serif;color:#312e81;" +
          "background:rgba(255,255,255,.7);padding:1px 5px;border-radius:6px;white-space:nowrap;";
        new maplibregl.Marker({ element: el }).setLngLat(center).addTo(map);
      }

      map.on("click", "nbhd-fill", (e) => {
        const props = e.features?.[0]?.properties;
        if (!props) return;
        onSelect({
          priNeigh: props.pri_neigh as string,
          display: (props.display as string) ?? (props.pri_neigh as string),
          curated: props.curated === true || props.curated === "true",
        });
      });
      map.on("mouseenter", "nbhd-fill", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "nbhd-fill", () => {
        map.getCanvas().style.cursor = "";
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // Mount-only: selection sync is handled by the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the selected-highlight layer in sync with the chosen neighborhood.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      if (!map.getLayer("nbhd-selected")) return;
      map.setFilter("nbhd-selected", ["==", ["get", "pri_neigh"], selected?.priNeigh ?? ""]);
    };
    if (map.getLayer("nbhd-selected")) apply();
    else map.once("idle", apply);
  }, [selected]);

  return <div ref={containerRef} className="h-full w-full" />;
}
