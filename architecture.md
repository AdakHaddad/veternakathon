# VET-REGION --- Architecture and Data Plan

**Status:** Proposed MVP architecture\
**Principle:** Minimal, secure, auditable, and easy to demonstrate.

## 1. System context

``` text
Livestock keeper
    |
    | mobile browser: submit report / check status
    v
VET-REGION web application
    |
    +--> Authentication and role checks
    |
    +--> Report API / validation
    |        |
    |        +--> Reports database
    |        +--> Action history / audit events
    |        +--> Protected attachments
    |
    +--> Authorized responder console
    |
    +--> Aggregate regional dashboard
    |
    +--> Education library
```

For the prototype, government-system integration is not assumed. If a
pilot partner later requests integration, use only an approved interface
and agreement.

## 2. Suggested stack

-   Next.js + TypeScript for the web application.
-   Supabase Postgres for structured data.
-   Supabase Auth or equivalent for authenticated staff roles.
-   Supabase Storage or equivalent for protected attachments.
-   Vercel or a familiar hosting provider.
-   A region-level map; precise farm coordinates are not shown publicly.

## 3. Data access model

  ----------------------------------------------------------------------------------
  Data           Reporter       Assigned responder    Administrator   Public
  -------------- -------------- --------------------- --------------- --------------
  Own report     Yes            Yes, if               Operational     No
  status                        assigned/authorized   access          

  Exact          Own submitted  Only if needed for    Restricted,     No
  farm/contact   details        response              audited access  
  details                                                             

  Report action  Appropriate    Yes                   Yes, as needed  No
  history        status summary                                       

  Aggregate      Public-safe    Yes                   Yes             Possibly
  counts by      summary if                                           
  region         approved                                             

  Unverified     Own report     Authorized view       Authorized view No precise
  report         only                                                 locations
  locations                                                           

  Education      Read           Read                  Manage          Read
  resources                                                           
  ----------------------------------------------------------------------------------

These are proposed defaults. The pilot agreement and privacy review
should determine final permissions.

## 4. Suggested status lifecycle

``` text
Submitted
   |
   v
Received
   |
   +--> Needs Information --> Received / Under Review
   |
   v
Under Review
   |
   +--> Referred / Escalated
   |
   v
Closed
```

"Closed" means the workflow was closed, not necessarily that the animal
recovered. Outcome and verification must be separate fields.

## 5. Suggested database entities

### profiles

-   `id`
-   `display_name`
-   `role`
-   `approved_region_id`
-   `professional_verification_status`
-   `created_at`

### reports

-   `id`
-   `created_at`
-   `reporter_id` or protected contact reference
-   `species`
-   `observed_signs`
-   `onset_at` nullable
-   `affected_count` nullable
-   `dead_count` nullable
-   `region_id`
-   `restricted_location_detail` nullable
-   `workflow_status`
-   `verification_status`
-   `assigned_responder_id` nullable
-   `outcome_summary` nullable
-   `outcome_source` nullable
-   `updated_at`

### report_actions

-   `id`
-   `report_id`
-   `actor_id`
-   `action_type`
-   `note`
-   `created_at`

### attachments

-   `id`
-   `report_id`
-   `storage_path`
-   `uploaded_by`
-   `created_at`
-   `access_classification`

### education_resources

-   `id`
-   `title`
-   `topic`
-   `species_scope`
-   `source_name`
-   `source_url`
-   `reviewer`
-   `reviewed_at`
-   `published_at`
-   `is_published`

### regions

-   `id`
-   `name`
-   `parent_region_id`
-   `routing_contact_or_group`

### audit_events

-   `id`
-   `actor_id`
-   `event_type`
-   `target_type`
-   `target_id`
-   `created_at`
-   `metadata`

## 6. Security requirements

-   Enforce authorization on the server and database, not only in the
    interface.
-   Use least-privilege roles and test access with different accounts.
-   Store attachments in private storage and use short-lived authorized
    access where supported.
-   Do not place personal data, contact details, or precise coordinates
    in public URLs or analytics events.
-   Validate all inputs and limit upload types and sizes.
-   Keep secrets out of source control.
-   Log status changes and administrative role changes.
-   Establish retention and deletion policies before handling real
    reports.

## 7. Geographic and epidemiological interpretation

-   A user-submitted report is not automatically a confirmed case.
-   Public maps should aggregate at an appropriate administrative level.
-   Suppress low-count areas or otherwise reduce the risk of identifying
    individual farms.
-   A cluster is a prompt for authorized review, not proof of an
    outbreak.
-   Do not calculate rates without a reliable denominator and a defined
    population at risk.
-   Record the source and verification status of any external data.

## 8. Integration policy

For the competition prototype, use simulated data and links to official
reporting resources. Do not scrape, copy, or claim integration with
official systems without permission and technical confirmation. Any
future interoperability should define data ownership, permitted fields,
access, error handling, auditability, and responsibilities.
