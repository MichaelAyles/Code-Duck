# CodeDuck: Architecture & Development Plan

## 1. Overview

This document outlines the architecture, technology stack, and development plan for **CodeDuck**, a mobile-first AI coding assistant. The primary goal is to create a functional, polished, and monetizable application within the hackathon's timeframe. The plan is designed to be ambitious yet achievable, focusing on a strong Minimum Viable Product (MVP) and a clear path to monetization using RevenueCat.

**Project Vision:** To empower developers to manage their coding workflow—from ideation to commit—entirely from their mobile device, leveraging AI to accelerate the process.

**Target Awards:**
*   **Best Vibes Award:** By creating a seamless and enjoyable coding "vibe" on mobile.
*   **HAMM (Help Apps Make Money) Award:** Through a well-designed freemium subscription model.
*   **Grand Prize: Build & Grow Award:** By launching early and demonstrating user adoption and growth.

---

## 2. Core Features & User Flow

The user experience will be centered around a central dashboard that unifies tasks from different services.

1.  **Onboarding & Authentication:**
    *   **User Signup:** Simple email/password registration and social login options.
    *   **Service Linking:** Secure OAuth 2.0 flow to connect GitHub and Trello accounts. Access tokens are stored securely on the backend, not the client.

2.  **Dashboard:**
    *   A unified view showing:
        *   Assigned GitHub issues.
        *   Trello cards in the "In Progress" list.
        *   A feed of recent AI activity and notifications.

3.  **GitHub Integration:**
    *   **Browse Repositories:** Navigate through repository files and directories.
    *   **File Viewer:** A read-only view of file contents with syntax highlighting.
    *   **Issue Management:** View, comment on, and close issues.

4.  **Trello Integration:**
    *   **Board Viewer:** View cards on a selected Trello board.
    *   **Card Management:** Drag and drop cards between lists to update status.

5.  **AI Coder (The Core "Vibe"):**
    *   A chat-based interface to interact with the AI assistant.
    *   **Key Commands:**
        *   `explain file <file_path>`: Get a natural language explanation of a file's purpose and logic.
        *   `propose fix for issue <issue_number>`: The AI analyzes the issue, reads relevant code, and proposes a patch.
        *   `write code <prompt>`: Generate code from a natural language prompt.
        *   `commit`: Commit staged changes to a new branch with an AI-generated commit message.
        *   `create pull request`: Open a PR on GitHub for the new branch.

---

## 3. Technology Stack & Architecture

The stack is chosen for speed of development, scalability, and strong community support.

*   **Frontend (Mobile App):** **React Native**
    *   **Why:** A single codebase for both iOS and Android is essential for a time-constrained hackathon. The rich ecosystem of libraries for code viewing and UI development is a significant advantage.
    *   **Key Libraries:**
        *   `@react-navigation/native`: For screen navigation.
        *   `react-native-keychain`: For secure storage of authentication tokens on the device.
        *   `react-native-syntax-highlighter`: For rendering code blocks beautifully.
        *   `@revenuecat/react-native-purchases`: The core of our monetization strategy.

*   **Backend:** **Node.js with TypeScript**
    *   **Why:** Node.js's non-blocking I/O is perfect for an API-heavy application that orchestrates calls to GitHub, Trello, and an AI service. TypeScript adds crucial type safety, reducing bugs.
    *   **Framework:** **Fastify** - Chosen for its high performance and low overhead, which is beneficial for a responsive user experience.
    *   **Key Libraries:**
        *   `@octokit/rest`: Official GitHub API client.
        *   `trello`: A simple client for the Trello API.
        *   `openai`: For seamless integration with AI models.
        *   `bullmq`: A robust Redis-based queue for managing long-running background jobs like code generation and analysis. This prevents API timeouts and provides a better UX.
        *   `prisma`: A next-generation ORM for type-safe database access.

*   **Database:** **PostgreSQL**
    *   **Why:** A reliable, feature-rich, and scalable open-source relational database.
    *   **Hosting:** A managed database service (e.g., on DigitalOcean or AWS RDS) is recommended to minimize setup and maintenance overhead.

*   **Deployment:**
    *   **Backend:** **Docker** for containerization. Deployed to a PaaS like **Render** or **Fly.io** for easy setup, auto-scaling, and CI/CD integration.
    *   **CI/CD:** **GitHub Actions** to automate testing, linting, and deployment of the backend on every push to the `main` branch.

### System Architecture Diagram

```mermaid
graph TD
    A[Mobile App <br/> (React Native)] --> B{Backend API <br/> (Node.js/Fastify)};
    B --> C[Database <br/> (PostgreSQL)];
    B --> D{Third-Party APIs};
    B --> E{Background Worker <br/> (BullMQ)};
    D -- GitHub API --> B;
    D -- Trello API --> B;
    E -- OpenAI API --> F((AI Service));
    subgraph "User Interaction"
        A
    end
    subgraph "Services"
        B
        C
        E
    end
    subgraph "External APIs"
        D
        F
    end
```

---

## 4. Monetization Strategy

A freemium model designed to attract a large user base while offering compelling value for power users. Managed entirely through **RevenueCat**.

*   **Free Tier (`Hobbyist`):**
    *   **Goal:** Allow users to experience the core value proposition and get hooked.
    *   **Limits:**
        *   Connect 1 private GitHub repository.
        *   Connect 1 Trello board.
        *   15 AI requests per day.
        *   Uses a standard AI model (e.g., GPT-3.5-turbo).

*   **Pro Tier (`Pro Coder`):**
    *   **Price:** $9.99/month (or a compelling annual discount).
    *   **Goal:** Provide unlimited access and premium features for serious developers.
    *   **Features:**
        *   **Unlimited** private repositories and Trello boards.
        *   **200** AI requests per day (or a higher limit).
        *   Access to the **most powerful AI models** (e.g., GPT-4o).
        *   Priority access to new features and beta releases.
        *   Enhanced AI capabilities (e.g., whole-repo context).

---

## 5. Development Plan & Milestones (8-Week Timeline)

This is an aggressive timeline suitable for a hackathon.

*   **Week 1: Foundation & Authentication**
    *   [ ] Set up React Native project.
    *   [ ] Set up Node.js backend with Fastify and Prisma.
    *   [ ] Implement user authentication (email/password).
    *   [ ] Implement GitHub OAuth flow and secure token storage.
    *   **Goal:** A user can sign in and see a list of their GitHub repos.

*   **Week 2: Core GitHub & Trello Integration**
    *   [ ] Build UI to browse repository files and view file content with syntax highlighting.
    *   [ ] Build UI to list and view details of GitHub issues.
    *   [ ] Implement Trello OAuth flow.
    *   [ ] Build UI to view a selected Trello board and its cards.
    *   **Goal:** The app provides a comprehensive read-only view of a developer's projects.

*   **Week 3: Basic AI & User Interaction**
    *   [ ] Integrate the OpenAI API on the backend.
    *   [ ] Create the chat interface for the AI Coder.
    *   [ ] Implement the first AI feature: `explain file <file_path>`.
    *   [ ] Allow users to comment on GitHub issues from the app.
    *   **Goal:** The app becomes interactive and demonstrates its core AI value.

*   **Week 4: Advanced AI & Background Jobs**
    *   [ ] Set up Redis and BullMQ for background job processing.
    *   [ ] Implement the `propose fix for issue` feature as a background job.
    *   [ ] Build a UI to show the status of long-running AI jobs.
    *   [ ] Implement the `commit` and `create pull request` features.
    *   **Goal:** The core "vibe coding" loop is complete. A user can fix an issue and create a PR from their phone.

*   **Week 5: Monetization & Polishing**
    *   [ ] Integrate the RevenueCat SDK into the React Native app.
    *   [ ] Design and build the paywall screen, highlighting Pro features.
    *   [ ] Use entitlements to lock Pro features.
    *   [ ] Refine the UI/UX, add micro-interactions, and ensure a polished "vibe."
    *   **Goal:** The app is feature-complete and ready for monetization.

*   **Weeks 6-8: Testing, Deployment, and Launch**
    *   [ ] Conduct thorough testing on both iOS and Android devices.
    *   [ ] Write unit and integration tests for the backend.
    *   [ ] Deploy the backend and set up CI/CD pipeline.
    *   [ ] Prepare App Store and Google Play Store listings (screenshots, descriptions).
    *   [ ] **Submit for review** with enough time for approval before the deadline.
    *   [ ] **Launch!** Announce on social media and start the #BuildInPublic campaign.
