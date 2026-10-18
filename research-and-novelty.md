# VET-REGION --- Research, Competitor Review, and Novelty Hypothesis

**Status:** Initial research checklist, not a completed exhaustive
market study\
**Purpose:** Prevent overclaiming novelty and identify a defensible
prototype scope.

## 1. Concept summary

VET-REGION is a proposed web application for structured
suspected-disease reporting, regional routing, responder follow-up, and
expert-reviewed prevention education.

## 2. Existing systems to review

The team should review official documentation and, where possible, ask
practitioners about actual workflows.

### iSIKHNAS

A national animal-health information system that supports field
reporting, data analysis, and information flow to staff who need to
respond. Review its reporter channels, case workflow, and current usage
in the intended pilot region.

### SIZE Platform

A zoonosis and epidemiology information system supporting cross-sector
information and response. Review which users can report, which data are
captured, and how animal-health events are handled.

### GEMABALA

A geospatial monitoring application associated with livestock health and
breeding activities. Review its target users and specific monitoring
functions.

These systems overlap with parts of the VET-REGION concept. Do not claim
that a function is missing merely because it is not obvious from a
public landing page.

## 3. Novelty hypothesis

Potential hypothesis to test:

> In a defined pilot area, some livestock keepers or responders may
> experience friction between submitting a suspected disease report and
> knowing who is responsible for the next action. A lightweight,
> mobile-friendly, region-scoped workflow with explicit acknowledgement,
> assignment, action history, and reporter-visible status may reduce
> that friction.

This is a hypothesis, not an established fact. It must be validated with
interviews and compared with the current local workflow.

## 4. Questions to answer

1.  Which reporting channels do livestock keepers currently use?
2.  Do users receive a confirmation or reference after reporting?
3.  Can the reporter see the status or next action?
4.  How are reports routed to a responsible officer?
5.  What happens when the initial report is incomplete?
6.  Do responders already use an internal queue or dashboard?
7.  What causes duplicate reports or missing information?
8.  Which official reporting channels must remain primary?
9.  What data can be shared with the public, and at what geographic
    granularity?
10. Which education topics are most useful to the target users?

## 5. Competitor comparison template

  ----------------------------------------------------------------------------------------------
  Capability            iSIKHNAS                  SIZE           GEMABALA       VET-REGION
                                                                                hypothesis
  --------------------- ------------------------- -------------- -------------- ----------------
  Structured            Verify from official      Verify         Verify         Prototype
  animal-health         documentation/interview                                 
  reporting                                                                     

  Regional/geospatial   Verify                    Verify         Verify         Aggregate
  view                                                                          regional
                                                                                dashboard

  Reporter-visible      Verify                    Verify         Verify         Explicit status
  follow-up status                                                              and reference

  Assigned owner/action Verify                    Verify         Verify         Core prototype
  history                                                                       workflow

  Education library     Verify                    Verify         Verify         Curated,
                                                                                reviewed
                                                                                resources

  Public access and     Verify                    Verify         Verify         Role-based and
  privacy model                                                                 aggregate-only

  Integration with      Existing system           Existing       Existing       Not in MVP
  official reporting                              system         system         
  ----------------------------------------------------------------------------------------------

Use "not found in public documentation" where evidence is incomplete. Do
not mark a feature "No" without support.

## 6. What would count as a credible differentiator?

A defensible contribution could be one of the following, if research
supports it: - A lower-friction reporting flow validated with target
users. - A transparent acknowledgement and follow-up workflow that
solves a locally observed problem. - A clear handoff process between
reporter and authorized responder. - A low-bandwidth/mobile-first
interface tested in the intended setting. - A carefully governed way to
summarize unverified reports without presenting them as confirmed
outbreaks.

The combination of a map, education page, and report form alone is not a
strong novelty claim.

## 7. Evidence to collect

-   Interview notes with role and date; avoid unnecessary personal data.
-   Screenshots or descriptions from official public documentation with
    source URLs and access dates.
-   A table of feature comparisons and uncertainties.
-   A simple usability test with task completion and time-to-submit.
-   Feedback from a veterinary or animal-health practitioner on report
    fields and safety wording.

## 8. Suggested proposal wording

Avoid: - "No existing system provides animal disease reporting." -
"VET-REGION will prevent outbreaks." - "AI detects outbreaks
automatically." - "All veterinarians will be available at any time."

Prefer: - "VET-REGION explores a complementary workflow for..." - "The
prototype will evaluate whether..." - "Unverified reports are
distinguished from confirmed cases." - "Urgent reports remain subject to
official reporting and veterinary response procedures." - "The pilot
will measure usability, report completeness, and acknowledgement time;
disease-impact evaluation requires further field study."
