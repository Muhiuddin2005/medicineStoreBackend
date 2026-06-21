# MediStore 💊 — Backend

> **"API and Database Management Engine for MediStore"**
> 
> 🌐 **Live Frontend Link:** [https://medistore-frontend-plum.vercel.app/](https://medistore-frontend-plum.vercel.app/)

MediStore Backend is a modern, modular, and high-performance server application built using **Express**, **Prisma ORM**, **PostgreSQL**, and **TypeScript**. It serves as the core API service for the MediStore platform, handling customer purchasing flows, secure seller catalogs, and database-level validation, authorization, and operations.

---

## 🚀 Tech Stack

| Technology | Purpose | Description |
| :--- | :--- | :--- |
| **Express** | Core Framework | Lightweight, modular server routing, middleware pipeline, and JSON API handling. |
| **Prisma ORM** | Database Toolkit | Database modeling, schema migrations, and type-safe database queries. |
| **PostgreSQL** | Relational Database | Persistent, structured, and transactional relational data storage hosted via Neon. |
| **JSON Web Tokens (JWT) & Bcrypt** | Security | Stateful user session validation, password hashing, and role-based access. |
| **Cloudinary & Multer** | Image Storage | Direct upload, processing, and management of medicine images. |
| **Zod** | Schema Validation | Type-safe request body validation middleware. |
| **TypeScript & TSX** | Development Environment | Static type checking and real-time watching using TypeScript execution engines. |

---

## 🌟 Key Features

### 🔐 Security & Identity Control
* **Role-Based Guards:** Multi-tier authorization middleware enforcing strict endpoint security rules based on user roles (`CUSTOMER`, `SELLER`, `ADMIN`).
* **Secured Password Hashing:** Secure credential salting and hashing utilizing Bcrypt.
* **Token Authentication:** Secure JWT-based tokens for user authentication.

### 📦 Inventory & Shop Management
* **Modular CRUD Endpoints:** Dedicated route structures handling medicines, categories, inventory stock, and manufacturer info.
* **Direct Image Uploads:** Native integration with Cloudinary via Multer storage engine for optimized product listing creation.
* **Dynamic Categorization:** Structured relationships where categories dynamically track listed items.

### 🛒 Ordering Transaction Engine
* **Inventory Control & Stock Checks:** Transaction-safe order creation preventing race conditions and keeping stock levels updated.
* **State Updates:** Sequential flow track updates (`PLACED` ➔ `PROCESSING` ➔ `SHIPPED` ➔ `DELIVERED`).
* **Purchase Reviews:** Verification checks guaranteeing only customers who bought a medicine can leave reviews.

### 🛡️ Administrative Moderation
* **User Ban/Unban System:** Live account status updates immediately locking out banned profiles.
* **Platform Operations Audit:** Full access to order files, category records, and seller catalogs.

---

## 📁 Project Structure

```
backend/
├── api/                      # Vercel serverless entry point
│   └── index.ts              # Entry handler for serverless requests
├── prisma/                   # Database schemas and migration configurations
│   ├── migrations/           # Database schema migrations
│   └── schema.prisma         # Relational database models and structural schema
├── src/
│   ├── helpers/              # Helper utility methods
│   ├── lib/                  # Library initializations
│   │   └── prisma.ts         # Singleton Prisma client instance configuration
│   ├── middlewares/          # Express route middlewares
│   │   ├── auth.ts           # Token verification and role validation guards
│   │   ├── globalErrorHandler.ts # App-wide centralized error handler
│   │   ├── notFound.ts       # 404 Route middleware
│   │   ├── upload.ts         # Multer and Cloudinary upload configurations
│   │   └── validateRequest.ts # Zod-based request validation schema runner
│   ├── modules/              # Modular API modules
│   │   ├── admin/            # Administrative dashboard and user status controllers
│   │   ├── auth/             # Session tokens, login, sign-up
│   │   ├── category/         # Medicine category controllers
│   │   ├── medicine/         # Medicine listings, categories, and inventory
│   │   ├── order/            # Ordering checkout pipelines and tracking status controllers
│   │   ├── review/           # Customer rating creation and retrieval controllers
│   │   └── seller/           # Seller statistics and catalog controls
│   ├── scripts/              # Setup and database seeding scripts
│   │   └── seedAdmin.ts      # Bootstrap script for seeding default ADMIN user
│   ├── app.ts                # Express application configuration and route registrations
│   └── server.ts             # Local development server boot configuration
├── tsconfig.json             # TypeScript server rules configuration
├── vercel.json               # Vercel deployment handler routing configurations
└── package.json              # Backend dependencies, engines and run scripts
```

---

## 🔒 Route Protection & Role Authorization

Endpoint security is enforced dynamically via role validation middleware located in [auth.ts](file:///c:/Programming/PH%20L2/medistore/backend/src/middlewares/auth.ts):
- **JWT Middleware Verification:** Decrypts cookies or authentication header authorization values.
- **Roles Evaluated:** Verifies user attributes matching strict requirements. `ADMIN` has access to all routes, `SELLER` access is restricted to inventory operations, and `CUSTOMER` to orders/reviews.
- **Unauthorized Blocking:** Instantly throws a standard error caught by the [globalErrorHandler.ts](file:///c:/Programming/PH%20L2/medistore/backend/src/middlewares/globalErrorHandler.ts) payload emitter.

---

## ⚙️ Configuration & Environment Variables

Create a `.env` file in the root of the `backend` folder:

```env
# Relational DB Connection URI
DATABASE_URL="postgresql://username:password@hostname:port/dbname?sslmode=require"

# Local Port Configuration
PORT=3000

# Client Application URL for CORS
APP_URL="http://localhost:3001"

# Cloudinary Cloud Storage Credentials
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

---

## 🛠️ Installation & Local Setup

To run this application locally, follow these steps:

1. **Clone the repository and navigate into the folder:**
   ```bash
   git clone https://github.com/Muhiuddin2005/medicineStore.git
   cd medicineStore/backend
   ```

2. **Install all required dependencies:**
   ```bash
   npm install
   ```

3. **Prisma Client Generation:**
   ```bash
   npx prisma generate
   ```

4. **Sync Schema Database (Optional):**
   ```bash
   npx prisma db push
   ```

5. **Start the Development Watch Server:**
   ```bash
   npm run dev
   ```
   *The Express server will boot up by default on **http://localhost:3000**.*

6. **Seed default Admin User (Optional):**
   ```bash
   npm run seed:admin
   ```
   *Default admin credentials will be bootstrapped (`admin@skillbridge.com` / `admin123`).*
