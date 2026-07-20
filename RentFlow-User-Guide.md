# RentFlow User Guide

A complete guide to using RentFlow, covering both the Landlord and Tenant experience.

---

## Getting Started

### Creating an Account

1. Go to the RentFlow login page and click **Register**.
2. Fill in:
   - **Full name**
   - **Email**
   - **Role** — choose **Landlord** if you manage properties, or **Tenant** if you're renting one.
   - **Password** (minimum 8 characters)
3. Click **Create account**. You'll be redirected to the login page.
4. Log in with your new email and password.

Your role is set at registration and determines which features and pages you see — landlords manage properties, tenants view and interact with the property they lease.

### Logging In / Out

- **Log in** at the login page with your email and password.
- **Log out** any time using the **Log out** button at the bottom of the sidebar.

### Your Profile

Click your name at the bottom of the sidebar to open your **Profile** page, where you can:
- Upload or change your avatar photo
- Edit your full name, phone number, and address
- Change your password

---

## For Landlords

### Dashboard

Your home page after logging in. At a glance, you'll see:
- **Total, occupied, and vacant properties**
- **This month's income** and **outstanding balance**
- A **cash flow chart** showing paid income over the last 6 months
- **Lease expiry alerts** — leases ending within 30 days
- **Recent maintenance requests** across all your properties

### Managing Properties

Go to **Properties** in the sidebar.

**Adding a property:**
1. Click **Add property**.
2. Fill in the details: title, description, type, address, city, province, rent, deposit, bedrooms, bathrooms, parking, size, and status.
3. Click **Save property**.
4. Once saved, reopen it via **Edit** to upload photos — image upload becomes available only after the property is created.

**Editing or removing a property:**
- Click **Edit** on any property card to update its details or manage its photos.
- Click **Delete** to permanently remove a property (you'll be asked to confirm).

**Finding properties:**
- Use the **search bar** to filter by title or city.
- Use the **status filter** to show only Available, Occupied, or Maintenance properties.
- Use the **sort dropdown** to order by newest, oldest, rent, or name.
- Use the **page controls** at the bottom if you have more than 6 properties.

### Assigning Tenants

Click **Tenant** on any property card.

- Enter the tenant's **email address**, lease start/end dates, monthly rent, deposit, and emergency contact details, then click **Save lease**.
- **If the tenant already has a RentFlow account**, they're linked immediately and the lease becomes **Active**.
- **If they don't have an account yet**, the lease is saved as **Pending** — as soon as they register using that same email, it automatically activates and links to their account. No further action needed from you.
- Reopening **Tenant** on an occupied property shows **Manage tenant**, where you can update lease details or click **Remove tenant** to end the lease.

### Recording Payments

Go to **Payments**.

1. Click **Record payment** (only enabled once you have at least one tenant with an active lease).
2. Choose which tenant/property the payment is for, then fill in the month, year, amount, and status.
3. Click **Save payment**.

**Confirming a payment:** click the green checkmark next to any pending payment to mark it **Paid** — this also notifies the tenant automatically.

**Editing or removing a payment:** use the pencil or trash icons in the Actions column.

**Viewing proof of payment:** if a tenant has uploaded a receipt or screenshot, click **View** in the Proof column to open it.

The three summary cards at the top show your income **this month**, **this year**, and your total **outstanding** balance across all pending/overdue payments.

### Managing Maintenance Requests

Go to **Maintenance** to see every request submitted across your properties, along with the tenant's name and the priority level they set.

**Updating a request:**
- Use the **status dropdown** on each request to move it through Open → Assigned → In Progress → Completed (or Cancelled).
- Changing the status automatically notifies the tenant.
- Click any attached photo to view it in full size.

**Removing a request:** click **Remove** to delete it entirely.

### Notifications

The bell icon at the top of the sidebar shows a red badge when you have unread notifications. Click it to see:
- New maintenance requests from tenants
- (You won't get notified about your own actions — only tenant-side and system events relevant to you)

Click any notification to jump straight to the relevant page and mark it as read. Use **Mark all read** to clear the badge in one click.

---

## For Tenants

### Dashboard

Your home page shows:
- Your **current property**, **monthly rent**, and **lease end date**
- Your **most recent payments** and their status
- Your **most recent maintenance requests** and their status

### Viewing Your Payments

Go to **Payments** to see your full payment history, including amount, month, and status (Paid, Pending, or Overdue) for each entry.

**Uploading proof of payment:**
- For any payment without proof attached, click **Upload proof** and select a photo or PDF of your receipt.
- Once uploaded, you can click **View proof** any time to confirm what was submitted.

Your landlord is notified automatically once they confirm a payment as paid.

### Submitting a Maintenance Request

Go to **Maintenance** (only available once you have an active lease).

1. Click **New request**.
2. Describe the **issue**, add an optional description, and choose a **priority** (Low, Medium, High, or Emergency).
3. Optionally attach one or more photos of the problem.
4. Click **Submit request**.

You'll see the request appear with its current status. You'll receive a notification automatically whenever your landlord updates its status.

### Notifications

Click the bell icon to see updates on:
- Changes to your maintenance request status
- Confirmation that a payment has been marked as paid

---

## Roles at a Glance

| Feature | Landlord | Tenant |
|---|---|---|
| View/manage properties | ✅ (own properties) | ❌ |
| View leased property | ❌ | ✅ (own lease only) |
| Assign tenants | ✅ | ❌ |
| Record/confirm payments | ✅ | ❌ |
| View payments | ✅ (all their properties) | ✅ (own only) |
| Upload proof of payment | ❌ | ✅ |
| Submit maintenance requests | ❌ | ✅ |
| Update maintenance status | ✅ | ❌ |
| View maintenance requests | ✅ (all their properties) | ✅ (own only) |

All data access is scoped by role and ownership at the database level — a tenant can never see another tenant's information, and a landlord only ever sees their own properties and the tenants leasing them.
