# 🌿 GreenArms UI

GreenArms is a sophisticated management and monitoring dashboard designed for industrial or environmental assets (Plants, Devices, Fleet). It provides real-time insights, alarm management, scheduling, and detailed audit/dispatch logs.

> [!NOTE]
> This UI was initially generated from a [Figma UI Specification](https://www.figma.com/design/D5Hey2BGrLM0JYbDxwEb84/UI-Specification-Document).

---

## 🚀 Key Features

- **Dashboard Overview**: At-a-glance metrics and high-level status of all assets.
- **Plant & Device Management**: Detailed monitoring and configuration for individual plants and devices.
- **Alarm System**: Real-time alarm monitoring and history tracking.
- **Scheduling & Pricing**: Manage operational schedules and price feeds for asset optimization.
- **Fleet Monitoring**: Comprehensive view of the entire device fleet.
- **Operations Logs**: Audit and dispatch logs for transparency and compliance.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://reactjs.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [MUI (Material UI)](https://mui.com/), [Radix UI](https://www.radix-ui.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **Components**: [Lucide React](https://lucide.dev/) (icons), [Sonner](https://sonner.emilkowal.ski/) (toasts)
- **Forms**: [React Hook Form](https://react-hook-form.com/)

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── components/  # Shared UI components and layout
│   ├── context/     # App-wide state (AppContext)
│   ├── pages/       # Main page components (Dashboard, Plants, etc.)
│   └── App.tsx      # Main routing and page switcher
├── styles/          # Global styles, Tailwind, and theme configuration
└── main.tsx         # App entry point
```

---

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (compatible with Vite 6)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation

```bash
# Clone the repository (if applicable)
# Navigate to the project directory
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

### Build

```bash
# Build for production
npm run build
```

---

## 📝 License

This project is for internal UI specification purposes. Refer to the original Figma design for licensing and usage constraints.