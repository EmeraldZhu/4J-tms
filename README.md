# Tenant Management System (4J-TMS)

Welcome to the 4J-Tenant Management System (4J-TMS), a modern web application designed for property owners and tenants. Built with Vue 3 and powered by Vite, 4J-TMS offers a seamless experience for managing properties, tenants, maintenance requests, and notices.

## Features

- **Authentication**: Secure login and registration for property owners and tenants.
- **Property Management**: Owners can add, view, and manage their properties.
- **Tenant Management**: Owners can manage tenant details and invitations.
- **Maintenance Requests**: Tenants can submit maintenance requests, viewable by property owners.
- **Notice Board**: A platform for owners to post notices for tenants.

## Technologies

- **Frontend**: Vue 3, PrimeVue
- **Backend**: Firebase
  - Authentication
  - Firestore Database
  - Cloud Storage

## Project Setup

```bash
# Install dependencies
npm install

# Serve with hot reload at localhost:3000
npm run dev

# Build for production with minification
npm run build

# Locally preview production build
npm run preview
```
## Configuration
You need to set up your Firebase project and configure it in src/services/firebase-config.js.

## Contributing
Contributions are welcome! Please feel free to submit a pull request.
