# API Implementation Documentation

This document provides a detailed overview of the API implementation for the GreenArms UI project.

## Base Configuration

The API client is configured in `src/app/api/client.ts`.

- **Base URL**: `https://api.quantumlab.codes/api` (or `VITE_API_BASE_URL` env var)
- **Library**: `axios`
- **Features**:
  - **Request Interceptor**: Automatically attaches the JWT token from `localStorage` (`Authorization: Bearer <token>`).
  - **Response Interceptor**: Basic error handling structure.
  - **Timeout**: 10 seconds.

---

## Authentication (`auth.api.ts`)

Handles user authentication, registration, and session management.

### Endpoints

| Function | Endpoint | Method | Description |
|----------|----------|--------|-------------|
| `login` | `/auth/login/` | POST | Authenticates user and retrieves access/refresh tokens. |
| `sendOtp` | `/auth/register/initiate` | POST | Sends an OTP to the provided email for registration. |
| `verifyOtp` | `/auth/verify-otp/` | POST | Verifies the OTP sent to the email. |
| `registerUser` | `/auth/register/` | POST | Completes the registration process with user details. |
| `logout` | `/auth/logout/` | POST | Invalidates the refresh token on the server. |

### Key Types (`Auth.types.ts`)

- **LoginRequest**: `{ email, password }`
- **RegisterRequest**: `{ email, password, first_name, last_name, ... }`
- **VerifyOtpRequest**: `{ email, otp_code }`

---

## Sites / Plants (`sites.api.ts`)

Manages Site (Plant) data. Note that "Sites" and "Plants" are used interchangeably in the domain, but `sites.api.ts` is the active implementation.

### Endpoints

| Function | Endpoint | Method | Description |
|----------|----------|--------|-------------|
| `createSite` | `/sites/` | POST | Creates a new site/plant. |
| `getSites` | `/sites/` | GET | Retrieves a list of all sites. |
| `getSite` | `/sites/:id/` | GET | Retrieves details for a specific site by ID (UUID). |
| `updateSite` | `/sites/:id/` | PUT | Updates an existing site. |

### Key Types (`Sites.types.ts`)

- **Site**: Represents a plant entity (ID, name, location, capacity, etc.).
- **CreateSiteRequest**: Payload for creating a site.

---

## Devices (`devices.api.ts`)

Manages devices associated with sites (inverters, meters, etc.).

### Endpoints

| Function | Endpoint | Method | Description |
|----------|----------|--------|-------------|
| `getDevices` | `/devices/` | GET | Retrieves a paginated list of devices. Supports filtering by `site`, `role`, `status`. |
| `getDeviceDetails` | `/devices/:id/` | GET | Retrieves details for a specific device. |
| `createDevice` | `/devices/` | POST | Creates a new device. |
| `updateDevice` | `/devices/:id/` | PUT | Updates a device configuration. |
| `deleteDevice` | `/devices/:id/` | DELETE | Removes a device. |

### Key Types (`Devices.types.ts`)

- **Device**: Represents a device entity.
- **PaginatedDevices**: Response structure containing `results` array and pagination metadata.

---

## Dashboard

There are currently two files related to the dashboard:

1.  **`dashboardApi.ts` (Active/Mock)**:
    -   Uses `fetch` API directly.
    -   Contains a `USE_MOCK_DATA` flag to toggle between real endpoints and hardcoded mock data.
    -   **Functions**:
        -   `fetchProductionMetrics`: Returns total production, capacity, etc.
        -   `fetchPlantStatusMetrics`: Returns counts of offline/online plants.
        -   `fetchHistoricalProduction`: Returns graph data.
        -   `fetchPeakHourRankings`: Returns ranking data.

2.  **`dashboard.api.ts` (Placeholder)**:
    -   Intended to use the `client` (axios) instance.
    -   Currently throws "Not implemented" errors.
    -   Planned structure for future migration.

---

## Usage Example

```typescript
import { getSites } from '@/app/api/sites.api';
import { getDevices } from '@/app/api/devices.api';

// Fetching sites
const loadSites = async () => {
  try {
    const sites = await getSites();
    console.log(sites);
  } catch (error) {
    console.error("Failed to load sites", error);
  }
};

// Fetching devices for a specific site
const loadSiteDevices = async (siteId: string) => {
  try {
    const devices = await getDevices({ site: siteId });
    console.log(devices);
  } catch (error) {
    console.error("Failed to load devices", error);
  }
};
```
