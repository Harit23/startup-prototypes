# Startup Prototypes · IIM Bangalore Business Plan Challenge

Live, no-login prototypes by **Harit Shah (Harit23)**.

**Live demo:** https://harit23.github.io/startup-prototypes/

| Prototype | What it shows | Open |
|---|---|---|
| **GroupDrive** | Group buying of cars, bikes, trucks and buses. The admin starts a group deal; dealers bid live from their phones; the lowest price wins. | `groupdrive/` |
| **SiteCrew** | "Amazon for builders": sellers list everything a construction site needs (cement, bricks, steel, electricals, trucks, skilled crews) and builders order to their site. | `sitecrew/` |

## How the live demo works
- Open the home page and pick a role (Admin / Dealer, Builder / Seller). No login.
- All devices share one live database (Supabase), so a bid placed on a phone shows instantly on the laptop.
- If the internet or database is down, add `?local=1` to the URL for an offline demo mode (works across tabs on one device).

## Tech
Plain HTML, CSS and JavaScript · Supabase (Postgres + realtime) · Hosted on GitHub Pages.

> Prototype for a student pitch. Prices are approximate and for demonstration only.
