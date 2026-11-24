/* GroupDrive prototype - shared data layer + helpers.
   Two backends behind one API: Supabase (default) and Local (localStorage). */
(function () {
  'use strict';
  const GD = (window.GD = {});
  const qs = new URLSearchParams(location.search);

  // ---------- Seed vehicles (used by local mode) ----------
  const V = (category, brand, model, price) => ({ category, brand, model, price });
  const SEED = [
    V('Car','BMW','M340i xDrive',7640000), V('Car','Mercedes-Benz','C 200',6000000),
    V('Car','Mercedes-Benz','GLC 220d',7600000), V('Car','Audi','Q3',4400000),
    V('Car','Toyota','Innova Hycross',2000000), V('Car','Mahindra','XUV700',1900000),
    V('Car','Hyundai','Creta',1500000), V('Car','Kia','Seltos',1400000),
    V('Car','Tata','Nexon EV',1500000), V('Car','Maruti Suzuki','Swift',700000),
        V('Bike','KTM','250 Duke',239000), V('Bike','Bajaj','Pulsar N250',155000),
    V('Bike','KTM','RC 390',318000), V('Bike','KTM','RC 200',217000), V('Bike','Yamaha','R3',465000),
    V('Bike','Bajaj','Pulsar RS200',185000), V('Bike','TVS','Apache RR 310',275000), V('Bike','Suzuki','Gixxer SF 250',200000),
    V('Bike','Kawasaki','Ninja 300',343000), V('Bike','Kawasaki','Ninja 650',727000), V('Bike','Honda','CBR 650R',960000),
    V('Bike','Royal Enfield','Continental GT 650',350000), V('Bike','Triumph','Speed 400',240000), V('Bike','Yamaha','MT-15 V2',170000),
V('Bike','Royal Enfield','Classic 350',200000), V('Bike','Royal Enfield','Himalayan 450',290000),
    V('Bike','KTM','390 Duke',320000), V('Bike','Bajaj','Pulsar NS200',150000),
    V('Bike','TVS','Apache RTR 160 4V',125000), V('Scooter','Honda','Activa 6G',90000), V('Scooter','Ola Electric','S1 Pro',135000),
    V('Truck','Ashok Leyland','Dost+',800000), V('Truck','Ashok Leyland','Ecomet 1615',2800000),
    V('Truck','Ashok Leyland','4825 Tipper',4500000), V('Truck','Tata','Ace Gold',550000),
    V('Truck','Tata','Signa 5530.S',4900000), V('Truck','Eicher','Pro 2049',1000000),
    V('Truck','BharatBenz','1917R',3500000), V('Truck','Mahindra','Blazo X 28',3800000),
    V('Bus','Ashok Leyland','Viking',3300000), V('Bus','Ashok Leyland','Falcon',2800000),
    V('Bus','Tata','Starbus',3000000), V('Bus','Eicher','Skyline Pro',2800000),
    V('Bus','Force','Traveller',1800000), V('Bus','Volvo','9600',20000000),
    V('Car','Tata','Punch',700000), V('Car','Tata','Harrier',2200000), V('Car','Maruti Suzuki','Baleno',800000),
    V('Car','Maruti Suzuki','Dzire',850000), V('Car','Maruti Suzuki','Brezza',1150000), V('Car','Maruti Suzuki','Ertiga',1150000),
    V('Car','Maruti Suzuki','Grand Vitara',1700000), V('Car','Hyundai','i20',900000), V('Car','Hyundai','Venue',1150000),
    V('Car','Hyundai','Verna',1500000), V('Car','Mahindra','Thar Roxx',1900000), V('Car','Mahindra','Scorpio-N',2100000),
    V('Car','Mahindra','XUV 3XO',1200000), V('Car','Toyota','Fortuner',4300000), V('Car','Toyota','Innova Crysta',2400000),
    V('Car','Kia','Sonet',1200000), V('Car','Kia','Carens',1600000), V('Car','Honda','City',1400000),
    V('Car','Honda','Elevate',1500000), V('Car','MG','Windsor EV',1500000), V('Car','MG','Hector',2000000),
    V('Car','Skoda','Kushaq',1500000), V('Car','Volkswagen','Virtus',1600000), V('Car','Mercedes-Benz','GLA 200',5200000),
    V('Car','Mercedes-Benz','E 200',7800000), V('Car','Audi','A4',4900000), V('Car','BMW','X5 xDrive40i',10500000),
    V('Car','Volvo','XC60',7000000),
    V('Bike','Royal Enfield','Hunter 350',170000), V('Scooter','TVS','Jupiter 110',85000), V('Scooter','Suzuki','Access 125',90000), V('Scooter','Ather','450X',160000),
    V('Scooter','TVS','iQube',120000), V('Scooter','Bajaj','Chetak',130000),
    V('Three-wheeler','Bajaj','RE Auto (CNG)',300000), V('Three-wheeler','Piaggio','Ape City',290000), V('Three-wheeler','Mahindra','Treo (EV)',350000),
    V('Tractor','Mahindra','575 DI',800000), V('Tractor','Swaraj','744 FE',750000), V('Tractor','Sonalika','DI 745',720000),
    V('Truck','Tata','Intra V30 (pickup)',850000), V('Truck','Mahindra','Bolero Pik-Up',950000), V('Truck','Ashok Leyland','Bada Dost',950000)
  ];

  // ---------- Helpers ----------
  const inr = new Intl.NumberFormat('en-IN');
  GD.fmt = (n) => '₹' + inr.format(Math.round(Number(n) || 0));
  // Short form: Rs 76.4 lakh / Rs 1.5 cr
  GD.short = (n) => {
    n = Number(n) || 0;
    const t = (x) => String(+x.toFixed(2));
    if (n >= 1e7) return '₹' + t(n / 1e7) + ' cr';
    if (n >= 1e5) return '₹' + t(n / 1e5) + ' lakh';
    return GD.fmt(n);
  };
  // Discount limiter: no deal may drop a vehicle's price by more than Rs 10 lakh,
  // and never by more than 20% of the ticket value (so cheaper vehicles stay sensible).
  GD.MAX_DISCOUNT = 1000000; GD.MAX_DISCOUNT_PCT = 0.20;
  GD.maxDiscount = (base) => Math.min(GD.MAX_DISCOUNT, Math.round(Number(base) * GD.MAX_DISCOUNT_PCT));
  GD.minBid = (base) => Math.max(1, Number(base) - GD.maxDiscount(base));
  GD.esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  GD.uuid = () => (crypto.randomUUID ? crypto.randomUUID() :
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); }));
  GD.countdown = (endsAt) => {
    if (!endsAt) return 'No timer';
    const s = Math.max(0, Math.floor((new Date(endsAt) - Date.now()) / 1000));
    return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  };
  GD.toast = (msg, kind) => {
    let box = document.getElementById('toasts');
    if (!box) { box = document.createElement('div'); box.id = 'toasts'; document.body.appendChild(box); }
    const el = document.createElement('div');
    el.className = 'toast ' + (kind || '');
    el.textContent = msg;
    box.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  };
  // Active bids sorted best (lowest) first; ties -> earlier bid wins.
  GD.ranked = (bids) => bids.filter((b) => b.status === 'active').sort((a, b) =>
    Number(a.amount) - Number(b.amount) || new Date(a.updated_at) - new Date(b.updated_at));

  // ---------- Backend: Local (localStorage) ----------
  const LS_KEY = 'gd_local_db';
  const bc = 'BroadcastChannel' in window ? new BroadcastChannel('gd_local') : null;
  const Local = {
    load() {
      let db;
      try { db = JSON.parse(localStorage.getItem(LS_KEY)); } catch (e) { db = null; }
      if (!db) {
        db = { vehicles: SEED.map((v, i) => Object.assign({ id: i + 1 }, v)), auctions: [], dealers: [], bids: [] };
        this.save(db, true);
      }
      return db;
    },
    save(db, silent) {
      localStorage.setItem(LS_KEY, JSON.stringify(db));
      if (!silent && bc) bc.postMessage('change');
    },
    async listVehicles() { return this.load().vehicles; },
    async listAuctions() {
      return this.load().auctions.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },
    async createAuction(a) {
      const db = this.load();
      const row = Object.assign({ id: GD.uuid(), status: 'live', group_size: 10, city: 'Ahmedabad',
        payment_terms: null, ends_at: null, winner_label: null, winner_amount: null,
        created_at: new Date().toISOString() }, a);
      db.auctions.push(row); this.save(db); return row;
    },
    async updateAuction(id, patch) {
      const db = this.load(); const row = db.auctions.find((x) => x.id === id);
      if (row) Object.assign(row, patch);
      this.save(db); return row;
    },
    async registerDealer(d) {
      const db = this.load();
      const row = Object.assign({ id: GD.uuid(), created_at: new Date().toISOString() }, d);
      db.dealers.push(row); this.save(db); return row;
    },
    async listBids() { return this.load().bids; },
    async listEvents() { return this.load().events || []; },
    async logEvent(e) {
      const db = this.load(); (db.events = db.events || []).push(Object.assign({ id: GD.uuid(), at: new Date().toISOString() }, e));
      this.save(db); },
    async updateBid(id, patch) {
      const db = this.load(); const row = db.bids.find((x) => x.id === id);
      if (row) Object.assign(row, patch); this.save(db); return row; },
    async deleteBid(id) {
      const db = this.load(); db.bids = db.bids.filter((x) => x.id !== id); this.save(db); },
    async upsertBid(b) {
      const db = this.load();
      let row = db.bids.find((x) => x.auction_id === b.auction_id && x.dealer_id === b.dealer_id);
      if (row) Object.assign(row, b); else { row = Object.assign({ id: GD.uuid() }, b); db.bids.push(row); }
      this.save(db); return row;
    },
    subscribe(cb) {
      if (bc) bc.onmessage = () => cb();
      window.addEventListener('storage', (e) => { if (e.key === LS_KEY) cb(); });
    }
  };

  // ---------- Backend: Supabase ----------
  let client = null;
  const Remote = {
    async listVehicles() {
      const { data, error } = await client.from('gd_vehicles').select('*').order('id');
      if (error) throw error; return data;
    },
    async listAuctions() {
      const { data, error } = await client.from('gd_auctions').select('*').order('created_at', { ascending: false });
      if (error) throw error; return data;
    },
    async createAuction(a) {
      const { data, error } = await client.from('gd_auctions').insert(a).select().single();
      if (error) throw error; return data;
    },
    async updateAuction(id, patch) {
      const { data, error } = await client.from('gd_auctions').update(patch).eq('id', id).select().single();
      if (error) throw error; return data;
    },
    async registerDealer(d) {
      const { data, error } = await client.from('gd_dealers').insert(d).select().single();
      if (error) throw error; return data;
    },
    async listBids() {
      const { data, error } = await client.from('gd_bids').select('*');
      if (error) throw error; return data;
    },
    async listEvents() {
      const { data, error } = await client.from('gd_bid_events').select('*').order('at');
      if (error) throw error; return data;
    },
    async logEvent(e) {
      const { error } = await client.from('gd_bid_events').insert(e);
      if (error) throw error;
    },
    async updateBid(id, patch) {
      const { data, error } = await client.from('gd_bids').update(patch).eq('id', id).select().single();
      if (error) throw error; return data;
    },
    async deleteBid(id) {
      const { error } = await client.from('gd_bids').delete().eq('id', id);
      if (error) throw error;
    },
    async upsertBid(b) {
      const { data, error } = await client.from('gd_bids').upsert(b, { onConflict: 'auction_id,dealer_id' }).select().single();
      if (error) throw error; return data;
    },
    subscribe(cb) {
      const ch = client.channel('gd-live');
      ['gd_bids', 'gd_auctions'].forEach((t) =>
        ch.on('postgres_changes', { event: '*', schema: 'public', table: t }, () => cb()));
      ch.subscribe();
    }
  };

  // ---------- Init: choose backend ----------
  let backend = Local;
  GD.mode = 'local';
  GD.init = async function () {
    const forceLocal = qs.get('local') === '1';
    if (!forceLocal && window.supabase && window.SB_URL && window.SB_KEY) {
      try {
        client = window.supabase.createClient(window.SB_URL, window.SB_KEY);
        // First request doubles as a connectivity probe (3 s timeout).
        await Promise.race([
          Remote.listVehicles().then((v) => { if (!v.length) throw new Error('empty'); }),
          new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 3000))
        ]);
        backend = Remote; GD.mode = 'live';
      } catch (e) { console.warn('Supabase unavailable, using local mode:', e.message || e); backend = Local; }
    }
    if (backend === Local) Local.load();
    GD.renderBadge();
    return GD.mode;
  };
  GD.renderBadge = function () {
    const el = document.getElementById('modeBadge');
    if (!el) return;
    el.className = 'badge ' + (GD.mode === 'live' ? 'live' : 'offline');
    el.textContent = GD.mode === 'live' ? 'Live database' : 'Offline demo';
  };

  // Public API (delegates to chosen backend)
  ['listVehicles', 'listAuctions', 'createAuction', 'updateAuction', 'registerDealer', 'listBids', 'upsertBid']
    .forEach((m) => { GD[m] = (...a) => backend[m](...a); });
  // History is best-effort: if the events table is missing, bidding still works.
  GD.logEvent = async (e) => { try { await backend.logEvent(e); } catch (err) { GD.eventsOff = true; } };
  GD.listEvents = async () => { try { return await backend.listEvents(); } catch (err) { GD.eventsOff = true; return []; } };
  ['updateBid', 'deleteBid'].forEach((m) => { GD[m] = (...a) => backend[m](...a); });
  GD.placeBid = async (auction_id, dealer_id, dealer_label, amount, status) => {
    const row = await backend.upsertBid({
      auction_id, dealer_id, dealer_label, amount, status: status || 'active', updated_at: new Date().toISOString() });
    GD.logEvent({ auction_id, dealer_label, amount, kind: status === 'out' ? 'left' : 'bid' });
    return row;
  };

  // subscribe(onChange): realtime / cross-tab events + 3 s polling fallback, debounced.
  GD.subscribe = function (onChange) {
    let timer = null;
    const fire = () => { clearTimeout(timer); timer = setTimeout(onChange, 60); };
    backend.subscribe(fire);
    setInterval(onChange, 3000);
  };
})();
