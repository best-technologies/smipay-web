# User Management API Endpoints

## Base Path
`/api/v1/unified-admin/users`

**Auth:** JWT Bearer token (admin role required)

---

## 1. List Users (Paginated, Filterable, Searchable)
**GET** `/api/v1/unified-admin/users`

### Query Params

| Param | Type | Default | Description |
|---|---|---|---|
| `page` | number | `1` | Page number |
| `limit` | number | `20` | Items per page (max 100) |
| `search` | string | — | Searches across first name, last name, email, phone number, and Smipay tag (case-insensitive) |
| `role` | string | — | Filter by role. Values: `user`, `agent`, `support`, `compliance_officer`, `finance`, `operations`, `admin` |
| `account_status` | string | — | Filter by status. Values: `active`, `suspended` |
| `tier` | string | — | Filter by tier key (e.g. `"UNVERIFIED"`, `"VERIFIED"`, `"PREMIUM"`) |
| `kyc_status` | string | — | Filter by KYC status. Values: `verified`, `pending`, `rejected`, `none` |
| `date_from` | string | — | Filter users registered on or after this date (ISO 8601, e.g. `"2026-01-01"`) |
| `date_to` | string | — | Filter users registered on or before this date |
| `sort_by` | string | `createdAt` | Sort field. Options: `createdAt`, `first_name`, `last_name`, `email`, `phone_number` |
| `sort_order` | string | `desc` | Sort direction: `asc` or `desc` |

### Example Request
```
GET /api/v1/unified-admin/users?page=1&limit=20&search=john&account_status=active&sort_by=createdAt&sort_order=desc
```

### Response
```json
{
  "success": true,
  "message": "Users fetched",
  "data": {
    "users": [
      {
        "id": "uuid",
        "first_name": "John",
        "last_name": "Doe",
        "middle_name": null,
        "email": "john@example.com",
        "phone_number": "+2348012345678",
        "smipay_tag": "johndoe",
        "role": "user",
        "gender": "male",
        "date_of_birth": "1990-05-15T00:00:00.000Z",
        "account_status": "active",
        "is_email_verified": true,
        "is_phone_verified": true,
        "createdAt": "2026-01-15T10:30:00.000Z",
        "updatedAt": "2026-02-20T14:00:00.000Z",
        "tier": {
          "id": "uuid",
          "tier": "VERIFIED",
          "name": "Verified Tier"
        },
        "profile_image": {
          "secure_url": "https://res.cloudinary.com/..."
        },
        "kyc_verification": {
          "status": "approved",
          "is_verified": true,
          "bvn_verified": true,
          "id_type": "NIGERIAN_NIN"
        }
      }
    ],
    "meta": {
      "total": 1250,
      "page": 1,
      "limit": 20,
      "total_pages": 63
    }
  }
}
```

### User Object (List View)

| Field | Type | Description |
|---|---|---|
| `id` | string | User UUID |
| `first_name` | string \| null | First name |
| `last_name` | string \| null | Last name |
| `middle_name` | string \| null | Middle name |
| `email` | string \| null | Email address |
| `phone_number` | string | Phone number (E.164 format) |
| `smipay_tag` | string \| null | Unique Smipay tag |
| `role` | string | One of: `user`, `agent`, `support`, `compliance_officer`, `finance`, `operations`, `admin` |
| `gender` | string \| null | `male` or `female` |
| `date_of_birth` | string \| null | ISO date |
| `account_status` | string | `active` or `suspended` |
| `is_email_verified` | boolean | Whether email is verified |
| `is_phone_verified` | boolean | Whether phone is verified |
| `createdAt` | string | ISO datetime |
| `updatedAt` | string | ISO datetime |
| `tier` | object \| null | `{ id, tier, name }` — current tier |
| `profile_image` | object \| null | `{ secure_url }` — profile image URL |
| `kyc_verification` | object \| null | `{ status, is_verified, bvn_verified, id_type }` — KYC summary |

---

## 2. Get User Detail
**GET** `/api/v1/unified-admin/users/:id`

Returns the full user profile including wallet, address, full KYC details, and counts.

### Response
```json
{
  "success": true,
  "message": "User fetched",
  "data": {
    "id": "uuid",
    "first_name": "John",
    "last_name": "Doe",
    "middle_name": null,
    "email": "john@example.com",
    "phone_number": "+2348012345678",
    "smipay_tag": "johndoe",
    "role": "user",
    "gender": "male",
    "date_of_birth": "1990-05-15T00:00:00.000Z",
    "account_status": "active",
    "is_email_verified": true,
    "is_phone_verified": true,
    "is_friendly": false,
    "referral_code": "ABC123",
    "agree_to_terms": true,
    "createdAt": "2026-01-15T10:30:00.000Z",
    "updatedAt": "2026-02-20T14:00:00.000Z",
    "tier": {
      "id": "uuid",
      "tier": "VERIFIED",
      "name": "Verified Tier"
    },
    "profile_image": {
      "secure_url": "https://res.cloudinary.com/..."
    },
    "address": {
      "id": "uuid",
      "userId": "uuid",
      "city": "Lagos",
      "state": "Lagos",
      "country": "NG",
      "home_address": "123 Main St",
      "house_number": "12A",
      "postal_code": "100001"
    },
    "wallet": {
      "id": "uuid",
      "current_balance": 50000.00,
      "all_time_fuunding": 200000.00,
      "all_time_withdrawn": 150000.00,
      "isActive": true
    },
    "kyc_verification": {
      "id": "uuid",
      "userId": "uuid",
      "first_name": "JOHN",
      "last_name": "DOE",
      "middle_name": null,
      "phone": "+2348012345678",
      "email": "john@example.com",
      "date_of_birth": "1990-05-15T00:00:00.000Z",
      "gender": "male",
      "nin": "12345678901",
      "state_of_origin": "Lagos",
      "lga_of_origin": "Ikeja",
      "state_of_residence": "Lagos",
      "lga_of_residence": "Lekki",
      "watchlisted": false,
      "face_image": "https://...",
      "is_verified": true,
      "id_type": "NIGERIAN_NIN",
      "id_no": "12345678901",
      "bvn": "22012345678",
      "bvn_verified": true,
      "status": "approved",
      "initiated_at": "2026-01-16T08:00:00.000Z",
      "approved_at": "2026-01-16T08:05:00.000Z",
      "failure_reason": null
    },
    "_count": {
      "cards": 2,
      "supportTickets": 1,
      "auditLogs": 45
    }
  }
}
```

### Additional Fields (Detail View Only)

| Field | Type | Description |
|---|---|---|
| `is_friendly` | boolean | Whether user has friendlies pricing |
| `referral_code` | string \| null | User's referral code |
| `agree_to_terms` | boolean | Terms acceptance |
| `address` | object \| null | Full address object |
| `wallet` | object \| null | `{ id, current_balance, all_time_fuunding, all_time_withdrawn, isActive }` |
| `kyc_verification` | object \| null | Full KYC details (see KYC fields below) |
| `_count.cards` | number | Number of virtual cards |
| `_count.supportTickets` | number | Number of support tickets |
| `_count.auditLogs` | number | Number of audit log entries |

---

## 3. Update User Status (Suspend / Activate)
**PUT** `/api/v1/unified-admin/users/:id/status`

### Payload
```json
{
  "account_status": "suspended",
  "reason": "Fraudulent activity detected"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `account_status` | string | Yes | `active` or `suspended` |
| `reason` | string | No | Reason for the change (recorded in audit log) |

### Response
```json
{
  "success": true,
  "message": "User suspended successfully",
  "data": { /* same as user list object */ }
}
```

---

## 4. Update User Role
**PUT** `/api/v1/unified-admin/users/:id/role`

### Payload
```json
{
  "role": "support",
  "reason": "Promoted to support team"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `role` | string | Yes | One of: `user`, `agent`, `support`, `compliance_officer`, `finance`, `operations`, `admin` |
| `reason` | string | No | Reason for the change (recorded in audit log) |

### Response
```json
{
  "success": true,
  "message": "User role updated successfully",
  "data": { /* same as user list object */ }
}
```

---

## 5. Update User Tier
**PUT** `/api/v1/unified-admin/users/:id/tier`

### Payload
```json
{
  "tier_id": "uuid-of-target-tier",
  "reason": "KYC verified — upgrading to VERIFIED tier"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `tier_id` | string | Yes | UUID of the target tier |
| `reason` | string | No | Reason for the change (recorded in audit log) |

### Response
```json
{
  "success": true,
  "message": "User tier updated successfully",
  "data": { /* same as user list object */ }
}
```

---

## Enum Values Reference

### Roles
| Value | Description |
|---|---|
| `user` | Regular customer |
| `agent` | Field agent / merchant |
| `support` | Customer support staff |
| `compliance_officer` | KYC/AML compliance reviewer |
| `finance` | Finance team |
| `operations` | Operational management |
| `admin` | Full system access |

### Account Status
| Value | Description |
|---|---|
| `active` | Normal active account |
| `suspended` | Account is suspended |

### KYC Status (filter values)
| Value | Description |
|---|---|
| `verified` | KYC is fully verified |
| `pending` | KYC submitted, awaiting review |
| `rejected` | KYC was rejected |
| `none` | No KYC record exists |

### KYC ID Types
| Value |
|---|
| `NIGERIAN_BVN_VERIFICATION` |
| `NIGERIAN_NIN` |
| `NIGERIAN_INTERNATIONAL_PASSPORT` |
| `NIGERIAN_PVC` |
| `NIGERIAN_DRIVERS_LICENSE` |

---

## Frontend Implementation Notes

- **Search:** Debounce search input (300-500ms) before making API calls. The search covers first name, last name, email, phone, and Smipay tag.
- **Filters:** Stack filters — they are AND-combined. Search + role + status + tier + kyc_status + date range all work together.
- **Pagination:** Use `meta.total_pages` to render pagination controls. Show `meta.total` as "X users found".
- **User detail:** Navigate to the detail view when a user row is clicked. The detail endpoint returns wallet balance, full KYC, address, and activity counts.
- **Status/role/tier updates:** After a successful update, the response contains the updated user object — use it to update the UI without refetching.
- **Profile image:** May be `null` — show a default avatar placeholder when missing.
- **Tier:** May be `null` for users created before the tier system — display "No tier" or similar.
