# TaskTogether — Copilot Instructions

## Project Overview

TaskTogether is a volunteer management website built for **Richmond Senior Center only**.

Tech stack:

* React
* TypeScript
* Vite
* Supabase
* Vercel
* GitHub

The website is used by:

* Richmond Senior Center directors/staff
* Approved volunteers

The priority is **stability and reliability for real users**, not demo polish.

---

# CRITICAL RULE: DO NOT BREAK EXISTING FUNCTIONALITY

Before changing anything, inspect the existing implementation and understand how the relevant functions, context values, database tables, routes, and components connect.

Do NOT remove, rename, or move an existing function simply because it appears unused in one file.

Before deleting or renaming anything:

1. Search the entire repository for references.
2. Check React Context/provider exports.
3. Check all components consuming the function.
4. Check useEffect dependencies.
5. Check routes and authentication flows.
6. Check whether the function is used indirectly.
7. Run the build after the change.

A function such as `fetchApplications`, `fetchOpportunities`, `deleteOpportunity`, authentication functions, or signup functions must not disappear from the provider if another component depends on it.

If a requested change can be completed without removing an existing function, keep the existing function.

---

# CURRENT PROJECT RULES

## 1. Richmond Senior Center Only

TaskTogether is currently for **Richmond Senior Center only**.

Do not reintroduce:

* Multiple senior homes
* Senior-home registration
* `RegisterSeniorHomePage`
* Mock senior homes
* Example senior centers
* Fake organizations

Do not add multi-organization architecture unless explicitly requested.

---

# 2. Authentication

There are two user types:

### Director

Director login uses:

`tasktogethercontact@gmail.com`

Director session key:

`tasktogether_director_session`

Director role:

`director`

The director dashboard is:

`/director/dashboard`

Do not replace the existing director authentication system unless explicitly requested.

Old routes such as `/admin/dashboard` and `/superadmin/dashboard` should not be reintroduced.

### Volunteers

Volunteer authentication uses Supabase email/password authentication.

Only approved volunteers should be allowed into the volunteer dashboard.

Volunteer dashboard:

`/volunteer-dashboard`

There is also a password setup flow using:

`/set-password`

Do not break:

* Volunteer login
* Approval checks
* Password setup
* Session persistence
* Logout
* Protected routes

---

# 3. Supabase

The project uses Supabase.

Existing important tables include:

* `volunteer_applications`
* `opportunities`
* `opportunity_signups`
* `opportunity_contacts`
* `kv_store_1a1315c`

There is NO `profiles` table.

Do not invent a `profiles` table.

Do not replace the existing database architecture unless explicitly requested.

Before modifying database-related code:

* Inspect the actual existing schema usage.
* Check existing RLS behavior.
* Check existing queries.
* Avoid changing unrelated tables.

---

# 4. Volunteer Applications

`volunteer_applications` is an important existing feature.

Existing application functionality includes:

* Application submission
* Application status
* Pending applications
* Approval
* Rejection
* Application video upload
* Processing applications
* Director review

Existing statuses include:

* `pending`
* `approved`
* `rejected`
* `not_found`

The application system must continue working after every change.

## IMPORTANT

`fetchApplications` is an existing critical function.

Before modifying `AuthContext.tsx`, search for every use of:

`fetchApplications`

Do not remove it from the provider if it is consumed by another component.

If a build/runtime error says:

`ReferenceError: Can't find variable: fetchApplications`

inspect:

1. Where `fetchApplications` is defined.
2. Whether it is inside the `AuthProvider`.
3. Whether it is included in the provider value.
4. Whether a component destructures it from `useAuth()`.
5. Whether a `useEffect` calls it.
6. Whether it was accidentally renamed, moved, or deleted.

Fix the underlying dependency instead of hiding the error.

---

# 5. Opportunities

The opportunity system is a core feature.

Existing functionality includes:

* Director creates opportunities
* Director edits opportunities
* Director deletes opportunities
* Volunteers view opportunities
* Volunteers sign up
* Capacity limits
* Volunteer counts
* Volunteer names
* Removing volunteers
* Opportunity status
* Specific and flexible scheduling

Do not break any of these when modifying the opportunity system.

---

# 6. Opportunity Scheduling

Opportunities support:

### Specific

A specific date and time are provided.

### Flexible

The opportunity is based on volunteer availability.

Flexible opportunities do NOT require a meaningful specific date.

The database currently retains a date field because of the existing schema, so do not casually change the database structure just to simplify the UI.

Flexible opportunity time should be represented as free text when appropriate.

Example:

`12:30-3:30`

Do not force users to enter a duration when the intended value is a time range.

Default location:

`Richmond Senior Center`

Do not allow unrelated location changes unless explicitly requested.

---

# 7. Private Senior Contact Information

Senior/task contact information is private.

Private fields include:

* Senior name
* Senior email
* Senior phone

These are stored in:

`opportunity_contacts`

They should NOT be stored in the public `opportunities` table.

The `opportunity_contacts` table has director-only RLS.

Volunteers must never receive private senior contact information.

Do not expose these fields through volunteer-facing queries, APIs, UI, or opportunity cards.

When modifying opportunity fetching:

* Public opportunity information can be returned to volunteers.
* Private contact information must remain director-only.
* Do not bypass RLS.
* Do not expose contact data through a public object accidentally.

---

# 8. Opportunity Signup Safety Rules

Existing safety behavior is important.

Do not remove or weaken:

* Capacity limits
* Duplicate signup prevention
* Minor/adult handling
* Adult/minor badges
* One-on-one restrictions
* Background-check requirements
* Safety-related status logic

Minors cannot volunteer alone where the existing rules prohibit it.

Adult one-on-one volunteering requires the existing opt-in/background-check behavior.

Do not change these rules unless the task explicitly requests a safety-rule change.

---

# 9. Opportunity Status

Existing status behavior includes concepts such as:

* `Not Ready`
* `Ready`
* `Full`
* `Past`
* `Upcoming`

Flexible opportunities must not be incorrectly treated as past simply because they use a placeholder date.

When changing status logic, inspect all places where opportunity status is calculated.

Do not update one status calculation while leaving another outdated.

Search the repository for:

`getOpportunityStatus`

and inspect every call site before changing its parameters.

---

# 10. Director Dashboard

Main file:

`src/app/pages/DirectorDashboard.tsx`

The Director Dashboard contains important functionality.

Before modifying it, inspect:

* Opportunity creation
* Opportunity editing
* Opportunity deletion
* Application management
* Volunteer management
* Status calculations
* Authentication
* Loading states

Do not remove working functionality to simplify the component.

If duplicate/old UI exists, do not delete it blindly. First determine whether it is actually rendered or still referenced.

---

# 11. Volunteer Dashboard / Opportunities

Important files include:

`src/app/pages/VolunteerDashboard.tsx`

`src/app/pages/Opportunities.tsx`

Before changing opportunity display behavior, inspect:

* Filtering
* Status
* Signup buttons
* Capacity
* Volunteer counts
* Details
* Privacy behavior

Volunteers should only see information intended for volunteers.

---

# 12. AuthContext

Main file:

`src/app/context/AuthContext.tsx`

This is a critical file.

Treat it as shared infrastructure.

Before changing it:

1. Search all functions exported by `useAuth()`.
2. Search every consumer.
3. Check the `AuthContextType`.
4. Check the provider `value={{ ... }}` object.
5. Check functions referenced by `useEffect`.
6. Check async dependencies.
7. Run the build.

A function being absent from one section does NOT mean it can safely be deleted.

Important existing functions may include:

* Authentication functions
* `fetchApplications`
* `fetchOpportunities`
* `createOpportunity`
* `updateOpportunity`
* `deleteOpportunity`
* Signup functions
* Volunteer removal
* Application status updates
* Logout

Keep these working unless the requested task specifically changes them.

---

# 13. Error Handling

Do not hide errors.

Do not solve a runtime error by:

* Removing the function call
* Removing a useEffect
* Removing a dependency
* Commenting out functionality
* Suppressing TypeScript errors
* Adding `any` everywhere
* Ignoring Supabase errors

Instead:

1. Find the root cause.
2. Fix the dependency or implementation.
3. Build the project.
4. Check related functionality.

---

# 14. Build Requirement

Before considering a change complete, run the project build.

Use the existing package scripts from `package.json`.

At minimum, verify:

`npm run build`

If the build fails:

* Fix the error.
* Re-run the build.
* Continue until the build succeeds.

Do not tell the user a change is complete while known build errors remain.

---

# 15. Runtime Errors

A successful build does not guarantee the website works.

When fixing runtime errors:

* Read the complete browser console error.
* Identify the actual missing variable/function.
* Trace where it is defined.
* Trace where it is exported.
* Trace where it is consumed.

For example:

`ReferenceError: Can't find variable: fetchApplications`

does NOT automatically mean the application page is broken.

It may mean:

* The function was deleted.
* The function was moved outside the component.
* The function is no longer in the provider.
* A component still references an old function.
* A refactor changed the function name.
* A useEffect still references the old function.

Investigate the dependency chain.

---

# 16. Do Not Guess

If the repository already contains the answer, inspect it.

Do not invent:

* Database tables
* Columns
* Routes
* Functions
* Authentication methods
* Environment variables
* Components

Use the existing project structure.

If something genuinely cannot be determined from the repository, state what is missing instead of guessing.

---

# 17. Preserve Existing UI

The existing Richmond Senior Center colors and overall visual identity should remain unless the user explicitly asks for a redesign.

Do not redesign unrelated pages while implementing a feature.

Do not replace the entire UI framework for a small change.

For visual changes, modify only what is necessary unless the user explicitly requests a larger redesign.

---

# 18. No Unrelated Refactoring

Do not use a requested feature as an excuse to:

* Rewrite the entire application
* Replace React
* Replace Supabase
* Replace authentication
* Rename unrelated components
* Reorganize the entire repository
* Change database architecture
* Remove old code without verifying usage

Make the smallest safe set of changes that accomplishes the request.

For a large redesign, preserve all underlying functionality unless the user explicitly asks to change it.

---

# 19. Vercel

The production site is deployed through Vercel.

A change is not finished just because local code looks correct.

Before merging:

* Build successfully.
* Check for TypeScript errors.
* Check for runtime errors.
* Check important affected flows.

Do not modify Vercel configuration unless required.

---

# 20. Git / Pull Requests

For significant changes:

* Work on a separate branch.
* Keep commits understandable.
* Do not overwrite unrelated work.
* Create a Pull Request.
* Clearly explain what changed.
* Clearly explain anything that could not be verified.

Never silently make destructive changes.

---

# 21. Before Editing

For every request:

### Step 1

Understand exactly what the user wants changed.

### Step 2

Search the repository for all relevant components, functions, database references, and call sites.

### Step 3

Identify dependencies.

### Step 4

Make the smallest safe change.

### Step 5

Check related functionality.

### Step 6

Run the build.

### Step 7

Fix any errors caused by the change.

### Step 8

Summarize exactly what changed.

---

# 22. Priority Order

When making decisions, prioritize:

1. Existing functionality
2. Data safety
3. Authentication/security
4. Volunteer safety rules
5. Correct Supabase behavior
6. Build/runtime stability
7. User-requested feature
8. UI polish

Never sacrifice security or existing functionality merely to make an implementation shorter.

---

# 23. TaskTogether-Specific Principle

The user wants to be able to request large changes without manually editing many files.

Therefore, when the user asks for a large feature or redesign:

**Do the repository-wide analysis yourself.**

Do not respond with a long list of files for the user to manually edit unless absolutely necessary.

Inspect the codebase, determine the affected files, implement the changes, test them, and report the result.

The goal is:

> User describes the desired result → AI handles the implementation safely → build/test → user reviews the result.

Not:

> User manually edits 10 files based on instructions.

---

# FINAL RULE

**Never break working TaskTogether functionality in order to implement a new feature.**

If a requested change conflicts with existing functionality, stop and identify the conflict before making a destructive change.
