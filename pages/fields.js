import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const YEARS = [2021, 2022, 2023, 2024, 2025];
const MONTHS = ['Ιανουάριος','Φεβρουάριος','Μάρτιος','Απρίλιος','Μάιος','Ιούνιος','Ιούλιος','Αύγουστος','Σεπτέμβριος','Οκτώβριος','Νοέμβριος','Δεκέμβριος'];
const TILLAGE_TYPES = ['Συμβατική', 'Μειωμένη', 'Strip-till', 'Ακαλλιέργεια/No-till'];
const CROP_LIST = ['Ελιά ελαιοποιήσιμη', 'Ελιά επιτραπέζια', 'Βαμβάκι', 'Μαλακό σιτάρι', 'Σκληρό σιτάρι', 'Κριθάρι', 'Αραβόσιτος', 'Βρώμη', 'Λούπινο', 'Ηλίανθος', 'Σόγια', 'Σουσάμι', 'Βίκος', 'Κουκί', 'Αγρανάπαυση', 'Πράσινο ακτινίδιο', 'Αμπέλι', 'Εσπεριδοειδή', 'Κηπευτικά', 'Άλλο', 'Καμία'];
const FERTILIZER_TYPES = ['Στερεό', 'Υγρό', 'Διαφυλλικό'];
const ORGANIC_TYPES = ['Κοπριά βοοειδών', 'Υδαρής κοπριά βοοειδών (slurry)', 'Κοπριά χοίρων', 'Υδαρής κοπριά χοίρων', 'Κοπριά πουλερικών/Ορνιθώνα', 'Κοπριά αιγοπροβάτων', 'Κομπόστ', 'Χώνευμα/Υπολείμματα Βιοαερίου (Digestate)'];

const SECTIONS = [
  { key: 'info', label: 'Στοιχεία', icon: '📋' },
  { key: 'tillage', label: 'Κατεργασία', icon: '🔨' },
  { key: 'crops', label: 'Καλλιέργειες', icon: '🌾' },
  { key: 'harvest_main', label: 'Συγκομιδή Κύρια', icon: '📅' },
  { key: 'harvest_cover', label: 'Συγκομιδή Επίσπορη', icon: '📅' },
  { key: 'fertilizer_n', label: 'Λιπάσματα Αζωτούχα', icon: '🧪' },
  { key: 'fertilizer_org', label: 'Λιπάσματα Οργανικά', icon: '🌿' },
  { key: 'legitimacy', label: 'Νομιμοποιητικά', icon: '📄' },
];

export default function Fields() {
  const router = useRouter();
  const [numPlots, setNumPlots] = useState(0);
  const [activePlot, setActivePlot] = useState(1);
  const [activeSection, setActiveSection] = useState('info');
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [legalFiles, setLegalFiles] = useState({});

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
          [field]: value
        }
      }
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
            [field]: value
          }
        }
      }
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
        input:focus, select:focus, textarea:focus { border-color: #4a8c2a; box-shadow: 0 0 0 3px rgba(74,140,42,0.1); }
        .field { margin-bottom: 1rem; }
        .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .row3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
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
                  <label>Έκταση (ha)</label>
                  <input type="number" placeholder="π.χ. 5" step="0.1" value={val(activePlot,'info','area')} onChange={e => setField(activePlot,'info','area',e.target.value)} />
                </div>
              </div>
              <div className="field">
                <label>Συντεταγμένες GIS</label>
                <input type="text" placeholder="π.χ. 37N 21E" value={val(activePlot,'info','gis')} onChange={e => setField(activePlot,'info','gis',e.target.value)} />
              </div>
              <div className="row2">
                <div className="field">
                  <label>Εδαφική ανάλυση (αρχείο/link)</label>
                  <input type="text" placeholder="π.χ. link ή όνομα αρχείου" value={val(activePlot,'info','soil_file')} onChange={e => setField(activePlot,'info','soil_file',e.target.value)} />
                </div>
                <div className="field">
                  <label>Εφαρμογή εδαφικού ασβέστη</label>
                  <select value={val(activePlot,'info','lime')} onChange={e => setField(activePlot,'info','lime',e.target.value)}>
                    <option value="">Επιλέξτε...</option>
                    <option>Ναι</option><option>Όχι</option>
                  </select>
                </div>
              </div>
              {val(activePlot,'info','lime') === 'Ναι' && (
                <div className="row2">
                  <div className="field">
                    <label>Τύπος ασβέστη *</label>
                    <select required value={val(activePlot,'info','lime_type')} onChange={e => setField(activePlot,'info','lime_type',e.target.value)}>
                      <option value="">Επιλέξτε...</option>
                      <option>Ασβεστιτικός</option>
                      <option>Δολομιτικός</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Ποσότητα (tn/ha) *</label>
                    <input required type="number" placeholder="π.χ. 2.5" step="0.1" value={val(activePlot,'info','lime_qty')} onChange={e => setField(activePlot,'info','lime_qty',e.target.value)} />
                  </div>
                </div>
              )}
              <div className="row3">
                <div className="field">
                  <label>Διαχείριση υπολειμμάτων</label>
                  <select value={val(activePlot,'info','residues')} onChange={e => setField(activePlot,'info','residues',e.target.value)}>
                    <option value="">Επιλέξτε...</option>
                    <option>Παραμονή/Ενσωμάτωση</option>
                    <option>Απομάκρυνση</option>
                    <option>Καύση</option>
                  </select>
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
                      <label>Ποσότητα νερού *</label>
                      <input required type="number" placeholder="π.χ. 500" value={val(activePlot,'info','irr_qty')} onChange={e => setField(activePlot,'info','irr_qty',e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Τύπος Άρδευσης *</label>
                      <select required value={val(activePlot,'info','irr_type')} onChange={e => setField(activePlot,'info','irr_type',e.target.value)}>
                        <option value="">Επιλέξτε...</option>
                        <option>Στάγδην</option>
                        <option>Μπεκ/Micro-sprinklers</option>
                        <option>Καρούλια/Κανόνια</option>
                        <option>Ράμπα οριζόντιου ποτίσματος</option>
                        <option>Κατάκλυση/Επιφανειακή</option>
                      </select>
                    </div>
                  </div>
                  <div className="row2">
                    <div className="field">
                      <label>Τύπος Αντλίας *</label>
                      <select required value={val(activePlot,'info','pump_type')} onChange={e => setField(activePlot,'info','pump_type',e.target.value)}>
                        <option value="">Επιλέξτε...</option>
                        <option>Ηλεκτροκίνητη</option>
                        <option>Πετρελαιοκίνητη (Diesel)</option>
                        <option>Βενζινοκίνητη</option>
                        <option>Φωτοβολταϊκό/ΑΠΕ</option>
                        <option>Αρδευτικό δίκτυο ΤΟΕΒ</option>
                      </select>
                    </div>
                    <div className="field">
                      <label>Τύπος Καυσίμου *</label>
                      <select required value={val(activePlot,'info','fuel_type')} onChange={e => setField(activePlot,'info','fuel_type',e.target.value)}>
                        <option value="">Επιλέξτε...</option>
                        <option>Diesel</option>
                        <option>Βενζίνη</option>
                        <option>Ρεύμα Δικτύου</option>
                      </select>
                    </div>
                  </div>
                  <div className="field">
                    <label>Ετήσια κατανάλωση ενέργειας/καυσίμου *</label>
                    <input required type="number" placeholder="π.χ. 1200" value={val(activePlot,'info','energy_consumption')} onChange={e => setField(activePlot,'info','energy_consumption',e.target.value)} />
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
              <div className="section-sub">Εργασίες κατεργασίας εδάφους ανά έτος. Μπορείτε να προσθέσετε πολλαπλές εργασίες ανά έτος.</div>
              {YEARS.map(year => (
                <div className="year-block" key={year}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div className="year-header" style={{ marginBottom: 0 }}>{year}</div>
                    <button type="button" style={{ fontSize: '12px', padding: '4px 10px', border: '1px solid #4a8c2a', borderRadius: '6px', background: 'white', color: '#1a3d2b', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }} onClick={() => addTillageEntry(activePlot, year)}>
                      + Προσθήκη Εργασίας
                    </button>
                  </div>
                  {tillageEntries(activePlot, year).map((entry, idx) => (
                    <div key={idx} style={{ background: idx > 0 ? '#fafbfa' : 'transparent', border: idx > 0 ? '1px solid #e8f0e4' : 'none', borderRadius: '6px', padding: idx > 0 ? '10px 10px 4px' : '0', marginBottom: '8px', position: 'relative' }}>
                      {idx > 0 && (
                        <button type="button" style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '11px', padding: '2px 8px', border: '1px solid #e0a0a0', borderRadius: '4px', background: 'white', color: '#c0392b', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }} onClick={() => removeTillageEntry(activePlot, year, idx)}>✕</button>
                      )}
                      <div className="row3">
                        <div className="field">
                          <label>Τύπος κατεργασίας</label>
                          <select value={entry.type || ''} onChange={e => setTillageEntry(activePlot, year, idx, 'type', e.target.value)}>
                            <option value="">Επιλέξτε...</option>
                            {TILLAGE_TYPES.map(t => <option key={t}>{t}</option>)}
                          </select>
                        </div>
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
                    </div>
                    <div className="field">
                      <label>Δευτερεύουσα / Επίσπορη</label>
                      <select value={yearVal(activePlot,'crops',year,'cover')} onChange={e => setYearField(activePlot,'crops',year,'cover',e.target.value)}>
                        <option value="">Επιλέξτε...</option>
                        {CROP_LIST.map(c => <option key={c}>{c}</option>)}
                      </select>
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
                      <label>Απόδοση (kg/ha)</label>
                      <input type="number" placeholder="π.χ. 3000" value={yearVal(activePlot,'harvest_main',year,'yield')} onChange={e => setYearField(activePlot,'harvest_main',year,'yield',e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* ΣΥΓΚΟΜΙΔΗ ΕΠΙΣΠΟΡΗ */}
          {activeSection === 'harvest_cover' && (
            <>
              <div className="section-title">📅 Επίσπορη Καλλιέργεια — Αγροτεμάχιο {activePlot}</div>
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
                          <option>Ενσωμάτωση στο έδαφος</option>
                          <option>Χημική Καταστροφή</option>
                          <option>Βόσκηση</option>
                          <option>Συγκομιδή</option>
                        </select>
                      </div>
                      {yearVal(activePlot,'harvest_cover',year,'termination') === 'Συγκομιδή' && (
                        <div className="field">
                          <label>Απόδοση (kg/ha) *</label>
                          <input required type="number" placeholder="π.χ. 1500" value={yearVal(activePlot,'harvest_cover',year,'yield')} onChange={e => setYearField(activePlot,'harvest_cover',year,'yield',e.target.value)} />
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </>
          )}

          {/* ΛΙΠΑΣΜΑΤΑ ΑΖΩΤΟΥΧΑ */}
          {activeSection === 'fertilizer_n' && (
            <>
              <div className="section-title">🧪 Αζωτούχα Λιπάσματα — Αγροτεμάχιο {activePlot}</div>
              <div className="section-sub">Τύπος, μήνας εφαρμογής και ποσότητα ανά έτος.</div>
              <div className="field" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                <input type="checkbox" id={`no_fert_n_${activePlot}`} style={{ width: 'auto', accentColor: '#1a3d2b' }} checked={val(activePlot,'fertilizer_n','no_application') === 'true'} onChange={e => setField(activePlot,'fertilizer_n','no_application', e.target.checked ? 'true' : '')} />
                <label htmlFor={`no_fert_n_${activePlot}`} style={{ fontWeight: '400', cursor: 'pointer', margin: 0 }}>Δεν εφαρμόστηκε Αζωτούχος Λίπανση</label>
              </div>
              {val(activePlot,'fertilizer_n','no_application') !== 'true' && YEARS.map(year => (
                <div className="year-block" key={year}>
                  <div className="year-header">{year}</div>
                  <div className="row3">
                    <div className="field">
                      <label>Τύπος λιπάσματος</label>
                      <select value={yearVal(activePlot,'fertilizer_n',year,'type')} onChange={e => setYearField(activePlot,'fertilizer_n',year,'type',e.target.value)}>
                        <option value="">Επιλέξτε...</option>
                        {FERTILIZER_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="field">
                      <label>Μήνας εφαρμογής</label>
                      <select value={yearVal(activePlot,'fertilizer_n',year,'month')} onChange={e => setYearField(activePlot,'fertilizer_n',year,'month',e.target.value)}>
                        <option value="">Επιλέξτε...</option>
                        {MONTHS.map(m => <option key={m}>{m}</option>)}
                      </select>
                    </div>
                    <div className="field">
                      <label>Ποσότητα (kg/ha)</label>
                      <input type="number" placeholder="π.χ. 96" value={yearVal(activePlot,'fertilizer_n',year,'qty')} onChange={e => setYearField(activePlot,'fertilizer_n',year,'qty',e.target.value)} />
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
              <div className="field" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                <input type="checkbox" id={`no_fert_org_${activePlot}`} style={{ width: 'auto', accentColor: '#1a3d2b' }} checked={val(activePlot,'fertilizer_org','no_application') === 'true'} onChange={e => setField(activePlot,'fertilizer_org','no_application', e.target.checked ? 'true' : '')} />
                <label htmlFor={`no_fert_org_${activePlot}`} style={{ fontWeight: '400', cursor: 'pointer', margin: 0 }}>Δεν εφαρμόστηκε Οργανική Λίπανση</label>
              </div>
              {val(activePlot,'fertilizer_org','no_application') !== 'true' && YEARS.map(year => (
                <div className="year-block" key={year}>
                  <div className="year-header">{year}</div>
                  <div className="row3">
                    <div className="field">
                      <label>Τύπος οργανικού λιπάσματος</label>
                      <select value={yearVal(activePlot,'fertilizer_org',year,'type')} onChange={e => setYearField(activePlot,'fertilizer_org',year,'type',e.target.value)}>
                        <option value="">Επιλέξτε...</option>
                        {ORGANIC_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="field">
                      <label>Μήνας εφαρμογής</label>
                      <select value={yearVal(activePlot,'fertilizer_org',year,'month')} onChange={e => setYearField(activePlot,'fertilizer_org',year,'month',e.target.value)}>
                        <option value="">Επιλέξτε...</option>
                        {MONTHS.map(m => <option key={m}>{m}</option>)}
                      </select>
                    </div>
                    <div className="field">
                      <label>Ποσότητα (kg/ha)</label>
                      <input type="number" placeholder="π.χ. 500" value={yearVal(activePlot,'fertilizer_org',year,'qty')} onChange={e => setYearField(activePlot,'fertilizer_org',year,'qty',e.target.value)} />
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
                <label>ΟΣΔΕ / Ενοικιαστήρια (αρχεία)</label>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={e => setLegalFiles(prev => ({ ...prev, [`plot${activePlot}`]: e.target.files }))}
                  style={{ padding: '8px 0', border: 'none' }}
                />
              </div>
              <div className="field" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <input
                  type="checkbox"
                  id={`carbon_decl_${activePlot}`}
                  required
                  style={{ width: 'auto', marginTop: '3px', flexShrink: 0, accentColor: '#1a3d2b' }}
                  checked={val(activePlot,'legitimacy','carbon_declaration') === 'true'}
                  onChange={e => setField(activePlot,'legitimacy','carbon_declaration', e.target.checked ? 'true' : '')}
                />
                <label htmlFor={`carbon_decl_${activePlot}`} style={{ fontWeight: '400', cursor: 'pointer', lineHeight: '1.5' }}>
                  Δηλώνω υπεύθυνα ότι τα αναγραφόμενα αγροτεμάχια δεν συμμετέχουν σε κανένα άλλο πρόγραμμα Carbon Credits *
                </label>
              </div>
            </>
          )}

          <div className="nav-row">
            {SECTIONS.findIndex(s => s.key === activeSection) > 0 && (
              <button className="btn btn-sec" onClick={() => setActiveSection(SECTIONS[SECTIONS.findIndex(s => s.key === activeSection) - 1].key)}>
                ← Προηγούμενο
              </button>
            )}
            {SECTIONS.findIndex(s => s.key === activeSection) < SECTIONS.length - 1 ? (
              <button className="btn btn-pri" onClick={() => setActiveSection(SECTIONS[SECTIONS.findIndex(s => s.key === activeSection) + 1].key)}>
                Επόμενο →
              </button>
            ) : activePlot < numPlots ? (
              <button className="btn btn-pri" onClick={() => { setActivePlot(activePlot + 1); setActiveSection('info'); }}>
                Αγροτεμάχιο {activePlot + 1} →
              </button>
            ) : (
              <button className="btn btn-pri" onClick={submit} disabled={loading}>
                {loading ? 'Υποβολή...' : 'Υποβολή φόρμας ✓'}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
