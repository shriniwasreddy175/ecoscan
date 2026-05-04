Environment setup and using .env for ecoscan_backend
--------------------------------------------------

1) Copy the sample file:

   - Open `ecoscan_backend/.env.sample` and copy it to `ecoscan_backend/.env`.

2) Set secrets locally (examples):

   - PowerShell (temporary for current session):

     $env:DB_PASSWORD = 'your-db-password'
     .\mvnw.cmd -DskipTests package

   - cmd.exe (temporary for current session):

     set DB_PASSWORD=your-db-password
     mvnw.cmd -DskipTests package

   - Linux / macOS (temporary for current shell):

     export DB_PASSWORD='your-db-password'
     ./mvnw -DskipTests package

3) IntelliJ Run Configuration:

   - Open Run > Edit Configurations > Your Spring Boot run configuration.
   - In "Environment variables" add `DB_PASSWORD=...;DB_USER=...` etc.

4) Why this change?

   - Keeps secrets out of source control. The app reads `application.properties`
     which now references environment variables with safe defaults.

5) After adding `.env` locally

   - Do NOT commit it. The repository `.gitignore` excludes `ecoscan_backend/.env`.

If you want, I can also add a small startup script that loads `.env` into the
environment before running Maven, or implement JWT-based auth next.