# Demo Data Management Guide

## Overview
TaskTogether includes **example data** to demonstrate the platform's features to new users. Once you have real data, admins can delete these examples.

## What Example Data Exists?

### 1. **Stories (2 examples)**
- "Tech Help at the Senior Center" by Alex J.
- "Community Garden Cleanup" by Maya T.

**Visual Indicator:** Yellow "EXAMPLE" badge in top-right corner of story cards

**How to Delete:**
- Super Admins can approve/reject stories through the admin dashboard
- Stories with IDs starting with `example-story-` are demo data

### 2. **Volunteer Opportunities (2 examples)**
- "Technology Tutor"
- "Friendly Visitor & Companion"

**Visual Indicator:** Yellow "EXAMPLE" badge next to the opportunity title in admin view

**How to Delete:**
- Navigate to Admin Dashboard → Opportunities Management
- Click "Remove" button on any example opportunity
- Confirm deletion
- Examples are marked with IDs starting with `example-opp-`

### 3. **Volunteer Applications (6 examples)**
These mock volunteer applications help demonstrate the approval workflow:
- Emma Johnson (pending)
- Liam Chen (approved)
- Sophia Martinez (rejected)
- Noah Williams (pending)
- Olivia Brown (approved)
- Aiden Park (pending)

**How to Manage:**
- These appear in the Admin Dashboard
- You can approve, reject, or delete them as needed
- Once you have real volunteers, these can be removed from local storage

## Why Keep Examples?

✅ **First Impressions:** New visitors see a populated platform  
✅ **Demonstrates Features:** Shows how stories, opportunities, and volunteers appear  
✅ **Easy Testing:** Admins can test workflows immediately  
✅ **Professional Look:** Avoids empty state on initial deployment

## When to Delete Examples?

🎯 **Recommended Timeline:**
- Keep examples for the first 2-3 weeks after launch
- Delete once you have 3+ real stories published
- Delete opportunities once you post your first real opportunities
- Delete volunteer examples after your first 2-3 real approvals

## How to Identify Examples

All example data uses specific ID prefixes:
- **Stories:** `example-story-1`, `example-story-2`
- **Opportunities:** `example-opp-1`, `example-opp-2`
- **Volunteers:** `v1`, `v2`, `v3`, `v4`, `v5`, `v6` (these are legacy IDs)

## Note for Developers

Example data is defined in:
- `/src/app/context/StoriesContext.tsx` (MOCK_STORIES)
- `/src/app/context/AppContext.tsx` (MOCK_OPPORTUNITIES and MOCK_VOLUNTEERS)

To completely remove examples from future deployments, simply empty these arrays before building for production.
