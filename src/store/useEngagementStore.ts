import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  EngagementState,
  WorkflowExtraction,
  AgentSpec,
  Verifier,
  RoiAssumptions,
  Experiment,
} from "@/types";
import { getInitialState } from "@/lib/data/seed";

type EngagementActions = {
  setInterviewExtraction: (interviewId: string, extraction: WorkflowExtraction) => void;
  updateAgentSpec: (specId: string, patch: Partial<AgentSpec>) => void;
  publishNewAgentSpecVersion: (patch: Partial<Omit<AgentSpec, "id" | "version">>) => void;
  updateVerifier: (verifierId: string, patch: Partial<Verifier>) => void;
  updateRoiAssumptions: (patch: Partial<RoiAssumptions>) => void;
  addExperiment: (experiment: Experiment) => void;
  markFailureRegression: (failureId: string) => void;
  resetDemo: () => void;
};

export type EngagementStore = EngagementState & EngagementActions;

export const useEngagementStore = create<EngagementStore>()(
  persist(
    (set) => ({
      ...getInitialState(),

      setInterviewExtraction: (interviewId, extraction) =>
        set((state) => ({
          interviews: state.interviews.map((i) => (i.id === interviewId ? { ...i, extraction } : i)),
        })),

      updateAgentSpec: (specId, patch) =>
        set((state) => ({
          agentSpecs: state.agentSpecs.map((s) => (s.id === specId ? { ...s, ...patch } : s)),
        })),

      publishNewAgentSpecVersion: (patch) =>
        set((state) => {
          const latest = state.agentSpecs[state.agentSpecs.length - 1];
          const next: AgentSpec = {
            ...latest,
            ...patch,
            id: `spec-v${latest.version + 1}`,
            version: latest.version + 1,
            createdAt: latest.createdAt,
          };
          return { agentSpecs: [...state.agentSpecs, next] };
        }),

      updateVerifier: (verifierId, patch) =>
        set((state) => ({
          verifiers: state.verifiers.map((v) => (v.id === verifierId ? { ...v, ...patch } : v)),
        })),

      updateRoiAssumptions: (patch) =>
        set((state) => ({ roiAssumptions: { ...state.roiAssumptions, ...patch } })),

      addExperiment: (experiment) => set((state) => ({ experiments: [...state.experiments, experiment] })),

      markFailureRegression: (failureId) =>
        set((state) => ({
          failures: state.failures.map((f) =>
            f.id === failureId ? { ...f, regressionAdded: true, status: "regression-added" as const } : f
          ),
        })),

      resetDemo: () => set({ ...getInitialState() }),
    }),
    {
      name: "trace-engagement-state",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);
