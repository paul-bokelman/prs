Models

- task model
  - title
  - description
  - status
  - priority
  - due date
  - points
- user model
  - name
  - pin
  - tasks
  - points

Controllers

- task controller

  - create task
  - update task
  - delete task
  - get task
  - get all tasks

  <!-- route to cycle through tasks (increment [take 1, skip prev]) -->
  <!-- LCD will only show title and maybe priority/points -->

- user controller

  - create user
  - update user
  - delete user
  - get user
  - all users

- authorization middleware (check for pin)

Flow?

- Connect to your account with your pin or make a new account
- Create task through terminal interface (use pin as authorization)
- Connect with PIN on physical system
- Cycle through task and complete them by hitting button

NOTES:

- Pin should auto generated in order to avoid pin collisions

might need more interface items...

## WEB INTERFACE LATER... (terminal for now for simplicity)
