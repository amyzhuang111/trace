import { Expert, Interview } from "@/types";

export const experts: Expert[] = [
  {
    id: "exp-vp-cs",
    name: "Dana Whitfield",
    role: "VP, Customer Success",
    domain: "Customer Success Strategy",
    tenureYears: 9,
    avatarInitials: "DW",
  },
  {
    id: "exp-sam",
    name: "Marcus Ilori",
    role: "Senior Strategic Account Manager",
    domain: "Strategic Accounts",
    tenureYears: 7,
    avatarInitials: "MI",
  },
  {
    id: "exp-csm",
    name: "Priya Nandakumar",
    role: "Enterprise CSM",
    domain: "Customer Success",
    tenureYears: 4,
    avatarInitials: "PN",
  },
  {
    id: "exp-support",
    name: "Tom Reyes",
    role: "Support Operations Lead",
    domain: "Support Operations",
    tenureYears: 6,
    avatarInitials: "TR",
  },
  {
    id: "exp-revops",
    name: "Elena Vasquez",
    role: "Revenue Operations Lead",
    domain: "Revenue Operations",
    tenureYears: 5,
    avatarInitials: "EV",
  },
];

export const interviews: Interview[] = [
  {
    id: "int-vp-cs",
    expertId: "exp-vp-cs",
    date: "2026-07-14",
    durationMinutes: 42,
    systemsReferenced: ["Salesforce", "Google Drive"],
    painPoints: [
      "Sales and CS use different account health definitions, so leadership sees conflicting risk signals in the same weekly review.",
      "Executive sponsor changes are tracked informally, often only known because a rep happens to mention it.",
    ],
    openQuestions: [
      "Should the agent reconcile health scores across Sales and CS, or just surface the disagreement?",
      "Who owns the canonical definition of 'renewal risk' if the two orgs disagree?",
    ],
    qualityCriteria: [
      "A brief should never state a risk level without saying which definition it's using.",
      "Executive sponsor changes should always be called out, even if usage looks fine.",
    ],
    edgeCasesNoted: [
      "Executive sponsor departs mid-quarter with no replacement named yet.",
      "Sales marks an account 'green' while CS has it flagged internally as at-risk.",
    ],
    objectives: [
      "Get a single reliable risk signal without hiding disagreement between Sales and CS.",
      "Ensure executive sponsor turnover is never missed.",
    ],
    signals: [
      "Sales health score vs. CS health score diverge.",
      "Executive sponsor change, even if only mentioned informally.",
    ],
    decisionRules: [
      "Never state a risk level without naming which definition (Sales vs. CS) it's based on.",
      "Surface executive sponsor changes regardless of what usage or health scores show.",
    ],
    exceptions: [
      "When Sales and CS scores agree, a single reconciled label is fine — the flag-the-disagreement rule only applies when they diverge.",
    ],
    constraints: [
      "Must not silently pick one org's health definition over the other's.",
      "Must not invent a canonical 'renewal risk' definition — that ownership question is still open.",
    ],
    metrics: [
      "Frequency of Sales/CS health-score disagreement per QBR cycle.",
      "Time between an executive sponsor change occurring and it being reflected in any structured system.",
    ],
    transcript: `We rolled out a formal account health score two years ago, but Sales and Customer Success still don't agree on what "healthy" means. Sales weights renewal probability and expansion pipeline. CS weights product engagement and support burden. When those two scores disagree — and they disagree more than people admit — nobody escalates it, it just sits there until the QBR.

The other thing that never makes it into any system cleanly is executive sponsor turnover. If our champion on the customer side leaves, that's one of the highest-signal renewal risks we have, and it's almost never captured as a structured field. Someone finds out in a hallway conversation and mentions it in Slack, if at all.

If I'm looking at an AI-generated brief, the thing I'd trust least is a single confident health label. I'd want to know which systems agree, which disagree, and why. I'd rather see "Sales says healthy, CS flags declining engagement, here's the gap" than a single number that hides the disagreement.`,
  },
  {
    id: "int-sam",
    expertId: "exp-sam",
    date: "2026-07-16",
    durationMinutes: 55,
    systemsReferenced: ["Salesforce", "Zendesk", "Product Analytics", "Meeting Notes Repository"],
    painPoints: [
      "Prep for an executive meeting pulls from five different places and takes half a day for a large account.",
      "Ticket counts are a weak proxy for real risk — severity and pattern matter far more.",
    ],
    openQuestions: [
      "How should the agent handle a usage decline when it can't tell if the account is seasonal?",
      "What happens when two source systems flatly contradict each other?",
    ],
    qualityCriteria: [
      "The brief should be short — three things that matter, not twenty facts.",
      "Never state a risk without pointing to the evidence behind it.",
    ],
    edgeCasesNoted: [
      "Usage decline during a known migration between product tiers.",
      "Conflicting evidence between CRM stage and recent meeting notes.",
    ],
    objectives: [
      "Cut prep time for executive meetings without losing the judgment senior AMs currently apply by hand.",
      "Get a brief that leads with the three things that matter, not a full data dump.",
    ],
    signals: [
      "Active-user decline (context-dependent — not risk on its own).",
      "Unresolved high-severity support issues.",
      "Executive sponsor pulled into a support escalation.",
      "Anything material said in the last two meeting notes that isn't in CRM.",
    ],
    decisionRules: [
      "Never state a risk without pointing to the evidence behind it.",
      "If information conflicts across systems, flag the conflict instead of choosing one silently.",
      "Select the top three most decision-relevant findings, not an exhaustive list.",
    ],
    exceptions: [
      "A usage decline is not risk if the account is seasonal or mid-migration between product tiers — check context before scoring it.",
    ],
    constraints: [
      "Brief must stay short — three findings, not twenty facts.",
      "Every claim needs a traceable source.",
    ],
    metrics: [
      "Prep time per executive brief (currently ~2.5 hours for a large account).",
      "Number of source systems consulted per brief (currently five).",
    ],
    transcript: `Before an executive business review, I usually start in Salesforce and look at the renewal date, ARR, contract scope, and the last few opportunities. But Salesforce never tells the whole story.

I then look at product usage because a decline in active users matters, but only in context. A 15% decline can be fine if the customer is seasonal. A smaller decline can be a major warning sign if they are in the middle of rollout.

Support tickets are useful, but ticket count alone is misleading. I care more about unresolved high-severity issues, repeated complaints about the same feature, and whether the executive sponsor has been pulled into support escalation.

I read the last two meeting notes because sometimes the biggest risk is something the customer said that never made it into CRM.

The final brief should be short. The executive does not need twenty facts. They need the three things that matter, why they matter, and what we should do in the meeting.

I would never want AI to state that an account is "at risk" unless it can point to the evidence. If information conflicts across systems, I want it to flag the conflict instead of choosing one silently.`,
  },
  {
    id: "int-csm",
    expertId: "exp-csm",
    date: "2026-07-17",
    durationMinutes: 38,
    systemsReferenced: ["Product Analytics", "Meeting Notes Repository", "Google Drive"],
    painPoints: [
      "New implementations look like risk in the usage dashboard even when everything is on track.",
      "My notes from onboarding calls almost never get read before an executive meeting.",
    ],
    openQuestions: [
      "How long should an account be exempt from usage-based risk scoring after go-live?",
      "Should CSM notes outrank product usage when they disagree?",
    ],
    qualityCriteria: [
      "Don't flag low usage as risk in the first 60 days of a rollout — that's expected.",
      "Expansion signals should show up in more than one place before they're presented as real.",
    ],
    edgeCasesNoted: [
      "New implementation with naturally low usage in week one.",
      "A single usage spike that isn't corroborated by anything a CSM has heard.",
    ],
    objectives: [
      "Stop new implementations from being misread as churn risk.",
      "Get onboarding-call context (day-to-day champion, sponsor engagement) into the brief instead of sitting unused in a doc.",
    ],
    signals: [
      "Low usage in the first weeks after go-live (expected, not risk).",
      "A usage spike on one module with no corroborating customer conversation.",
    ],
    decisionRules: [
      "Don't flag low usage as risk in the first 60 days of a rollout.",
      "Require usage and conversation signals to line up before calling something an expansion opportunity.",
    ],
    exceptions: [
      "After the 60-day window, low usage reverts to being treated as a normal risk signal like any other account.",
    ],
    constraints: [
      "CSM call notes are a legitimate context source and must not be ignored just because they're unstructured.",
    ],
    metrics: [
      "Days since go-live (determines whether the 60-day exemption applies).",
      "Number of independent signals corroborating an expansion opportunity (target: 2+).",
    ],
    transcript: `A lot of the noise I see is accounts that look risky in the usage dashboard purely because they just went live. Nobody expects full adoption in the first two months, but if you only look at the numbers, it reads exactly like churn risk.

I also think expansion signals get over-trusted. If usage on one module spikes for two weeks, that shows up as an "opportunity," but if I haven't heard anything from the customer about wanting more seats or a new module, I'd treat that as noise, not signal. I want to see usage and conversation line up before something gets called an opportunity.

My call notes have context nobody else captures — onboarding friction, who's actually the day-to-day champion, whether the exec sponsor even shows up to calls. Right now that just sits in a doc nobody opens before a QBR.`,
  },
  {
    id: "int-support",
    expertId: "exp-support",
    date: "2026-07-20",
    durationMinutes: 47,
    systemsReferenced: ["Zendesk", "Salesforce"],
    painPoints: [
      "We migrated ticketing systems eighteen months ago and the severity taxonomy doesn't map cleanly between old and new tickets.",
      "Duplicate tickets from the same incident inflate how bad things look if you just count rows.",
    ],
    openQuestions: [
      "Should the agent de-duplicate incidents automatically, or just flag likely duplicates?",
      "What's the right threshold for 'this needs a human before the brief goes out'?",
    ],
    qualityCriteria: [
      "A repeated P1 on the same feature is a bigger signal than ten unrelated minor tickets.",
      "If a ticket status is stale, say so — don't present it as current fact.",
    ],
    edgeCasesNoted: [
      "Ticket marked unresolved in the system but closed via a side email thread.",
      "Zendesk API unavailable when the agent runs.",
    ],
    objectives: [
      "Make support-risk signal reflect real severity and pattern, not raw ticket count.",
      "Make sure a tool outage never gets silently presented as a clean bill of health.",
    ],
    signals: [
      "A repeated P1 on the same feature (high signal).",
      "Ticket status vs. last-updated timestamp (staleness check).",
      "Multiple tickets tagged to the same underlying incident (duplicates).",
    ],
    decisionRules: [
      "Weight support risk by unresolved severity and repetition, not raw ticket count.",
      "If a ticket's last-updated date is old relative to the meeting date, flag it as possibly stale rather than current fact.",
      "If a source system can't be reached, say so — don't quietly present silence as a clean bill of health.",
    ],
    exceptions: [
      "A single ticket, even P1, is not automatically the top risk if it's isolated and not repeated — pattern matters more than any one ticket.",
    ],
    constraints: [
      "Must not treat 'open P1s' as directly comparable across the legacy and current severity taxonomies — they don't map 1:1.",
    ],
    metrics: [
      "Legacy-to-current severity taxonomy mapping accuracy.",
      "Duplicate-ticket detection rate for same-incident tickets.",
    ],
    transcript: `Legacy tickets use a P1 through P4 scale, and after the migration the new system uses Critical/High/Medium/Low, and the mapping between them isn't exact — some old P2s are effectively today's Critical. If someone just counts "open P1s" across both systems, the number is wrong.

Volume is the wrong lens generally. Ten minor tickets about ten different things is not as bad as two tickets about the same broken integration that keeps coming back. And we do get duplicates — a customer opens three tickets for one incident because three different users hit it. If you count rows, that looks three times worse than it is.

The other thing that worries me about an automated brief is staleness. Sometimes a ticket sits "open" in the system for a week after it was actually resolved over email, because nobody closed the loop in Zendesk. If an agent reads that as current truth, it's going to scare an executive over nothing. I'd want it to at least flag the ticket's last-updated date so a human can sanity check it.

And systems go down. If Zendesk is unreachable when someone needs a brief, I don't want the agent to just quietly skip the support section — I want it to say it couldn't check.`,
  },
  {
    id: "int-revops",
    expertId: "exp-revops",
    date: "2026-07-22",
    durationMinutes: 40,
    systemsReferenced: ["Salesforce"],
    painPoints: [
      "Prioritization by raw ARR ignores margin and strategic fit, which skews which accounts get executive attention.",
      "Multi-year contracts get treated with the same urgency as month-to-month, which misallocates prep time.",
    ],
    openQuestions: [
      "Should contract term length directly discount urgency scoring?",
      "How do we weight strategic-logo accounts that aren't the largest ARR?",
    ],
    qualityCriteria: [
      "Renewal urgency should account for time-to-renewal, not just account size.",
      "Recommended actions need to be specific enough that an AM could act on them without more research.",
    ],
    edgeCasesNoted: [
      "Large ARR account on a three-year contract with eighteen months of runway left.",
      "Small ARR account that's strategically important as a logo/reference customer.",
    ],
    objectives: [
      "Stop ARR alone from driving prep prioritization — get time-to-renewal and strategic fit into the ranking.",
      "Make sure recommended actions are things an AM can actually do in the meeting.",
    ],
    signals: [
      "Time remaining on current contract term.",
      "Strategic or reference-logo status independent of ARR size.",
    ],
    decisionRules: [
      "Renewal urgency should account for time-to-renewal, not just account size.",
      "Recommended actions must be specific enough that an AM could act on them without further research.",
    ],
    exceptions: [
      "A large multi-year account with long runway left should not receive the same urgency framing as a smaller account renewing soon, even though it has more ARR at stake.",
    ],
    constraints: [
      "Vague recommendations (e.g. 'monitor the account') are treated as worse than none — they must not appear in a brief.",
    ],
    metrics: [
      "Time-to-renewal per account, weighted against ARR in prioritization.",
      "Share of recommended actions an AM can execute directly vs. requiring more research.",
    ],
    transcript: `If you rank accounts by ARR alone, you end up over-preparing for large, stable, multi-year accounts and under-preparing for smaller accounts that are actually at near-term risk. Contract term matters a lot — an account with eighteen months left on a three-year deal doesn't need the same urgency framing as one renewing in six weeks, even if the six-week account is smaller.

I'd also want recommended actions in a brief to be genuinely actionable — not "monitor the account" but something an AM could actually do in the meeting. Vague recommendations are worse than no recommendations, because they create false confidence that the brief did its job.`,
  },
];
