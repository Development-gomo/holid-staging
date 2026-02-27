"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

function fmtMoney(n) {
  const rounded = Math.round(n);
  return "$" + rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function fmtCommas(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Segmented slider field matching the screenshot:
 * - segmented blocks
 * - filled blocks to the thumb
 * - thin blue tick line at thumb
 * - blue dot under the tick
 * - value displayed under the tick
 */
function RangeField({
  label,
  value,
  setValue,
  min,
  max,
  step,
  minLabel,
  maxLabel,
  valueLabel,
  segments = 12,
}) {
  const p = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <p className="text-[12px] font-semibold text-slate-500">{label}</p>

      <div className="relative">
        <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="calc-seg-range w-full appearance-none bg-transparent"
        style={{
            "--p": `${p}%`,
            "--segments": segments,
        }}
        />

        {/* Blue dot marker under the tick */}
        <div
          className="absolute w-2 h-2 rounded-full bg-[#2A3EF4]"
          style={{ left: `${p}%`, transform: "translateX(-40%)", top: "38px", }}
          aria-hidden="true"
        />

        {/* value under thumb */}
        <div
          className="absolute text-[12px] font-semibold text-slate-900"
          style={{ left: `${p}%`, transform: "translateX(-40%)", top: "52px" }}
        >
          {valueLabel}
        </div>

        <div className="mt-[14px] flex items-center justify-between text-[11px] text-slate-400">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      </div>
    </div>
  );
}

export default function RevenueCalculatorSection({
  title = "How much can you earn?",
  subtitle =
    "Use the calculator to see how much Holid can make your site or app earn",
  maxYearly = 500000,
  ctaLabel = "Get started",
  onCtaClick,
}) {
  const [visitors, setVisitors] = useState(41000);
  const [pages, setPages] = useState(3);
  const [ads, setAds] = useState(6);
  const [tier, setTier] = useState("medium"); // low | medium | high

  // Gauge refs
  const trackRef = useRef(null);
  const [fullLen, setFullLen] = useState(1);

  useEffect(() => {
    if (trackRef.current) {
      try {
        setFullLen(trackRef.current.getTotalLength());
      } catch {
        setFullLen(1);
      }
    }
  }, []);

  const cpm = useMemo(() => {
    if (tier === "low") return 1;
    if (tier === "medium") return 2;
    return 3;
  }, [tier]);

  const adsMultiplier = (n) => {
    if (n <= 1) return 1.0;
    if (n === 2) return 1.7;
    if (n === 3) return 2.4;
    if (n === 4) return 2.9;
    if (n === 5) return 3.4;
    if (n === 6) return 3.9;
    if (n === 7) return 4.3;
    return 4.7;
  };

  const { monthly, yearly } = useMemo(() => {
    const tmp = (cpm / 1000) * visitors * pages;
    const m = tmp * adsMultiplier(ads);
    const y = m * 12;
    return { monthly: m, yearly: y };
  }, [visitors, pages, ads, cpm]);

  const pct = useMemo(() => clamp(yearly / maxYearly, 0, 1), [yearly, maxYearly]);
  const filledLen = useMemo(() => fullLen * pct, [fullLen, pct]);

  return (
    <section id="calculator" className="w-full bg-white py-16 md:py-20">
      <div className="web-width px-6">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-2 text-black/50 text-xs">
          <span className="inline-block w-1.5 h-1.5 rounded-sm bg-[#2D5BFF]" />
          <span>Calculator</span>
        </div>

        {/* Title */}
        <h2 className="mt-6 text-center text-black font-[Merriweather] font-medium text-4xl md:text-6xl leading-[1.05]">
          {title}
        </h2>

        {/* Subtitle */}
        <p className="mt-5 text-center text-black/55 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          {subtitle}
        </p>

        {/* Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
          {/* LEFT PANEL */}
          <div className="rounded-[14px] bg-[#DBE2E959] border border-black/5 shadow-[0_10px_30px_rgba(17,24,39,.08)] p-6 md:p-7">
            <div className="space-y-7">
              <RangeField
                label="Visitors per month"
                value={visitors}
                setValue={setVisitors}
                min={0}
                max={1000000}
                step={1000}
                minLabel="0"
                maxLabel="1000000"
                valueLabel={fmtCommas(visitors)}
                segments={12}
              />

              <RangeField
                label="Page views per visit"
                value={pages}
                setValue={setPages}
                min={0}
                max={10}
                step={1}
                minLabel="0"
                maxLabel="10"
                valueLabel={pages}
                segments={10}
              />

              <RangeField
                label="Ads per page"
                value={ads}
                setValue={setAds}
                min={0}
                max={8}
                step={1}
                minLabel="0"
                maxLabel="8"
                valueLabel={ads}
                segments={8}
              />

              {/* Segmented control */}
              <div className="pt-2">
                <p className="text-[12px] font-semibold text-slate-500 mb-3">
                  Traffic value
                </p>

                <div className="grid grid-cols-3 rounded-xl overflow-hidden border border-black/10 bg-white">
                  {["low", "medium", "high"].map((v) => {
                    const active = tier === v;
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setTier(v)}
                        className={[
                          "py-3 text-xs font-bold transition",
                          active
                            ? "bg-[#DDE2FF] text-slate-900"
                            : "bg-white text-slate-500 hover:text-slate-700",
                        ].join(" ")}
                      >
                        {v.charAt(0).toUpperCase() + v.slice(1)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE (two cards stacked) */}
          <div className="space-y-6">
            {/* Top card: Gauge + Yearly */}
            <div className="rounded-[14px] overflow-hidden border border-white/10 shadow-[0_10px_30px_rgba(17,24,39,.18)] bg-[#000821]">
              <div className="px-6 pb-4 bg-[#000821]">
                {/* Gauge */}
                <svg
                className="w-full h-[240px] block"
                viewBox="0 0 520 230"
                aria-label="Revenue gauge"
                role="img"
                >
                {/* OUTER dashed border */}
                <path
                  d="M84,55 A156,156 0 0 0 436,55"
                  fill="none"
                  stroke="rgba(79,93,255,.25)"
                  strokeWidth="2"
                  strokeDasharray="8 6"
                  strokeLinecap="round"
                />

                {/* INNER dashed border */}
                <path
                  d="M150,55 A110,110 0 0 0 370,55"
                  fill="none"
                  stroke="rgba(79,93,255,.25)"
                  strokeWidth="2"
                  strokeDasharray="8 6"
                  strokeLinecap="round"
                />

                {/* Base track */}
                <path
                    ref={trackRef}
                    d="M120,55 A140,140 0 0 0 400,55"
                    fill="none"
                    stroke="rgba(255,255,255,.15)"
                    strokeWidth="32"
                    strokeLinecap="round"
                />

                {/* Glow arc */}
                <path
                    d="M120,55 A140,140 0 0 0 400,55"
                    fill="none"
                    stroke="rgba(79,93,255,.35)"
                    strokeWidth="44"
                    strokeLinecap="round"
                    style={{
                    strokeDasharray: `${filledLen} ${fullLen}`,
                    transition: "stroke-dasharray 420ms ease",
                    }}
                />

                {/* Progress arc */}
                <path
                    d="M120,55 A140,140 0 0 0 400,55"
                    fill="none"
                    stroke="#2A3EF4"
                    strokeWidth="32"
                    strokeLinecap="round"
                    style={{
                    strokeDasharray: `${filledLen} ${fullLen}`,
                    transition: "stroke-dasharray 420ms ease",
                    }}
                />
                </svg>

                <div className="text-center pt-2 pb-4">
                    <div className="text-[#EAF0FF] font-medium tracking-tight text-4xl md:text-4xl">
                        {fmtMoney(yearly)}
                    </div>
                    <div className="mt-1 text-[12px] text-white/70">Revenue / year</div>
                </div>
              </div>
            </div>

            {/* Bottom card: Monthly + CTA */}
            <div className="rounded-[14px] overflow-hidden border border-white/10 shadow-[0_10px_30px_rgba(17,24,39,.18)] bg-[#000821]">
              <div className="px-6 pt-8 pb-6 text-center border-b border-white/10 bg-[#000821]">
                <div className="text-[#EAF0FF] font-extrabold tracking-tight text-3xl md:text-4xl">
                  {fmtMoney(monthly)}
                </div>
                <div className="mt-1 text-[12px] text-white/70">
                  Revenue / month
                </div>
              </div>

              <div className="p-6 bg-[#000821]">
                <a
                  href="https://app.holid.io/register"
                  className="w-full inline-flex rounded-xl bg-[#2F43FF] hover:opacity-95 transition text-white font-extrabold text-sm py-4 items-center justify-center gap-2"
                >
                  <span className="inline-block w-1.5 h-1.5 bg-white" />
                  {ctaLabel}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal CSS only for the segmented range styling */}
        <style jsx>{`
        /* Base input (track styling is done in pseudo-elements below) */
        :global(.calc-seg-range) {
            -webkit-appearance: none;
            appearance: none;
            height: 48px;            /* gives room for track */
            background: transparent; /* important */
            outline: none;
        }

        /* Chrome / Edge / Safari track */
        :global(.calc-seg-range::-webkit-slider-runnable-track) {
            height: 34px;
            border-radius: 3px;
            border: 1px solid rgba(0, 0, 0, 0.25);

            /* Layers:
            1) blue tick at current value
            2) vertical segment dividers
            3) base color fill (left = filled, right = white)
            */
            background:
            /* tick line */
            linear-gradient(
                to right,
                transparent 0%,
                transparent calc(var(--p) - 1px),
                #2a3ef4 calc(var(--p) - 1px),
                #2a3ef4 calc(var(--p) + 1px),
                transparent calc(var(--p) + 1px),
                transparent 100%
            ),
            /* segment dividers */
            repeating-linear-gradient(
                to right,
                transparent 0,
                transparent calc((100% / var(--segments)) - 2px),
                #e9edf6 calc((100% / var(--segments)) - 2px),
                #e9edf6 calc(100% / var(--segments))
            ),
            /* base fill */
            linear-gradient(
                to right,
                #c8d2ff 0%,
                #c8d2ff var(--p),
                #ffffff var(--p),
                #ffffff 100%
            );
        }

        /* Hide the native thumb (we show dot + label under it) */
        :global(.calc-seg-range::-webkit-slider-thumb) {
            -webkit-appearance: none;
            appearance: none;
            width: 0;
            height: 0;
            opacity: 0;
            border: 0;
            background: transparent;
            box-shadow: none;
        }

        /* Firefox track */
        :global(.calc-seg-range::-moz-range-track) {
            height: 34px;
            border-radius: 3px;
            border: 1px solid rgba(0, 0, 0, 0.25);
            background:
            linear-gradient(
                to right,
                transparent 0%,
                transparent calc(var(--p) - 1px),
                #2a3ef4 calc(var(--p) - 1px),
                #2a3ef4 calc(var(--p) + 1px),
                transparent calc(var(--p) + 1px),
                transparent 100%
            ),
            repeating-linear-gradient(
                to right,
                transparent 0,
                transparent calc((100% / var(--segments)) - 2px),
                #e9edf6 calc((100% / var(--segments)) - 2px),
                #e9edf6 calc(100% / var(--segments))
            ),
            linear-gradient(
                to right,
                #c8d2ff 0%,
                #c8d2ff var(--p),
                #ffffff var(--p),
                #ffffff 100%
            );
        }

        :global(.calc-seg-range::-moz-range-thumb) {
            width: 0;
            height: 0;
            opacity: 0;
            border: 0;
            background: transparent;
        }
        `}</style>
      </div>
    </section>
  );
}
