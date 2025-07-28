# GitHub Device Flow Alternative

## What is Device Flow?

Device Flow is designed for devices without browsers or with limited input capabilities. Instead of redirecting to GitHub:

1. App requests a device code from GitHub
2. User manually visits GitHub and enters the code
3. App polls GitHub until user authorizes
4. No callback URL needed

## When to Use Device Flow

**Pros:**
- Works from any IP address (perfect for Tailscale)
- No callback URL configuration needed
- Works on devices without browsers

**Cons:**
- Extra step for users (they must manually enter a code)
- Slightly more complex UX
- Requires polling

## Implementation

Would require these changes:

### Backend Changes
```typescript
// New endpoint: POST /api/github/device-auth
// Returns: device_code, user_code, verification_uri

// New endpoint: POST /api/github/device-poll
// Polls GitHub until user authorizes
```

### Frontend Changes
```typescript
// Show user a code and GitHub URL
// Poll backend until authorization complete
// No redirect needed
```

## Recommendation

For your current setup with Tailscale:
1. **Stick with Authorization Code Flow** - just update GitHub OAuth app callback URL
2. **Consider Device Flow later** if you need dynamic IPs or deploy to different environments

The Authorization Code Flow is more standard and provides better UX when the callback URL is configured correctly.