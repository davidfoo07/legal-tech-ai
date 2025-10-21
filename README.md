# LawLink MVP ⚖️

> An AI-powered legal consultation CRM tool specializing in labour law.

LawLink AI is a specialized legal tech platform designed as an AI chatbot and intelligent CRM focused on labour law case intake. Its primary function is to efficiently collect, structure, and summarize complex client information into prioritized, actionable case reports for law firm review. The goal is to streamline the initial client intake process and reduce administrative time for legal professionals.

---

## 🛠️ Tech Stack

-   **Frontend:** React, Vite, TypeScript
-   **Backend:** Java, Spring Boot
-   **Monorepo Tools:** `npm` scripts with `concurrently`

---

## 📂 Project Structure

The repository is organized as a monorepo to streamline development between the client and server.

---

## 🚀 Getting Started

Follow these instructions to get the project set up and running on your local machine.

### 1. Prerequisites

Make sure you have the following software installed:

-   Node.js (v18 or higher recommended)
-   JDK (v17 or higher recommended)
-   Maven or Gradle (for backend dependency management)

### 2. Installation

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/davidfoo07/legal-tech-ai.git
    cd legal-tech-ai
    ```

2.  **Install dependencies:**
    Run `npm install` from the root directory. This will install the necessary packages for running both the frontend and backend concurrently, as well as install dependencies for the `frontend` workspace.
    ```sh
    npm install
    ```
    _(Note: You will still need to ensure your backend dependencies are resolved by your Java IDE or build tool.)_

### 3. Environment Configuration

The project requires environment variables for both the frontend and backend to function correctly. Sample files are provided.

1.  **Frontend Setup:**
    Navigate to the `/frontend` directory, copy the example file, and create your local environment file.

    ```sh
    cp frontend/.env.example frontend/.env.development
    ```

2.  **Backend Setup:**
    Similarly, create the environment file for the Spring Boot server in the `/backend` directory.

    ```sh
    cp backend/src/main/resources/application.example.properties backend/src/main/resources/application-dev.properties
    ```

3.  **Update Environment Variables:**
    Open the newly created `.env.development` (frontend) and `application-dev.properties` (backend) files and fill in the required values (e.g., API keys, database URLs).

---

## 💻 Running the Application

You can start both the backend API and the frontend development server with a single command from the **root directory**.

```sh
npm run dev
```
