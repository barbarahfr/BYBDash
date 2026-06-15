# Security Specifications: Firebase Data Invariants and Hardening

This document outlines the security invariants and malicious attack payloads used to verify our Zero-Trust security design before writing actual rules.

## 1. Data Invariants

- **Authentication Requirement**: Only authenticated users are allowed to access any collection. Anonymous, unverified, or public read/writes are strictly denied by default.
- **Verification Guarantee**: Write actions are restricted to users whose email addresses are verified by Firebase Authentication, when email-based auth is used.
- **Client Document Schema Integrity**: Writing a Client document must require specific schema keys: `id`, `name`, `status`, `ranking`, `responsibles`, and `scope` to prevent shadow fields.
- **Department & Team Definitions**: All configuration collections like `departments` and `customColumns` are system-only configuration, allowing read access to authenticated team members but strictly limiting creations, updates, or deletions to specific admins or system handlers if necessary (we default block writes to everyone).
- **ID Poisoning Safeguard**: Any targeted single-document operations must validate that the document ID matches standard alphanumeric naming schemes (`^[a-zA-Z0-9_\-]+$`) and contains at most 128 characters.
- **Immortal Fields**: Fields like `createdAt` must be immutable after initial creation.

---

## 2. The "Dirty Dozen" Malicious Payloads

The following payloads attempt to break our state or permissions. Real rules must return `PERMISSION_DENIED` on all of them.

### Malicious Test 1: Anonymous Read Attempt (Identity Violation)
- **Path**: `/clients/c_3be`
- **Context**: No authorization header/auth token present.
- **Attack Vector**: Attempting to read client segment and goals anonymously.

### Malicious Test 2: Unverified User Write (Auth Bypass)
- **Path**: `/clients/c_3be`
- **Context**: Authenticated, but `email_verified == false`.
- **Payload**: `{ "satisfactionRating": 5 }`
- **Attack Vector**: Modifying data using a non-verified email account.

### Malicious Test 3: ID Poisoning Attack (Resource Poisoning)
- **Path**: `/clients/c_very_long_junk_payload_id_with_more_than_128_chars_xxxxxxxxx_xxxxxxxx_xxxxxxxxx_xxxxxxxxx_xxxxxxxxx_xxxxxxxxx_and_symbols_$$$`
- **Context**: Authenticated and verified.
- **Payload**: `{ "id": "c_poison", "name": "Hack Ltd." }`
- **Attack Vector**: Injecting massive/malicious string to clog Firestore indexes.

### Malicious Test 4: Shadow Field Injection (Integrity Breach)
- **Path**: `/clients/c_3be`
- **Context**: Authenticated and verified.
- **Payload**: `{ "id": "c_3be", "name": "3BE", "status": "Active", "ranking": "D", "responsibles": {}, "scope": {}, "attackerField": "implant", "isSystemVerifiedAdmin": true }`
- **Attack Vector**: Injecting hidden privilege flags via unvalidated client schemas.

### Malicious Test 5: Client Modification (State Shortcutting)
- **Path**: `/clients/c_3be`
- **Context**: Authenticated and verified, trying to update client details with a type-violating score.
- **Payload**: `{ "satisfactionRating": "spectacular" }` (Should be integer/number)
- **Attack Vector**: Attempting to bypass client-side range validation with invalid data type.

### Malicious Test 6: Immutable Field Manipulation (Timeline Corruption)
- **Path**: `/clients/c_3be`
- **Context**: Authenticated and verified.
- **Payload**: Modifying `createdAt` from its initial value.
- **Attack Vector**: Forging historic tracking records to skew analytics.

### Malicious Test 7: Unauthorized Config Manipulation (Sysadmin Spoof)
- **Path**: `/departments/design`
- **Context**: Authenticated collaborator.
- **Payload**: `{ "name": "Destroyed Dept" }`
- **Attack Vector**: Non-admin collaborator trying to rewrite core department tasks list.

### Malicious Test 8: Path Traversal ID Injection (Sanitization Failure)
- **Path**: `/clients/../customColumns/col_operand`
- **Context**: Authenticated.
- **Payload**: Trying to write config via relative document pathing.
- **Attack Vector**: Injecting file-system path sequences inside IDs.

### Malicious Test 9: Self-Assigned Role Elevation (Privilege Escalation)
- **Path**: `/teamMembers/member_attacker`
- **Context**: Authenticated as `member_attacker`.
- **Payload**: `{ "isCoordinator": true, "supervisedDepartmentIds": ["design", "paid_media"] }`
- **Attack Vector**: Elevating own status to Coordinator without admin approval.

### Malicious Test 10: System-Generated Fields Override (System Poisoning)
- **Path**: `/clients/c_3be`
- **Context**: Authenticated.
- **Payload**: Directly overriding audit timestamps or internal keys using a client connection.

### Malicious Test 11: Array Under-specification (Boundary Overrun)
- **Path**: `/departments/design`
- **Context**: Attempting to update with a huge `tasks` array exceeding memory limits.
- **Attack Vector**: Bypassing size boundaries to freeze client frontends.

### Malicious Test 12: List Query Extortion (Query Scraper)
- **Path**: `/clients`
- **Context**: Authenticated, attempting blanket list query without filters, aiming to scrape all clients.
- **Attack Vector**: Bypassing owner queries to harvest database records.

---

## 3. Test Runner Schema (Simulation Model)

```typescript
// firestore.rules.test.ts simulation framework
import { assertFails, initializeTestEnvironment } from '@firebase/rules-unit-testing';

describe("Zero-Trust Security Unit Tests", () => {
  it("rejects non-authenticated sessions on clients", async () => {
    // Malicious Test 1
    const unauthedDb = (await initializeTestEnvironment({ projectId: "dash-agencia-99f95" })).unauthenticatedContext().firestore();
    await assertFails(unauthedDb.collection("clients").doc("c_3be").get());
  });
  
  it("rejects unverified user registrations", async () => {
    // Malicious Test 2
    const unverifiedDb = (await initializeTestEnvironment({ projectId: "dash-agencia-99f95" })).authenticatedContext("user_abc", { email_verified: false }).firestore();
    await assertFails(unverifiedDb.collection("clients").doc("c_3be").set({ satisfactionRating: 5 }, { merge: true }));
  });
});
```
