## Endpoints
### 1. `/recent-devices` 
- **Method** : GET 
- **Description** : Retrieve recent devices for the authenticated user. 
- **Query Parameters** : 
- `page`: Page number for pagination (optional). 
- `forUid`: User ID for which devices are being retrieved (optional). 
- **Authorization** : Required (user or admin). 
- **Response** : Returns recent devices along with their details.
### 2. `/all-activities` 
- **Method** : GET 
- **Description** : Retrieve all activities (admin-only). 
- **Query Parameters** : 
- `page`: Page number for pagination (optional). 
- **Authorization** : Required (admin). 
- **Response** : Returns all activities performed in the system.
### 3. `/recent-activities` 
- **Method** : GET 
- **Description** : Retrieve recent activities for the authenticated user. 
- **Query Parameters** : 
- `page`: Page number for pagination (optional). 
- `forUid`: User ID for which activities are being retrieved (optional). 
- **Authorization** : Required (user or admin). 
- **Response** : Returns recent activities performed by the user.
### 4. `/logout-device/:seed` 
- **Method** : GET 
- **Description** : Logout a device using its seed. 
- **Parameters** : 
- `seed`: Seed of the device to be logged out. 
- **Query Parameters** : 
- `forUid`: User ID for which the device is being logged out (optional). 
- **Authorization** : Required (user or admin). 
- **Response** : Logs out the device and returns the status.
### 5. `/device/:seed` 
- **Method** : GET 
- **Description** : Retrieve device details using its seed. 
- **Parameters** : 
- `seed`: Seed of the device to retrieve details. 
- **Query Parameters** : 
- `forUid`: User ID for which the device details are being retrieved (optional). 
- **Authorization** : Required (user or admin). 
- **Response** : Returns details of the specified device.
### 6. `/upgrade` 
- **Method** : GET 
- **Description** : Upgrade user account to admin role. 
- **Authorization** : Required (user). 
- **Response** : Upgrades the user account to admin role and returns the status.
