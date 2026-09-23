import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { investigations as seedInvestigations } from "@/lib/mock-data/investigations";
import { productFeedback as seedFeedback } from "@/lib/mock-data/product-feedback";
import { decisionLog as seedDecisionLog } from "@/lib/mock-data/decision-log";
import { readoutEntries as seedReadout } from "@/lib/mock-data/readout";
import {
  DecisionLogEntry,
  FeedbackStatus,
  HypothesisStatus,
  Investigation,
  InvestigationStatus,
  ProductFeedback,
  ReadoutEntry,
} from "@/types";

function getInitialState() {
  return {
    investigations: seedInvestigations.map((i) => ({ ...i })),
    productFeedback: seedFeedback.map((f) => ({ ...f })),
    decisionLog: seedDecisionLog.map((d) => ({ ...d })),
    readoutEntries: seedReadout.map((r) => ({ ...r })),
  };
}

interface HilbertState {
  investigations: Investigation[];
  productFeedback: ProductFeedback[];
  decisionLog: DecisionLogEntry[];
  readoutEntries: ReadoutEntry[];
}

interface HilbertActions {
  setOperatorStatus: (id: string, status: InvestigationStatus) => void;
  setHypothesisStatus: (investigationId: string, hypothesisId: string, status: HypothesisStatus) => void;
  toggleValidationCheck: (investigationId: string, checkId: string) => void;
  updateDriverDecomposition: (investigationId: string, channelMixPct: number, promotionPct: number) => void;
  addToReadout: (entry: ReadoutEntry) => void;
  setFeedbackStatus: (id: string, status: FeedbackStatus) => void;
  addDecisionLogEntry: (entry: DecisionLogEntry) => void;
  resetDemo: () => void;
}

export type HilbertStore = HilbertState & HilbertActions;

export const useHilbertStore = create<HilbertStore>()(
  persist(
    (set) => ({
      ...getInitialState(),

      setOperatorStatus: (id, status) =>
        set((state) => ({
          investigations: state.investigations.map((i) => (i.id === id ? { ...i, operatorStatus: status } : i)),
        })),

      setHypothesisStatus: (investigationId, hypothesisId, status) =>
        set((state) => ({
          investigations: state.investigations.map((i) =>
            i.id === investigationId
              ? { ...i, hypotheses: i.hypotheses.map((h) => (h.id === hypothesisId ? { ...h, status } : h)) }
              : i,
          ),
        })),

      toggleValidationCheck: (investigationId, checkId) =>
        set((state) => ({
          investigations: state.investigations.map((i) =>
            i.id === investigationId
              ? {
                  ...i,
                  validationChecks: i.validationChecks.map((c) =>
                    c.id === checkId ? { ...c, completed: !c.completed } : c,
                  ),
                }
              : i,
          ),
        })),

      updateDriverDecomposition: (investigationId, channelMixPct, promotionPct) =>
        set((state) => ({
          investigations: state.investigations.map((i) =>
            i.id === investigationId && i.driverDecomposition
              ? {
                  ...i,
                  driverDecomposition: i.driverDecomposition.map((d) =>
                    d.label === "Acquisition mix"
                      ? { ...d, pct: channelMixPct }
                      : d.label === "Promotion depth"
                        ? { ...d, pct: promotionPct }
                        : d,
                  ),
                }
              : i,
          ),
        })),

      addToReadout: (entry) =>
        set((state) => ({
          readoutEntries: state.readoutEntries.some((r) => r.investigationId === entry.investigationId)
            ? state.readoutEntries
            : [...state.readoutEntries, entry],
        })),

      setFeedbackStatus: (id, status) =>
        set((state) => ({
          productFeedback: state.productFeedback.map((f) => (f.id === id ? { ...f, status } : f)),
        })),

      addDecisionLogEntry: (entry) => set((state) => ({ decisionLog: [entry, ...state.decisionLog] })),

      resetDemo: () => set({ ...getInitialState() }),
    }),
    {
      name: "hilbert-workbench-state",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
