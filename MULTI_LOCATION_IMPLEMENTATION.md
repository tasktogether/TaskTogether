# Multi-Location Senior Home Implementation

## Overview
TaskTogether has been updated to support multiple senior homes across different communities instead of just Richmond Senior Center. The platform now allows any senior home to register, be approved by platform admins, and manage their own volunteer opportunities.

## Key Changes

### 1. Backend (Server Routes)
**File: `/supabase/functions/server/index.tsx`**

Added four new API endpoints:
- `POST /senior-homes/register` - Register a new senior home
- `GET /senior-homes` - Get all senior homes (for admin)
- `GET /senior-homes/approved` - Get approved senior homes only
- `PUT /senior-homes/:seniorHomeId/status` - Update senior home status (approve/reject)

All senior homes are stored in the KV store with keys prefixed `senior_home_`.

### 2. Data Model Updates
**File: `/src/app/context/AuthContext.tsx`**

Updated interfaces:
- **User**: Added `preferredSeniorHomeId` (for volunteers) and `seniorHomeId` (for senior home admins)
- **SeniorHome**: New interface with id, name, city, state, contactPerson, email, status, etc.
- **Opportunity**: Added `seniorHomeId` and `seniorHomeName` fields

### 3. New Pages Created

#### Senior Home Registration Page
**File: `/src/app/pages/RegisterSeniorHomePage.tsx`**
- Beautiful registration form with pastel design
- Fields: Senior Home Name, City, State, Contact Person, Email, Message
- Success confirmation screen
- Mobile-responsive design

#### Admin Senior Home Management
**File: `/src/app/pages/admin/AdminSeniorHomesPage.tsx`**
- View all registered senior homes
- Filter by status (pending, approved, rejected)
- Approve or reject registrations
- View detailed information for each senior home
- Stats dashboard showing counts by status

### 4. Updated Pages

#### Home Page
**File: `/src/app/pages/Home.tsx`**
- Added "Bring TaskTogether to Your Community" section
- Benefits list for senior homes
- Call-to-action card to register senior homes
- Maintains existing design aesthetic

#### Opportunities Page
**File: `/src/app/pages/Opportunities.tsx`**
- Added senior home filter dropdown
- Volunteers can filter opportunities by specific senior home or view all
- Shows tip when user has a preferred senior home set
- Maintains all existing filtering (time slots, search)

#### Admin Dashboard
**File: `/src/app/pages/AdminDashboard.tsx`**
- Added new "Senior Homes" tab in sidebar navigation
- Integrated AdminSeniorHomesPage component
- Platform admins can manage all senior home registrations

### 5. Routing
**File: `/src/app/App.tsx`**
- Added route: `/register-senior-home`

## Features Implemented

### For Senior Home Administrators:
✅ Registration form to join TaskTogether
✅ Status tracking (pending, approved, rejected)
✅ Email and contact information collection
✅ Location details (city/state)

### For Platform Administrators:
✅ View all senior home registrations
✅ Approve or reject applications
✅ Filter by status
✅ View detailed information
✅ Statistics dashboard

### For Volunteers:
✅ Filter opportunities by senior home location
✅ See opportunities from multiple communities
✅ Set preferred senior home (data model ready)
✅ View location in opportunity details

## Multi-Tenancy Support (Ready for Implementation)

The data model now supports:
1. **Senior Home Admins**: Each admin can be associated with a specific `seniorHomeId`
2. **Filtered Dashboards**: Admin dashboards can filter opportunities/volunteers by their senior home
3. **Preferred Locations**: Volunteers can set preferred senior homes for personalized feeds
4. **Location-based Filtering**: All opportunities can be filtered by senior home

## Database Structure (KV Store)

### Senior Home Keys:
```
senior_home_{id} = {
  id: string,
  name: string,
  city: string,
  state: string,
  contactPerson: string,
  email: string,
  message?: string,
  status: 'pending' | 'approved' | 'rejected',
  registeredAt: string,
  statusUpdatedAt?: string
}
```

## Design Consistency
- All new components follow the "cute but responsible" pastel aesthetic
- Consistent use of violet, pink, and blue color schemes
- Rounded corners, soft shadows, and gradient accents
- Mobile-first responsive design
- Motion animations for smooth transitions

## Next Steps (Optional Enhancements)

1. **Email Notifications**: Send emails to senior homes when approved/rejected
2. **Admin Assignment**: Auto-create admin accounts for approved senior homes
3. **Opportunity Management**: Allow senior home admins to post their own opportunities
4. **Volunteer Assignment**: Let senior homes manage volunteers connected to their location
5. **Analytics**: Track volunteer hours and activities per senior home
6. **Profile Settings**: Add UI for volunteers to select preferred senior home in their profile

## Testing Recommendations

1. Register a new senior home via `/register-senior-home`
2. Log into admin dashboard and approve the registration
3. Filter opportunities by senior home on `/opportunities` page
4. Verify data persists in KV store

## Security Notes

- All API routes use proper authorization headers
- Platform admin role required for status updates
- Input validation on all registration fields
- CORS properly configured for frontend access
