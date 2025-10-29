## Git & Teamwork Notes – Create & Push a New Branch

🔧 1. Create and Switch to a New Branch

```bash
git switch -C feature/redesign
```

- Use a clear and descriptive branch name (e.g., feature/, bugfix/, hotfix/).
- Keep branch names consistent across the team.

👀 2. Check Current Branch

```bash
git branch
```

- Shows your current branch.
- Make sure you're not committing directly to `main` or `develop`.

💾 3. Stage and Commit Changes

```bash
git add .
git commit -m "redesign landing page"
```

- Write clear and meaningful commit messages.
- Use present tense (e.g., "update button style", not "updated").

☁️ 4. Push Your Branch to Remote

```bash
git push -u origin feature/redesign
```

- `-u` links the local branch with the remote for easier future pushes.

🔄 5. Keep Your Branch Up-to-date

```bash
git pull origin main
```

- Pull changes from `main` to avoid conflicts later.
- Always pull before pushing or opening a pull request (PR).

🤝 6. Team Collaboration Tips

- Communicate: Let the team know what branch you're working on.
- Pull Requests (PRs): Always create a PR for code review before merging.
- Code Reviews: Give and receive constructive feedback.
- No direct commits to `main`: Use branches and PRs for changes.

---

Notes

- Keep branch names short, descriptive, and consistent.
- Consider adding a branch naming convention in CONTRIBUTING.md for the team.
- Example branch prefixes: `feature/`, `bugfix/`, `hotfix/`, `chore/`.
