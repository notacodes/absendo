# Absendo 

**Absendo** is a tool designed to simplify the process of filling out absence forms for students of the BBZW (Berufsbildungszentrum Wirtschaft, Informatik und Technik). By integrating directly with your school calendar, Absendo automates the task of generating absence forms, saving students time and effort.

## ✨ Features

*   **Automated Form Filling:** Generate complete absence forms with just a few clicks.
*   **School Calendar Integration:** Seamlessly import absence data from your BBZW school calendar.
*   **End-to-End Encryption:** Your personal data and absence information are secured with end-to-end encryption.
*   **Open Source:** Developed as an open-source project, promoting transparency and community contributions.

## 🌐 Live Demo

Experience Absendo live: [https://absendo.app](https://absendo.app)

## 📦 Project Structure

This repository contains the **frontend** of the Absendo application, built with React and Vite. The backend is maintained in a separate repository:

👉 [Absendo Backend Repository](https://github.com/notacodes/absendo-backend)

## 🚀 Technologies

*   **Frontend:**
    *   [TypeScript](https://www.typescriptlang.org/)
    *   [React](https://react.dev/)
    *   [Vite](https://vitejs.dev/) (Build Tool)
    *   [Tailwind CSS](https://tailwindcss.com/) (Styling), [DaisyUI](https://daisyui.com/) (Component Library)
    *   [Supabase](https://supabase.com/) (Authentication, Database)
*   **Deployment:**
    *   [Vercel](https://vercel.com/)

## 🛠️ Installation & Local Setup

To get a local copy of Absendo up and running, follow these steps:

### Prerequisites

*   Node.js (LTS version recommended)
*   npm (comes with Node.js)

### Clone the repository

```bash
git clone https://github.com/notacodes/absendo-react.git
cd absendo-react
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root of the project.

```
VITE_SUPABASE_URL=https://uvvchmphtkqsfpaydagn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2dmNobXBodGtxc2ZwYXlkYWduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNzA4MzYsImV4cCI6MjA1OTc0NjgzNn0.x9jLUG8EOwXeO6clfhZII_H90JTceR3UAKcQRZARd2U
```

### Run the Development Server

```bash
npm run dev
```

This will start the development server, usually at `http://localhost:5173`.

## 👋 Contributing

We welcome contributions to Absendo! If you have suggestions for improvements, bug reports, or want to contribute code, please feel free to:

1.  Open an issue to discuss your proposed changes or report a bug.
2.  Fork the repository and create a pull request with your contributions.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Thanks

Special thanks to everyone who shared their SLUZ URL for testing purposes — your help made this tool possible.
Thanks also to [dDreistein](https://github.com/dDreistein) for designing the favicon.