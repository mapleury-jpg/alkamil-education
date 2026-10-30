/* ============================================================
   supabase.js  -  satu-satunya tempat koneksi ke Supabase
   Dimuat SETELAH supabase-js CDN dan SEBELUM app.js
   ============================================================ */
(function () {
  /* ---- ISI DUA BARIS INI (Supabase > Project Settings > API) ---- */
  var SUPABASE_URL = 'https://obdvfwdaxsvgnyupxqtv.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_ndoV_pSEAXxvL7PZ0owjOg_TGM2wt9j';
  var ADMIN_FUNCTION = 'admin';
  /* --------------------------------------------------------------- */

  var configured = SUPABASE_URL.indexOf('YOUR-') < 0 && SUPABASE_KEY.indexOf('YOUR-') < 0;
  var db = configured && window.supabase
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
    : null;

  var DEFAULTS = {
    cfg: { wa: '6280000000000', map: 'https://www.google.com/maps/search/?api=1&query=-6.1754,106.8272' },
    texts: {},
    ts: [
      { q: '[Testimoni orang tua 1. Ubah lewat halaman admin.]', n: '[Nama Orang Tua]' },
      { q: '[Testimoni orang tua 2. Ubah lewat halaman admin.]', n: '[Nama Orang Tua]' },
      { q: '[Testimoni orang tua 3. Ubah lewat halaman admin.]', n: '[Nama Orang Tua]' }
    ],
    gal: [
      { caption: 'Belajar bersama', icon: 'pencil' }, { caption: 'Metode games', icon: 'game' },
      { caption: 'Setor lisan', icon: 'mic' }, { caption: 'Suasana kelas', icon: 'book' },
      { caption: 'Masa ujian', icon: 'check' }, { caption: 'Salam sopan santun', icon: 'smile' }
    ]
  };
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  /* Baca konten publik (tabel site_content + gallery) */
  async function fetchContent() {
    if (!db) return clone(DEFAULTS);
    var res = await Promise.all([
      db.from('site_content').select('data').eq('id', 1).maybeSingle(),
      db.from('gallery').select('caption,image').order('position', { ascending: true })
    ]);
    var d = (res[0].data && res[0].data.data) || {};
    var gal = res[1].data;
    return {
      cfg: Object.assign({}, DEFAULTS.cfg, d.cfg || {}),
      texts: d.texts || {},
      ts: Array.isArray(d.ts) && d.ts.length ? d.ts : DEFAULTS.ts,
      gal: gal && gal.length ? gal : DEFAULTS.gal
    };
  }

  /* Panggil edge function "admin" (verify / save) */
  async function callAdmin(body) {
    if (!db) throw new Error('Supabase belum dikonfigurasi di supabase.js');
    var r = await db.functions.invoke(ADMIN_FUNCTION, { body: body });
    if (r.error) {
      var status = r.error.context && r.error.context.status, msg = r.error.message;
      try { var j = await r.error.context.json(); if (j && j.error) msg = j.error; } catch (e) {}
      var err = new Error(msg); err.status = status; throw err;
    }
    return r.data;
  }

  window.AK = { DEFAULTS: DEFAULTS, configured: !!db, fetchContent: fetchContent, callAdmin: callAdmin };
})();