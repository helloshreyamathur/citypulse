// Hand-written placeholder content for Phase 1 (design crit). None of this is real —
// it stands in for the nightly pipeline's output so we can react to the layout and voice.
// Deleted / replaced by real data in Phase 2.

export type ServingItem = {
  title: string;
  /** Short when-string, e.g. "Today · 6pm" or "Sat". */
  when: string;
  /** One-word-ish category shown as a chip. */
  kind: string;
  blurb: string;
};

type Placeholder = {
  serving: ServingItem[];
  fact: string;
};

const BESPOKE: Record<string, Placeholder> = {
  "Logan Square": {
    serving: [
      { title: "Farmers Market on the Boulevard", when: "Today · 9am", kind: "Market", blurb: "Produce, flowers, and too many breakfast sandwiches along Logan Blvd." },
      { title: "Comedy in the back room at a bar", when: "Today · 8pm", kind: "Comedy", blurb: "Free show, one-drink minimum, arrive early for a seat." },
      { title: "Record fair pop-up", when: "Sat · noon", kind: "Pop-up", blurb: "Local diggers selling crates; mostly soul and house." },
    ],
    fact: "The Illinois Centennial Monument at Logan Square went up in 1918 — the eagle on top faces east, toward the lake.",
  },
  "Pilsen": {
    serving: [
      { title: "Gallery night on 18th Street", when: "Today · 6pm", kind: "Art", blurb: "Studios and storefronts open late; some have mezcal." },
      { title: "Tamales, then a mural walk", when: "Today", kind: "Food", blurb: "Come early — the good tamale spot sells out by early afternoon." },
    ],
    fact: "Pilsen's name comes from Plzeň in the Czech Republic — the neighborhood's first big immigrant wave, before it became a Mexican-American cultural anchor.",
  },
  "Wrigleyville": {
    serving: [
      { title: "Day game at Wrigley Field", when: "Today · 1:20pm", kind: "Sports", blurb: "Streets pack out after the 7th; parking is a myth, take the Red Line." },
    ],
    fact: "Wrigley Field's hand-turned scoreboard has been operated by hand since 1937 — no one has ever been hit by a batted ball up there.",
  },
  "Chinatown": {
    serving: [
      { title: "Dim sum, all morning", when: "Today", kind: "Food", blurb: "Carts on Wentworth; go with a group and point at things." },
      { title: "Reading at the Chinatown Library", when: "Sat · 2pm", kind: "Books", blurb: "The branch with the pinwheel roofline on Wentworth." },
    ],
    fact: "The Chinatown Branch Library's fan-shaped design has no right angles in its main hall — it's laid out around feng shui principles.",
  },
};

const GENERIC: Placeholder = {
  serving: [
    { title: "Live music at a neighborhood bar", when: "Today · 9pm", kind: "Music", blurb: "No cover; the kind of set you stumble into." },
    { title: "Coffee shop popup market", when: "Sat · 10am", kind: "Market", blurb: "A dozen local makers, one very good pastry table." },
    { title: "Movie in the park", when: "Fri · dusk", kind: "Outdoors", blurb: "Bring a blanket; it starts when the sky does." },
  ],
  fact: "Every Chicago neighborhood has a story hiding in a building or a street name — the real ones land here in Phase 2.",
};

export function placeholderFor(display: string): Placeholder {
  return BESPOKE[display] ?? GENERIC;
}
