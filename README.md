# QAMRAH — Luxury Dry Fruits & Dates E-Commerce Platform

> **A high-end, bespoke e-commerce platform for royal-grade dry fruits and sacred dates, connected to a robust Node.js/Express/MongoDB backend and a dedicated luxury dark green + champagne gold Super CMS Dashboard.**

---

## 🌟 Key Highlights & Architectural Features

1. **Customer-Facing Luxury Storefront:**
   - Visual Identity: Preserved 100% of the QAMRAH brand design (Dark Green `#07130D`, Forest Green `#091A11`, Champagne Gold `#D8B66A`, Serif headings, smooth transitions).
   - Dynamic Pack Design Selector: Customers can pick between *Classic QAMRAH Pack (+₹0)*, *Premium Gold Pack (+₹150)*, *Royal Gift Box (+₹350)*, and *Corporate Gift Pack (+₹500)* directly on product detail and quick view modals, with live price calculation and cart synchronization.
   - Resilient Fallback Architecture: Pages automatically fetch from backend APIs while falling back to curated static defaults if offline, guaranteeing zero downtime or blank screens.
   - One-Click Cash on Delivery (COD) Checkout with automated order numbering (`QMR-YYYYMMDD-XXX`) and WhatsApp fallback notification.

2. **Automated WhatsApp Order Notification:**
   - Target Concierge Number: **`+91 62358 20223`**
   - Dual-Mode Dispatch: Integrates WhatsApp Cloud API when API keys are supplied in `.env`, and generates a formatted `https://wa.me/` direct fallback link containing the customer's name, phone, shipping address, ordered items, chosen pack designs, and total payable amount.
   - Non-blocking: If WhatsApp delivery encounters an issue, the order is safely persisted in MongoDB without failing the checkout.

3. **Super CMS & Admin Concierge Portal (`/admin`):**
   - Theme: Bespoke dark green and champagne gold palette tailored for luxury management.
   - Authentication: JWT authentication with bcrypt-hashed passwords and rate limiting (`express-rate-limit`).
   - Default Concierge Credentials:
     - **Username:** `QAMRAH`
     - **Password:** `AJMAL SAHIR`
   - Real-Time Dashboard: 8 KPI metric cards (Gross Revenue, Total Orders, Average Order Value, Active Products, Low Stock Alerts, etc.) and a Recent Orders table.
   - Order Management: Status lifecycle workflow (`Pending` ➔ `Confirmed` ➔ `Processing` ➔ `Packed` ➔ `Shipped` ➔ `Delivered` ➔ `Cancelled`), Printable Connoisseur Invoice modal, and direct Customer WhatsApp button.
   - Pack Design Management: Add, edit, or toggle pack designs and custom price adjustments.
   - Content Management System (CMS):
     - **Homepage CMS:** 7 editable tabs (Hero slides, Announcement bar, Feature benefits, Bestsellers, Categories, Story preview, Luxury CTA, Newsletter) with prominent **[SAVE CHANGES]** buttons.
     - **Our Story CMS:** Edit narrative, philosophy, 4 pillars, and artisanal stats.
     - **Wholesale CMS & Inbox:** Manage B2B copy, hamper banner, and view incoming corporate enquiries.
     - **Contact CMS & Inbox:** Manage touchpoints (email, phone, flagship address, concierge hours) and view customer messages.
     - **FAQs CMS:** Full CRUD for frequent inquiries.
     - **Media Library:** Asset management with copy-to-clipboard URL functionality.
     - **Global Settings:** Store identity, currency, shipping rates (default ₹49, free threshold ₹999), and admin WhatsApp target.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, Vite, React Router v7, Lucide Icons, Canvas Confetti
- **Backend:** Node.js, Express.js, MongoDB / Mongoose, In-Memory Mongo dev fallback (`mongodb-memory-server`)
- **Security:** Helmet, Express Rate Limiter, CORS, JWT (JSON Web Tokens), Bcrypt.js
- **File Storage:** Multer, Cloudinary integration with local disk fallback

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18 or newer)
- npm

### 2. Installation
Install root dependencies and backend dependencies:
```bash
# In the project root
npm install

# In the backend directory
cd backend
npm install
cd ..
```

### 3. Environment Variables
A sample configuration is available in `backend/.env.example`. The backend automatically loads default development configuration if `.env` is omitted:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=qamrah_luxury_jwt_secret_key_2026_super_cms
ADMIN_USERNAME=QAMRAH
ADMIN_PASSWORD=AJMAL SAHIR
ADMIN_WHATSAPP=+916235820223
DEFAULT_SHIPPING_FEE=49
FREE_SHIPPING_THRESHOLD=999
```

### 4. Database Seeding
To initialize the database with royal default products, categories, pack designs, homepage slides, story pillars, and the master admin account:
```bash
npm run seed
```

### 5. Running the Application

Run the backend and frontend concurrently or in separate terminals:

**Terminal 1 (Backend Server):**
```bash
npm run server
# Runs Express on http://localhost:5000
```

**Terminal 2 (Frontend Dev Server):**
```bash
npm run dev
# Runs Vite on http://localhost:5174
```

---

## 🔐 Admin Concierge Portal

Navigate to:
```
http://localhost:5174/admin/login
```

Log in with:
- **Username:** `QAMRAH`
- **Password:** `AJMAL SAHIR`

---

## 📱 WhatsApp Order Notification Workflow

When a customer confirms their order:
1. The backend stores the order in MongoDB and assigns a distinct Order ID (e.g., `QMR-20260920-406`).
2. The order notification payload is formatted:
   ```text
   🌟 *NEW QAMRAH ORDER* 🌟
   ---------------------------------
   *Order ID:* QMR-20260920-406
   *Customer:* Test Customer
   *Phone:* 9876543210
   *Address:* 123 Heritage Lane, Mumbai, Maharashtra 400001
   *Items:*
   - W-180 Jumbo Cashew (250g, Premium Gold Pack) x1 = ₹749
   ---------------------------------
   *Subtotal:* ₹749
   *Shipping:* ₹49
   *Total Amount:* ₹798
   *Payment Method:* COD
   ```
3. If WhatsApp Cloud API credentials are configured in `.env`, the notification is sent directly to `+91 62358 20223`.
4. The customer and admin are also provided with a direct one-click WhatsApp fallback link to open chat with the pre-filled receipt.

---

## 📁 Repository Structure

```
QAMRAH/
├── backend/
│   ├── config/             # DB & Cloudinary configs
│   ├── controllers/        # Express route controllers (Auth, Products, Orders, CMS, etc.)
│   ├── middleware/         # Auth, rate limiting, file upload, error handling
│   ├── models/             # Mongoose schemas (Product, Order, PackDesign, HomePage, etc.)
│   ├── routes/             # REST API routes
│   ├── services/           # WhatsApp service, DB seed service
│   ├── app.js              # Express app setup
│   ├── server.js           # Server entrypoint
│   └── seed.js             # Standalone seed script
├── src/
│   ├── admin/
│   │   ├── components/     # AdminLayout, AdminHeader, ConfirmModal, SaveToast
│   │   ├── pages/          # Dashboard, ProductsCMS, CategoriesCMS, OrdersCMS, PackDesignCMS, HomeCMS...
│   │   └── admin.css       # Dark green & champagne gold luxury CMS styling
│   ├── components/         # TopBar, Navbar, Hero, ProductCard, CheckoutModal, Footer...
│   ├── context/            # AdminAuthContext, CartContext, WishlistContext, ToastContext...
│   ├── pages/              # Home, Shop, ProductDetails, OurStory, Wholesale, Contact, Cart...
│   ├── services/           # api.js (Axios API client with auth interceptors)
│   ├── App.jsx             # Route definitions & conditional admin layout
│   └── main.jsx            # React root & providers
├── package.json
└── vite.config.js
```

---

## 🛡️ License
All rights reserved © 2026 QAMRAH.
