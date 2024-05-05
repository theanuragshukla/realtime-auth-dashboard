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

### Recent Devices Endpoint 
- **Method** : GET 
- **Route** : `/recent-devices` 
- **Description** : Retrieves recent devices associated with the authenticated user. 
- **Access** : Requires authentication 
- **Parameters** : 
- `page` (optional): Page number for pagination 
- `forUid` (optional): User ID for which devices are being retrieved 
- **Response** : 
- `status`: Indicates the success status of the request. 
- `data`: Array of recent devices with details such as seed, last active time, device details, and status. 
- `msg`: Message indicating the status of the request.
### All Activities Endpoint 
- **Method** : GET 
- **Route** : `/all-activities` 
- **Description** : Retrieves all activities in the system. Restricted to admin users. 
- **Access** : Requires admin role 
- **Parameters** : 
- `page` (optional): Page number for pagination 
- **Response** : 
- `status`: Indicates the success status of the request. 
- `data`: Array of activities with details such as user ID, seed, action, and timestamp. 
- `msg`: Message indicating the status of the request.
### Recent Activities Endpoint 
- **Method** : GET 
- **Route** : `/recent-activities` 
- **Description** : Retrieves recent activities associated with the authenticated user. 
- **Access** : Requires authentication 
- **Parameters** : 
- `page` (optional): Page number for pagination 
- `forUid` (optional): User ID for which activities are being retrieved 
- **Response** : 
- `status`: Indicates the success status of the request. 
- `data`: Array of recent activities with details such as user ID, seed, action, and timestamp. 
- `msg`: Message indicating the status of the request.
### Logout Device Endpoint 
- **Method** : GET 
- **Route** : `/logout-device/:seed` 
- **Description** : Logs out a device using its seed. 
- **Access** : Requires authentication 
- **Parameters** : 
- `seed`: Seed of the device to be logged out 
- `forUid` (optional): User ID for which the device is being logged out 
- **Response** : 
- `status`: Indicates the success status of the request. 
- `msg`: Message indicating the status of the request.
### Device Details Endpoint 
- **Method** : GET 
- **Route** : `/device/:seed` 
- **Description** : Retrieves details of a device using its seed. 
- **Access** : Requires authentication 
- **Parameters** : 
- `seed`: Seed of the device to retrieve details 
- `forUid` (optional): User ID for which the device details are being retrieved 
- **Response** : 
- `status`: Indicates the success status of the request. 
- `data`: Object containing details of the device such as last active time, device details, and status. 
- `msg`: Message indicating the status of the request.
### Upgrade Account Endpoint 
- **Method** : GET 
- **Route** : `/upgrade` 
- **Description** : Upgrades the user account to admin role. 
- **Access** : Requires authentication 
- **Response** : 
- `status`: Indicates the success status of the request. 
- `msg`: Message indicating the status of the request.

### Get All Users Endpoint 
- **Method** : GET 
- **Route** : `/all` 
- **Description** : Retrieves all users in the system. 
- **Access** : Restricted to users with admin role. 
- **Query Parameters** : 
- `page` (optional): Page number for pagination 
- **Response** : 
- `status`: Indicates the success status of the request. 
- `data`: Array of user objects containing user details such as UID, name, email, and role. 
- `msg`: Message indicating the status of the request.
### Get User Details Endpoint 
- **Method** : GET 
- **Route** : `/:uid` 
- **Description** : Retrieves details of a specific user. 
- **Access** : Restricted to users with admin role. 
- **Parameters** : 
- `uid`: UID of the user to retrieve details. 
- **Response** : 
- `status`: Indicates the success status of the request. 
- `data`: Object containing details of the user such as UID, name, email, and role. 
- `msg`: Message indicating the status of the request.
### Delete User Endpoint 
- **Method** : DELETE 
- **Route** : `/:uid` 
- **Description** : Deletes a specific user from the system. 
- **Access** : Restricted to users with admin role. 
- **Parameters** : 
- `uid`: UID of the user to be deleted. 
- **Response** : 
- `status`: Indicates the success status of the request. 
- `msg`: Message indicating the status of the request.

