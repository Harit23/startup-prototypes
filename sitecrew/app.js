/* SiteCrew data layer + helpers. Two backends behind one API:
   1) Supabase (default)  2) Local mode (localStorage) when ?local=1 or Supabase fails/times out (3 s). */
(function () {
  'use strict';

  /* ---------- categories (A-Z) ---------- */
  var CATS = {
    'Bricks & Blocks': '🧱', 'Cement': '🏗️', 'Electrical': '⚡', 'Machinery & Trucks': '🚚',
    'Paint': '🎨', 'Plumbing': '🚰', 'Sand & Aggregates': '⛰️', 'Skilled Services': '👷',
    'Steel & TMT': '🔩', 'Tiles & Flooring': '🟫', 'Wood & Plywood': '🪵'
  };

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  var nf = new Intl.NumberFormat('en-IN');
  function inr(n) { return '₹' + nf.format(Math.round(Number(n) || 0)); }
  function uid() {
    return (window.crypto && crypto.randomUUID) ? crypto.randomUUID() :
      'id-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }
  function toast(msg, good) {
    var t = document.createElement('div');
    t.className = 'toast' + (good ? ' good' : '');
    t.setAttribute('role', 'status');
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 3200);
  }
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function lsSet(k, v) { localStorage.setItem(k, JSON.stringify(v)); }

  /* ---------- seed data (used in local mode) ---------- */
  var SEED_SELLERS = [
    ['Shree Ambica Cement Depot', 'Cement depot', 'Naroda', '98250 10001'],
    ['Gujarat Bricks & Blocks', 'Brick maker', 'Changodar', '98250 10002'],
    ['Patel Steel Traders', 'Steel trader', 'Odhav', '98250 10003'],
    ['Sabarmati Sand Suppliers', 'Sand & aggregates', 'Sabarmati', '98250 10004'],
    ['Volt Electricals', 'Electrician / wire fitter', 'Satellite', '98250 10005'],
    ['AquaFlow Plumbing', 'Plumber', 'Bopal', '98250 10006'],
    ['Tile Galaxy', 'Tile shop', 'SG Highway', '98250 10007'],
    ['ColorHub Paints', 'Paint dealer', 'Maninagar', '98250 10008'],
    ['Woodline Plywood', 'Plywood & doors', 'Vatva', '98250 10009'],
    ['HeavyMove Rentals', 'Truck / JCB rental', 'Sarkhej', '98250 10010'],
    ['SkillPro Crew', 'Skilled crews', 'Vastrapur', '98250 10011']
  ].map(function (s, i) { return { id: 'seed-seller-' + (i + 1), name: s[0], trade: s[1], area: s[2], phone: s[3], created_at: new Date(2026, 0, 1, 0, i).toISOString() }; });

  // [seller index, category, name, unit, price, stock, description]
  var SEED_PRODUCTS = [
    [0, 'Cement', 'OPC 53 Grade Cement', 'bag', 390, 800, '50 kg bag, high early strength. Free unloading above 100 bags.'],
    [0, 'Cement', 'PPC Cement', 'bag', 360, 1200, '50 kg bag, good for plaster and masonry.'],
    [1, 'Bricks & Blocks', 'Red Clay Bricks', '1000 pcs', 8500, 40, 'First-class burnt bricks, uniform size.'],
    [1, 'Bricks & Blocks', 'AAC Blocks', 'cubic metre', 3800, 120, 'Lightweight autoclaved blocks, 600x200x200 mm.'],
    [2, 'Steel & TMT', 'TMT Bar Fe 550D 12 mm', 'tonne', 58000, 25, 'ISI marked earthquake-resistant TMT.'],
    [2, 'Steel & TMT', 'Binding Wire', '25 kg', 1900, 60, 'Annealed GI binding wire, 18 gauge.'],
    [3, 'Sand & Aggregates', 'River Sand', 'brass', 6500, 50, 'Washed river sand, delivered by tipper.'],
    [3, 'Sand & Aggregates', '20 mm Aggregate', 'brass', 4200, 50, 'Crushed stone aggregate for RCC.'],
    [4, 'Electrical', 'FR Copper Wire 2.5 sq mm', '90 m coil', 2400, 150, 'Flame-retardant house wire, ISI.'],
    [4, 'Electrical', 'Modular Switch Board Set', 'set', 650, 200, 'Modular switch and socket plate set.'],
    [4, 'Electrical', 'LED Panel 18W', 'piece', 450, 300, 'Recessed round LED panel, cool white.'],
    [5, 'Plumbing', 'CPVC Pipe 1 inch', '3 m', 520, 400, 'Hot and cold water CPVC pipe.'],
    [5, 'Plumbing', 'Western Toilet Set', 'set', 7500, 30, 'Wall-hung WC with seat cover and cistern.'],
    [6, 'Tiles & Flooring', 'Vitrified Tile 600×600', 'box', 780, 500, 'Glossy double charge, 4 tiles per box.'],
    [6, 'Tiles & Flooring', 'Anti-skid Tile', 'box', 620, 350, 'Matte finish for bathrooms and balconies.'],
    [7, 'Paint', 'Exterior Emulsion', '20 L', 5200, 40, 'Weather-proof exterior paint, 10-year warranty.'],
    [7, 'Paint', 'Waterproofing', '20 kg', 3400, 35, 'Polymer waterproofing coat for terrace and bath.'],
    [8, 'Wood & Plywood', 'BWP Plywood 18 mm', 'sheet', 2900, 90, 'Boiling water proof, 8x4 ft.'],
    [8, 'Wood & Plywood', 'Flush Door', 'piece', 3600, 45, 'Solid core flush door with laminate.'],
    [9, 'Machinery & Trucks', 'JCB 3DX on rent', 'hour', 1200, 5, 'JCB with operator, minimum 4 hours.'],
    [9, 'Machinery & Trucks', 'Tipper Truck (Ashok Leyland 4825)', 'trip', 4500, 8, 'Tipper for sand, aggregate and debris.'],
    [9, 'Machinery & Trucks', 'Concrete Mixer', 'day', 1800, 10, 'Diesel concrete mixer with hopper.'],
    [10, 'Skilled Services', 'Electrician wiring a 2BHK', 'flat', 18000, 6, 'Concealed wiring, labour only, 5-day job.'],
    [10, 'Skilled Services', 'Plumber bathroom fitting', 'bathroom', 6500, 10, 'Fitting of all sanitary and CP fixtures.'],
    [10, 'Skilled Services', 'Carpenter modular kitchen', 'kitchen', 25000, 4, 'Modular kitchen carpentry, 2-week job.']
  ].map(function (p, i) {
    var s = SEED_SELLERS[p[0]];
    return { id: 'seed-prod-' + (i + 1), seller_id: s.id, seller_name: s.name, category: p[1], name: p[2], unit: p[3], price: p[4], stock: p[5], description: p[6], created_at: new Date(2026, 0, 2, 0, i).toISOString() };
  });

  /* ---------- Local backend (localStorage, synced across tabs) ---------- */
  var LKEY = 'sc_local_db';
  var bc = null;
  try { bc = new BroadcastChannel('sitecrew'); } catch (e) { /* older browsers */ }
  function lload() {
    var db = lsGet(LKEY, null);
    if (!db) { db = { sellers: SEED_SELLERS, products: SEED_PRODUCTS, orders: [] }; lsSet(LKEY, db); }
    return db;
  }
  function lsave(db) { lsSet(LKEY, db); if (bc) bc.postMessage('changed'); notify(); }
  var Local = {
    name: 'local',
    sellers: async function () { return lload().sellers; },
    products: async function () { return lload().products; },
    orders: async function () { return lload().orders; },
    addSeller: async function (s) { var db = lload(); var r = Object.assign({ id: uid(), created_at: new Date().toISOString() }, s); db.sellers.push(r); lsave(db); return r; },
    addProduct: async function (p) { var db = lload(); var r = Object.assign({ id: uid(), created_at: new Date().toISOString() }, p); db.products.push(r); lsave(db); return r; },
    updateProduct: async function (id, patch) { var db = lload(); db.products.forEach(function (p) { if (p.id === id) Object.assign(p, patch); }); lsave(db); },
    deleteProduct: async function (id) { var db = lload(); db.products = db.products.filter(function (p) { return p.id !== id; }); lsave(db); },
    insertOrders: async function (rows) {
      var db = lload(); var now = Date.now();
      rows.forEach(function (o, i) { db.orders.push(Object.assign({ id: uid(), status: 'placed', created_at: new Date(now + i).toISOString() }, o)); });
      lsave(db);
    },
    updateOrder: async function (id, patch) { var db = lload(); db.orders.forEach(function (o) { if (o.id === id) Object.assign(o, patch); }); lsave(db); }
  };

  /* ---------- Supabase backend ---------- */
  var client = null;
  function chk(res) { if (res.error) throw res.error; return res.data; }
  var Remote = {
    name: 'supabase',
    sellers: async function () { return chk(await client.from('sc_sellers').select('*').order('created_at')); },
    products: async function () { return chk(await client.from('sc_products').select('*').order('created_at')); },
    orders: async function () { return chk(await client.from('sc_orders').select('*').order('created_at')); },
    addSeller: async function (s) { return chk(await client.from('sc_sellers').insert(s).select().single()); },
    addProduct: async function (p) { return chk(await client.from('sc_products').insert(p).select().single()); },
    updateProduct: async function (id, patch) { chk(await client.from('sc_products').update(patch).eq('id', id)); },
    deleteProduct: async function (id) { chk(await client.from('sc_products').delete().eq('id', id)); },
    insertOrders: async function (rows) { chk(await client.from('sc_orders').insert(rows)); },
    updateOrder: async function (id, patch) { chk(await client.from('sc_orders').update(patch).eq('id', id)); }
  };

  /* ---------- change notification (realtime + poll + cross-tab) ---------- */
  var listeners = [], timer = null;
  function notify() {
    clearTimeout(timer);
    timer = setTimeout(function () { listeners.forEach(function (f) { try { f(); } catch (e) { console.error(e); } }); }, 60);
  }

  var SC = { CATS: CATS, esc: esc, inr: inr, toast: toast, lsGet: lsGet, lsSet: lsSet, mode: 'local' };
  var be = Local;
  ['sellers', 'products', 'orders', 'addSeller', 'addProduct', 'updateProduct', 'deleteProduct', 'insertOrders', 'updateOrder'].forEach(function (m) {
    SC[m] = function () { return be[m].apply(be, arguments); };
  });
  SC.onChange = function (f) { listeners.push(f); };
  // strip a leading "Site:" so we never show "Site: Site: ..."
  SC.cleanSite = function (s) { return String(s == null ? '' : s).replace(/^\s*site\s*:\s*/i, '').trim(); };
  SC.emoji = function (cat) { return CATS[cat] || '📦'; };

  function paintBadge() {
    var el = document.getElementById('modeBadge');
    if (!el) return;
    var live = be === Remote;
    el.textContent = live ? '● Live database' : '● Offline demo mode';
    el.className = 'badge ' + (live ? 'live' : 'off');
  }

  /* init(): choose backend, paint badge, start sync. Resolves when ready. */
  SC.init = async function () {
    var forceLocal = /[?&]local=1/.test(location.search);
    if (!forceLocal && window.supabase && window.SB_URL) {
      try {
        client = supabase.createClient(window.SB_URL, window.SB_KEY);
        // first request must succeed within 3 s, otherwise fall back to local mode
        var probe = client.from('sc_sellers').select('id').limit(1);
        var res = await Promise.race([probe, new Promise(function (_, rej) { setTimeout(function () { rej(new Error('timeout')); }, 3000); })]);
        if (res.error) throw res.error;
        be = Remote;
        client.channel('sc-live').on('postgres_changes', { event: '*', schema: 'public', table: 'sc_orders' }, notify)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'sc_products' }, notify).subscribe();
      } catch (e) { be = Local; client = null; }
    }
    SC.mode = be.name;
    if (be === Local) {
      lload();
      if (bc) bc.onmessage = notify;
      window.addEventListener('storage', function (ev) { if (ev.key === LKEY) notify(); });
    }
    paintBadge();
    setInterval(notify, 4000); // polling fallback
  };

  window.SC = SC;
})();
