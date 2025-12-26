# Purchase Flow Guide - How It All Works

This guide explains how learners can purchase courses (both individual content types and complete bundles) in the NCA LMS application.

## Overview

The purchase system supports two types of purchases:
1. **Individual Content Type** - Purchase specific content (VIDEO, PDF, or MOCK) for a subject
2. **Complete Bundle** - Purchase all content types for a subject at a discounted price

## User Journey

### 1. Browsing Courses

**Location**: `/learner/courses`

- Learners see all available courses
- Each course card shows:
  - Course title and description
  - Subject thumbnail
  - Learning stream (e.g., "NCA")
  - Exam type (e.g., "Barrister")
  - Bundle price (if available)

### 2. Viewing Course Details

**Location**: `/learner/courses/[id]`

Learners can click on any course to view its details. The page shows different views based on purchase status:

#### A. Not Purchased (Preview Mode)
- Shows course preview with demo video
- Displays pricing card with:
  - **Complete Bundle Card** (if enabled)
    - Shows bundle price
    - Displays savings percentage
    - Lists all included content types
    - "Add Complete Bundle" button
  - **Individual Purchase Options**
    - Each content type with its price
    - "Add" button for each type

#### B. Partially Purchased
- Shows purchased content in tabs
- Locked tabs for unpurchased content with "Add to Cart" buttons

#### C. Fully Purchased
- Full access to all content
- No purchase options shown

### 3. Adding to Cart

**How to Add Items**:

From the course detail page, learners can:

1. **Add Complete Bundle**
   - Click "Add Complete Bundle" button
   - Gets all content types (VIDEO, PDF, MOCK)
   - Usually offers the best value with discount

2. **Add Individual Content Type**
   - Click "Add" button next to specific content type (VIDEO, PDF, or MOCK)
   - Only that specific content type is added

**Cart Button States**:
- **Default**: "Add Complete Bundle" or "Add"
- **Loading**: Shows spinner with "Adding..."
- **Success**: Shows checkmark with "Added!" (auto-resets after 2 seconds)
- **Error**: Shows error toast notification

### 4. Accessing the Cart

**Navigation**: Click "Shopping Cart" in the sidebar

**Location**: `/learner/cart`

The cart page displays:
- All items added to cart
- Item details (subject title, content type/bundle)
- Individual prices
- Order summary with total
- "Proceed to Checkout" button
- "Continue Shopping" link

**Cart Features**:
- Remove individual items
- View thumbnail for each course
- See total amount in CAD
- Empty cart state if no items

### 5. Checkout Process

**Initiated From**: Cart page → "Proceed to Checkout" button

**Flow**:
1. Click "Proceed to Checkout"
2. System creates Stripe checkout session
3. Redirects to Stripe hosted checkout page
4. Learner enters payment details
5. Stripe processes payment

**Test Cards for Development**:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- Use any future expiry date and any CVC

### 6. Payment Completion

#### Success Path
**Location**: `/learner/checkout/success`

When payment is successful:
1. Stripe webhook notifies the application
2. System automatically:
   - Creates purchase records
   - Grants user access to purchased content
   - Clears the cart
3. User sees success page with:
   - Success message
   - Order ID
   - Links to "My Library" and "Browse More Courses"

#### Cancel Path
**Location**: `/learner/checkout/cancel`

If user cancels payment:
- Shows cancellation message
- Cart items are preserved
- Can return to cart or continue shopping

### 7. Accessing Purchased Content

**Location**: `/learner/library` or `/learner/courses/[id]`

After purchase:
1. Content immediately becomes available
2. Navigate to "My Library" to see all purchased courses
3. Click on purchased course to access content
4. Content is organized by type (VIDEO, PDF, MOCK)
5. Lifetime access to purchased content

## Purchase Logic & Business Rules

### Duplicate Prevention
- Cannot add same item twice to cart
- Cannot purchase content already owned
- System checks existing access before allowing cart addition

### Bundle vs Individual Pricing
- Bundle price is typically lower than sum of individual prices
- Savings percentage is calculated and displayed
- Learners can mix individual and bundle purchases for different courses

### Access Management
- **Individual Purchase**: Grants access to specific content type for that subject
- **Bundle Purchase**: Grants access to ALL content types for that subject
- Access is lifetime (no expiration)

### Cart Persistence
- Cart items persist in database
- Survive page refreshes and logout/login
- Only cleared after successful payment

## Technical Implementation

### Database Flow
1. **Add to Cart**: Record inserted in `cart` table
2. **Checkout**: Stripe session created with cart metadata
3. **Payment Success**: Webhook triggers:
   - Insert into `purchases` table
   - Insert into `user_access` table (grants access)
   - Delete from `cart` table
4. **Access Check**: System queries `user_access` when displaying content

### Security
- All cart actions require authentication
- User can only modify their own cart
- Stripe webhook signatures are verified
- Prices are validated server-side

## User Experience Features

### Visual Feedback
- Loading states during add-to-cart
- Success confirmations
- Error messages
- Cart count badges
- "Added!" temporary state

### Navigation
- Easy access to cart from sidebar
- Back navigation on all pages
- Clear CTAs (Call-to-Actions)

### Responsive Design
- Works on mobile and desktop
- Touch-friendly buttons
- Optimized layouts

## Common Use Cases

### Use Case 1: Buy Complete Bundle
1. Browse courses → Select course
2. Click "Add Complete Bundle"
3. Go to Shopping Cart
4. Click "Proceed to Checkout"
5. Complete payment
6. Access all content

### Use Case 2: Buy Individual Content
1. Browse courses → Select course
2. Click "Add" next to VIDEO (or PDF/MOCK)
3. Go to Shopping Cart
4. Click "Proceed to Checkout"
5. Complete payment
6. Access VIDEO content only

### Use Case 3: Mix and Match
1. Add VIDEO from Course A
2. Add Complete Bundle from Course B
3. Add PDF from Course C
4. Checkout all at once
5. Access respective content for each

### Use Case 4: Incremental Purchase
1. Initially buy VIDEO for a course
2. Later, return and buy PDF
3. Even later, buy MOCK
4. Progressively build up access

## Troubleshooting

### "Item already in cart"
- Item was already added
- Check cart to see existing items
- Proceed to checkout or remove duplicate

### "You already have access to this content"
- Content was previously purchased
- Go to My Library to access it
- No need to purchase again

### Payment failed
- Try different payment method
- Check card details
- Contact support if issue persists

### Cart is empty after adding items
- Check if logged in
- Verify network connection
- Try adding item again

## For Administrators

Administrators can:
- View all transactions in `/admin/transactions`
- See purchase records per user
- Track revenue and popular content types
- Monitor cart abandonment

## Future Enhancements

Potential features to consider:
- Promo codes/coupons (Stripe supports this)
- Gift purchases
- Subscription plans
- Wishlists
- Email notifications for purchases
- Invoice generation
- Refund processing through admin panel
