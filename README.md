# Hotel Kanha Resort And Restaurant — Website

Pure vegetarian resort website with **two separate backend systems**:
- **Table Booking system** (`/api/bookings`)
- **Food Ordering system** (`/api/orders`)

Plus a **Menu system** (`/api/menu`) that both the site and the ordering
page read from, and a password-protected **Admin Panel** (`/admin.html`)
to view and update bookings/orders.

---

## 1. Project structure

```
kanha-fullstack/
├── server.js              → main server file
├── package.json
├── .env.example            → copy to .env and fill in
├── routes/
│   ├── menu.js              → GET /api/menu
│   ├── bookings.js          → table booking system
│   └── orders.js            → food ordering system
├── utils/
│   ├── db.js                → simple JSON-file storage
│   └── adminAuth.js         → admin-key check
├── data/
│   ├── menu.json            → edit this to change dishes/prices
│   ├── bookings.json        → booking records (auto-created)
│   └── orders.json          → order records (auto-created)
└── public/                  → the website itself
    ├── index.html            → Home
    ├── order.html            → Order Food
    ├── booking.html          → Book a Table
    ├── admin.html            → Admin dashboard
    ├── css/style.css
    └── js/
```

## 2. Running it locally

You need [Node.js](https://nodejs.org) version 18 or newer installed.

```bash
cd kanha-fullstack
npm install
cp .env.example .env
```

Open `.env` and set a real `ADMIN_KEY` (this is the password for
`/admin.html`). Then:

```bash
npm start
```

Open **http://localhost:3000** in your browser. The admin panel is at
**http://localhost:3000/admin.html**.

## 3. Editing the menu

Open `data/menu.json`. Each dish looks like this:

```json
{ "id": "f1", "category": "The Tandoori Affair", "type": "food",
  "name": "Tandoori Paneer Tikka", "price": 240,
  "desc": "Char-grilled cottage cheese, resort-style marinade.",
  "photo": "https://..." }
```

Add, remove, or edit items freely — the website reads this file live,
no restart needed. `"photo": null` shows a "Photo coming soon" tag
instead of an image.

## 4. How the two backend systems work

**Booking system** — a visitor submits the form on `booking.html`,
which is saved to `data/bookings.json` with status `pending`. Staff
open the admin panel, call the guest to confirm, and change the status
to `confirmed` (or `cancelled`).

**Ordering system** — a visitor adds items to the cart on `order.html`
and checks out. The **server** re-looks-up every item's real price from
`data/menu.json` before saving the order — so a browser can never send
a fake discounted price. Orders start as `placed`; staff update the
status as the kitchen/delivery progresses.

Both systems are completely independent — they have separate routes,
separate storage files, and separate status flows.

## 5. Deploying it live (free options)

This is a normal Node.js app, so any Node hosting works. Two easy free
options:

**Render.com** (recommended, simplest):
1. Push this project to a GitHub repository.
2. On [render.com](https://render.com), create a **New Web Service**,
   connect the repo.
3. Build command: `npm install` — Start command: `npm start`.
4. Under **Environment**, add `ADMIN_KEY` with your real password.
5. Deploy. Render gives you a live `https://...onrender.com` URL.

**Railway.app** works the same way — connect the repo, set the
`ADMIN_KEY` environment variable, deploy.

> ⚠️ Important: `data/*.json` files reset on some free hosting plans
> when the app restarts or redeploys, because the free tier's disk
> isn't permanent. For a small resort this is usually fine to start
> with, but if bookings/orders need to be permanently safe, the next
> step is swapping `utils/db.js` for a real database (e.g. free tiers
> of MongoDB Atlas or Supabase/Postgres) — the routes files don't need
> to change much since they only call `readData`/`writeData`.

## 6. Security notes for handover

- Change `ADMIN_KEY` in `.env` before going live — do not use the
  example value.
- Never commit your real `.env` file (it's already in `.gitignore`).
- The admin panel uses a single shared password. If the resort wants
  separate logins per staff member later, that needs a proper
  authentication system (sessions + hashed passwords) added to
  `utils/adminAuth.js`.

## 7. What's still using placeholder content

- Gallery and hero photos are free stock photos (Pexels), not the
  resort's real photos — swap the `<img src="...">` URLs in
  `public/index.html`, `order.html`, and `booking.html` once real
  photos are available.
- Contact details, address and map in the footer are placeholders —
  update them in each page's `<footer>` section.
