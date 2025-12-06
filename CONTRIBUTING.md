# Contributing to Africa Heritage Platform

Thank you for your interest in contributing to the Africa Heritage Platform! We welcome contributions from the community to help us preserve and share African wisdom.

## Getting Started

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally:
    ```bash
    git clone https://github.com/your-username/Africa-Heritage.git
    cd Africa-Heritage
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    ```
4.  **Set up environment variables**:
    Copy `.env.example` to `.env.local` and fill in the required values.
    ```bash
    cp .env.example .env.local
    ```
5.  **Run the development server**:
    ```bash
    npm run dev
    ```

## Development Workflow

1.  **Create a new branch** for your feature or bug fix:
    ```bash
    git checkout -b feature/your-feature-name
    ```
2.  **Make your changes**.
3.  **Run tests** to ensure everything is working:
    ```bash
    npm test
    ```
4.  **Commit your changes** using conventional commits:
    ```bash
    git commit -m "feat: add new proverb category"
    ```
    - `feat`: New feature
    - `fix`: Bug fix
    - `docs`: Documentation changes
    - `style`: Code style changes (formatting, missing semi colons, etc)
    - `refactor`: Refactoring code without changing functionality
    - `test`: Adding or updating tests
    - `chore`: Maintenance tasks

5.  **Push your branch**:
    ```bash
    git push origin feature/your-feature-name
    ```
6.  **Open a Pull Request** on GitHub.

## Code Style

- We use **TypeScript** for type safety.
- We use **Tailwind CSS** for styling.
- We use **ESLint** and **Prettier** for code formatting.
- Please ensure your code passes linting before submitting a PR:
    ```bash
    npm run lint
    ```

## Testing

- We use **Jest** and **React Testing Library** for testing.
- Please add tests for new features and bug fixes.
- Run tests with `npm test`.

## Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable React components.
- `lib/`: Utility functions, services, and types.
- `public/`: Static assets.
- `scripts/`: Database migration and maintenance scripts.
- `__tests__/`: Unit and integration tests.

## License

This project is licensed under the MIT License.
