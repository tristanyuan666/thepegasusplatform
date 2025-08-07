# Complete User Flow Test Plan

## Test Environment Setup
- Local development server running on http://localhost:3000
- Live Stripe configuration (price IDs and environment variables updated)
- Supabase Edge Functions deployed with live keys

## Test Flow 1: New User Sign-Up Flow

### 1.1 Sign-Up Process
1. **Navigate to sign-up page**: http://localhost:3000/sign-up
2. **Fill out sign-up form**:
   - Full Name: "Test User"
   - Email: "testuser@example.com" (use a real email for verification)
   - Password: "TestPassword123" (meets requirements)
   - Confirm Password: "TestPassword123"
   - Accept Terms of Service
3. **Submit form** and verify:
   - Success message appears
   - Redirected to sign-in page with email verification message
   - Check email for verification link

### 1.2 Email Verification
1. **Click verification link** in email
2. **Verify redirect** to pricing page with success message
3. **Check database** for user profile creation

### 1.3 First Sign-In
1. **Navigate to sign-in page**: http://localhost:3000/sign-in
2. **Sign in** with verified credentials
3. **Verify redirect** to pricing page (no subscription yet)

## Test Flow 2: Basic Monthly Plan Purchase

### 2.1 Plan Selection
1. **Navigate to pricing page**: http://localhost:3000/pricing
2. **Select Creator Monthly plan** ($39.99/month)
3. **Click "Get Started"** button
4. **Verify Stripe checkout** opens with correct price

### 2.2 Payment Process
1. **Complete Stripe checkout** with test card:
   - Card: 4242 4242 4242 4242
   - Expiry: Any future date
   - CVC: Any 3 digits
2. **Verify successful payment** and redirect to success page
3. **Check webhook processing** in Supabase logs

### 2.3 Post-Payment Verification
1. **Verify redirect** to dashboard
2. **Check subscription status** in database
3. **Verify user profile** has subscription data
4. **Test feature access** based on Creator plan

## Test Flow 3: Plan Upgrade Process

### 3.1 Upgrade to Influencer Plan
1. **Navigate to pricing page** while logged in
2. **Select Influencer Monthly plan** ($59.99/month)
3. **Verify upgrade flow** (should allow upgrade from Creator)
4. **Complete payment** with test card
5. **Verify subscription update** in database

### 3.2 Upgrade to Superstar Plan
1. **Navigate to pricing page** while logged in
2. **Select Superstar Monthly plan** ($99.99/month)
3. **Complete payment** with test card
4. **Verify subscription update** and feature access

## Test Flow 4: Account Management

### 4.1 Profile Settings
1. **Navigate to dashboard settings**: http://localhost:3000/dashboard?tab=settings
2. **Update profile information**:
   - Full Name
   - Bio
   - Social links
3. **Save changes** and verify database update

### 4.2 Subscription Management
1. **Check subscription details** in settings
2. **Verify billing cycle** and plan features
3. **Test subscription cancellation** (if implemented)

### 4.3 Account Deletion
1. **Navigate to profile settings**
2. **Find "Delete Account" section** in danger zone
3. **Click "Delete Account"** button
4. **Confirm deletion** in popup
5. **Verify account deletion**:
   - User data removed from database
   - Stripe subscription cancelled
   - Redirect to home page

## Test Flow 5: Error Handling

### 5.1 Payment Failures
1. **Test with declined card**: 4000 0000 0000 0002
2. **Verify error handling** and user feedback
3. **Test with insufficient funds**: 4000 0000 0000 9995

### 5.2 Network Issues
1. **Simulate network failure** during payment
2. **Verify graceful error handling**
3. **Test retry mechanisms**

### 5.3 Webhook Failures
1. **Check webhook logs** in Supabase
2. **Verify webhook retry** mechanisms
3. **Test webhook signature verification**

## Test Flow 6: Feature Access Control

### 6.1 Creator Plan Features
1. **Verify access** to basic features
2. **Test limitations** (50 AI posts, 2 platforms)
3. **Check upgrade prompts** for premium features

### 6.2 Influencer Plan Features
1. **Verify access** to advanced features
2. **Test unlimited posts** and all platforms
3. **Check viral predictor** access

### 6.3 Superstar Plan Features
1. **Verify access** to all premium features
2. **Test custom branding** options
3. **Check API access** and white label features

## Verification Checklist

### Database Verification
- [ ] User profile created correctly
- [ ] Subscription data stored properly
- [ ] Payment records created
- [ ] Webhook events logged

### Stripe Verification
- [ ] Customer created in Stripe
- [ ] Subscription active in Stripe
- [ ] Payment succeeded
- [ ] Webhook events received

### Application Verification
- [ ] User redirected correctly after sign-up
- [ ] Email verification works
- [ ] Payment flow completes successfully
- [ ] Feature access controls work
- [ ] Account deletion removes all data

### Error Handling Verification
- [ ] Payment failures handled gracefully
- [ ] Network errors don't break flow
- [ ] Webhook failures don't affect user experience
- [ ] Invalid inputs show appropriate errors

## Test Data Cleanup
After testing, clean up test data:
1. **Delete test user** from Supabase
2. **Cancel test subscriptions** in Stripe
3. **Remove test payments** from database
4. **Clear browser data** and cookies

## Notes
- Use real email addresses for testing email verification
- Monitor Supabase logs for webhook processing
- Check Stripe dashboard for payment status
- Verify all environment variables are set to live mode
