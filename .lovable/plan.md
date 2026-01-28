

## Plan: Require Authentication for Bookings with Security Announcement

This plan implements secure booking (requiring user accounts) while clearly communicating to customers why this change benefits them.

---

### Overview

We will add a prominent security announcement banner and require users to sign in or create an account before making a booking. This follows industry best practices for transparency when introducing security measures.

---

### Best Practices for Security Announcements

When introducing authentication requirements, transparency is key. Here's what the implementation will follow:

1. **Be transparent about the "why"** - Explain that this protects their personal data (name, email, phone, address)
2. **Highlight the benefits** - Account creation means they can view their booking history and manage their events
3. **Use positive framing** - Frame it as "protecting you" rather than "restricting access"
4. **Make it non-intrusive** - Use a dismissible banner, not a blocking popup
5. **Provide easy action** - Include a direct link to create an account

---

### Implementation Steps

#### 1. Create a Security Announcement Banner Component

A new `SecurityAnnouncementBanner` component will:
- Display at the top of pages (below the navbar)
- Use the brand colors for a cohesive look
- Include a shield icon to reinforce security messaging
- Be dismissible (stored in localStorage so it doesn't reappear)
- Link directly to the sign-in/sign-up page

**Message Example:**
> "Your security matters to us. To protect your personal information, we now require a quick account creation before booking. This ensures only you can access your booking details and history."

#### 2. Add Authentication Route to App.tsx

Add the `/auth` route that already exists in `Auth.tsx` but is currently missing from the router.

#### 3. Update Booking Flow to Require Authentication

Modify `BookingFlowContainer.tsx` to:
- Check if user is authenticated before showing the booking form
- Redirect unauthenticated users to sign in first
- Show a friendly message explaining why authentication is needed

#### 4. Add Login/Signup Prompts at Key Points

- Add a "Sign in to book" call-to-action in the menu builder summary
- Update the booking form to show an auth prompt if not logged in

---

### Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/components/SecurityAnnouncementBanner.tsx` | Create | New announcement banner component |
| `src/App.tsx` | Modify | Add `/auth` route |
| `src/pages/Index.tsx` | Modify | Add banner below Navbar |
| `src/pages/Booking.tsx` | Modify | Add banner and auth check |
| `src/components/booking/BookingFlowContainer.tsx` | Modify | Redirect to auth if not logged in |
| `src/components/menu/summary/PricingSection.tsx` | Modify | Update CTA to mention sign-in |

---

### Technical Details

**SecurityAnnouncementBanner Component Structure:**
```text
+------------------------------------------------------------------+
| [Shield Icon] Your security matters! We now require account     X |
|              creation to protect your booking information.         |
|              [Create Account / Sign In]                            |
+------------------------------------------------------------------+
```

**Banner Features:**
- Uses existing Alert component styling with custom security variant
- Dismissible with X button, stores preference in localStorage
- Responsive design (stacks vertically on mobile)
- Uses brand primary color (#0066a4) for trust association

**Authentication Flow:**
```text
User clicks "Book Your Experience"
         |
         v
    Is logged in? ----No----> Show Auth Prompt
         |                         |
        Yes                   Sign in/Sign up
         |                         |
         v                         v
   Show Booking Form <-------------+
```

**LocalStorage Keys:**
- `securityAnnouncementDismissed`: boolean - tracks if user dismissed the banner

---

### User Experience

1. **First-time visitors** see the security announcement banner on the homepage
2. **When they try to book**, they're prompted to create an account with a clear explanation
3. **After signing in**, they can proceed with booking normally
4. **Returning users** who dismissed the banner won't see it again
5. **Logged-in users** go straight to booking without interruption

This approach balances security with user experience by being transparent about why the change was made and making the account creation process as frictionless as possible.

