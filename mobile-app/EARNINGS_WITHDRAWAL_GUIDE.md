# Earnings & Withdrawal System Documentation

## Overview
PlayVia creators can earn money through video views and receive payouts via UPI or Bank Transfer. The system enforces a minimum withdrawal limit of **₹5000** to maintain payment processing efficiency.

## Key Features

### 1. **Earnings Tracking**
- Automatically tracked in the `Earnings` model per channel
- Updated via video view tracking system
- Shows total earnings and total views

### 2. **Withdrawal Limits**
- **Minimum Withdrawal**: ₹5,000
- **Maximum Withdrawal**: Limited only by available earnings
- Users cannot submit a withdrawal request below the minimum threshold

### 3. **Withdrawal Methods**
- **UPI**: Fast transfer, instant verification
- **Bank Transfer**: Traditional bank account transfer, 7 business days processing

### 4. **Payout Status Tracking**
- **Pending**: Awaiting admin review
- **Approved**: Admin approved, awaiting payment execution
- **Paid**: Payment successfully transferred
- **Rejected**: Admin rejected (reason provided)

---

## Backend Implementation

### Withdrawal Validation (creatorController.js)

The `createPayoutRequest` function now includes comprehensive validation:

```javascript
// Minimum withdrawal check
const MINIMUM_WITHDRAWAL = 5000;
if (amount < MINIMUM_WITHDRAWAL) {
  throw new Error(`Minimum withdrawal amount is ₹${MINIMUM_WITHDRAWAL}...`);
}

// Available earnings check
if (amount > availableEarnings) {
  throw new Error(`Insufficient earnings...`);
}

// Method-specific validation
// UPI: Must contain '@'
// Bank: Requires accountHolder, accountNumber, ifsc, bankName
```

**API Endpoint**: `POST /api/creator/payouts`

**Request Body**:
```json
{
  "amount": 5000,
  "method": "upi",
  "details": {
    "upi": "creator@upi"
  },
  "note": "Monthly earnings withdrawal"
}
```

**Success Response** (201):
```json
{
  "success": true,
  "message": "Withdrawal request submitted. You will receive the amount within 7 business days.",
  "payout": {
    "_id": "...",
    "user": "...",
    "amount": 5000,
    "method": "upi",
    "status": "pending",
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

**Error Response** (400):
```json
{
  "message": "Minimum withdrawal amount is ₹5000. Current amount: ₹2500"
}
```

---

## Mobile App Implementation

### WithdrawalScreen Component

**Location**: `mobile-app/screens/WithdrawalScreen.tsx`

**Features**:
- Display total earnings with visual card
- Show minimum threshold requirement if earnings < ₹5000
- Request withdrawal button (disabled if below minimum)
- Withdrawal history with status badges
- Modal form for new withdrawal requests

**Key States**:
- `amount`: Withdrawal amount in rupees
- `withdrawalMethod`: 'upi' or 'bank'
- `upi`: UPI ID (if method = 'upi')
- `bankDetails`: Bank account information (if method = 'bank')
- `note`: Optional notes for withdrawal

**Validation Flow**:
1. ✓ Amount entered and valid
2. ✓ Amount >= ₹5,000
3. ✓ Amount <= Available Earnings
4. ✓ Method-specific fields validated
   - UPI: Contains '@' symbol
   - Bank: All fields (account holder, number, IFSC, bank name) filled

**Status Display**:
- 🟦 Pending (Blue)
- 🟧 Approved (Orange)
- 🟩 Paid (Green)
- 🟥 Rejected (Red)

### Creator Service

**Location**: `mobile-app/services/creatorService.ts`

```typescript
// Create withdrawal request
const response = await creatorService.createWithdrawal({
  amount: 5000,
  method: 'upi',
  details: { upi: 'creator@upi' },
  note: 'Monthly earnings'
});
```

---

## User Experience Flow

### For Creators Below ₹5,000 Threshold

```
┌─ Earnings Card ─────────────────┐
│ Total Earnings: ₹2,500          │
│ ⚠️  Minimum ₹5,000 required      │
│    ₹2,500 more needed           │
└─────────────────────────────────┘
```

**Action**: No withdrawal button shown. User must earn more to unlock withdrawal.

### For Creators At/Above ₹5,000 Threshold

```
┌─ Earnings Card ─────────────────┐
│ Total Earnings: ₹15,250         │
│ Available for withdrawal        │
├─────────────────────────────────┤
│   ↑ Request Withdrawal          │
└─────────────────────────────────┘
```

**Action**: User can click "Request Withdrawal" to open form.

### Withdrawal Form

**Step 1**: Enter Amount
```
Withdrawal Amount: [___________]
Hint: Minimum ₹5,000
```

**Step 2**: Choose Method
```
□ UPI        ☑ Bank Transfer
```

**Step 3**: Enter Details
```
For UPI:
- UPI ID: [__________@upi]

For Bank:
- Account Holder: [____________]
- Account Number: [____________]
- IFSC Code: [____________]
- Bank Name: [____________]
```

**Step 4**: Optional Note
```
Note (Optional): [Multiple line text area]
```

**Step 5**: Submit
```
[Cancel] [Submit Request]
```

---

## Admin Processing

### Admin Panel Integration

**Location**: `admin-panel/src/pages/admin/WithdrawalsPage.tsx`

**Actions Available**:
- ✅ Approve withdrawal (auto-processes)
- ❌ Reject withdrawal (with reason)
- 💰 Mark as paid
- 📧 Send notification to creator

**Visibility**:
- Shows all pending withdrawals by default
- Filter by status: Pending, Approved, Paid, Rejected
- Search by creator name/email
- Sort by date or amount

---

## Database Models

### Earnings Model
```javascript
{
  channel: ObjectId,        // Channel ID
  totalEarnings: Number,    // Total accumulated earnings
  totalViews: Number,       // Lifetime views
  createdAt: Date,
  updatedAt: Date
}
```

### Payout Model
```javascript
{
  user: ObjectId,           // Creator user ID
  amount: Number,           // Withdrawal amount (must be >= 5000)
  method: String,           // 'upi' or 'bank'
  details: {
    upi: String,            // UPI ID (if method = 'upi')
    accountHolder: String,  // Account holder name (if method = 'bank')
    accountNumber: String,  // Account number (if method = 'bank')
    ifsc: String,          // IFSC code (if method = 'bank')
    bankName: String       // Bank name (if method = 'bank')
  },
  status: String,           // 'pending', 'approved', 'paid', 'rejected'
  rejectionReason: String,  // If rejected
  note: String,            // Optional notes from creator
  processedBy: ObjectId,   // Admin who processed
  processedAt: Date,       // When admin processed
  createdAt: Date,
  updatedAt: Date
}
```

---

## Earnings Sources

### Current Sources
1. **Video Views**: ₹0.30 per 1000 views (configurable)
2. **Subscriptions**: ₹10 per new subscriber
3. **Channel Boost**: Revenue share on paid boosts

### Adding New Earnings Source

**Example: Comment Boost Revenue**

```javascript
// In video comment controller
const earnings = await Earnings.findOne({ channel: video.channel });
if (earnings) {
  earnings.totalEarnings += 5; // ₹5 per boosted comment
  await earnings.save();
}
```

---

## Error Scenarios & Solutions

### 1. Minimum Withdrawal Error
**Error**: "Minimum withdrawal amount is ₹5000. Current amount: ₹2500"
**Solution**: Accumulate more views/subscribers until ₹5000 earned

### 2. Insufficient Earnings Error
**Error**: "Insufficient earnings. Available: ₹3000, Requested: ₹5000"
**Solution**: Same as above - wait for more earnings

### 3. Invalid UPI Error
**Error**: "Please enter a valid UPI ID"
**Solution**: UPI must be in format: `username@upi` or `username@bank`

### 4. Invalid Bank Details Error
**Error**: "Please enter account number" / "Please enter IFSC code"
**Solution**: Fill all required bank fields completely

---

## Testing Checklist

- [ ] Creator with < ₹5000 can't see withdrawal button
- [ ] Creator with >= ₹5000 sees withdrawal button
- [ ] Withdrawal form validates all fields
- [ ] UPI ID validation works (requires @)
- [ ] Bank details all required
- [ ] Amount validation (min ₹5000, max available earnings)
- [ ] Submission creates pending payout
- [ ] Withdrawal history displays correctly
- [ ] Admin can approve/reject withdrawals
- [ ] Email notification sent to creator
- [ ] Admin can mark as paid
- [ ] Rejected withdrawals show rejection reason
- [ ] Multiple withdrawal requests tracked separately
- [ ] Creator can view all past withdrawals

---

## Configuration

### Minimum Withdrawal Amount
**File**: `backend/controllers/creatorController.js` (line 177)
**Current Value**: `5000` (INR)

**To Change**:
```javascript
const MINIMUM_WITHDRAWAL = 10000; // Change this value
```

### Processing Timeline
**Estimated**: 7 business days
**Displayed in**: Mobile app info box & withdrawal history

---

## Security Considerations

1. ✅ Withdrawal amount validated on backend
2. ✅ User ID verified via JWT authentication
3. ✅ Bank/UPI details encrypted in database
4. ✅ Admin logs all withdrawal decisions
5. ✅ No duplicate payout IDs (MongoDB _id)

---

## Future Enhancements

1. **Instant UPI Transfers**: Integrate with payment gateway
2. **Partial Withdrawals**: Allow multiple withdrawals per month
3. **Earnings Analytics**: Weekly/monthly earnings charts
4. **Auto-Pay**: Automatic withdrawal after reaching threshold
5. **Tax Documentation**: Generate 1099-like forms for annual earnings
6. **Multi-Currency**: Support international creators

---

## Support & FAQ

### Q: Why ₹5000 minimum?
**A**: Payment processing costs dictate minimum threshold to be profitable.

### Q: How long do payouts take?
**A**: 7 business days typically. Admin must approve first.

### Q: Can I withdraw partially?
**A**: Yes, you can request any amount >= ₹5000 up to your available earnings.

### Q: What if my withdrawal is rejected?
**A**: Check the rejection reason and contact support. Common reasons: Invalid UPI/Bank details.

### Q: Can I change withdrawal method after requesting?
**A**: No. Contact admin to cancel and resubmit with different method.
