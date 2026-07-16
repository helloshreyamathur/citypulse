"use client";

import type { Selection } from "./NeighborhoodMap";
import { placeholderFor } from "@/lib/placeholder";

export default function SidePanel({ selected }: { selected: Selection | null }) {
  if (!selected) {
    return (
      <Shell>
        <p className="text-sm text-slate-500">
          Pick a neighborhood on the map to see what&rsquo;s happening today.
        </p>
      </Shell>
    );
  }

  if (!selected.curated) {
    return (
      <Shell>
        <h2 className="text-xl font-semibold text-slate-900">{selected.display}</h2>
        <span className="mt-2 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
          Coming soon
        </span>
        <p className="mt-4 text-sm text-slate-500">
          This neighborhood isn&rsquo;t one of the 15 curated areas yet. We&rsquo;re starting
          with a focused set and growing from there.
        </p>
      </Shell>
    );
  }

  const { serving, fact } = placeholderFor(selected.display);

  return (
    <Shell>
      <h2 className="text-xl font-semibold text-slate-900">{selected.display}</h2>
      {selected.approximate && (
        <p className="mt-1 text-xs text-amber-600">
          Approximate boundary — assembled from the city&rsquo;s neighborhood polygons.
        </p>
      )}

      <div className="mt-5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Today&rsquo;s serving
        </h3>
        <ul className="mt-3 space-y-3">
          {serving.map((item, i) => (
            <li key={i} className="rounded-lg border border-slate-100 bg-white p-3 shadow-sm">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-medium text-slate-800">{item.title}</span>
                <span className="shrink-0 text-xs text-slate-400">{item.when}</span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-indigo-600">
                  {item.kind}
                </span>
                <span className="text-sm text-slate-500">{item.blurb}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 rounded-lg bg-amber-50 p-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-amber-700">
          Did you know
        </h3>
        <p className="mt-1.5 text-sm text-amber-900">{fact}</p>
      </div>

      <p className="mt-6 text-[11px] text-slate-300">Placeholder content · real data lands in Phase 2</p>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <aside className="flex h-full w-full flex-col overflow-y-auto border-l border-slate-200 bg-slate-50 p-6">
      <div className="mb-4">
        <span className="text-lg font-bold tracking-tight text-indigo-600">CityPulse</span>
        <span className="ml-2 text-xs text-slate-400">Chicago</span>
      </div>
      {children}
    </aside>
  );
}
