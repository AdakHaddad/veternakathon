# VET-REGION --- Project Plan

**Version:** 0.1\
**Date:** 18 October 2026\
**Target:** Pekan Insinyur Peternakan UGM 2026 prototype competition\
**Proposal deadline from the competition guide:** 25 October 2026\
**Assumption:** The team has a very short runway; prioritize a focused
demonstrator over a production-ready service.

## 1. Strategy

Build one complete and believable workflow, not a broad "super app."

**Demo story:** A livestock keeper submits a suspected disease report.
The report appears in an authorized responder's regional queue. The
responder acknowledges it, requests information or records an action,
and the report status changes. A dashboard updates aggregate counts, and
the user can access relevant expert-reviewed education.

Do not claim that the prototype diagnoses disease, prevents an outbreak,
replaces iSIKHNAS, or provides 24/7 veterinary service.

## 2. Scope decisions

### In scope

-   Responsive web application
-   One pilot region
-   One or two livestock categories
-   Report submission and reference ID
-   Role-based responder queue
-   Status tracking and action history
-   Aggregate regional dashboard
-   Small education library
-   Seeded demo data, clearly labelled as simulated
-   A short usability test and a proposal-ready explanation of the
    novelty gap

### Out of scope

-   National rollout
-   Live integration with government systems without permission and
    documentation
-   AI diagnosis or outbreak prediction
-   Mandatory onboarding of all veterinarians or officials
-   Complete animal inventory or lifetime animal-recording system
-   Native Android/iOS apps
-   Payments, auctions, or livestock trading
-   24/7 staffing promise

## 3. Workstreams and deliverables

  ---------------------------------------------------------------------------
  Workstream              Deliverable             Owner role
  ----------------------- ----------------------- ---------------------------
  Problem validation      Interview notes and top Product/research lead
                          three workflow pain     
                          points                  

  Existing-system review  Feature comparison with Research lead
                          iSIKHNAS, SIZE,         
                          GEMABALA, and relevant  
                          official workflows      

  Veterinary review       Approved report fields, Veterinary/animal-science
                          safety copy, and        liaison
                          education sources       

  UX and design           Mobile report flow,     UX/front-end
                          responder queue,        
                          dashboard               

  Backend                 Database schema,        Backend
                          authentication, access  
                          policies, report status 
                          workflow                

  Content                 3--5 concise, sourced   Content/editor + reviewer
                          educational resources   

  Testing                 Test script, results,   QA/research
                          and issue list          

  Competition submission  Proposal, architecture  Whole team
                          diagram, demo script,   
                          screenshots             
  ---------------------------------------------------------------------------

## 4. Suggested timeline

Because the deadline is close, use short timeboxes and parallel work.

### 18--19 October --- Validate and narrow

-   Interview at least 2 livestock keepers and 1 veterinarian/Puskeswan
    contact if possible.
-   Ask how reports are currently made, what happens after submission,
    and what is difficult.
-   Review public documentation of existing systems.
-   Select one concrete unmet workflow.
-   Decide pilot region and species.

**Exit condition:** The team can describe the problem in one sentence
and name evidence supporting it.

### 20 October --- Lock the MVP and prototype flow

-   Agree on report fields and status lifecycle.
-   Draw reporter, responder, and admin screens.
-   Decide what is simulated versus real.
-   Draft privacy and safety copy.

**Exit condition:** No feature is built unless it supports the demo
story.

### 21--22 October --- Implement the end-to-end workflow

-   Build report form.
-   Build responder queue and status updates.
-   Add role-based access.
-   Add aggregate dashboard with simulated data.
-   Add a few sourced educational resources.

**Exit condition:** A report can be submitted, reviewed, updated, and
reflected in the dashboard.

### 23 October --- Test and refine

-   Run a short test with team members and, if available, one
    practitioner.
-   Fix confusing labels and broken flows.
-   Verify unauthorized users cannot see restricted report details.
-   Confirm all simulated data is labelled.

**Exit condition:** The demo works reliably from a clean session.

### 24 October --- Prepare competition materials

-   Write proposal narrative and novelty-gap section.
-   Prepare architecture and workflow diagrams.
-   Capture screenshots.
-   Prepare a 3--5 minute demo script.
-   State limitations and validation still needed.

### 25 October --- Final check and submission

-   Check format and required proposal sections against the official
    guide.
-   Proofread claims, references, team details, and file formatting.
-   Submit before the stated deadline.

## 5. MVP backlog

### P0 --- Must work

-   [ ] Submit a report
-   [ ] Generate report reference
-   [ ] View report in authorized responder queue
-   [ ] Update status and add action log
-   [ ] Show status to reporter
-   [ ] Show aggregate regional dashboard
-   [ ] Distinguish unverified from confirmed information
-   [ ] Display education source and review metadata
-   [ ] Protect restricted report data
-   [ ] Seed demo data and label it as simulated

### P1 --- Only if P0 is stable

-   [ ] Status-change notification
-   [ ] Duplicate-report flag for manual review
-   [ ] Export de-identified summary
-   [ ] Draft form recovery on poor connectivity

### Do not build now

-   [ ] AI disease diagnosis
-   [ ] AI outbreak prediction
-   [ ] National map using unverified data
-   [ ] Full livestock population database
-   [ ] Auction or marketplace
-   [ ] Complex chat system
-   [ ] Live government-system integration

## 6. Suggested technical approach

Use tools the team already knows. A possible lean stack:

-   **Frontend:** Next.js + TypeScript + Tailwind CSS
-   **Backend/database:** Supabase (Postgres, Auth, Storage)
-   **Hosting:** Vercel or another familiar deployment platform
-   **Maps:** Use a simple region-level map or aggregate geographic
    view; avoid exposing exact farm coordinates publicly.
-   **Content:** Store title, topic, source URL, reviewer, and review
    date for each resource.

Do not let stack selection delay problem validation. A clickable
prototype plus a working end-to-end flow is better than a sophisticated
architecture that cannot be demonstrated.

## 7. Minimal database tables

-   `profiles`: user role, display name, approved region, verification
    status
-   `reports`: report metadata, species, observed signs, time, region,
    status, restricted location detail
-   `report_actions`: report ID, actor, timestamp, action type, note
-   `attachments`: report ID, protected file path, upload metadata
-   `education_resources`: title, topic, content/source, reviewer,
    review date
-   `regions`: pilot region and routing configuration
-   `audit_events`: security-sensitive actions and access changes

Apply row-level security or equivalent server-side authorization. Never
rely on hiding a button in the frontend as the only access control.

## 8. Validation plan

### Interview prompts for livestock keepers

1.  If you suspect an animal disease today, whom do you contact first?
2.  How do you find the correct contact?
3.  What information are you asked to provide?
4.  Have you ever been unsure whether your report was received or
    followed up?
5.  What would make you trust or distrust a reporting web app?
6.  Would you use a browser form, WhatsApp, phone call, or another
    channel? Why?

### Interview prompts for veterinarians/Puskeswan

1.  How do reports currently arrive and get recorded?
2.  What makes a report useful or difficult to act on?
3.  How are reports assigned and tracked?
4.  What information should never be visible publicly?
5.  Which cases must follow an official reporting pathway?
6.  Would a supplementary queue or status tracker help, or would it
    create duplicate work?

### Competitor/system review

Document for each existing system: - Intended users - Reporting
channels - Geographic capabilities - Status and follow-up features -
Education functions - Data access and interoperability - Verified
evidence from official documentation - What remains unknown

Do not describe a feature as absent unless there is sufficient evidence.
Distinguish "not found in public documentation" from "does not exist."

## 9. Demo script (3--5 minutes)

1.  **Problem (30 sec):** Explain the specific reporting/follow-up
    friction validated by interviews.
2.  **Submit (45 sec):** A reporter submits a sample report.
3.  **Respond (60 sec):** A responder sees it, acknowledges it, and
    records a next action.
4.  **Track (45 sec):** The reporter sees the status; the dashboard
    updates.
5.  **Educate (30 sec):** Show a relevant reviewed resource.
6.  **Novelty and limitations (45 sec):** Explain the gap being tested,
    how the prototype complements rather than replaces official systems,
    and what must be validated in a pilot.

## 10. Risks and mitigations

  -----------------------------------------------------------------------
  Risk                                Mitigation
  ----------------------------------- -----------------------------------
  Existing systems already cover much Compare actual workflows and narrow
  of the concept                      the problem to a demonstrable gap

  No official partner before deadline Use a simulated workflow; clearly
                                      state that operational integration
                                      is future work

  Doctors cannot be continuously      Use assigned responders, operating
  available                           hours, and official escalation
                                      guidance

  Incorrect public outbreak           Label report verification status
  interpretation                      and restrict sensitive maps

  Privacy or location exposure        Minimize data, limit roles,
                                      aggregate public displays, define
                                      retention

  Scope creep                         Freeze P0 after 20 October

  Claims exceed evidence              Report usability and workflow
                                      metrics only; do not claim outbreak
                                      reduction
  -----------------------------------------------------------------------

## 11. Go/no-go criteria

Proceed with this concept if the team can: - Identify a specific user
problem not adequately solved by the existing workflow they reviewed. -
Get at least one knowledgeable practitioner to review the report fields
or response workflow. - Demonstrate the complete report-to-follow-up
flow. - Explain how the product complements existing official systems. -
Finish the P0 features before preparing final presentation materials.

If the team cannot identify a distinct problem by 20 October, narrow the
concept further rather than adding more modules.

## 12. Immediate next actions

1.  Assign one person to interview users and review existing systems.
2.  Assign one person to draft the report form and status workflow.
3.  Assign one person to build the web prototype.
4.  Ask a lecturer or practitioner to review safety, report fields, and
    the novelty claim.
5.  Hold a short scope-lock meeting on 20 October.
