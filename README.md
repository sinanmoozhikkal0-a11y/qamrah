# QAMRAH — Luxury Dry Fruits & Dates E-Commerce Platform

> **A high-end, bespoke e-commerce platform for royal-grade dry fruits and sacred dates, built as a fast, pure frontend Single Page Application (Vite + React 19 + React Router v7) with seamless WhatsApp order concierge.**

---

## 🌟 Key Highlights & Architectural Features

1. **Customer-Facing Luxury Storefront:**
   - **Visual Identity:** 100% bespoke QAMRAH brand design (Dark Green `#07130D`, Forest Green `#091A11`, Champagne Gold `#D8B66A`, Serif headings, smooth transitions).
   - **Dynamic Pack Design Selector:** Customers can choose between *Classic QAMRAH Pack (+₹0)*, *Premium Gold Pack (+₹150)*, *Royal Gift Box (+₹350)*, and *Corporate Gift Pack (+₹500)* on product detail and quick view modals, with live price calculation and cart synchronization.
   - **Pure Frontend Architecture:** Completely serverless and backend-independent. All product catalogs, categories, pack designs, and editorial content load instantly in the browser.
   - **One-Click WhatsApp Checkout:** Automated order numbering (`QMR-XXXXXX`) with luxury celebratory confetti, saving orders locally and generating direct WhatsApp click-to-chat links formatted for instant concierge order processing.

2. **Automated WhatsApp Order Concierge:**
   - **Target Concierge Number:** **`+91 62358 20223`**
   - **Instant Direct Messaging:** Generates a pre-filled `https://wa.me/` direct link containing the customer's name, phone, shipping address, ordered items, chosen pack designs, and total payable amount.

3. **Super CMS & Admin Concierge Portal (`/admin`):**
   - **Theme:** Bespoke dark green and champagne gold palette tailored for luxury management.
   - **Client-Side Data Storage:** Content and configuration persist safely in browser storage (`localStorage`), allowing full offline previews and immediate client-side edits.
   - **Default Concierge Credentials:**
     - **Username:** `QAMRAH`
     - **Password:** `AJMAL SAHIR`
   - **Real-Time Dashboard:** KPI metric cards (Gross Revenue, Total Orders, Average Order Value, Active Products, Low Stock Alerts) and a Recent Orders table.
   - **Order Management:** Status lifecycle workflow (`Pending` ➔ `Confirmed` ➔ `Processing` ➔ `Packed` ➔ `Shipped` ➔ `Delivered` ➔ `Cancelled`), Printable Connoisseur Invoice modal, and direct Customer WhatsApp button.
   - **Pack Design Management:** Add, edit, or toggle pack designs and custom price adjustments.
   - **Content Management System (CMS):**
     - **Homepage CMS:** Editable Hero slides, Announcement bar, Feature benefits, Bestsellers, Categories, Story preview, Luxury CTA, Newsletter.
     - **Our Story CMS:** Edit narrative, philosophy, 4 pillars, and artisanal stats.
     - **Wholesale CMS & Inbox:** Manage B2B copy, hamper banner, and view incoming corporate enquiries.
     - **Contact CMS & Inbox:** Manage touchpoints (email, phone, flagship address, concierge hours) and customer messages.
     - **FAQs CMS:** Full CRUD for frequent inquiries.
     - **Media Library:** Asset management with image picker preview.
     - **Global Settings:** Store identity, currency, shipping rates (default ₹49, free threshold ₹999), and admin WhatsApp target.

---

## 🛠️ Technology Stack

- **Framework:** React 19 + Vite 8.2
- **Routing:** React Router v7
- **Icons & Effects:** Lucide React, Canvas Confetti
- **Styling:** Vanilla CSS & CSS Design System (no heavy utility frameworks required)
- **Deployment:** Zero-backend static hosting compatible (Vercel, Netlify, Cloudflare Pages, GitHub Pages, AWS S3)

---

## 🚀 Quick Start Guide

### 1. Installation
```bash
npm install
```

### 2. Development Server
```bash
npm run dev
```
Open [http://localhost:5174](http://localhost:5174) in your browser.

### 3. Production Build
```bash
npm run build
```
The optimized static build will be generated in `dist/`.

### 4. Code Quality & Linting
```bash
npm run lint
```
