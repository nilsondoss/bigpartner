# Help Center Live Chat Feature

## Overview
Added functional live chat support to the Help Center page at https://bigpartner.in/help-center

## Changes Made

### 1. Updated ChatSupport Component
**File:** `src/components/ChatSupport.tsx`

**New Features:**
- Added optional `isOpen` and `onClose` props for external control
- Component can now be controlled by parent components
- Maintains backward compatibility (works standalone with floating button)
- When controlled externally, floating button is hidden

**Props Interface:**
```typescript
interface ChatSupportProps {
  isOpen?: boolean;      // Control chat visibility externally
  onClose?: () => void;  // Callback when chat is closed
}
```

**Usage:**
```tsx
// Standalone (original behavior)
<ChatSupport />

// Controlled (new behavior)
<ChatSupport isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
```

### 2. Updated Help Center Page
**File:** `src/pages/help-center.tsx`

**Added Features:**
- ✅ **Start Chat Button** - Opens AI chat support dialog
- ✅ **Send Email Button** - Opens email client with pre-filled support email
- ✅ **Call Now Button** - Initiates phone call to +91 9600047740
- ✅ **Chat State Management** - Controls chat visibility from help center

**New Handlers:**
```typescript
const handleStartChat = () => {
  setIsChatOpen(true);
};

const handleEmailSupport = () => {
  window.location.href = 'mailto:info@bigpartner.in?subject=Support Request';
};

const handlePhoneCall = () => {
  window.location.href = 'tel:+919600047740';
};
```

**Updated Contact Information:**
- ❌ Old: 1-800-BIG-PARTNER
- ✅ New: +91 9600047740

## Features

### Live Chat Support Card
**Location:** Help Center page, "Still Need Help?" section

**Features:**
- Click "Start Chat" button to open AI chat
- Chat opens in controlled mode (no floating button)
- Full AI assistant capabilities available
- Can answer questions about properties, investments, partnerships
- Provides contact information and navigation help

### Email Support Card
**Features:**
- Click "Send Email" to open email client
- Pre-filled recipient: info@bigpartner.in
- Pre-filled subject: "Support Request"
- Response time: Within 24 hours

### Phone Support Card
**Features:**
- Click "Call Now" to initiate phone call
- Direct dial: +91 9600047740
- Available for immediate assistance

## Testing

### Test Live Chat
1. Visit: https://bigpartner.in/help-center
2. Scroll to "Still Need Help?" section
3. Click "Start Chat" button in the Live Chat card
4. Chat window opens with AI assistant
5. Try asking questions:
   - "Show me properties"
   - "How can I invest?"
   - "Contact information"
   - "I want to become a partner"

### Test Email Support
1. Click "Send Email" button
2. Email client opens with:
   - To: info@bigpartner.in
   - Subject: Support Request
3. User can compose and send email

### Test Phone Support
1. Click "Call Now" button
2. Phone dialer opens with: +91 9600047740
3. User can initiate call

## AI Chat Capabilities

The chat bot can help with:

**Properties:**
- Browse available properties
- Filter by type (residential, commercial, industrial, farmland)
- Get property details and pricing

**Investment:**
- Learn about investment opportunities
- Register as an investor
- Understand investment process

**Partnership:**
- Become a property partner
- List properties on the platform
- Partnership program details

**Contact:**
- Get phone number, email, and address
- Navigate to contact page
- Find support options

**General:**
- Answer FAQs
- Provide navigation help
- Offer quick actions

## Summary

✅ **Live Chat** - Fully functional AI assistant integrated
✅ **Email Support** - Direct mailto link with pre-filled info
✅ **Phone Support** - Direct tel link for immediate calls
✅ **Updated Contact Info** - Correct phone number displayed
✅ **Seamless Integration** - Chat controlled from help center page

The Help Center page now provides three convenient ways for users to get support:
1. **Live Chat** - Instant AI-powered assistance
2. **Email** - Traditional support channel
3. **Phone** - Direct human contact

All support options are fully functional and ready to use!
