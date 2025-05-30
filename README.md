# Company Dashboard 

A full-stack web application that allows a company to manage its employees and their vacations. Includes authentication, admin dashboard, user profile management with image upload, and database-backed persistence.

---

## Technologies Used

- **Frontend and Backend:** Next.js, React, TypeScript
- **Authentication:** NextAuth
- **Database:** MySQL 8 + Prisma ORM
- **Styling:** TailwindCSS
- **Image upload server:** Express, Multer
- **Dev environment:** Docker

---

## Requirements

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [Docker](https://www.docker.com/)
- [Git](https://git-scm.com/)

---

## Setup & Usage Instructions

### 1. Clone the repository and install dependencies

```bash
git clone https://github.com/your-username/company-dashboard.git
cd company-dashboard
npm install
cd profile_images_server
npm install
cd ..
```

### 2. Create the environment variable file in the root directory called .env
```bash
MYSQL_ROOT_PASSWORD=admin123
MYSQL_DATABASE=companyDashboard_db
MYSQL_PORT=3308

NEXTAUTH_SECRET=HVJgxI1pocV3guNplN4iFFiPqYXf6eT7SvuP16Jeunk

DATABASE_URL="mysql://root:admin123@127.0.0.1:3308/companyDashboard_db"
NEXT_PUBLIC_IMAGE_SERVER_URL=http://localhost:5001
```
>  **Important:** Make sure the following ports are available:
> - `3308` → MySQL container
> - `5001` → Image upload server
>
> If you change either port (e.g. to `3309` or `5002`), you must:
> - Update `.env`
> - Update `docker-compose.yml`
> - If changing image upload port: also update `profile_images_server/app.ts`, `Dockerfile` (Here both 5001 must be changed to the new port), and `next.config.ts`
> - Then run:
>
> ```bash
> docker-compose down -v
> docker-compose up --build
> ```


### 3. Start Docker containers
```bash
docker-compose up --build
```

## Demo Users (created by `seed.ts`)

The application seeds the database with the following test accounts:

| Email                  | Password   | Role  |
|------------------------|------------|-------|
| `admin@empresa.com`    | `admin123` | ADMIN |
| `user1@empresa.com`    | `user123`  | USER  |
| `user2@empresa.com`    | `user123`  | USER  |
| `user3@empresa.com`    | `user123`  | USER  |

These are created automatically when you run the database seed step:

### 4. Initialize and seed the database
```bash
npx prisma migrate dev --name init
npx prisma db seed
```
### 5. Start the web application
```bash
npm run dev
```

