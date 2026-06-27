/**
 * Full-screen filmic grain + soft vignette over ALL content (DOM + canvas),
 * giving the page a cohesive, expensive cinematic finish. Pure CSS/SVG, cheap.
 */
export function GrainOverlay() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[60] opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[55]"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 50%, rgba(5,6,10,0) 55%, rgba(5,6,10,0.55) 100%)",
        }}
      />
    </>
  );
}
