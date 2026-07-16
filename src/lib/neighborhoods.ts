// The 15 curated neighborhoods from SPEC.md, each mapped to one or more polygons
// in the Chicago "Boundaries - Neighborhoods" dataset (public/data/neighborhoods.geojson).
//
// The dataset splits some areas more finely than people actually talk about them, so a
// curated neighborhood can roll up several dataset polygons (`pri_neigh` values). E.g.
// "The Loop" absorbs Grant Park, Millennium Park and Printers Row. A few also carry a
// different label than we show (verified July 2026, see NOTES.md §4):
//   - Pilsen is labelled "Lower West Side" (its community-area name) in the data.
//   - South Loop has no polygon of its own; it rolls up Near South Side + Museum Campus.
//   - Northalsted is still labelled by its former name "Boystown" in the data.
// `datasetNames` lists every `pri_neigh` value that belongs to this curated neighborhood;
// the first entry is treated as the primary and anchors the map label.
// NB: "Millenium Park" is misspelled (one N) in the source data — matched verbatim.

export type Curated = {
  /** How we show the name in the UI. */
  display: string;
  /** Every `pri_neigh` value in neighborhoods.geojson that rolls up into this neighborhood. */
  datasetNames: string[];
  /** True where our display name and the dataset polygons don't cleanly agree (NOTES §4). */
  approximate?: boolean;
};

export const CURATED: Curated[] = [
  { display: "West Loop", datasetNames: ["West Loop"] },
  { display: "River North", datasetNames: ["River North", "Streeterville"] },
  { display: "Wicker Park", datasetNames: ["Wicker Park"] },
  { display: "Logan Square", datasetNames: ["Logan Square"] },
  { display: "Old Town", datasetNames: ["Old Town", "Gold Coast", "Rush & Division"] },
  { display: "Pilsen", datasetNames: ["Lower West Side"], approximate: true },
  { display: "Northalsted / Boystown", datasetNames: ["Boystown", "Lake View"] },
  { display: "Andersonville", datasetNames: ["Andersonville"] },
  { display: "Chinatown", datasetNames: ["Chinatown"] },
  {
    display: "The Loop",
    datasetNames: ["Loop", "Grant Park", "Millenium Park", "Printers Row"],
  },
  { display: "Wrigleyville", datasetNames: ["Wrigleyville"] },
  { display: "Lincoln Park", datasetNames: ["Lincoln Park"] },
  { display: "Bucktown", datasetNames: ["Bucktown"] },
  { display: "South Loop", datasetNames: ["Near South Side", "Museum Campus"], approximate: true },
  { display: "Uptown", datasetNames: ["Uptown"] },
];

/** Every `pri_neigh` value that should render as part of a curated neighborhood. */
export const CURATED_DATASET_NAMES: string[] = CURATED.flatMap((c) => c.datasetNames);

/** Look up the curated neighborhood a dataset `pri_neigh` value belongs to. */
export function curatedByDatasetName(name: string | undefined): Curated | undefined {
  if (!name) return undefined;
  return CURATED.find((c) => c.datasetNames.includes(name));
}
