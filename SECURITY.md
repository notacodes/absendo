# PIN-Based Client-Side Encryption System

## Overview

This document describes the PIN-based client-side encryption system implemented for OAuth users in Absendo. This system enhances security by requiring users to enter a PIN after OAuth login, which is used to derive encryption keys for sensitive data.

## Security Features

### PIN Requirements
- **Length**: 4-6 digit numeric PIN
- **Confirmation**: First-time setup requires PIN confirmation
- **No Storage**: PIN is never stored or transmitted to servers
- **Local Only**: Used exclusively for client-side key derivation

### Key Derivation
- **Algorithm**: PBKDF2 with SHA-512
- **Iterations**: 10,000 iterations (as specified in requirements)
- **Input Parameters**:
  - OAuth user ID (string)
  - User email (string)
  - User-entered PIN (string)
  - Cryptographically secure client-side salt
- **Output**: AES-256 encryption key

### Salt Management
- **Generation**: Cryptographically secure random salt (256 bits)
- **Storage**: IndexedDB with LocalStorage fallback
- **Persistence**: One salt per user, reused on subsequent logins
- **Cleanup**: Automatic salt clearing on logout

## Components

### PinEntry Component (`src/components/PinEntry.tsx`)
- User-friendly PIN input modal
- Auto-focus between input fields
- Paste support with digit filtering
- Error handling and validation
- Loading states with spinner
- First-time setup vs. login modes

### AuthWrapper Component (`src/components/AuthWrapper.tsx`)
- Handles PIN authentication flow for OAuth users
- Determines if user needs PIN setup or entry
- Manages authentication state
- Provides fallback for authentication errors

### EncryptionService (`src/services/encryptionService.ts`)
- Enhanced with PIN-based key derivation methods
- Backward compatibility with existing encryption
- Secure key management and cleanup
- Profile data encryption/decryption

### SaltManager (`src/services/saltManager.ts`)
- IndexedDB-first storage with LocalStorage fallback
- Secure salt generation using Web Crypto API
- User-specific salt management
- Cleanup functionality for logout/reset scenarios

## Security Considerations

### What is Protected
- ✅ PIN never stored or transmitted
- ✅ Salt stored locally, unique per user
- ✅ Encryption keys derived using strong PBKDF2 parameters
- ✅ Automatic key clearing on logout
- ✅ Client-side only encryption/decryption

### Attack Mitigation
- **Offline Attacks**: High iteration count (10,000) increases computation cost
- **Rainbow Tables**: Unique per-user salts prevent precomputed attacks
- **Session Hijacking**: Keys cleared on logout/sign-out events
- **Memory Leaks**: Minimal key storage time, automatic cleanup

### Data Flow
1. OAuth user logs in successfully
2. AuthWrapper determines PIN requirement
3. User enters PIN in secure modal
4. PIN + user data + salt → PBKDF2 → AES-256 key
5. Key used for encrypting/decrypting sensitive profile data
6. Key cleared from memory on logout

## Backward Compatibility

The system maintains full backward compatibility:
- **Existing Users**: Can continue using existing encrypted data
- **Legacy Encryption**: Still supported for email/password users  
- **Migration Path**: OAuth users gradually migrate to PIN-based system
- **Fallback Handling**: Graceful degradation if PIN system fails

## User Experience

### First-Time Setup
1. OAuth login completes
2. PIN setup modal appears
3. User enters 4-6 digit PIN
4. User confirms PIN entry
5. System derives and stores encryption key
6. User proceeds to application

### Returning User Login
1. OAuth login completes
2. PIN entry modal appears
3. User enters their PIN
4. System verifies PIN and derives key
5. User proceeds to application

### Error Handling
- Invalid PIN length shows immediate feedback
- PIN mismatch in setup requires re-entry
- Wrong PIN on login shows error message
- Network/system errors provide fallback options

## Testing

A test page is available at `/pin-test` to demonstrate:
- First-time PIN setup flow
- PIN confirmation validation
- Login PIN entry
- Error handling (try PIN "1234")
- Success scenarios

## Implementation Notes

### Browser Compatibility
- **IndexedDB**: Supported in all modern browsers
- **LocalStorage**: Fallback for older browsers or privacy modes
- **Web Crypto API**: For secure salt generation
- **PBKDF2**: Available through CryptoJS library

### Performance
- **Key Derivation**: ~100ms on modern devices (10,000 iterations)
- **Storage Operations**: Millisecond-level IndexedDB operations
- **Memory Usage**: Minimal, keys cleared promptly

### Monitoring
- Console warnings for storage failures
- Error logging for key derivation issues
- Graceful fallbacks prevent application breaking

## Future Enhancements

- [ ] Biometric authentication integration
- [ ] Hardware security key support
- [ ] Key rotation mechanisms
- [ ] Advanced threat detection
- [ ] Audit logging for security events