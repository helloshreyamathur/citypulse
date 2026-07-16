// The 15 curated neighborhoods from SPEC.md, mapped to the name each one carries
// in the Chicago "Boundaries - Neighborhoods" dataset (public/data/neighborhoods.geojson).
//
// Most match exactly; a few don't (verified July 2026, see NOTES.md §4):
//   - Pilsen is labelled "Lower West Side" (its community-area name) in the data.
//   - South Loop has no polygon of its own; it falls inside "Near South Side".
//   - Northalsted is still labelled by its former name "Boystown" in the data.
//   - "the Loop/Downtown" is simply "Loop".
// `datasetName` is the value of the feature's `pri_neigh` property to match on.

export type Curated = {
  /** How we show the name in the UI. */
  display: string;
  /** The `pri_neigh` value in neighborhoods.geojson to match this to. */
  datasetName: string;
  /** True where our display name and the dataset polygon don't cleanly agree (NOTES §4). */
  approximate?: boolean;
};

export const CURATED: Curated[] = [
  { display: "West Loop", datasetName: "West Loop" },
  { display: "River North", datasetName: "River North" },
  { display: "Wicker Park", datasetName: "Wicker Park" },
  { display: "Logan Square", datasetName: "Logan Square" },
  { display: "Old Town", datasetName: "Old Town" },
  { display: "Pilsen", datasetName: "Lower West Side", approximate: true },
  { display: "Northalsted / Boystown", datasetName: "Boystown" },
  { display: "Andersonville", datasetName: "Andersonville" },
  { display: "Chinatown", datasetName: "Chinatown" },
  { display: "The Loop", datasetName: "Loop" },
  { display: "Wrigleyville", datasetName: "Wrigleyville" },
  { display: "Lincoln Park", datasetName: "Lincoln Park" },
  { display: "Bucktown", datasetName: "Bucktown" },
  { display: "South Loop", datasetName: "Near South Side", approximate: true },
  { display: "Uptown", datasetName: "Uptown" },
];

/** Every `pri_neigh` value that should render as a fully-alive curated neighborhood. */
export const CURATED_DATASET_NAMES: string[] = CURATED.map((c) => c.datasetName);

/** Look up a curated neighborhood by its dataset `pri_neigh` value. */
export function curatedByDatasetName(name: string | undefined): Curated | undefined {
  if (!name) return undefined;
  return CURATED.find((c) => c.datasetName === name);
}
