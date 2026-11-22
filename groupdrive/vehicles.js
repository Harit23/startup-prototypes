/* GroupDrive - generic vehicle illustrations (inline SVG, no real brand art).
   Reusable functions: GDV.draw.<kind>(color) -> svg string, GDV.kindOf(), GDV.pic(), GDV.thumb().
   The only photo used is the user's own bmw.jpg (BMW models). */
(function () {
  'use strict';
  const GDV = (window.GDV = {});

  GDV.COLORS = { Car: '#2F6FED', Bike: '#E8590C', Scooter: '#8B5CF6', 'Three-wheeler': '#2E9E4F', Tractor: '#C62828', Truck: '#0F9D8A', Bus: '#D98E04' };
  GDV.CAT_ORDER = ['Car', 'Bike', 'Scooter', 'Three-wheeler', 'Tractor', 'Truck', 'Bus'];
  GDV.CAT_LABEL = { Car: 'Cars', Bike: 'Bikes', Scooter: 'Scooters', 'Three-wheeler': 'Autos', Tractor: 'Tractors', Truck: 'Trucks', Bus: 'Buses' };
  GDV.colorOf = (cat) => GDV.COLORS[cat] || '#2F6FED';
  GDV.KIND_LABEL = {
    hatchback: 'Hatchback', sedan: 'Sedan', suv: 'SUV', ev: 'Electric car',
    commuter: 'Commuter', cruiser: 'Cruiser', sports: 'Sports', scooter: 'Scooter', escooter: 'Electric scooter',
    minitruck: 'Mini truck / pickup', auto: 'Auto-rickshaw', eauto: 'Electric auto', cargoauto: 'Cargo auto', tractor: 'Tractor', truck: 'Cargo truck', tipper: 'Tipper', heavy: 'Heavy haul',
    schoolbus: 'School bus', bus: 'Staff / intercity', minibus: 'Minibus', coach: 'Luxury coach'
  };
  GDV.CAT_OF_KIND = {};
  ['hatchback', 'sedan', 'suv', 'ev'].forEach((k) => (GDV.CAT_OF_KIND[k] = 'Car'));
  ['commuter', 'cruiser', 'sports'].forEach((k) => (GDV.CAT_OF_KIND[k] = 'Bike'));
  ['scooter', 'escooter'].forEach((k) => (GDV.CAT_OF_KIND[k] = 'Scooter'));
  ['auto', 'eauto', 'cargoauto'].forEach((k) => (GDV.CAT_OF_KIND[k] = 'Three-wheeler'));
  GDV.CAT_OF_KIND.tractor = 'Tractor';
  ['minitruck', 'truck', 'tipper', 'heavy'].forEach((k) => (GDV.CAT_OF_KIND[k] = 'Truck'));
  ['schoolbus', 'bus', 'minibus', 'coach'].forEach((k) => (GDV.CAT_OF_KIND[k] = 'Bus'));

  // ---------- colour + shape helpers ----------
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const f = (v) => Math.max(0, Math.min(255, v + amt));
    return '#' + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => f(v).toString(16).padStart(2, '0')).join('');
  }
  const INK = '#1B2233', GLASS = '#DCE8FF', STEEL = '#CBD3E3', SEAT = '#2A3350', LAMP = '#FFE7A3', TAIL = '#E5484D';
  const wrap = (inner) => '<svg viewBox="0 0 200 110" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" focusable="false">' +
    '<ellipse cx="100" cy="93" rx="84" ry="4.5" fill="' + INK + '" opacity=".14"/>' + inner + '</svg>';
  const wheel = (x, y, r) => '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + INK + '"/><circle cx="' + x + '" cy="' + y +
    '" r="' + (r * 0.55).toFixed(1) + '" fill="' + STEEL + '"/><circle cx="' + x + '" cy="' + y + '" r="' + (r * 0.2).toFixed(1) + '" fill="' + INK + '"/>';
  const spokeWheel = (x, y, r) => '<circle cx="' + x + '" cy="' + y + '" r="' + (r - 3) + '" fill="none" stroke="' + INK + '" stroke-width="6"/>' +
    '<circle cx="' + x + '" cy="' + y + '" r="' + (r - 9) + '" fill="none" stroke="' + STEEL + '" stroke-width="2"/>' +
    '<circle cx="' + x + '" cy="' + y + '" r="3" fill="' + INK + '"/>';
  const bolt = (x, y, s, fill) => '<path transform="translate(' + x + ' ' + y + ') scale(' + s + ')" d="M8 0 L0 14 L7 14 L4 26 L16 10 L9 10 Z" fill="' + fill + '"/>';
  const line = (d, w, col) => '<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>';

  // ---------- cars ----------
  function carLights() {
    return '<rect x="181" y="62" width="8" height="4" rx="1.5" fill="' + LAMP + '"/><rect x="13" y="62" width="5" height="5" rx="1.5" fill="' + TAIL + '"/>';
  }
  function sedan(c) {
    return wrap('<path d="M14 80 L14 66 Q14 59 22 57 L58 51 L76 33 Q79 30 84 30 L124 30 Q130 30 134 34 L152 51 L180 57 Q188 59 188 67 L188 80 Z" fill="' + c + '"/>' +
      '<path d="M80 35 L65 51 L101 51 L101 35 Z M106 35 L106 51 L146 51 L131 36 Q129 35 126 35 Z" fill="' + GLASS + '"/>' +
      '<rect x="14" y="73" width="174" height="7" fill="' + shade(c, -30) + '"/>' + line('M103 52 L103 72', 1.5, shade(c, -45)) +
      '<rect x="108" y="58" width="9" height="2.5" rx="1" fill="' + shade(c, -45) + '"/>' + carLights() + wheel(54, 78, 14) + wheel(148, 78, 14));
  }
  function hatchback(c) {
    return wrap('<path d="M16 80 L16 64 Q16 57 24 55 L40 37 Q44 31 52 31 L112 31 Q120 31 126 37 L148 55 L178 59 Q186 61 186 69 L186 80 Z" fill="' + c + '"/>' +
      '<path d="M52 37 L100 37 L100 53 L38 53 L47 40 Q49 37 52 37 Z M105 37 L112 37 Q116 37 119 40 L136 53 L105 53 Z" fill="' + GLASS + '"/>' +
      '<rect x="16" y="73" width="170" height="7" fill="' + shade(c, -30) + '"/>' + line('M103 54 L103 72', 1.5, shade(c, -45)) +
      '<rect x="108" y="60" width="9" height="2.5" rx="1" fill="' + shade(c, -45) + '"/>' + carLights() + wheel(54, 78, 14) + wheel(146, 78, 14));
  }
  function suv(c) {
    return wrap('<rect x="40" y="22" width="90" height="3.5" rx="1.7" fill="' + shade(c, -40) + '"/>' +
      '<path d="M12 81 L12 54 Q12 47 20 45 L34 33 Q38 28 46 28 L128 28 Q136 28 141 34 L158 49 L182 53 Q190 55 190 63 L190 81 Z" fill="' + c + '"/>' +
      '<path d="M44 34 L98 34 L98 49 L28 49 L38 37 Q40 34 44 34 Z M103 34 L127 34 Q131 34 134 37 L148 49 L103 49 Z" fill="' + GLASS + '"/>' +
      '<rect x="12" y="73" width="178" height="8" fill="' + shade(c, -30) + '"/>' + line('M100 50 L100 72', 1.5, shade(c, -45)) +
      '<rect x="105" y="57" width="9" height="2.5" rx="1" fill="' + shade(c, -45) + '"/>' +
      '<rect x="182" y="58" width="8" height="4" rx="1.5" fill="' + LAMP + '"/><rect x="11" y="58" width="5" height="6" rx="1.5" fill="' + TAIL + '"/>' +
      wheel(50, 77, 15) + wheel(150, 77, 15));
  }
  function ev(c) {
    return sedan(c).replace('</svg>', '<circle cx="100" cy="66" r="0" fill="none"/>' +
      '<circle cx="120" cy="65" r="9.5" fill="#fff" opacity=".95"/>' + bolt(114.5, 53.5, 0.62, '#12B76A') + '</svg>');
  }

  // ---------- bikes ----------
  function commuter(c) {
    return wrap(spokeWheel(46, 72, 19) + spokeWheel(156, 72, 19) +
      line('M156 72 L130 40', 4, STEEL) + line('M122 36 L138 38', 4, INK) +
      '<circle cx="136" cy="44" r="5" fill="' + LAMP + '"/>' +
      '<path d="M84 52 Q100 40 122 45 L118 58 L84 60 Z" fill="' + c + '"/>' +
      '<path d="M50 52 Q70 46 92 52 L90 58 L48 58 Z" fill="' + SEAT + '"/>' +
      '<rect x="86" y="60" width="28" height="16" rx="3" fill="#4A5675"/>' +
      line('M46 72 L88 70', 4, INK) + line('M62 70 L104 79', 4, '#8A94AB') + line('M92 76 L124 60 L132 44', 3, STEEL) +
      '<path d="M22 56 L48 52 L50 56 L26 60 Z" fill="' + c + '"/>');
  }
  function cruiser(c) {
    return wrap(spokeWheel(44, 72, 19) + spokeWheel(158, 72, 19) +
      '<path d="M138 58 Q158 46 176 62" fill="none" stroke="' + c + '" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M44 58 Q30 50 14 62" fill="none" stroke="' + c + '" stroke-width="5" stroke-linecap="round"/>' +
      line('M158 72 L134 36', 4, STEEL) + line('M124 32 L146 30', 4, INK) +
      '<circle cx="142" cy="42" r="7" fill="' + LAMP + '" stroke="' + STEEL + '" stroke-width="2"/>' +
      '<path d="M78 52 Q96 34 122 44 L116 60 L80 60 Z" fill="' + c + '"/>' +
      '<path d="M40 58 Q58 50 82 58 L82 62 L40 64 Z" fill="' + SEAT + '"/>' +
      '<rect x="84" y="62" width="30" height="15" rx="3" fill="#4A5675"/><rect x="84" y="62" width="30" height="4" fill="' + STEEL + '"/>' +
      line('M44 72 L90 70', 4, INK) + line('M56 72 L110 80', 5, '#8A94AB'));
  }
  function sports(c) {
    const dark = shade(c, -30);
    return wrap(spokeWheel(46, 72, 19) + spokeWheel(156, 72, 19) +
      // Swingarm, forks and clip-on bars.
      line('M156 72 L130 46', 5, STEEL) + line('M46 72 L96 66', 5, '#8A94AB') +
      line('M124 42 L138 45', 4, INK) +
      // Full fairing, screen and raised tail.
      '<path d="M112 34 Q136 34 150 50 Q156 58 152 66 L136 68 Q130 54 112 50 Z" fill="' + c + '"/>' +
      '<path d="M118 32 Q130 28 137 34 Q128 36 122 40 Z" fill="' + GLASS + '"/>' +
      '<path d="M86 46 Q104 38 118 48 L116 62 L86 62 Z" fill="' + dark + '"/>' +
      '<path d="M44 40 Q66 36 84 46 L84 56 L50 58 Z" fill="' + c + '"/>' +
      '<path d="M50 56 L92 52 L92 60 L54 62 Z" fill="' + SEAT + '"/>' +
      '<path d="M90 60 Q106 60 114 66 L114 74 Q100 76 90 72 Z" fill="#4A5675"/>' +
      // Underbelly exhaust and lights.
      line('M96 74 L128 78', 5, '#9AA4BA') +
      '<path d="M142 46 L150 52 L146 58 L139 53 Z" fill="' + LAMP + '"/>' +
      '<rect x="42" y="38" width="7" height="4" rx="1.5" fill="' + TAIL + '"/>');
  }
  function scooter(c) {
    return wrap(wheel(48, 79, 12.5) + wheel(154, 79, 12.5) +
      '<path d="M28 54 Q28 45 42 45 L84 45 Q94 45 94 56 L94 68 Q80 72 62 72 L40 72 Q28 68 28 54 Z" fill="' + c + '"/>' +
      '<rect x="40" y="36" width="50" height="10" rx="5" fill="' + SEAT + '"/>' +
      '<path d="M92 68 L128 68 L132 62 L96 62 Z" fill="' + shade(c, -30) + '"/>' +
      '<path d="M124 46 Q140 40 144 54 L140 74 L128 74 Z" fill="' + c + '"/>' +
      line('M150 80 L140 34', 4, INK) + line('M132 32 L152 32', 4, INK) +
      '<circle cx="147" cy="41" r="4.5" fill="' + LAMP + '"/>' +
      '<rect x="22" y="52" width="8" height="5" rx="2" fill="' + TAIL + '"/>' + line('M60 74 L84 74', 4, '#8A94AB'));
  }
  function escooter(c) {
    return scooter(c).replace('</svg>', '<circle cx="62" cy="58" r="9" fill="#fff" opacity=".95"/>' + bolt(56.5, 47.5, 0.62, '#12B76A') + '</svg>');
  }

  // ---------- trucks ----------
  function cab(c, x) {   // truck cab; x = left edge, front faces right
    return '<path d="M' + x + ' 82 L' + x + ' 42 Q' + x + ' 36 ' + (x + 6) + ' 36 L' + (x + 32) + ' 36 Q' + (x + 38) + ' 36 ' + (x + 42) + ' 42 L' + (x + 58) + ' 64 Q' + (x + 62) + ' 68 ' + (x + 62) + ' 74 L' + (x + 62) + ' 82 Z" fill="' + c + '"/>' +
      '<path d="M' + (x + 8) + ' 42 L' + (x + 30) + ' 42 L' + (x + 44) + ' 62 L' + (x + 8) + ' 62 Z" fill="' + GLASS + '"/>' +
      '<rect x="' + (x + 55) + '" y="68" width="7" height="4" rx="1.5" fill="' + LAMP + '"/>';
  }
  function minitruck(c) {
    return wrap('<rect x="14" y="62" width="100" height="20" fill="#CFD8EA"/><rect x="14" y="56" width="100" height="7" rx="2" fill="' + c + '"/>' +
      '<rect x="14" y="62" width="100" height="3" fill="' + shade(c, -30) + '"/>' +
      '<path d="M120 82 L120 52 Q120 45 127 44 L152 44 Q158 44 162 50 L176 64 Q180 68 180 74 L180 82 Z" fill="' + c + '"/>' +
      '<path d="M128 50 L150 50 L163 64 L128 64 Z" fill="' + GLASS + '"/>' +
      '<rect x="173" y="68" width="7" height="4" rx="1.5" fill="' + LAMP + '"/><rect x="10" y="78" width="172" height="5" fill="' + SEAT + '"/>' +
      wheel(46, 80, 12) + wheel(150, 80, 12));
  }
  function truck(c) {
    return wrap('<rect x="8" y="24" width="116" height="56" rx="3" fill="#F2F5FB" stroke="' + STEEL + '" stroke-width="2"/>' +
      '<rect x="8" y="54" width="116" height="9" fill="' + c + '"/>' +
      [30, 52, 74, 96].map((x) => line('M' + x + ' 26 L' + x + ' 52', 1.5, STEEL)).join('') +
      cab(c, 130) + '<rect x="8" y="80" width="184" height="5" fill="' + SEAT + '"/>' + wheel(36, 82, 11) + wheel(62, 82, 11) + wheel(160, 82, 11));
  }
  function tipper(c) {
    return wrap('<g transform="rotate(-11 12 76)"><path d="M10 74 L10 38 L118 38 L118 74 Z" fill="' + c + '"/>' +
      [34, 58, 82].map((x) => line('M' + x + ' 40 L' + x + ' 72', 2, shade(c, -35))).join('') +
      '<rect x="8" y="34" width="112" height="6" rx="2" fill="' + shade(c, -35) + '"/></g>' +
      line('M96 80 L112 64', 4, STEEL) + cab(c, 130) +
      '<rect x="8" y="80" width="184" height="5" fill="' + SEAT + '"/>' + wheel(36, 82, 11) + wheel(62, 82, 11) + wheel(160, 82, 11));
  }
  function heavy(c) {
    return wrap('<rect x="4" y="30" width="120" height="46" rx="3" fill="#F2F5FB" stroke="' + STEEL + '" stroke-width="2"/>' +
      '<rect x="4" y="30" width="120" height="14" fill="' + c + '"/>' +
      [24, 44, 64, 84, 104].map((x) => line('M' + x + ' 46 L' + x + ' 74', 1.5, STEEL)).join('') +
      '<rect x="128" y="22" width="4" height="30" rx="2" fill="' + STEEL + '"/>' +
      '<path d="M132 82 L132 38 Q132 32 138 32 L164 32 Q170 32 174 38 L190 62 Q192 66 192 72 L192 82 Z" fill="' + c + '"/>' +
      '<path d="M140 38 L162 38 L176 58 L140 58 Z" fill="' + GLASS + '"/><rect x="184" y="66" width="8" height="4" rx="1.5" fill="' + LAMP + '"/>' +
      '<rect x="4" y="76" width="188" height="6" fill="' + SEAT + '"/>' + wheel(20, 82, 10) + wheel(42, 82, 10) + wheel(64, 82, 10) + wheel(150, 82, 10) + wheel(174, 82, 10));
  }

  // ---------- buses ----------
  function busBody(c, x0, x1, opts) {
    opts = opts || {};
    const w = x1 - x0, tint = opts.tint || GLASS;
    let wins = '';
    const n = opts.windows || 6, gap = 4, usable = w - 54, ww = (usable - gap * (n - 1)) / n;
    for (let i = 0; i < n; i++) wins += '<rect x="' + (x0 + 10 + i * (ww + gap)).toFixed(1) + '" y="30" width="' + ww.toFixed(1) + '" height="20" rx="3" fill="' + tint + '"/>';
    return '<rect x="' + x0 + '" y="' + (opts.top || 22) + '" width="' + w + '" height="' + (82 - (opts.top || 22)) + '" rx="' + (opts.round || 9) + '" fill="' + c + '"/>' + wins +
      '<path d="M' + (x1 - 32) + ' 30 L' + (x1 - 8) + ' 30 Q' + (x1 - 4) + ' 30 ' + (x1 - 4) + ' 36 L' + (x1 - 4) + ' 56 L' + (x1 - 32) + ' 56 Z" fill="' + tint + '"/>' +
      '<rect x="' + (x1 - 50) + '" y="30" width="14" height="40" rx="2" fill="' + shade(c, -35) + '"/><rect x="' + (x1 - 47) + '" y="33" width="8" height="34" rx="1.5" fill="' + tint + '"/>' +
      '<rect x="' + (x1 - 8) + '" y="66" width="6" height="5" rx="1.5" fill="' + LAMP + '"/><rect x="' + (x0 + 1) + '" y="64" width="4" height="6" rx="1.5" fill="' + TAIL + '"/>';
  }
  function bus(c) {
    return wrap(busBody(c, 8, 192) + '<rect x="8" y="58" width="184" height="6" fill="' + shade(c, -35) + '"/>' + wheel(48, 80, 12.5) + wheel(150, 80, 12.5));
  }
  function schoolbus(c) {
    return wrap(busBody(c, 8, 192, { round: 7 }) +
      '<rect x="8" y="56" width="184" height="3" fill="' + INK + '"/><rect x="8" y="62" width="184" height="3" fill="' + INK + '"/>' +
      '<circle cx="30" cy="46" r="0" fill="none"/><rect x="8" y="20" width="184" height="3" rx="1.5" fill="' + shade(c, -35) + '"/>' +
      wheel(48, 80, 12.5) + wheel(150, 80, 12.5));
  }
  function minibus(c) {
    return wrap(busBody(c, 26, 184, { windows: 4, top: 30, round: 12 }).replace(/y="30" width/g, 'y="38" width').replace(/height="20"/g, 'height="16"') +
      '<rect x="26" y="62" width="158" height="5" fill="' + shade(c, -35) + '"/>' + wheel(60, 80, 12) + wheel(148, 80, 12));
  }
  function coach(c) {
    return wrap(busBody(c, 6, 194, { windows: 7, tint: '#34405F', round: 14 }) +
      '<path d="M6 62 Q60 50 194 66 L194 72 L6 72 Z" fill="#fff" opacity=".9"/>' +
      '<path d="M6 68 Q80 58 194 72 L194 76 L6 76 Z" fill="' + shade(c, -45) + '" opacity=".9"/>' +
      wheel(46, 80, 12.5) + wheel(150, 80, 12.5));
  }


  // ---------- autos + tractor ----------
  function autoBase(c, cargo) {
    const dark = shade(c, -40), roof = '#2B3346';
    // Rear tray for the cargo version, bench + canopy for the passenger one.
    const rear = cargo
      ? '<path d="M30 50 L116 50 L116 74 L30 74 Z" fill="#D7DEEC"/>' +
        '<path d="M30 50 L116 50 L116 55 L30 55 Z" fill="' + dark + '"/>' +
        line('M44 55 L44 74 M62 55 L62 74 M80 55 L80 74 M98 55 L98 74', 2, '#B9C3D6')
      : '<path d="M36 36 Q36 26 50 26 L116 26 Q126 26 130 34 L130 40 L36 40 Z" fill="' + roof + '"/>' +
        '<path d="M40 40 L126 40 L126 68 L40 68 Z" fill="' + dark + '" opacity=".22"/>' +
        '<path d="M48 54 L112 54 L112 68 L48 68 Z" fill="' + SEAT + '"/>' +
        line('M44 40 L44 68 M126 40 L126 62', 3, roof);
    return rear +
      // Nose, windscreen and driver area.
      '<path d="M126 34 Q142 36 150 50 L152 62 Q153 72 146 76 L126 76 Z" fill="' + c + '"/>' +
      '<path d="M130 38 Q142 40 147 52 L132 52 Z" fill="' + GLASS + '"/>' +
      '<path d="M30 68 L150 68 L150 77 Q150 80 146 80 L34 80 Q30 80 30 77 Z" fill="' + c + '"/>' +
      '<path d="M30 74 L150 74 L150 77 Q150 80 146 80 L34 80 Q30 80 30 77 Z" fill="' + dark + '"/>' +
      '<circle cx="146" cy="62" r="5" fill="' + LAMP + '" stroke="' + STEEL + '" stroke-width="1.5"/>' +
      '<rect x="30" y="58" width="5" height="6" rx="1.5" fill="' + TAIL + '"/>' +
      line('M138 34 L134 26', 2.5, STEEL) +
      // One wheel at the front, two at the back: that is what makes it an auto.
      wheel(146, 82, 10) + wheel(74, 82, 13) + wheel(46, 82, 13);
  }
  function auto(c) { return wrap(autoBase(c, false)); }
  function cargoauto(c) { return wrap(autoBase(c, true)); }
  function eauto(c) {
    return wrap(autoBase(c, false)).replace('</svg>', '<circle cx="106" cy="66" r="0"/><circle cx="70" cy="64" r="8" fill="#fff" opacity=".95"/>' + bolt(65, 54, 0.55, '#12B76A') + '</svg>');
  }
  function tractor(c) {
    return wrap('<rect x="50" y="16" width="56" height="4.5" rx="2" fill="' + INK + '"/>' + line('M54 20 L54 44 M102 20 L102 44', 3, SEAT) +
      '<rect x="64" y="42" width="22" height="9" rx="3" fill="' + SEAT + '"/>' + line('M92 44 L100 34', 3, INK) +
      '<path d="M94 74 L94 48 Q94 42 100 42 L150 42 Q158 42 161 48 L168 62 L168 74 Z" fill="' + c + '"/>' +
      '<rect x="156" y="56" width="12" height="16" rx="2" fill="' + shade(c, -35) + '"/>' +
      [58, 62, 66].map((y) => '<rect x="158" y="' + y + '" width="8" height="1.8" fill="' + STEEL + '"/>').join('') +
      '<rect x="140" y="22" width="4" height="22" rx="2" fill="' + INK + '"/><rect x="48" y="70" width="124" height="6" rx="2" fill="' + shade(c, -35) + '"/>' +
      '<circle cx="62" cy="66" r="26" fill="' + INK + '"/><circle cx="62" cy="66" r="23.5" fill="none" stroke="#3B4560" stroke-width="4" stroke-dasharray="4 3"/>' +
      '<circle cx="62" cy="66" r="13" fill="' + STEEL + '"/><circle cx="62" cy="66" r="5" fill="' + INK + '"/>' +
      wheel(152, 77, 15) + '<rect x="14" y="68" width="22" height="4" rx="2" fill="' + SEAT + '"/>');
  }

  GDV.draw = { sedan, hatchback, suv, ev, commuter, cruiser, sports, scooter, escooter, minitruck, truck, tipper, heavy, auto, eauto, cargoauto, tractor, bus, schoolbus, minibus, coach };
  GDV.svg = (kind, color) => (GDV.draw[kind] || GDV.draw.sedan)(color || '#2F6FED');

  // ---------- model -> kind ----------
  const RULES = [
    [/Treo/i, 'eauto'], [/Ape\b/i, 'cargoauto'], [/RE Auto/i, 'auto'],
    [/M340i|\bC 200\b|\bE 200\b|Dzire|Verna|Honda City|Virtus|\bA4\b/i, 'sedan'], [/Swift|Baleno|\bi20\b/i, 'hatchback'], [/Nexon EV|Windsor/i, 'ev'],
    [/Classic|Himalayan|Hunter/i, 'cruiser'], [/Continental GT/i, 'cruiser'], [/Duke|Pulsar|Apache|R15|\bRC \d|\bR3\b|Ninja|CBR|Gixxer|\bRR \d|MT-15|Speed 400/i, 'sports'], [/Splendor|HF Deluxe|Shine|Raider/i, 'commuter'],
    [/Activa|Jupiter|Access/i, 'scooter'], [/S1 Pro|Ather|iQube|Chetak/i, 'escooter'],
    [/Dost|\bAce\b|Intra|Pik-?Up/i, 'minitruck'], [/Tipper/i, 'tipper'], [/Signa|Blazo/i, 'heavy'],
    [/Starbus|Skyline/i, 'schoolbus'], [/Traveller/i, 'minibus'], [/9600/i, 'coach']
  ];
  GDV.kindOf = function (category, brand, model) {
    const name = (brand || '') + ' ' + (model || '');
    for (const [re, k] of RULES) if (re.test(name)) return k;
    return { Car: 'suv', Bike: 'commuter', Scooter: 'scooter', 'Three-wheeler': 'auto', Tractor: 'tractor', Truck: 'truck', Bus: 'bus' }[category] || 'sedan';
  };
  const kindOfV = (v) => GDV.kindOf(v.category, v.brand, v.model);
  GDV.kindOfV = kindOfV;

  // ---------- real photos ----------
  /* GDV.PHOTOS maps a vehicle to a real photo URL.
     Keys are matched in this order, all lower-case:
       1. "brand model"   e.g. "maruti suzuki baleno"
       2. "brand"         e.g. "mahindra"      (fallback for the whole brand)
     Values are either a local file in this folder (e.g. "bmw.jpg") or a full
     https:// URL. Use freely licensed sources (Wikimedia Commons) so the photo
     is legal to show and the host does not block other sites from loading it.
     Anything with no entry, or whose photo fails to load, falls back to the
     built-in drawing automatically - so a dead link can never show a broken
     image box during a demo. */
  GDV.PHOTOS = {
    'bmw m340i': 'bmw.jpg',
    // --- Photos Harit supplied (local files, highest quality match) ---
    'audi a4': 'img/audi-a4.jpg',
    'mercedes-benz c 200': 'img/mercedes-c200.jpg',
    'audi q3': 'img/audi-q3.jpg',
    'mahindra xuv700': 'img/mahindra-xuv700.jpg',
    'hyundai creta': 'img/hyundai-creta.jpg',
    'kia seltos': 'img/kia-seltos.jpg',
    'tata nexon': 'img/tata-nexon.jpg',
    'maruti suzuki baleno': 'img/maruti-baleno.jpg',
    'maruti suzuki dzire': 'img/maruti-dzire.jpg',
    'maruti suzuki brezza': 'img/maruti-brezza.jpg',
    'toyota fortuner': 'img/toyota-fortuner.jpg',
    'mahindra scorpio-n': 'img/mahindra-scorpio-n.jpg',
    'mahindra scorpio': 'img/mahindra-scorpio-n.jpg',
    'kia carens': 'img/kia-carens.jpg',
    'honda city': 'img/honda-city.jpg',
    'skoda kushaq': 'img/skoda-kushaq.jpg',
    'volkswagen virtus': 'img/vw-virtus.jpg',
    'bmw x5': 'img/bmw-x5.jpg',
    'royal enfield classic 350': 'img/re-classic-350.jpg',
    'ktm 250 duke': 'img/ktm-250-duke.jpg',
    'bajaj pulsar n250': 'img/bajaj-pulsar-n250.jpg',
    'tvs apache rtr 160': 'img/tvs-apache-rtr160.jpg',
    'bharatbenz 1624': 'img/bharatbenz-bus.jpg',
    'volvo 9600': 'img/volvo-9600-coach.jpg',
    'tata starbus': 'img/tata-starbus.jpg',
    'eicher skyline pro': 'img/eicher-skyline-pro.jpg',
    'force traveller': 'img/force-traveller.jpg',
    'suzuki access 125': 'img/suzuki-access-125.jpg',
    'toyota innova hycross': 'img/toyota-innova-hycross.jpg',
    'maruti suzuki swift': 'img/maruti-swift.jpg',
    'tata punch': 'img/tata-punch.jpg',
    'tata harrier': 'img/tata-harrier.jpg',
    'hyundai verna': 'img/hyundai-verna.jpg',
    'mahindra xuv 3xo': 'img/mahindra-xuv3xo.jpg',
    'mg hector': 'img/mg-hector.jpg',
    'bmw x1': 'img/bmw-x1.jpg',
    'honda elevate': 'img/honda-elevate.jpg',
    'mg windsor ev': 'img/mg-windsor-ev.jpg',
    'mercedes-benz gla 200': 'img/mercedes-gla.jpg',
    'mercedes-benz e 200': 'img/mercedes-e200.jpg',
    'volvo xc60': 'img/volvo-xc60.jpg',
    'ktm 390 duke': 'img/ktm-390-duke.jpg',
    'royal enfield hunter 350': 'img/re-hunter-350.jpg',
    'tvs raider 125': 'img/tvs-raider.jpg',
    'tvs jupiter 110': 'img/tvs-jupiter.jpg',
    'tvs iqube': 'img/tvs-iqube.jpg',
    'ather 450x': 'img/ather-450x.jpg',
    'piaggio ape city': 'img/piaggio-ape.jpg',
    'mahindra treo (ev)': 'img/mahindra-treo.jpg',
    'mahindra 575 di': 'img/mahindra-575di.jpg',
    'tata signa': 'img/tata-signa-tipper.jpg',
    'tata ace gold': 'img/tata-ace-gold.jpg',
    'tata intra': 'img/tata-intra-v30.jpg',
    'bharatbenz 1917r': 'img/bharatbenz-1917r.jpg',
    'mahindra blazo x 28': 'img/mahindra-blazo.jpg',
    'ashok leyland bada dost': 'img/ashok-leyland-bada-dost.jpg',
    'ashok leyland dost+': 'img/ashok-leyland-dost.jpg',
    // Cars
    // Bikes
    // Scooters
    // Three-wheelers
    // Tractors
    // Trucks
    // Buses

    /* Parked: user-taken road photos from Wikimedia. Next to the studio
       shots they made the cards look like second-hand listings, so they are
       out until a clean press photo replaces each one. Move a line back into
       the map above to re-enable it.
       'maruti suzuki ertiga': 'commons:Maruti Suzuki Ertiga(1).jpg'
       'maruti suzuki grand vitara': 'commons:2022 Maruti Suzuki Grand Vitara Zeta Smart Hybrid (India) front view.jpg'
       'kia sonet': 'commons:Kia Sonet IMG001.jpg'
       'mahindra thar': 'commons:Mahindra Thar 2.5 CRDe 2011.jpg'
       'hyundai i20': 'commons:2021 Hyundai i20 N Line (BI3; India) front view.png'
       'hyundai venue': 'commons:2020 Hyundai Venue Ultimate 2019-12-13 2.jpg'
       'ola electric s1 pro': 'commons:OLA S1 Pro Gen 1 Electric Scooter.jpg'
       'tata ace': 'commons:Tata Ace mini-truck, Bangladesh. (43926311271).jpg'
       'hero splendor plus': 'commons:Hero Splendor+, Bangalore (2025).jpg'
       'bajaj pulsar': 'commons:Red Bajaj Pulsar outside hotel in Goa.jpg'
       'yamaha r15 v4': 'commons:Yamaha YZF-R15.jpg'
       'honda activa 6g': 'commons:Honda Activa 6G.jpg'
       'bajaj chetak': 'commons:Bajaj Chetak electric scooters (2026) 01.jpg'
       'bajaj re auto (cng)': 'commons:Auto-rickshaw Bajaj.jpg'
       'sonalika di 745': 'commons:Sonalika Tractor.jpg'
       'swaraj 744 fe': 'commons:Swaraj 735.png'
       'ashok leyland ecomet 1615': 'commons:Ashok Leyland Truck (5478313829).jpg'
       'eicher pro 2049': 'commons:Eicher Truck at Azadpur Vegetable Market.jpg'
       'mahindra bolero pik-up': 'commons:Mahindra Bolero Double Cab Front.JPG'
       'ashok leyland viking': 'commons:Ashok-Leyland Bus in Goa, India (17018817397).jpg'
    */
  };

  // "commons:<file name>" becomes a Special:FilePath URL, which is the stable
  // form Wikimedia publishes for other sites (no hashed path to get wrong).
  GDV.photoUrl = function (val) {
    if (!val) return null;
    return /^commons:/.test(val)
      ? 'https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(val.slice(8)) + '?width=400'
      : val;
  };

  /* Live rows carry trim names the seed does not ("Creta SX", "Swift ZXi"),
     so after an exact hit we fall back to the longest key whose model is a
     prefix of this one. Longest wins, so "pulsar n160" beats "pulsar". */
  /* Live rows spell some brands differently from the seed ("Tata Motors",
     "Force Motors", "Ola"), so brands are normalised before lookup. */
  const BRAND_ALIAS = { 'ola': 'ola electric', 'maruti': 'maruti suzuki', 'mercedes': 'mercedes-benz', 'royal enfield motors': 'royal enfield' };
  function normBrand(brand) {
    let b = String(brand || '').trim().toLowerCase().replace(/\s+motors$/, '');
    return BRAND_ALIAS[b] || b;
  }

  GDV.photoFor = function (brand, model) {
    const b = normBrand(brand);
    const m = String(model || '').trim().toLowerCase();
    const exact = GDV.PHOTOS[b + ' ' + m];
    if (exact) return GDV.photoUrl(exact);
    let best = null, bestLen = -1;
    for (const key of Object.keys(GDV.PHOTOS)) {
      if (key.indexOf(b + ' ') !== 0) continue;
      const keyModel = key.slice(b.length + 1);
      if ((m + ' ').indexOf(keyModel + ' ') === 0 && keyModel.length > bestLen) {
        best = GDV.PHOTOS[key]; bestLen = keyModel.length;
      }
    }
    return GDV.photoUrl(best || GDV.PHOTOS[b] || null);
  };

  // Called by the img onerror: swap a failed photo for the drawing.
  GDV.fallback = function (img) {
    const host = img.parentNode;
    if (!host) return;
    host.innerHTML = decodeURIComponent(img.getAttribute('data-svg') || '');
  };

  // ---------- picture markup ----------
  GDV.picHtml = function (category, brand, model, extraCls) {
    const svg = GDV.svg(GDV.kindOf(category, brand, model), GDV.colorOf(category));
    const url = GDV.photoFor(brand, model);
    if (!url) return svg;
    const alt = String(brand + ' ' + model).replace(/"/g, '');
    return '<img src="' + url + '" alt="' + alt + '" loading="lazy" class="photo"' +
      ' referrerpolicy="no-referrer"' +
      ' data-svg="' + encodeURIComponent(svg) + '"' +
      ' onerror="GDV.fallback(this)">';
  };
  GDV.pic = (v, cls) => '<span class="vpic ' + (cls || '') + '">' + GDV.picHtml(v.category, v.brand, v.model) + '</span>';
  GDV.thumb = (v) => GDV.pic(v, 'thumb');
})();
