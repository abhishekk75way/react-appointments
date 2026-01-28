# Appointment Scheduling - Frontend

A modern, professional frontend interface for managing appointments and scheduling. This application is designed for clinics, salons, coworking spaces, and other service-based businesses.

## Use Cases

- **Online Booking Systems**: Seamless interface for customers to book services.
- **Service-Based Businesses**: Perfect for salons, spas, clinics, and workspaces.
- **Calendar Integration**: Visual scheduling and availability management.
- **Client Communication**: Automated reminders and status notifications for appointments.

## Features

- **User-friendly Booking UI**: Intuitive step-by-step booking process.
- **Calendar View**: Manage availability slots and view schedules at a glance.
- **Profile Management**: Complete control for both Users and Staff members.
- **Reminders & Notifications**: Integrated email/SMS reminder simulation for upcoming appointments.
- **Flexible Management**: Full support for cancellation, rescheduling, and status updates.
- **Persistent Storage**: All data persists in browser's LocalStorage—no backend setup required!

## Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Customer** | <rajesh.kumar@gmail.com> | Rajesh@123 |
| **Staff/Specialist** | <deepak.verma@salonpro.in> | Deepak@123 |
| **System Admin** | <admin@salonpro.in> | Admin@123 |

## Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [Material UI (MUI)](https://mui.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Persistence**: Browser LocalStorage

## Project Structure

```bash
src/
├── assets/         # Static assets (images, fonts)
├── components/     # Reusable UI components and Feature components
├── layouts/        # Layout wrappers (e.g., AuthLayout, StaffLayout)
├── pages/          # Page-level components
├── routes/         # Routing configuration
├── services/       # API services and data loaders
├── libs/           # Reusable libraries and static data
│   └── data/       # Static data modules with CRUD operations
├── store/          # Redux store and slices
└── styles/         # Global styles and theme
```

## Getting Started

### Prerequisites

- Node.js installed on your machine.
- npm or yarn package manager.

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/abhishekk75way/react-appointments.git
    cd react-appointments
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Run the development server:**

    ```bash
    npm run dev
    ```

    The app will be available at `http://localhost:5173`.

## Build

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```
