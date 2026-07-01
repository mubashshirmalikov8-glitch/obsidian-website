"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  type AdminLead,
  type LeadStatus,
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
} from "@/lib/lead-status";
import { cn } from "@/lib/cn";
import { updateLeadStatus } from "./actions";

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-label text-muted">{label}</dt>
      <dd className={cn("mt-1 text-sm text-starlight", mono && "break-all font-mono text-[12px]")}>
        {value || "—"}
      </dd>
    </div>
  );
}

export function LeadDrawer({
  lead,
  onClose,
}: {
  lead: AdminLead | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<LeadStatus | null>(lead?.status ?? null);
  const [err, setErr] = useState<string | null>(null);

  // Sync local status when a different lead is opened.
  useEffect(() => {
    setStatus(lead?.status ?? null);
    setErr(null);
  }, [lead?.id, lead?.status]);

  // Close on Escape.
  useEffect(() => {
    if (!lead) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lead, onClose]);

  function change(next: LeadStatus) {
    if (!lead || next === status || isPending) return;
    setErr(null);
    startTransition(async () => {
      const res = await updateLeadStatus(lead.id, next);
      if (res.ok) {
        setStatus(next);
        router.refresh();
      } else {
        setErr(res.error);
      }
    });
  }

  return (
    <AnimatePresence>
      {lead && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-void/60 backdrop-blur-sm"
            aria-hidden
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label={`Lead: ${lead.name}`}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-hairline bg-surface shadow-elev-3"
          >
            <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
              <h2 className="font-display text-lg font-semibold text-starlight">{lead.name}</h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md p-1 text-dust outline-none transition-colors hover:text-starlight focus-visible:ring-2 focus-visible:ring-ion/50"
                aria-label="Close"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                  <path
                    d="M4 4l10 10M14 4L4 14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
              {/* Status editor */}
              <div>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-label text-muted">
                  Status
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {LEAD_STATUSES.map((s) => {
                    const active = s === status;
                    return (
                      <button
                        key={s}
                        type="button"
                        disabled={isPending}
                        onClick={() => change(s)}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-xs outline-none transition-colors disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-ion/50",
                          active
                            ? "border-ion/55 bg-ion/[0.10] text-starlight"
                            : "border-white/12 bg-white/[0.02] text-dust hover:border-white/25 hover:text-starlight",
                        )}
                      >
                        {LEAD_STATUS_LABELS[s]}
                      </button>
                    );
                  })}
                </div>
                {err && <p className="mt-2 font-mono text-xs text-ember/90">Update failed: {err}</p>}
              </div>

              <dl className="grid grid-cols-2 gap-x-5 gap-y-5">
                <Field label="Phone" value={lead.phone} mono />
                <Field label="Locale" value={(lead.locale ?? "").toUpperCase()} />
                <Field label="Format" value={lead.format ?? ""} />
                <Field label="Tariff" value={lead.tariff ?? ""} />
                <Field label="Gender" value={lead.gender ?? ""} />
                <Field label="Age" value={lead.age ?? ""} />
                <Field label="Source" value={lead.source ?? ""} />
                <Field label="Created" value={lead.created_at.replace("T", " ").slice(0, 19)} mono />
              </dl>

              <Field label="User agent" value={lead.user_agent ?? ""} mono />
              <Field label="Lead ID" value={lead.id} mono />

              <a
                href={`tel:${lead.phone}`}
                className="inline-flex items-center gap-2 rounded-full border border-ion/45 bg-[linear-gradient(180deg,rgba(94,230,255,0.14),rgba(94,230,255,0.06))] px-5 py-2.5 text-sm font-medium text-starlight outline-none transition-colors hover:border-ion/70 focus-visible:ring-2 focus-visible:ring-ion/50"
              >
                Call {lead.phone}
              </a>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
