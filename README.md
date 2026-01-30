# 🌿 GreenArms UI

GreenArms is a comprehensive, modern frontend dashboard designed for the management and monitoring of distributed energy resources (DERs), industrial assets, and environmental systems. It provides operators and fleet managers with real-time visibility, control, and analytical insights into their infrastructure.

This project is a high-fidelity React application that visualizes complex data relationships—from global fleet overviews down to individual device metrics—using interactive charts, dynamic topologies, and responsive design patterns.

> [!NOTE]
> This UI serves as the frontend client for the GreenArms platform, currently operating with a mock data layer for demonstration and development purposes.

---

## 🚀 Key Features

### 📊 Interactive Dashboards
- **Real-time Monitoring**: Visualise power flow (Solar, Grid, Battery, Consumption) with dynamic animations and live status updates.
- **Asset Health**: At-a-glance health badges and status indicators for all monitored plants and devices.
- **Topology Views**: Interactive system diagrams showing energy flow direction and state.

### 🏭 Asset Management
- **Plant Detail Views**: Deep dive into specific sites with time-series data, historical charts, and device listings.
- **Device Configuration**: Manage individual inverters, batteries, and meters with granular control.
- **Fleet Overview**: Aggregate metrics across all assets to identify underperforming units or system-wide issues.

### ⚡ Operations & Control
- **Alarm System**: centralized alert management with severity levels and acknowledgement workflows.
- **Scheduling**: visual tools for planning energy dispatch and maintenance windows.
- **Price Feeds**: Integration with market data to optimize energy usage and trading strategies.
- **Audit & Dispatch Logs**: Comprehensive history of user actions and automated system commands for compliance.

### 🔐 Authentication & Security
- **Secure Access**: Complete authentication flow including Login, Registration, and Email Verification.
- **Role-Based Access**: UI elements adapted for different user roles (Admin, Operator, Viewer).

---

## 🛠️ Tech Stack

This project leverages a modern, performance-focused stack:

- **Core**: [React 18](https://reactjs.org/) with [Vite 6](https://vitejs.dev/) for lightning-fast development and building.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) for utility-first styling, complemented by [Radix UI](https://www.radix-ui.com/) primitives and [MUI](https://mui.com/) icons.
- **Visualization**: [Recharts](https://recharts.org/) for responsive, composable charts and graphs.
- **Navigation**: [React Router v7](https://reactrouter.com/) for client-side routing.
- **Forms**: [React Hook Form](https://react-hook-form.com/) for efficient, performant form handling.
- **Icons**: [Lucide React](https://lucide.dev/) for consistent, beautiful iconography.
- **Utilities**: [date-fns](https://date-fns.org/) for date manipulation and [Sonner](https://sonner.emilkowal.ski/) for toast notifications.

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── components/    # Reusable UI components (Buttons, Cards, Charts)
│   │   ├── ui/        # Low-level accessible primitives (shadcn-like)
│   │   └── ...        # Domain-specific components (PlantInfo, SystemTopology)
│   ├── context/       # Global state management (Auth, Theme)
│   ├── data/          # Mock data generators for prototyping
│   ├── pages/         # Main route views
│   │   ├── auth/      # Authentication pages (Login, Register)
│   │   ├── Dashboard  # Main landing view
│   │   ├── Plants     # Asset listing and details
│   │   └── ...        # Other functional pages
│   └── App.tsx        # Root component and router configuration
└── main.tsx           # Application entry point
```

---

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd greenarms_ui
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

### Development

Start the local development server with hot-module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

### Build for Production

Create an optimized build for deployment:

```bash
npm run build
```

The output will be in the `dist/` directory, ready to be served by any static file host.

---

## 🎨 UI/UX Highlights

- **Responsive Design**: Fully optimized for desktop, tablet, and mobile interfaces.
- **Dark/Light Mode**: (Architecture ready) Built with CSS variables for easy theming.
- **Accessibility**: Utilizes Radix UI primitives to ensure screen reader support and keyboard navigation.

---

## 📝 License

This project is proprietary software. All rights reserved.
