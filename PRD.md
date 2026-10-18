# VET-REGION --- Product Requirements Document (PRD)

**Version:** 0.1 --- Competition prototype\
**Date:** 18 October 2026\
**Status:** Draft for team review\
**Product type:** Responsive web application\
**Competition context:** Pekan Insinyur Peternakan UGM 2026\
**Working title:** VET-REGION --- Regional Animal Health Reporting and
Response Coordination

## 1. Executive summary

VET-REGION is a responsive web application concept intended to help
livestock keepers submit structured reports about suspected
animal-health problems and help authorized local responders coordinate
and track follow-up. It also provides accessible, expert-reviewed
educational content on disease prevention, biosecurity, feed management,
and livestock care.

The prototype focuses on one practical workflow: **a report should not
disappear after submission**. The reporter should receive confirmation
and be able to see an appropriate status, while authorized responders
can review, assign, update, and close reports. A geographic dashboard
helps authorized users understand where reports are being submitted.

VET-REGION is a proposed coordination layer for a limited pilot, not a
replacement for official Indonesian animal-health reporting systems, a
diagnostic tool, or a guarantee of 24/7 veterinary availability.

## 2. Problem statement

Livestock keepers may have difficulty knowing how to report suspected
disease, what information to provide, which local professional or
authority to contact, and whether a submitted report is being followed
up. Relevant educational information may also be scattered or difficult
to find when needed.

These are problem hypotheses to validate through interviews with
livestock keepers, veterinarians, Puskeswan staff, and relevant local
authorities. Existing systems already support parts of animal-health
reporting and surveillance, so VET-REGION must identify a specific unmet
workflow rather than claim that reporting, maps, or educational content
are entirely new.

## 3. Product vision

Make reporting and follow-up for suspected livestock health issues
easier to understand, geographically coordinated, and more
transparent---while helping users access reliable prevention guidance.

## 4. Goals

1.  Enable a livestock keeper to submit a structured report using a
    mobile browser.
2.  Give authorized responders a clear queue of reports requiring review
    or follow-up.
3.  Make report status and responsibility visible to appropriate users.
4.  Display aggregate geographic information without exposing sensitive
    personal or farm-location data publicly.
5.  Provide curated, expert-reviewed educational resources.
6.  Measure prototype performance using workflow metrics such as
    completion rate, report completeness, and time to acknowledge a
    report in a test scenario.

## 5. Non-goals for the prototype

-   Replacing iSIKHNAS, SIZE, GEMABALA, or other official systems.
-   Making an automated veterinary diagnosis or prescribing treatment.
-   Declaring a disease outbreak based only on unverified user reports.
-   Providing guaranteed 24/7 access to a veterinarian.
-   Building a complete national livestock census or national disease
    database.
-   Recording every animal's lifetime production history.
-   Processing payments, livestock auctions, or animal sales.
-   Automatically integrating government data without permission and a
    confirmed technical interface.

## 6. Target users and roles

### 6.1 Livestock keeper / reporter

-   Submit a suspected disease or unusual-event report.
-   View the report reference and status.
-   Access relevant prevention and biosecurity education.
-   Add requested follow-up information.

### 6.2 Authorized responder

May be a participating veterinarian, Puskeswan officer, or other
authorized animal-health professional according to the pilot
agreement. - Review incoming reports. - Request clarification. - Record
an acknowledgement and next action. - Update case status and outcome,
within their authority. - Escalate reports through the agreed official
pathway.

### 6.3 Content editor / subject-matter reviewer

-   Publish and update educational materials.
-   Record the source, reviewer, review date, and relevant audience for
    each resource.

### 6.4 Platform administrator

-   Verify professional or institutional accounts.
-   Configure pilot locations and routing rules.
-   Manage roles, access, audit logs, and report categories.
-   Monitor platform operation without making clinical decisions.

## 7. Core user journeys

### Journey A --- Submit a report

1.  User opens the web application.
2.  User selects report type and livestock species.
3.  User enters observed signs, onset time, approximate number affected,
    and location at the level required for response.
4.  User optionally attaches a photo or supporting note, with privacy
    guidance.
5.  User reviews the consent/privacy notice and submits.
6.  System creates a report ID and displays confirmation plus the
    appropriate next steps.
7.  User can check the report status.

### Journey B --- Triage and follow-up

1.  Authorized responder signs in.
2.  Responder sees a queue filtered by assigned area and status.
3.  Responder reviews the report and marks it as received, needs
    information, under review, referred/escalated, or closed.
4.  Responder records the action and next step.
5.  Reporter sees an appropriate status update.
6.  Any clinical conclusion or confirmed disease status is entered only
    by an authorized professional or imported from an authorized source.

### Journey C --- Explore education

1.  User browses topics such as biosecurity, common signs that warrant
    contacting a professional, feed management, and prevention.
2.  User filters content by species or topic.
3.  Each resource shows its source, review date, and reviewer/issuing
    organization where permitted.
4.  Urgent content directs users to the relevant official reporting
    channel rather than suggesting that the app itself provides
    emergency veterinary care.

### Journey D --- View regional dashboard

1.  Authorized user chooses a permitted region and date range.
2.  Dashboard displays aggregate report counts and status breakdowns.
3.  Unverified reports are visually distinguished from
    verified/confirmed cases.
4.  Small counts and precise locations are hidden or generalized where
    necessary to reduce re-identification risk.

## 8. Functional requirements

### P0 --- Required for the prototype

-   **FR-01 Authentication:** Provide sign-in for responder and
    administrator roles. A limited reporter flow may use a one-time
    reference or account, depending on implementation scope.
-   **FR-02 Role-based access:** Restrict report details and
    administrative functions by role.
-   **FR-03 Report form:** Capture species, observed signs, time
    observed/onset if known, approximate affected/dead counts if known,
    location, contact method, and optional evidence.
-   **FR-04 Confirmation:** Generate a unique report reference and
    confirmation state.
-   **FR-05 Status lifecycle:** Support `Submitted`, `Received`,
    `Needs Information`, `Under Review`, `Referred/Escalated`, and
    `Closed`. Do not imply that `Closed` means recovered unless a
    verified outcome explicitly says so.
-   **FR-06 Responder queue:** List and filter reports by status, date,
    species, and authorized region.
-   **FR-07 Follow-up notes:** Authorized responders can add timestamped
    actions and status changes.
-   **FR-08 Map/dashboard:** Display aggregate reports by region.
    Precise farm locations must not be publicly exposed.
-   **FR-09 Education library:** Display curated resources with source
    and review metadata.
-   **FR-10 Admin tools:** Manage users, roles, region routing, report
    categories, and content.
-   **FR-11 Audit trail:** Record status changes and relevant
    administrative actions.
-   **FR-12 Safety notice:** Clearly state that the platform does not
    diagnose disease and does not replace official reporting channels or
    direct professional advice.

### P1 --- Only if time permits

-   Notifications when a report is acknowledged or its status changes.
-   Offline-friendly draft saving in the browser.
-   Duplicate-report flagging for human review.
-   Export of de-identified pilot metrics.
-   Basic clustering of reports by time and geographic area for
    authorized review, with no automated outbreak declaration.

### Explicitly out of scope

-   AI diagnosis from images or symptoms.
-   Automated treatment recommendations.
-   Public display of reporter names, phone numbers, or exact farm
    coordinates.
-   Unverified automatic alerts claiming an outbreak.
-   Mandatory enrollment of all veterinarians or government staff.

## 9. Report data model (minimum)

A report should contain only the data needed for the pilot:

-   `id`: unique report identifier
-   `created_at`: submission timestamp
-   `reporter_user_id` or a protected contact reference
-   `species`: species/category observed
-   `observed_signs`: structured choices plus optional free text
-   `onset_at`: optional date/time signs were first observed
-   `affected_count`: optional approximate count
-   `dead_count`: optional approximate count
-   `location_region`: region used for routing and aggregation
-   `location_detail`: restricted detail only when necessary
-   `attachments`: optional file references with access controls
-   `verification_status`: unverified / reviewed / confirmed by
    authorized source / not confirmed / unable to determine
-   `workflow_status`: one of the defined status values
-   `assigned_responder_id`: optional
-   `action_log`: timestamped status changes and actions
-   `outcome`: optional, with source and verification status

Do not require a complete herd inventory for the first prototype. The
approximate number affected is useful if known, but users should be able
to indicate "unknown." A regional population denominator is not required
for the MVP.

## 10. Non-functional requirements

-   **Mobile-first:** Core report submission should work on a
    low-to-mid-range smartphone browser.
-   **Performance:** Keep the report form lightweight; optimize image
    size and avoid unnecessary scripts.
-   **Accessibility:** Use clear Indonesian labels, readable contrast,
    and plain language.
-   **Security:** Enforce server-side authorization, secure file access,
    input validation, and protected secrets.
-   **Privacy:** Collect the minimum necessary personal and location
    data; explain purpose and access; define retention and deletion
    rules with the pilot partner.
-   **Reliability:** Show whether a report was submitted successfully;
    do not silently lose form data.
-   **Traceability:** Preserve an audit trail for status changes.
-   **Localization:** Indonesian language first; design for future
    local-language support if validated.

## 11. Privacy, governance, and safety

-   Exact farm coordinates, phone numbers, and personal identifiers must
    only be visible to authorized users with a legitimate operational
    need.
-   Public maps should use aggregated regions and should suppress very
    small counts where disclosure risk exists.
-   Consent and privacy notices must explain how information will be
    used and who may access it.
-   Reporters should be warned not to use the platform as the sole
    channel for urgent or legally reportable disease events.
-   Clinical determinations and official outbreak declarations remain
    with authorized professionals/authorities.
-   Establish a written pilot agreement before using real identifiable
    case data.
-   Educational content must have a credible source and expert review;
    include review dates and a correction process.

## 12. Success metrics

For a prototype test, measure: - Percentage of test users who complete a
report without assistance. - Median time to submit a report. -
Percentage of reports containing the required minimum fields. - Time
from submission to acknowledgement in the simulated workflow. -
Percentage of reports with a recorded next action. - Responder task
completion rate. - User feedback on clarity, trust, and ease of use.

Do not claim reduced disease incidence or outbreak containment from a
short prototype test.

## 13. MVP acceptance criteria

The prototype is ready for demonstration when: 1. A test reporter can
submit a report and receive a unique reference. 2. An authorized
responder can find the report in their queue. 3. The responder can
update status and add a follow-up action. 4. The reporter can see an
appropriate status update. 5. The dashboard shows aggregate report
counts and distinguishes unverified from confirmed information. 6. An
education resource can be opened and its source/review metadata is
visible. 7. Unauthorized users cannot access restricted report details.
8. The demo clearly identifies sample data as simulated.

## 14. Assumptions and open questions

-   Which district or pilot region will be used?
-   Which livestock species should be in the first version?
-   Which institution or professional will review the reporting form and
    education content?
-   Which official reporting pathway should be displayed for suspected
    priority diseases?
-   Can a Puskeswan or local authority participate in testing?
-   What data may be collected, stored, and shared under the pilot
    agreement?
-   Is the product intended to complement an official system, or is the
    prototype only demonstrating a workflow without integration?

## 15. Positioning statement

VET-REGION is a regional animal-health reporting and follow-up
coordination prototype that helps livestock keepers submit structured
reports and helps authorized responders track the next action, supported
by geographically relevant educational content. Its novelty must be
demonstrated through a validated user problem and workflow comparison
with existing systems.
