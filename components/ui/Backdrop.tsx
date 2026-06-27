/**
 * Lightweight, GPU-free page backdrop (replaces the old WebGL canvas).
 * Deep obsidian with two very faint cyan/amber glows — the "fog" mood at zero
 * runtime cost. The Hero renders its own animated wave on top (HeroWave).
 */
export function Backdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        background:
          "radial-gradient(70% 55% at 22% 16%, rgba(31,94,116,0.10) 0%, rgba(4,5,10,0) 55%)," +
          "radial-gradient(60% 55% at 84% 88%, rgba(120,72,36,0.08) 0%, rgba(4,5,10,0) 52%)," +
          "#04050a",
      }}
    />
  );
}
