import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const YEARS = [2021, 2022, 2023, 2024, 2025];
const MONTHS = ['Ιανουάριος','Φεβρουάριος','Μάρτιος','Απρίλιος','Μάιος','Ιούνιος','Ιούλιος','Αύγουστος','Σεπτέμβριος','Οκτώβριος','Νοέμβριος','Δεκέμβριος'];
const TILLAGE_TYPES = ['Συμβατική', 'Μειωμένη', 'Strip-till', 'Ακαλλιέργεια/No-till', 'Άλλο'];
const CROP_LIST = ['Ελιά ελαιοποιήσιμη','Ελιά επιτραπέζια','Βαμβάκι','Μαλακό σιτάρι','Σκληρό σιτάρι','Κριθάρι','Αραβόσιτος','Βρώμη','Λούπινο','Ηλίανθος','Σόγια','Σουσάμι','Βίκος','Κουκί','Αγρανάπαυση','Πράσινο ακτινίδιο','Αμπέλι','Εσπεριδοειδή','Κηπευτικά','Άλλο','Καμία'];
const ORGANIC_TYPES = ['Κοπριά βοοειδών','Υδαρής κοπριά βοοειδών (slurry)','Κοπριά χοίρων','Υδαρής κοπριά χοίρων','Κοπριά πουλερικών/Ορνιθώνα','Κοπριά αιγοπροβάτων','Κομπόστ','Χώνευμα/Υπολείμματα Βιοαερίου (Digestate)','Άλλο'];
const NITROGEN_TYPES = ['Αμμωνιακή ουρία (46-0-0)','Θειική αμμωνία','Νιτρική αμμωνία','Νιτρική αμμωνία + ασβέστης (CAN)','Υγρή αμμωνία','Διαλύματα ουρίας-αμμωνίου (UAN)','Σύνθετο λίπασμα (π.χ. NPK)','Διαφυλλικό αζωτούχο','Άλλο'];
const IRRIGATION_TYPES = ['Στάγδην','Μπεκ/Micro-sprinklers','Καρούλια/Κανόνια','Ράμπα οριζόντιου ποτίσματος','Κατάκλυση/Επιφανειακή','Άλλο'];
const PUMP_TYPES = ['Ηλεκτροκίνητη','Πετρελαιοκίνητη (Diesel)','Βενζινοκίνητη','Φωτοβολταϊκό/ΑΠΕ','Αρδευτικό δίκτυο ΤΟΕΒ','Άλλο'];
const FUEL_TYPES = ['Diesel','Βενζίνη','Ρεύμα Δικτύου','Άλλο'];
const LIME_TYPES = ['Ασβεστιτικός','Δολομιτικός','Άλλο'];
const SOIL_TYPES = ['Αμμώδες','Αργιλώδες','Πηλώδες','Αμμοπηλώδες','Αργιλοπηλώδες','Άλλο'];
const RESIDUES_OPTIONS = ['Παραμονή/Ενσωμάτωση','Απομάκρυνση','Καύση','Άλλο'];
const CERT_TYPES = ['Βιολογική γεωργία','GlobalG.A.P.','AGRO 2.1-2.2','Rainforest Alliance','Demeter','Άλλο'];
const TERMINATION_OPTIONS = ['Ενσωμάτωση στο έδαφος','Χημική Καταστροφή','Βόσκηση','Συγκομιδή','Άλλο'];

const SECTIONS = [
  { key: 'info', label: 'Στοιχεία', icon: '📋' },
  { key: 'tillage', label: 'Κατεργασία', icon: '🔨' },
  { key: 'crops', label: 'Καλλιέργειες', icon: '🌾' },
  { key: 'harvest_main', label: 'Συγκομιδή Κύρια', icon: '📅' },
  { key: 'harvest_cover', label: 'Επίσπορη', icon: '🌱' },
  { key: 'certification', label: 'Πιστοποίηση', icon: '📜' },
  { key: 'fertilizer_n', label: 'Λιπάσματα Αζωτούχα', icon: '🧪' },
  { key: 'fertilizer_org', label: 'Λιπάσματα Οργανικά', icon: '🌿' },
  { key: 'legitimacy', label: 'Νομιμοποιητικά', icon: '📄' },
];

function MapPicker({ value, onChange }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const initMap = () => {
      if (!window.L || !containerRef.current || mapRef.current) return;
      const L = window.L;
      const map = L.map(containerRef.current, { zoomControl: true }).setView([38.5, 22.0], 6);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors', maxZoom: 19,
      }).addTo(map);
      if (value) {
        const [lat, lng] = value.split(',').map(Number);
        if (!isNaN(lat) && !isNaN(lng)) {
          markerRef.current = L.marker([lat, lng]).addTo(map);
          map.setView([lat, lng], 13);
        }
      }
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        const coords = `${lat.toFixed(6)},${lng.toFixed(6)}`;
        onChange(coords);
        if (markerRef.current) { markerRef.current.setLatLng([lat, lng]); }
        else { markerRef.current = L.marker([lat, lng]).addTo(map); }
      });
      mapRef.current = map;
    };
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link'); link.id = 'leaflet-css';
      link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    if (window.L) { initMap(); }
    else if (!document.getElementById('leaflet-js')) {
      const s = document.createElement('script'); s.id = 'leaflet-js';
      s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      s.onload = initMap; document.body.appendChild(s);
    } else { document.getElementById('leaflet-js').addEventListener('load', initMap); }
    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; markerRef.current = null; } };
  }, []);

  const handleUseLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude: lat, longitude: lng } = pos.coords;
      const coords = `${lat.toFixed(6)},${lng.toFixed(6)}`;
      onChange(coords);
      if (window.L && mapRef.current) {
        mapRef.current.setView([lat, lng], 14);
        if (markerRef.current) { markerRef.current.setLatLng([lat, lng]); }
        else { markerRef.current = window.L.marker([lat, lng]).addTo(mapRef.current); }
      }
    });
  };

  return (
    <div>
      <div ref={containerRef} style={{ height: '280px', width: '100%', borderRadius: '8px', border: '1px solid #d0d8cc', marginBottom: '8px', position: 'relative', zIndex: 0 }} />
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
        <button type="button" onClick={handleUseLocation} style={{ padding: '6px 14px', border: '1px solid #4a8c2a', borderRadius: '6px', background: '#f0f7ec', color: '#1a3d2b', fontSize: '12px', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontWeight: '500' }}>
          📍 Χρήση αυτής της τοποθεσίας
        </button>
        <span style={{ fontSize: '12px', color: '#888' }}>ή κάντε κλικ στον χάρτη</span>
      </div>
      {value && <div style={{ fontSize: '12px', color: '#4a8c2a', marginTop: '2px' }}>✓ Συντεταγμένες: {value}</div>}
    </div>
  );
}

export default function Fields() {
  const router = useRouter();
  const [numPlots, setNumPlots] = useState(0);
  const [activePlot, setActivePlot] = useState(1);
  const [activeSection, setActiveSection] = useState('info');
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [legalFiles, setLegalFiles] = useState({});
  const [certFiles, setCertFiles] = useState({});
  const [gisFiles, setGisFiles] = useState({});
  const [soilFiles, setSoilFiles] = useState({});
  const [legalErrors, setLegalErrors] = useState({});
  const [alloError, setAlloError] = useState('');

  useEffect(() => {
    if (!router.isReady) return;
    const plots = parseInt(router.query.plots) || 1;
    setNumPlots(plots);
  }, [router.isReady, router.query]);

  const setField = (plot, section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [`plot${plot}`]: {
        ...prev[`plot${plot}`],
        [section]: {
          ...prev[`plot${plot}`]?.[section],
          [field]: value,
        },
      },
    }));
  };

  const setYearField = (plot, section, year, field, value) => {
    setFormData(prev => ({
      ...prev,
      [`plot${plot}`]: {
        ...prev[`plot${plot}`],
        [section]: {
          ...prev[`plot${plot}`]?.[section],
          [year]: {
            ...prev[`plot${plot}`]?.[section]?.[year],
            [field]: value,
          },
        },
      },
    }));
  };

  const val = (plot, section, field) => formData[`plot${plot}`]?.[section]?.[field] || '';
  const yearVal = (plot, section, year, field) => formData[`plot${plot}`]?.[section]?.[year]?.[field] || '';

  const tillageEntries = (plot, year) => {
    const e = formData[`plot${plot}`]?.tillage?.[year];
    return Array.isArray(e) ? e : [{}];
  };
  const addTillageEntry = (plot, year) => setFormData(prev => {
    const curr = prev[`plot${plot}`]?.tillage?.[year];
    const entries = Array.isArray(curr) ? curr : [{}];
    return { ...prev, [`plot${plot}`]: { ...prev[`plot${plot}`], tillage: { ...prev[`plot${plot}`]?.tillage, [year]: [...entries, {}] } } };
  });
  const removeTillageEntry = (plot, year, idx) => setFormData(prev => {
    const curr = prev[`plot${plot}`]?.tillage?.[year];
    const entries = Array.isArray(curr) ? curr : [{}];
    if (entries.length <= 1) return prev;
    return { ...prev, [`plot${plot}`]: { ...prev[`plot${plot}`], tillage: { ...prev[`plot${plot}`]?.tillage, [year]: entries.filter((_, i) => i !== idx) } } };
  });
  const setTillageEntry = (plot, year, idx, field, value) => setFormData(prev => {
    const curr = prev[`plot${plot}`]?.tillage?.[year];
    const entries = Array.isArray(curr) ? curr : [{}];
    return { ...prev, [`plot${plot}`]: { ...prev[`plot${plot}`], tillage: { ...prev[`plot${plot}`]?.tillage, [year]: entries.map((e, i) => i === idx ? { ...e, [field]: value } : e) } } };
  });

  const setTillageCount = (plot, year, n) => {
    const count = Math.max(0, parseInt(n) || 0);
    setFormData(prev => {
      const curr = prev[`plot${plot}`]?.tillage?.[year];
      const entries = Array.isArray(curr) ? curr : [];
      const newEntries = Array.from({ length: count }, (_, i) => entries[i] || {});
      return { ...prev, [`plot${plot}`]: { ...prev[`plot${plot}`], tillage: { ...prev[`plot${plot}`]?.tillage, [year]: newEntries } } };
    });
  };

  function SelectOther({ value, otherValue, onChange, onOtherChange, options }) {
    return (
      <>
        <select value={value} onChange={e => onChange(e.target.value)}>
          <option value="">Επιλέξτε...</option>
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
        {value === 'Άλλο' && (
          <input
            type="text"
            required
            placeholder="Παρακαλώ προσδιορίστε..."
            style={{ marginTop: '8px' }}
            value={otherValue || ''}
            onChange={e => onOtherChange(e.target.value)}
          />
        )}
      </>
    );
  }

  const submit = async () => {
    setLoading(true);
    try {
      await fetch('/api/submit-fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: formData, farmerId: router.query.id }),
      });
      setSubmitted(true);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const checkAlloFilled = (plot, section) => {
    const sec = formData[`plot${plot}`]?.[section] || {};
    const simpleSelects = {
      info: ['soil_type', 'lime_type', 'irr_type', 'pump_type', 'residues'],
      certification: ['cert_type'],
    };
    if (simpleSelects[section]) {
      for (const f of simpleSelects[section]) {
        if (sec[f] === 'Άλλο' && !sec[`${f}_other`]) return false;
      }
    }
    const yearSelects = {
      crops: ['main', 'cover'],
      harvest_cover: ['termination'],
      fertilizer_n: ['type'],
      fertilizer_org: ['type'],
    };
    if (yearSelects[section]) {
      for (const year of YEARS) {
        const yd = sec[year] || {};
        for (const f of yearSelects[section]) {
          if (yd[f] === 'Άλλο' && !yd[`${f}_other`]) return false;
        }
      }
    }
    if (section === 'tillage') {
      for (const year of YEARS) {
        const entries = Array.isArray(sec[year]) ? sec[year] : [];
        for (const entry of entries) {
          if (entry.type === 'Άλλο' && !entry.type_other) return false;
        }
      }
    }
    return true;
  };

  const handleAdvance = () => {
    if (!checkAlloFilled(activePlot, activeSection)) {
      setAlloError('Παρακαλούμε συμπληρώστε όλα τα υποχρεωτικά πεδία "Άλλο".');
      return;
    }
    if (activeSection === 'certification' && val(activePlot, 'certification', 'has_cert') === 'Ναι') {
      if (!val(activePlot, 'certification', 'cert_number') && !certFiles[`plot${activePlot}`]) {
        setAlloError('Παρακαλώ συμπληρώστε τον αριθμό πιστοποίησης ή ανεβάστε το αρχείο πιστοποίησης.');
        return;
      }
    }
    setAlloError('');
    const idx = SECTIONS.findIndex(s => s.key === activeSection);
    if (idx < SECTIONS.length - 1) {
      setActiveSection(SECTIONS[idx + 1].key);
    } else if (activePlot < numPlots) {
      setActivePlot(activePlot + 1);
      setActiveSection('info');
    } else {
      validateAndSubmit();
    }
  };

  const validateAndSubmit = () => {
    const errs = {};
    for (let p = 1; p <= numPlots; p++) {
      const files = legalFiles[`plot${p}`];
      const hasFile = files && files.length > 0;
      const hasDecl = formData[`plot${p}`]?.legitimacy?.carbon_declaration === 'true';
      if (!hasFile) errs[`file_${p}`] = true;
      if (!hasDecl) errs[`decl_${p}`] = true;
    }
    if (Object.keys(errs).length > 0) {
      setLegalErrors(errs);
      setActiveSection('legitimacy');
      const firstPlotErr = parseInt(Object.keys(errs)[0].split('_')[1]);
      setActivePlot(firstPlotErr);
      return;
    }
    submit();
  };

  if (submitted) return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#f4f7f4', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '3rem', textAlign: 'center', border: '1px solid #e0ead8', maxWidth: '400px' }}>
        <div style={{ fontSize: '48px', marginBottom: '1rem' }}>✅</div>
        <h2 style={{ color: '#1a3d2b', fontSize: '20px', marginBottom: '8px' }}>Σας ευχαριστούμε!</h2>
        <p style={{ color: '#666', fontSize: '14px' }}>Τα στοιχεία αγροτεμαχίων υποβλήθηκαν επιτυχώς.</p>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>Roots of Carbon — Καταγραφή Αγροτεμαχίων</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: #f4f7f4; min-height: 100vh; padding: 2rem 1rem; }
        .wrap { max-width: 760px; margin: 0 auto; }
        .header { background: #1a3d2b; border-radius: 12px; padding: 1.5rem 2rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 1rem; }
        .logo { width: 48px; height: 48px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
        .header h1 { color: white; font-size: 18px; font-weight: 600; }
        .header p { color: rgba(255,255,255,0.65); font-size: 13px; margin-top: 2px; }
        .plot-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 1rem; }
        .plot-tab { padding: 8px 18px; border-radius: 99px; border: 1px solid #d0d8cc; background: white; font-size: 13px; cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.15s; color: #333; }
        .plot-tab:hover { border-color: #4a8c2a; }
        .plot-tab.active { background: #1a3d2b; color: white; border-color: #1a3d2b; }
        .section-nav { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 1.5rem; }
        .sec-btn { padding: 6px 12px; border-radius: 8px; border: 1px solid #d0d8cc; background: white; font-size: 12px; cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.15s; color: #555; display: flex; align-items: center; gap: 4px; }
        .sec-btn:hover { border-color: #4a8c2a; color: #1a3d2b; }
        .sec-btn.active { background: #e8f4e0; border-color: #4a8c2a; color: #1a3d2b; font-weight: 500; }
        .card { background: white; border-radius: 12px; padding: 2rem; border: 1px solid #e0ead8; }
        .section-title { font-size: 15px; font-weight: 600; color: #1a3d2b; margin-bottom: 4px; }
        .section-sub { font-size: 13px; color: #888; margin-bottom: 1.5rem; }
        label { display: block; font-size: 13px; font-weight: 500; color: #333; margin-bottom: 5px; }
        input, select, textarea { width: 100%; border: 1px solid #d0d8cc; border-radius: 8px; padding: 10px 12px; font-size: 14px; font-family: 'Inter', sans-serif; color: #333; background: white; outline: none; transition: border-color 0.2s; }
        input:not([type=file]):not([type=checkbox]):not([type=radio]), select { height: 38px; padding: 0 12px; }
        textarea { padding: 10px 12px; }
        input:focus, select:focus, textarea:focus { border-color: #4a8c2a; box-shadow: 0 0 0 3px rgba(74,140,42,0.1); }
        .field { margin-bottom: 1rem; }
        .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; align-items: flex-end; }
        .row3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; align-items: flex-end; }
        .year-block { border: 1px solid #e0ead8; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; }
        .year-header { font-size: 12px; font-weight: 600; color: #1a3d2b; background: #f0f7ec; padding: 4px 10px; border-radius: 4px; display: inline-block; margin-bottom: 10px; }
        .nav-row { display: flex; justify-content: space-between; margin-top: 2rem; gap: 12px; }
        .btn { padding: 10px 24px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.15s; }
        .btn-sec { background: white; color: #1a3d2b; border: 1px solid #d0d8cc; }
        .btn-sec:hover { background: #f5f5f5; }
        .btn-pri { background: #1a3d2b; color: white; border: none; margin-left: auto; }
        .btn-pri:hover { background: #4a8c2a; }
        .divider { border: none; border-top: 1px solid #e0ead8; margin: 1.5rem 0; }
        .radio-row { display: flex; gap: 12px; }
        .radio-opt { display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 13px; color: #333; }
        .member-box { background: #f0f7ec; border: 1px solid #c8e0b4; border-radius: 8px; padding: 1rem 1.25rem; margin-bottom: 1rem; }
        .member-box-header { font-size: 13px; font-weight: 600; color: #1a3d2b; margin-bottom: 1rem; }
      `}</style>

      <div className="wrap">
        <div className="header">
          <div className="logo">🌱</div>
          <div>
            <h1>Roots of Carbon</h1>
            <p>Καταγραφή στοιχείων αγροτεμαχίων</p>
          </div>
        </div>

        <div className="plot-tabs">
          {Array.from({ length: numPlots }, (_, i) => i + 1).map(p => (
            <button key={p} className={`plot-tab ${activePlot === p ? 'active' : ''}`} onClick={() => setActivePlot(p)}>
              Αγροτεμάχιο {p}
            </button>
          ))}
        </div>

        <div className="section-nav">
          {SECTIONS.map(s => (
            <button key={s.key} className={`sec-btn ${activeSection === s.key ? 'active' : ''}`} onClick={() => setActiveSection(s.key)}>
              {s.icon} {s.label}
            </button>
          ))}
        </div>

        <div className="card">

          {/* ΣΤΟΙΧΕΙΑ */}
          {activeSection === 'info' && (
            <>
              <div className="section-title">📋 Στοιχεία αγροτεμαχίου {activePlot}</div>
              <div className="section-sub">Βασικές πληροφορίες για το αγροτεμάχιο.</div>
              <div className="row2">
                <div className="field">
                  <label>Περιοχή</label>
                  <input type="text" placeholder="π.χ. Ηλεία" value={val(activePlot,'info','region')} onChange={e => setField(activePlot,'info','region',e.target.value)} />
                </div>
                <div className="field">
                  <label>Έκταση (στρέμματα)</label>
                  <input type="number" placeholder="π.χ. 50" step="0.1" value={val(activePlot,'info','area')} onChange={e => setField(activePlot,'info','area',e.target.value)} />
                </div>
              </div>

              <div className="field">
                <label>Συντεταγμένες (κάντε κλικ στον χάρτη ή χρησιμοποιήστε GPS)</label>
                <input
                  type="text"
                  placeholder="π.χ. 38.246111,21.735556"
                  value={val(activePlot,'info','gis_link')}
                  onChange={e => setField(activePlot,'info','gis_link',e.target.value)}
                  style={{ marginBottom: '8px' }}
                />
                <MapPicker
                  key={activePlot}
                  value={val(activePlot,'info','gis_link')}
                  onChange={v => setField(activePlot,'info','gis_link',v)}
                />
                <div style={{ marginTop: '10px' }}>
                  <label style={{ marginBottom: '4px' }}>Αρχείο KML/Shapefile</label>
                  <input
                    type="file"
                    accept=".kml,.shp,.zip"
                    style={{ padding: '8px 0', border: 'none' }}
                    onChange={e => setGisFiles(prev => ({ ...prev, [`plot${activePlot}`]: e.target.files[0] }))}
                  />
                </div>
              </div>

              <div className="row2">
                <div className="field">
                  <label>Εδαφική ανάλυση</label>
                  <input type="text" placeholder="Link εδαφολογικής ανάλυσης (URL)" value={val(activePlot,'info','soil_link')} onChange={e => setField(activePlot,'info','soil_link',e.target.value)} />
                  <div style={{ marginTop: '8px' }}>
                    <label style={{ fontSize: '12px', color: '#666', fontWeight: '400', marginBottom: '4px' }}>ή ανεβάστε αρχείο (.pdf, .jpg, .png)</label>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ padding: '8px 0', border: 'none' }} onChange={e => setSoilFiles(prev => ({ ...prev, [`plot${activePlot}`]: e.target.files[0] }))} />
                  </div>
                </div>
                <div className="field">
                  <label>Τύπος εδάφους</label>
                  <select value={val(activePlot,'info','soil_type')} onChange={e => setField(activePlot,'info','soil_type',e.target.value)}>
                    <option value="">Επιλέξτε...</option>
                    {SOIL_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                  {val(activePlot,'info','soil_type') === 'Άλλο' && (
                    <input type="text" required placeholder="Παρακαλώ προσδιορίστε..." style={{ marginTop: '8px' }} value={val(activePlot,'info','soil_type_other')} onChange={e => setField(activePlot,'info','soil_type_other',e.target.value)} />
                  )}
                </div>
              </div>

              <div className="row2">
                <div className="field">
                  <label>Εφαρμογή εδαφικού ασβέστη</label>
                  <select value={val(activePlot,'info','lime')} onChange={e => setField(activePlot,'info','lime',e.target.value)}>
                    <option value="">Επιλέξτε...</option>
                    <option>Ναι</option><option>Όχι</option>
                  </select>
                </div>
                <div className="field">
                  <label>Φυτοκάλυψη χειμώνα (cover crops)</label>
                  <select value={val(activePlot,'info','cover_crops')} onChange={e => setField(activePlot,'info','cover_crops',e.target.value)}>
                    <option value="">Επιλέξτε...</option>
                    <option>Ναι, τακτικά</option>
                    <option>Ναι, περιστασιακά</option>
                    <option>Όχι</option>
                  </select>
                </div>
              </div>

              {val(activePlot,'info','lime') === 'Ναι' && (
                <div className="row2">
                  <div className="field">
                    <label>Τύπος ασβέστη *</label>
                    <select required value={val(activePlot,'info','lime_type')} onChange={e => setField(activePlot,'info','lime_type',e.target.value)}>
                      <option value="">Επιλέξτε...</option>
                      {LIME_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                    {val(activePlot,'info','lime_type') === 'Άλλο' && (
                      <input type="text" required placeholder="Παρακαλώ προσδιορίστε..." style={{ marginTop: '8px' }} value={val(activePlot,'info','lime_type_other')} onChange={e => setField(activePlot,'info','lime_type_other',e.target.value)} />
                    )}
                  </div>
                  <div className="field">
                    <label>Ποσότητα (tn/στρέμμα) *</label>
                    <input required type="number" placeholder="π.χ. 0.25" step="0.01" value={val(activePlot,'info','lime_qty')} onChange={e => setField(activePlot,'info','lime_qty',e.target.value)} />
                  </div>
                </div>
              )}

              <div className="row3">
                <div className="field">
                  <label>Διαχείριση υπολειμμάτων</label>
                  <select value={val(activePlot,'info','residues')} onChange={e => setField(activePlot,'info','residues',e.target.value)}>
                    <option value="">Επιλέξτε...</option>
                    {RESIDUES_OPTIONS.map(o => <option key={o}>{o}</option>)}
                  </select>
                  {val(activePlot,'info','residues') === 'Άλλο' && (
                    <input type="text" required placeholder="Παρακαλώ προσδιορίστε..." style={{ marginTop: '8px' }} value={val(activePlot,'info','residues_other')} onChange={e => setField(activePlot,'info','residues_other',e.target.value)} />
                  )}
                </div>
                <div className="field">
                  <label>Αρδευόμενο</label>
                  <select value={val(activePlot,'info','irrigated')} onChange={e => setField(activePlot,'info','irrigated',e.target.value)}>
                    <option value="">Επιλέξτε...</option>
                    <option>Ναι</option><option>Όχι</option>
                  </select>
                </div>
                <div className="field">
                  <label>Έξυπνη άρδευση</label>
                  <select value={val(activePlot,'info','smart_irr')} onChange={e => setField(activePlot,'info','smart_irr',e.target.value)}>
                    <option value="">Επιλέξτε...</option>
                    <option>Ναι</option><option>Όχι</option>
                  </select>
                </div>
              </div>

              {val(activePlot,'info','residues') === 'Απομάκρυνση' && (
                <div className="field">
                  <label>Ποσοστό (%) υπολειμμάτων που απομακρύνθηκε *</label>
                  <input required type="number" min="0" max="100" placeholder="π.χ. 80" value={val(activePlot,'info','residues_pct')} onChange={e => setField(activePlot,'info','residues_pct',e.target.value)} />
                </div>
              )}

              {val(activePlot,'info','irrigated') === 'Ναι' && (
                <>
                  <div className="row2">
                    <div className="field">
                      <label>Ποσότητα νερού (m³/στρέμμα) *</label>
                      <input required type="number" placeholder="π.χ. 50" value={val(activePlot,'info','irr_qty')} onChange={e => setField(activePlot,'info','irr_qty',e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Τύπος Άρδευσης *</label>
                      <select required value={val(activePlot,'info','irr_type')} onChange={e => setField(activePlot,'info','irr_type',e.target.value)}>
                        <option value="">Επιλέξτε...</option>
                        {IRRIGATION_TYPES.map(o => <option key={o}>{o}</option>)}
                      </select>
                      {val(activePlot,'info','irr_type') === 'Άλλο' && (
                        <input type="text" required placeholder="Παρακαλώ προσδιορίστε..." style={{ marginTop: '8px' }} value={val(activePlot,'info','irr_type_other')} onChange={e => setField(activePlot,'info','irr_type_other',e.target.value)} />
                      )}
                    </div>
                  </div>
                  <div className="row2">
                    <div className="field">
                      <label>Τύπος Αντλίας *</label>
                      <select required value={val(activePlot,'info','pump_type')} onChange={e => setField(activePlot,'info','pump_type',e.target.value)}>
                        <option value="">Επιλέξτε...</option>
                        {PUMP_TYPES.map(o => <option key={o}>{o}</option>)}
                      </select>
                      {val(activePlot,'info','pump_type') === 'Άλλο' && (
                        <input type="text" required placeholder="Παρακαλώ προσδιορίστε..." style={{ marginTop: '8px' }} value={val(activePlot,'info','pump_type_other')} onChange={e => setField(activePlot,'info','pump_type_other',e.target.value)} />
                      )}
                    </div>
                    {['Ηλεκτροκίνητη','Φωτοβολταϊκό/ΑΠΕ'].includes(val(activePlot,'info','pump_type')) && (
                      <div className="field">
                        <label>Κατανάλωση ρεύματος (kWh/έτος) *</label>
                        <input required type="number" placeholder="π.χ. 1200" value={val(activePlot,'info','pump_kwh')} onChange={e => setField(activePlot,'info','pump_kwh',e.target.value)} />
                      </div>
                    )}
                    {['Πετρελαιοκίνητη (Diesel)','Βενζινοκίνητη','Άλλο'].includes(val(activePlot,'info','pump_type')) && (
                      <div className="field">
                        <label>Κατανάλωση καυσίμου (λίτρα/έτος) *</label>
                        <input required type="number" placeholder="π.χ. 800" value={val(activePlot,'info','fuel_liters')} onChange={e => setField(activePlot,'info','fuel_liters',e.target.value)} />
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="row2">
                <div className="field">
                  <label>Βόσκηση</label>
                  <select value={val(activePlot,'info','grazing')} onChange={e => setField(activePlot,'info','grazing',e.target.value)}>
                    <option value="">Επιλέξτε...</option>
                    <option>Ναι</option><option>Όχι</option>
                  </select>
                </div>
                {val(activePlot,'info','grazing') === 'Ναι' && (
                  <div className="field">
                    <label>Αριθμός ζώων</label>
                    <input type="number" placeholder="π.χ. 50" value={val(activePlot,'info','animals')} onChange={e => setField(activePlot,'info','animals',e.target.value)} />
                  </div>
                )}
              </div>
              <div className="field">
                <label>Σχόλια</label>
                <textarea rows={3} placeholder="Οποιαδήποτε πρόσθετη πληροφορία..." value={val(activePlot,'info','notes')} onChange={e => setField(activePlot,'info','notes',e.target.value)} />
              </div>
            </>
          )}

          {/* ΚΑΤΕΡΓΑΣΙΑ */}
          {activeSection === 'tillage' && (
            <>
              <div className="section-title">🔨 Κατεργασία εδάφους — Αγροτεμάχιο {activePlot}</div>
              <div className="section-sub">Καταχωρίστε τον αριθμό εργασιών κατεργασίας για κάθε έτος.</div>
              {YEARS.map(year => (
                <div className="year-block" key={year}>
                  <div className="year-header">{year}</div>
                  <div className="field" style={{ maxWidth: '240px' }}>
                    <label>Πόσες φορές κάνατε κατεργασία;</label>
                    <select
                      value={tillageEntries(activePlot, year).length}
                      onChange={e => {
                        const newN = parseInt(e.target.value) || 0;
                        const oldN = tillageEntries(activePlot, year).length;
                        if (newN < oldN) {
                          const hasData = tillageEntries(activePlot, year).slice(newN).some(en => en.type || en.month || en.depth);
                          if (hasData && !window.confirm(`Θα διαγραφούν ${oldN - newN} εγγραφές κατεργασίας. Συνέχεια;`)) return;
                        }
                        setTillageCount(activePlot, year, newN);
                      }}
                    >
                      {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n === 0 ? '—' : n}</option>)}
                    </select>
                  </div>
                  {tillageEntries(activePlot, year).map((entry, idx) => (
                    <div key={idx} style={{ background: '#fafbfa', border: '1px solid #e8f0e4', borderRadius: '6px', padding: '12px 12px 6px', marginBottom: '8px', marginTop: idx === 0 ? '8px' : '0' }}>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#1a3d2b', marginBottom: '10px' }}>Εργασία {idx + 1}</div>
                      <div className="row2">
                        <div className="field">
                          <label>Τύπος κατεργασίας</label>
                          <select value={entry.type || ''} onChange={e => setTillageEntry(activePlot, year, idx, 'type', e.target.value)}>
                            <option value="">Επιλέξτε...</option>
                            {TILLAGE_TYPES.map(t => <option key={t}>{t}</option>)}
                          </select>
                          {entry.type === 'Άλλο' && (
                            <input type="text" required placeholder="Παρακαλώ προσδιορίστε..." style={{ marginTop: '8px' }} value={entry.type_other || ''} onChange={e => setTillageEntry(activePlot, year, idx, 'type_other', e.target.value)} />
                          )}
                        </div>
                        <div className="field">
                          <label>Μήνας εφαρμογής</label>
                          <select value={entry.month || ''} onChange={e => setTillageEntry(activePlot, year, idx, 'month', e.target.value)}>
                            <option value="">Επιλέξτε...</option>
                            {MONTHS.map(m => <option key={m}>{m}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="row2">
                        <div className="field">
                          <label>Βάθος εφαρμογής (cm)</label>
                          <input type="number" placeholder="π.χ. 25" value={entry.depth || ''} onChange={e => setTillageEntry(activePlot, year, idx, 'depth', e.target.value)} />
                        </div>
                        <div className="field">
                          <label>Αριθμός Περασμάτων</label>
                          <input type="number" placeholder="π.χ. 2" value={entry.passes || ''} onChange={e => setTillageEntry(activePlot, year, idx, 'passes', e.target.value)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}

          {/* ΚΑΛΛΙΕΡΓΕΙΕΣ */}
          {activeSection === 'crops' && (
            <>
              <div className="section-title">🌾 Καλλιεργούμενα είδη — Αγροτεμάχιο {activePlot}</div>
              <div className="section-sub">Κύρια και δευτερεύουσα καλλιέργεια ανά έτος.</div>
              {YEARS.map(year => (
                <div className="year-block" key={year}>
                  <div className="year-header">{year}</div>
                  <div className="row2">
                    <div className="field">
                      <label>Κύρια καλλιέργεια</label>
                      <select value={yearVal(activePlot,'crops',year,'main')} onChange={e => setYearField(activePlot,'crops',year,'main',e.target.value)}>
                        <option value="">Επιλέξτε...</option>
                        {CROP_LIST.map(c => <option key={c}>{c}</option>)}
                      </select>
                      {yearVal(activePlot,'crops',year,'main') === 'Άλλο' && (
                        <input type="text" required placeholder="Παρακαλώ προσδιορίστε..." style={{ marginTop: '8px' }} value={yearVal(activePlot,'crops',year,'main_other')} onChange={e => setYearField(activePlot,'crops',year,'main_other',e.target.value)} />
                      )}
                    </div>
                    <div className="field">
                      <label>Δευτερεύουσα / Επίσπορη</label>
                      <select value={yearVal(activePlot,'crops',year,'cover')} onChange={e => setYearField(activePlot,'crops',year,'cover',e.target.value)}>
                        <option value="">Επιλέξτε...</option>
                        {CROP_LIST.map(c => <option key={c}>{c}</option>)}
                      </select>
                      {yearVal(activePlot,'crops',year,'cover') === 'Άλλο' && (
                        <input type="text" required placeholder="Παρακαλώ προσδιορίστε..." style={{ marginTop: '8px' }} value={yearVal(activePlot,'crops',year,'cover_other')} onChange={e => setYearField(activePlot,'crops',year,'cover_other',e.target.value)} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* ΣΥΓΚΟΜΙΔΗ ΚΥΡΙΑ */}
          {activeSection === 'harvest_main' && (
            <>
              <div className="section-title">📅 Σχεδιασμός & Συγκομιδή Κύριας — Αγροτεμάχιο {activePlot}</div>
              <div className="section-sub">Ημερομηνίες σποράς, συγκομιδής και απόδοση ανά έτος.</div>
              {YEARS.map(year => (
                <div className="year-block" key={year}>
                  <div className="year-header">{year}</div>
                  <div className="row3">
                    <div className="field">
                      <label>Μήνας σποράς</label>
                      <select value={yearVal(activePlot,'harvest_main',year,'sow_month')} onChange={e => setYearField(activePlot,'harvest_main',year,'sow_month',e.target.value)}>
                        <option value="">Επιλέξτε...</option>
                        {MONTHS.map(m => <option key={m}>{m}</option>)}
                      </select>
                    </div>
                    <div className="field">
                      <label>Μήνας συγκομιδής</label>
                      <select value={yearVal(activePlot,'harvest_main',year,'harvest_month')} onChange={e => setYearField(activePlot,'harvest_main',year,'harvest_month',e.target.value)}>
                        <option value="">Επιλέξτε...</option>
                        {MONTHS.map(m => <option key={m}>{m}</option>)}
                      </select>
                    </div>
                    <div className="field">
                      <label>Απόδοση (kg/στρέμμα)</label>
                      <input type="number" placeholder="π.χ. 300" value={yearVal(activePlot,'harvest_main',year,'yield')} onChange={e => setYearField(activePlot,'harvest_main',year,'yield',e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* ΣΥΓΚΟΜΙΔΗ ΕΠΙΣΠΟΡΗ */}
          {activeSection === 'harvest_cover' && (
            <>
              <div className="section-title">🌱 Επίσπορη Καλλιέργεια — Αγροτεμάχιο {activePlot}</div>
              <div className="section-sub">Στοιχεία επίσπορης καλλιέργειας ανά έτος.</div>
              {YEARS.map(year => (
                <div className="year-block" key={year}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div className="year-header" style={{ marginBottom: 0 }}>{year}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '12px', color: '#555' }}>Εφαρμογή Επίσπορης Καλλιέργειας:</span>
                      <div className="radio-row">
                        {['Ναι', 'Όχι'].map(opt => (
                          <label key={opt} className="radio-opt">
                            <input type="radio" name={`cover_apply_${activePlot}_${year}`} value={opt} checked={yearVal(activePlot,'harvest_cover',year,'applies') === opt} onChange={() => setYearField(activePlot,'harvest_cover',year,'applies',opt)} style={{ width: 'auto' }} />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  {yearVal(activePlot,'harvest_cover',year,'applies') === 'Ναι' && (
                    <>
                      <div className="row2">
                        <div className="field">
                          <label>Ημερομηνία Σποράς</label>
                          <input type="date" value={yearVal(activePlot,'harvest_cover',year,'sow_date')} onChange={e => setYearField(activePlot,'harvest_cover',year,'sow_date',e.target.value)} />
                        </div>
                        <div className="field">
                          <label>Ημερομηνία Τερματισμού</label>
                          <input type="date" value={yearVal(activePlot,'harvest_cover',year,'end_date')} onChange={e => setYearField(activePlot,'harvest_cover',year,'end_date',e.target.value)} />
                        </div>
                      </div>
                      <div className="field">
                        <label>Μέθοδος Τερματισμού</label>
                        <select value={yearVal(activePlot,'harvest_cover',year,'termination')} onChange={e => setYearField(activePlot,'harvest_cover',year,'termination',e.target.value)}>
                          <option value="">Επιλέξτε...</option>
                          {TERMINATION_OPTIONS.map(o => <option key={o}>{o}</option>)}
                        </select>
                        {yearVal(activePlot,'harvest_cover',year,'termination') === 'Άλλο' && (
                          <input type="text" required placeholder="Παρακαλώ προσδιορίστε..." style={{ marginTop: '8px' }} value={yearVal(activePlot,'harvest_cover',year,'termination_other')} onChange={e => setYearField(activePlot,'harvest_cover',year,'termination_other',e.target.value)} />
                        )}
                      </div>
                      {yearVal(activePlot,'harvest_cover',year,'termination') === 'Συγκομιδή' && (
                        <div className="field">
                          <label>Απόδοση (kg/στρέμμα) *</label>
                          <input required type="number" placeholder="π.χ. 150" value={yearVal(activePlot,'harvest_cover',year,'yield')} onChange={e => setYearField(activePlot,'harvest_cover',year,'yield',e.target.value)} />
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </>
          )}

          {/* ΠΙΣΤΟΠΟΙΗΣΗ */}
          {activeSection === 'certification' && (
            <>
              <div className="section-title">📜 Πιστοποίηση καλλιέργειας — Αγροτεμάχιο {activePlot}</div>
              <div className="section-sub">Στοιχεία πιστοποίησης για το αγροτεμάχιο.</div>

              <div className="field">
                <label>Διαθέτετε πιστοποίηση για την καλλιέργειά σας;</label>
                <div className="radio-row" style={{ marginTop: '6px' }}>
                  {['Ναι', 'Όχι'].map(opt => (
                    <label key={opt} className="radio-opt">
                      <input type="radio" name={`has_cert_${activePlot}`} value={opt} checked={val(activePlot,'certification','has_cert') === opt} onChange={() => setField(activePlot,'certification','has_cert',opt)} style={{ width: 'auto' }} />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              {val(activePlot,'certification','has_cert') === 'Ναι' && (
                <>
                  <div className="field">
                    <label>Τύπος πιστοποίησης *</label>
                    <select required value={val(activePlot,'certification','cert_type')} onChange={e => setField(activePlot,'certification','cert_type',e.target.value)}>
                      <option value="">Επιλέξτε...</option>
                      {CERT_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                    {val(activePlot,'certification','cert_type') === 'Άλλο' && (
                      <input type="text" required placeholder="Παρακαλώ προσδιορίστε..." style={{ marginTop: '8px' }} value={val(activePlot,'certification','cert_type_other')} onChange={e => setField(activePlot,'certification','cert_type_other',e.target.value)} />
                    )}
                  </div>
                  <div className="field">
                    <label>Αριθμός πιστοποίησης *</label>
                    <input required type="text" placeholder="π.χ. GR-ORG-001" value={val(activePlot,'certification','cert_number')} onChange={e => setField(activePlot,'certification','cert_number',e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Αρχείο πιστοποίησης</label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      style={{ padding: '8px 0', border: 'none' }}
                      onChange={e => setCertFiles(prev => ({ ...prev, [`plot${activePlot}`]: e.target.files[0] }))}
                    />
                  </div>
                </>
              )}
            </>
          )}

          {/* ΛΙΠΑΣΜΑΤΑ ΑΖΩΤΟΥΧΑ */}
          {activeSection === 'fertilizer_n' && (
            <>
              <div className="section-title">🧪 Αζωτούχα Λιπάσματα — Αγροτεμάχιο {activePlot}</div>
              <div className="section-sub">Τύπος, μήνας εφαρμογής και ποσότητα ανά έτος.</div>
              <div className="field" style={{ marginBottom: '1.5rem' }}>
                <label>Χρησιμοποιήσατε λιπάσματα με άζωτο;</label>
                <div className="radio-row" style={{ marginTop: '6px' }}>
                  {['Ναι', 'Όχι'].map(opt => (
                    <label key={opt} className="radio-opt">
                      <input type="radio" name={`fert_n_applied_${activePlot}`} value={opt} checked={val(activePlot,'fertilizer_n','applied') === opt} onChange={() => setField(activePlot,'fertilizer_n','applied',opt)} style={{ width: 'auto' }} />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
              {val(activePlot,'fertilizer_n','applied') === 'Ναι' && YEARS.map(year => (
                <div className="year-block" key={year}>
                  <div className="year-header">{year}</div>
                  <div className="row3">
                    <div className="field">
                      <label>Τύπος λιπάσματος</label>
                      <select value={yearVal(activePlot,'fertilizer_n',year,'type')} onChange={e => setYearField(activePlot,'fertilizer_n',year,'type',e.target.value)}>
                        <option value="">Επιλέξτε...</option>
                        {NITROGEN_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                      {yearVal(activePlot,'fertilizer_n',year,'type') === 'Άλλο' && (
                        <input type="text" required placeholder="Παρακαλώ προσδιορίστε..." style={{ marginTop: '8px' }} value={yearVal(activePlot,'fertilizer_n',year,'type_other')} onChange={e => setYearField(activePlot,'fertilizer_n',year,'type_other',e.target.value)} />
                      )}
                    </div>
                    <div className="field">
                      <label>Μήνας εφαρμογής</label>
                      <select value={yearVal(activePlot,'fertilizer_n',year,'month')} onChange={e => setYearField(activePlot,'fertilizer_n',year,'month',e.target.value)}>
                        <option value="">Επιλέξτε...</option>
                        {MONTHS.map(m => <option key={m}>{m}</option>)}
                      </select>
                    </div>
                    <div className="field">
                      <label>Ποσότητα (kg/στρέμμα)</label>
                      <input type="number" placeholder="π.χ. 9.6" value={yearVal(activePlot,'fertilizer_n',year,'qty')} onChange={e => setYearField(activePlot,'fertilizer_n',year,'qty',e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* ΛΙΠΑΣΜΑΤΑ ΟΡΓΑΝΙΚΑ */}
          {activeSection === 'fertilizer_org' && (
            <>
              <div className="section-title">🌿 Οργανικά Λιπάσματα — Αγροτεμάχιο {activePlot}</div>
              <div className="section-sub">Τύπος, μήνας εφαρμογής και ποσότητα ανά έτος.</div>
              <div className="field" style={{ marginBottom: '1.5rem' }}>
                <label>Χρησιμοποιήσατε οργανικά λιπάσματα;</label>
                <div className="radio-row" style={{ marginTop: '6px' }}>
                  {['Ναι', 'Όχι'].map(opt => (
                    <label key={opt} className="radio-opt">
                      <input type="radio" name={`fert_org_applied_${activePlot}`} value={opt} checked={val(activePlot,'fertilizer_org','applied') === opt} onChange={() => setField(activePlot,'fertilizer_org','applied',opt)} style={{ width: 'auto' }} />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
              {val(activePlot,'fertilizer_org','applied') === 'Ναι' && YEARS.map(year => (
                <div className="year-block" key={year}>
                  <div className="year-header">{year}</div>
                  <div className="row3">
                    <div className="field">
                      <label>Τύπος οργανικού λιπάσματος</label>
                      <select value={yearVal(activePlot,'fertilizer_org',year,'type')} onChange={e => setYearField(activePlot,'fertilizer_org',year,'type',e.target.value)}>
                        <option value="">Επιλέξτε...</option>
                        {ORGANIC_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                      {yearVal(activePlot,'fertilizer_org',year,'type') === 'Άλλο' && (
                        <input type="text" required placeholder="Παρακαλώ προσδιορίστε..." style={{ marginTop: '8px' }} value={yearVal(activePlot,'fertilizer_org',year,'type_other')} onChange={e => setYearField(activePlot,'fertilizer_org',year,'type_other',e.target.value)} />
                      )}
                    </div>
                    <div className="field">
                      <label>Μήνας εφαρμογής</label>
                      <select value={yearVal(activePlot,'fertilizer_org',year,'month')} onChange={e => setYearField(activePlot,'fertilizer_org',year,'month',e.target.value)}>
                        <option value="">Επιλέξτε...</option>
                        {MONTHS.map(m => <option key={m}>{m}</option>)}
                      </select>
                    </div>
                    <div className="field">
                      <label>Ποσότητα (kg/στρέμμα)</label>
                      <input type="number" placeholder="π.χ. 50" value={yearVal(activePlot,'fertilizer_org',year,'qty')} onChange={e => setYearField(activePlot,'fertilizer_org',year,'qty',e.target.value)} />
                    </div>
                  </div>
                  <div className="row2">
                    <div className="field">
                      <label>Περιεκτικότητα σε Άζωτο (%)</label>
                      <input type="number" step="0.1" placeholder="π.χ. 1.5" value={yearVal(activePlot,'fertilizer_org',year,'n_pct')} onChange={e => setYearField(activePlot,'fertilizer_org',year,'n_pct',e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Περιεκτικότητα σε Άνθρακα (%)</label>
                      <input type="number" step="0.1" placeholder="π.χ. 12.0" value={yearVal(activePlot,'fertilizer_org',year,'c_pct')} onChange={e => setYearField(activePlot,'fertilizer_org',year,'c_pct',e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* ΝΟΜΙΜΟΠΟΙΗΤΙΚΑ */}
          {activeSection === 'legitimacy' && (
            <>
              <div className="section-title">📄 Νομιμοποιητικά — Αγροτεμάχιο {activePlot}</div>
              <div className="section-sub">Δικαιολογητικά και υπεύθυνη δήλωση για τα αγροτεμάχια.</div>
              <div className="field">
                <label>ΟΣΔΕ / Ενοικιαστήρια (αρχεία) *</label>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={e => { setLegalFiles(prev => ({ ...prev, [`plot${activePlot}`]: e.target.files })); setLegalErrors(prev => ({ ...prev, [`file_${activePlot}`]: false })); }}
                  style={{ padding: '8px 0', border: 'none' }}
                />
                {legalErrors[`file_${activePlot}`] && <div style={{ color: '#c0392b', fontSize: '12px', marginTop: '4px' }}>Απαιτείται τουλάχιστον ένα αρχείο ΟΣΔΕ/Ενοικιαστήριο.</div>}
              </div>
              <div className="field" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <input
                  type="checkbox"
                  id={`carbon_decl_${activePlot}`}
                  style={{ width: 'auto', marginTop: '3px', flexShrink: 0, accentColor: '#1a3d2b' }}
                  checked={val(activePlot,'legitimacy','carbon_declaration') === 'true'}
                  onChange={e => { setField(activePlot,'legitimacy','carbon_declaration', e.target.checked ? 'true' : ''); setLegalErrors(prev => ({ ...prev, [`decl_${activePlot}`]: false })); }}
                />
                <label htmlFor={`carbon_decl_${activePlot}`} style={{ fontWeight: '400', cursor: 'pointer', lineHeight: '1.5' }}>
                  Δηλώνω υπεύθυνα ότι τα αναγραφόμενα αγροτεμάχια δεν συμμετέχουν σε κανένα άλλο πρόγραμμα Carbon Credits *
                </label>
              </div>
              {legalErrors[`decl_${activePlot}`] && <div style={{ color: '#c0392b', fontSize: '12px', marginTop: '-8px', marginBottom: '8px' }}>Η δήλωση είναι υποχρεωτική.</div>}
            </>
          )}

          {alloError && (
            <div style={{ color: '#c0392b', fontSize: '13px', marginBottom: '1rem', padding: '8px 12px', background: '#fef0f0', border: '1px solid #fcd0d0', borderRadius: '6px' }}>
              {alloError}
            </div>
          )}
          <div className="nav-row">
            {SECTIONS.findIndex(s => s.key === activeSection) > 0 && (
              <button className="btn btn-sec" onClick={() => { setAlloError(''); setActiveSection(SECTIONS[SECTIONS.findIndex(s => s.key === activeSection) - 1].key); }}>
                ← Προηγούμενο
              </button>
            )}
            <button className="btn btn-pri" onClick={handleAdvance} disabled={loading}>
              {(() => {
                const idx = SECTIONS.findIndex(s => s.key === activeSection);
                if (idx < SECTIONS.length - 1) return 'Επόμενο →';
                if (activePlot < numPlots) return `Αγροτεμάχιο ${activePlot + 1} →`;
                return loading ? 'Υποβολή...' : 'Υποβολή φόρμας ✓';
              })()}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
