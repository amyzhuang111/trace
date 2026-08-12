import { Blocker } from "@/types";

export const blockers: Blocker[] = [
  {
    id: "blocker-contradiction",
    title: "Contradiction Handling",
    description:
      "Conflicting-evidence cases remain unreliable — when a structured field and unstructured text disagree, the committed configuration sometimes picks one silently instead of flagging the conflict.",
    verifierId: "ver-contradiction-handling",
    failureId: "failure-021",
    owner: "Engineering — Agent Spec",
    remediation:
      "Strengthen contradiction-detection to explicitly compare structured fields against recent note content; add regression coverage.",
    status: "open",
  },
  {
    id: "blocker-support-risk",
    title: "Critical Support Risk",
    description:
      "An unresolved, executive-tracked high-severity issue was correctly retrieved but deprioritized out of the final top-3 selection instead of always surfacing.",
    verifierId: "ver-critical-support-risk",
    failureId: "failure-022",
    owner: "Engineering — Verifier Logic",
    remediation: "Move Critical Support Risk to a hard pre-summarization filter rather than a post-hoc check.",
    status: "open",
  },
  {
    id: "blocker-adversarial-coverage",
    title: "Adversarial Coverage",
    description:
      "Severity-taxonomy conflict coverage is insufficient — only one adversarial case currently exercises the legacy/current taxonomy mapping, not enough to isolate or trust the failure pattern.",
    verifierId: "ver-critical-support-risk",
    failureId: "failure-023",
    owner: "Evaluation — Eval Authoring",
    remediation: "Author four additional adversarial cases varying taxonomy mismatch patterns.",
    status: "open",
  },
];
