# Users Management Components

This directory contains all components related to the admin users management feature.

## Architecture

### Server Components
- **page.tsx** - Main server component that fetches data and renders the page
- Uses React Suspense for progressive loading
- Handles search params for filtering and pagination

### Client Components

#### UsersFilters
- Handles search, role, and status filtering
- Updates URL search params for shareable URLs
- Uses Next.js router for navigation

#### UsersTable
- Displays users in a table format
- Server-rendered for better performance
- Shows user details, role, status, and stats

#### UserActionsDropdown
- Dropdown menu for user actions
- Handles user status toggling (activate/deactivate)
- Email sending functionality
- Uses React Toastify for notifications

#### UsersStatsCards
- Displays key metrics (total users, active, learners, admins)
- Server-rendered component
- Accepts stats data as props

#### ExportUsersButton
- Client component for exporting users data
- Generates CSV file on-demand
- Downloads file to user's device

## Server Actions

Located in `/lib/actions/users.ts`:

- `getUsersWithStats()` - Fetches users with purchase statistics
- `getUsersStats()` - Fetches dashboard statistics
- `toggleUserStatus()` - Activates/deactivates users
- `updateUserRole()` - Updates user roles
- `exportUsersAsCSV()` - Generates CSV export
- `getUserById()` - Fetches single user details

## Data Flow

1. **Page Load**:
   - Server component reads search params
   - Fetches data via server actions
   - Renders with Suspense boundaries

2. **Filtering**:
   - User interacts with filters (client component)
   - URL search params are updated
   - Page re-renders with new data (server-side)

3. **Actions**:
   - User clicks action button (client component)
   - Server action is called
   - Page is revalidated
   - UI updates with fresh data

## Features

- ✅ Server-side rendering for better SEO and performance
- ✅ Real-time filtering with URL-based state
- ✅ Progressive loading with Suspense
- ✅ Error boundaries for graceful error handling
- ✅ CSV export functionality
- ✅ User status management
- ✅ Responsive design
- ✅ Type-safe with TypeScript
- ✅ Production-ready code quality

## Usage

Import components from the index:

```tsx
import {
  UsersStatsCards,
  UsersFilters,
  UsersTable
} from "@/components/admin/users";
```

Or import directly:

```tsx
import { UsersTable } from "@/components/admin/users/users-table";
```

## Future Enhancements

- [ ] Add pagination controls
- [ ] Bulk user actions
- [ ] Advanced filtering options
- [ ] User detail page
- [ ] User creation/editing forms
- [ ] Activity log
