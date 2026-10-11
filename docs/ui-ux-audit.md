# Pathology Intelligence Platform UI audit

## Audit scope and evidence

The router contains 62 explicit route entries plus the `*` fallback. The route/component/style-reference inventory below was generated from the route groups. The live Vite app was visually inspected at `/`, `/login`, `/register`, `/register/internal`, `/pending-approval`, and `/unauthorized` at the available desktop viewport. Protected routes were not visually inspected: this browser was signed out, and no test credentials or records were used. Entries marked **Source only** must not be read as visual verification.

The page-level source review and changes focused on the inconsistent specimen/block/slide directories and forms, report workspaces and queues, QC entry, shared keyboard focus, and the visibly unfinished unauthorized page. Other listed pages received the shared focus/content-width baseline where applicable; they did not receive a page-specific visual redesign during this pass.

| Route | Page | Inspection evidence | UI improvement / outcome |
|---|---|---|---|
| `/audit-logs` | AuditLogs | Source only; route and style reference inventoried | No page-specific change; shared focus baseline applies. |
| `/consent` | ConsentRequests | Source only; page and backend route inventory reviewed | Removed fabricated patient requests; now clearly explains the missing backend integration. |
| `/consent/:id` | ConsentDetails | Source only; page and backend route inventory reviewed | Removed fabricated consent detail; now clearly explains the missing backend integration. |
| `/shared-records` | SharedRecords | Source only; page and backend route inventory reviewed | Removed fabricated shared patient records; now clearly explains the missing backend integration. |
| `/dashboard` | Dashboard | Source only; route and component inventoried | Patient and doctor role routing was corrected in the prior stabilization pass. |
| `/doctors` | Doctors | Source only; registered during directory completion | Added searchable doctor directory using the existing authorized doctors API. |
| `/doctors/:id` | DoctorDetails | Source only; registered during directory completion | Added doctor professional detail view; backend excludes password/account metadata. |
| `/doctor-dashboard` | DoctorDashboard | Source only; route and dashboard component inventoried | Shared focus/content-width baseline applies; visual review pending. |
| `/patient-dashboard` | PatientDashboard | Source only; route and dashboard component inventoried | Shared focus/content-width baseline applies; visual review pending. |
| `/admin-dashboard` | AdminDashboard | Source only; route and dashboard styles inventoried | Management destinations and navigation were corrected in the prior pass. |
| `/technician-dashboard` | TechnicianDashboard | Source only; route and dashboard styles inventoried | Shared focus/content-width baseline applies; visual review pending. |
| `/pathologist-dashboard` | PathologistDashboard | Source only; route and dashboard styles inventoried | Shared focus/content-width baseline applies; visual review pending. |
| `/quality-dashboard` | QualityDashboard | Source only; route and dashboard styles inventoried | Shared focus/content-width baseline applies; visual review pending. |
| `/login` | Login | Rendered and visually inspected | Existing composition retained; shared keyboard focus visible. |
| `/register` | RegisterSelector | Rendered and visually inspected | Existing account-type cards retained; shared keyboard focus visible. |
| `/register/internal` | InternalRegister | Rendered and visually inspected | Existing form retained; shared keyboard focus visible. |
| `/register/patient` | PatientRegister | Source only; route/component/style reference inventoried | No page-specific change; visual review pending. |
| `/register/doctor` | DoctorRegister | Source only; route/component/style reference inventoried | No page-specific change; visual review pending. |
| `/forgot-password` | ForgotPassword | Source only; route/component/style reference inventoried | No page-specific change; visual review pending. |
| `/reset-password/:token` | ResetPassword | Source only; route/component/style reference inventoried | No page-specific change; visual review pending. |
| `/verify-email/:token` | VerifyEmail | Source only; route/component/style reference inventoried | No page-specific change; visual review pending. |
| `/cases` | Cases | Source only; route and cases styles inventoried | Existing structured case table retained; visual review pending. |
| `/cases/add` | AddCase | Source only; route and form styles inventoried | Existing form retained; visual review pending. |
| `/cases/:id` | CaseDetails | Source only; route and detail/workflow styles inventoried | Existing workflow/detail layout retained; visual review pending. |
| `/specimens` | Specimens | Source only; page and shared table implementation reviewed | Replaced bare cards with shared responsive directory table, header, retry, loading, and empty states. |
| `/specimens/add` | AddSpecimen | Source only; page and form implementation reviewed | Added shared header/form layout, explicit label associations, and accessible error state. |
| `/specimens/:id` | SpecimenDetails | Source only; page implementation reviewed | Added shared detail layout, field grid, loading/error/not-found state, and return link. |
| `/blocks` | Blocks | Source only; page and shared table implementation reviewed | Replaced bare cards with shared responsive directory table, header, retry, loading, and empty states. |
| `/blocks/add` | AddBlock | Source only; page/form implementation reviewed | Added shared header/form layout, explicit label associations, and retained entered values on failure. |
| `/blocks/:id` | BlockDetails | Source only; page implementation reviewed | Added shared detail layout, field grid, loading/error/not-found state, and return link. |
| `/slides` | Slides | Source only; page and table implementation reviewed | Replaced default unstyled table with shared responsive table, detail links, header, retry, and empty/loading/error states. |
| `/slides/add` | AddSlide | Source only; page/form implementation reviewed | Added shared header/form layout, explicit label associations, and retained entered values on failure. |
| `/slides/:id` | SlideDetails | Source only; page and viewer style references inventoried | Existing viewer retained; visual review pending. |
| `/admin/pending-approvals` | PendingApprovals | Source only; route/component/style reference inventoried | Existing approval surface retained; visual review pending. |
| `/admin/workflow-configuration` | WorkflowConfiguration | Source only; route/component/style reference inventoried | Existing honest configuration explanation retained; visual review pending. |
| `/patients` | Patients | Source only; route and patient styles inventoried | Existing structured patient table retained; visual review pending. |
| `/patients/add` | AddPatient | Source only; route and form styles inventoried | Existing patient form retained; visual review pending. |
| `/patients/:id` | PatientDetails | Source only; route and detail styles inventoried | Existing patient detail layout retained; visual review pending. |
| `/` | Home | Rendered and visually inspected before final copy revision | Removed unsupported AI capability claims; section now describes real workflow/TAT/QC functions and states predictive AI is not connected. |
| `/pending-approval` | PendingApproval | Rendered and visually inspected | Existing approval status card retained. |
| `/unauthorized` | Unauthorized | Rendered, visually inspected, then rechecked | Replaced unstyled text with a centered access-denied card and workspace action. |
| `/qc` | QCDashboard | Source only; route and dashboard styles inventoried | Existing QC dashboard retained; visual review pending. |
| `/qc/add` | AddQCRecord | Source only; page/form implementation reviewed | Added shared form layout, accessible labels, loading/error/success states, and submit progress. |
| `/qc/records` | QCRecords | Source only; route and record styles inventoried | Existing searchable records surface retained; visual review pending. |
| `/qc/:id` | QCRecords | Source only; route and record styles inventoried | Same records page as `/qc/records`; visual review pending. |
| `/reports` | Reports | Source only; page and shared table implementation reviewed | Replaced default bordered table with shared responsive directory and loading/error/empty/retry states. |
| `/reports/create` | CreateReport | Source only; page, selector, information panels, and form reviewed | Added consistent report page header, case selector panel, loading and error presentation, and aligned report fields. |
| `/reports/:id/sign-out` | SignOutReport | Source only; page implementation reviewed | Added consistent report header/panels and success/error states; confirmation behavior retained. |
| `/pathologist-workspace` | PathologistWorkspace | Source only; page implementation reviewed | Replaced plain links with a three-card report task workspace. |
| `/reports/drafts` | DraftReports | Source only; page and shared table implementation reviewed | Replaced default bordered table with shared responsive queue and loading/error/empty/retry states. |
| `/reports/sign-out` | SignOutReports | Source only; page and shared table implementation reviewed | Replaced default bordered table with shared responsive queue and loading/error/empty/retry states. |
| `/reports/:id` | ReportDetails | Source only; page implementation reviewed | Added consistent page header, report panel, and grouped report actions. |
| `/reports/:id/edit` | EditReport | Source only; page and report form reviewed | Added consistent report header, metadata panel, and accessible error presentation. |
| `/server-error` | ServerError | Source only; route and component inventoried | Shared error-page styles added; visual review pending. |
| `/maintenance` | Maintenance | Source only; route and component inventoried | Shared error-page styles added; visual review pending. |
| `/tat` | TATDashboard | Source only; route and TAT styles inventoried | Existing metrics/table surface retained; visual review pending. |
| `/tat/:caseId` | TATDetails | Source only; route and TAT styles inventoried | Existing case timeline retained; visual review pending. |
| `/users` | Users | Source only; route and component/style reference inventoried | Existing directory retained; visual review pending. |
| `/users/add` | AddUser | Source only; route and component/style reference inventoried | Existing registration form retained; visual review pending. |
| `/users/access-control` | AccessControl | Source only; route and component/style reference inventoried | Existing explanatory permissions matrix retained; visual review pending. |
| `/users/:id/account` | AccountOverview | Source only; route and component/style reference inventoried | Existing account summary retained; visual review pending. |
| `/users/:id` | UserDetails | Source only; route and component/style reference inventoried | Existing details surface retained; visual review pending. |
| `*` | NotFound | Source only; fallback component and shared error styles inventoried | Shared error-page styles apply; visual review pending. |

## Shared changes

- Added a global visible `:focus-visible` indicator, disabled-control cursor treatment, and consistent content width/padding in `styles/design/clinical-ui.css`.
- Added reusable record directory/detail layouts and responsive styles for laboratory and report records.
- Added consistent error-card styles for unauthorized, not-found, server-error, and maintenance pages.
- Added authenticated internal case search, using server-side role checks and limited case result fields, plus a notification menu wired to the recipient-owned notification APIs.
- Added live operational queues for technician, pathologist, and quality-manager dashboards. Admin navigation now links to searchable patient and doctor directories.
- Updated the shared shell's narrow-screen sidebar to overlay the workspace instead of reducing its width. This is source-reviewed only; mobile browser verification remains pending.

## Verification

- Follow-up browser verification rendered `/` (Home), `/login`, and `/register` in the local Vite app at a 1470×800 desktop viewport. Screenshots and accessibility-tree snapshots were inspected. Home navigation links, the Login form controls, and the three registration-selector options were present. No visual or interaction defect reproduced on these pages.
- A direct signed-out request to `/admin-dashboard` redirected to `/login`. This verifies the signed-out guard response only; it does **not** visually verify the dashboard or any other protected page.
- Protected pages remain source-only because this repository provides no documented demo/test credentials or browser fixtures and the available browser has no authenticated application session. No account was created, no auth state was synthesized, and no records were modified.
- Narrow/mobile rendering was **not verified**. The available browser-control surface did not provide a viewport override, and the rendered app remained at 1470×800. Do not infer responsive behavior from the source review.
- The public routes rendered and visually inspected in the earlier pass remain `/pending-approval` and `/unauthorized`; `/` was rendered again after its copy revision. `/register/internal` was rendered during the earlier pass.
- No reproducible visual or interaction defect was found in the pages rendered during this follow-up. No UI code changes were made in this verification pass.
- Follow-up frontend tests, build, and `git diff --check` results are recorded in the task response.

## Remaining browser verification blockers

- To continue with protected pages, an authorized user should sign in directly in the local browser using an existing non-production account and safe demo records. Do not send credentials in chat. Once signed in, review only the routes allowed for that account and avoid submitting record-changing forms.
- To check narrow layouts, the user can use Chrome DevTools device emulation (for example, 390 px and 768 px wide) and inspect the same pages without submitting forms. Routes must remain labeled source-only until actually rendered at those widths.
