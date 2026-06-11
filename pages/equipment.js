import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const YEARS = [2021, 2022, 2023, 2024, 2025];

const FUEL_OPTIONS = ['Diesel', 'Βενζίνη', 'Βιοντίζελ', 'Άλλο'];

const EQUIPMENT_SCHEMAS = {
  'Ελκυστήρας': {
    icon: '🚜',
    instanceFields: [
      { key: 'type', label: 'Τύπος Ελκυστήρα', type: 'select', options: [
        'Διαξονικός Ελκυστήρας (ανοιχτού πεδίου / δενδροκομικό)',
        'Μονοαξονικός Ελκυστήρας / Μοτοσκαπτικό',
        'Άλλο',
      ]},
      { key: 'year', label: 'Χρονολογία κατασκευής', type: 'number', placeholder: 'π.χ. 2005' },
      { key: 'hp', label: 'Ιπποδύναμη (HP)', type: 'number', placeholder: 'π.χ. 120' },
      { key: 'fuel', label: 'Τύπος καυσίμου', type: 'select', options: FUEL_OPTIONS },
    ],
    yearlyFields: [
      { key: 'hours', label: 'Ώρες λειτουργίας' },
      { key: 'fuel_lt', label: 'Κατανάλωση καυσίμου (λίτρα)' },
    ],
  },
  'Μηχάνημα Κατεργασίας': {
    icon: '⚙️',
    instanceFields: [
      { key: 'type', label: 'Τύπος Μηχανήματος Κατεργασίας', type: 'select', options: [
        'Άροτρο με υνιά (Βαθιά συμβατική κατεργασία)',
        'Δισκάροτρο',
        'Υπεδαφοκαλλιεργητής / Ρίπερ',
        'Φρέζα',
        'Δισκοσβάρνα / Σβάρνα (Μειωμένη κατεργασία)',
        'Μηχάνημα τοπικής κατεργασίας γραμμών (Strip-till)',
        'Άλλο',
      ]},
      { key: 'width', label: 'Πλάτος εργασίας (μέτρα)', type: 'number', placeholder: 'π.χ. 2.5' },
      { key: 'year', label: 'Χρονολογία κατασκευής', type: 'number', placeholder: 'π.χ. 2010' },
    ],
    yearlyFields: [
      { key: 'hours', label: 'Ώρες λειτουργίας' },
      { key: 'stremata', label: 'Στρέμματα εφαρμογής' },
    ],
  },
  'Σπαρτική': {
    icon: '🌱',
    instanceFields: [
      { key: 'type', label: 'Τύπος Σπαρτικής', type: 'select', options: [
        'Σπαρτική μηχανή απευθείας σποράς (No-till seeder)',
        'Σπαρτική σιτηρών / ψυχανθών (Συμβατική)',
        'Σπαρτική ακριβείας / πνευματική',
        'Πατατοσπορέας',
        'Άλλο',
      ]},
      { key: 'width', label: 'Πλάτος εργασίας (μέτρα)', type: 'number', placeholder: 'π.χ. 3.0' },
      { key: 'year', label: 'Χρονολογία κατασκευής', type: 'number', placeholder: 'π.χ. 2015' },
    ],
    yearlyFields: [
      { key: 'hours', label: 'Ώρες λειτουργίας' },
      { key: 'stremata', label: 'Στρέμματα εφαρμογής' },
    ],
  },
  'Λιπασματοδιανομέας': {
    icon: '📦',
    instanceFields: [
      { key: 'type', label: 'Τύπος Διανομέα Λιπάσματος', type: 'select', options: [
        'Φυγοκεντρικός διανομέας',
        'Διανομέας Οργανικής Λίπανσης / Κοπριάς',
        'Σύστημα Υδρολίπανσης',
        'Διανομέας μεταβλητής δόσης (Γεωργία Ακριβείας)',
        'Άλλο',
      ]},
      { key: 'capacity', label: 'Χωρητικότητα (λίτρα)', type: 'number', placeholder: 'π.χ. 500' },
      { key: 'year', label: 'Χρονολογία κατασκευής', type: 'number', placeholder: 'π.χ. 2016' },
    ],
    yearlyFields: [
      { key: 'hours', label: 'Ώρες λειτουργίας' },
      { key: 'stremata', label: 'Στρέμματα εφαρμογής' },
    ],
  },
  'Ψεκαστικό': {
    icon: '💧',
    instanceFields: [
      { key: 'type', label: 'Τύπος Ψεκαστικού', type: 'select', options: [
        'Ψεκαστικό γραμμικών καλλιεργειών (Ράμπα)',
        'Μηχανοκίνητος ψεκαστήρας (Νεφελοψεκαστήρας / Τουρμπίνα)',
        'Επινώτιος ψεκαστήρας',
        'Μηχανοκίνητος θειωτήρας',
        'Ψεκαστικό μεταβλητής δόσης (Γεωργία Ακριβείας)',
        'Άλλο',
      ]},
      { key: 'capacity', label: 'Χωρητικότητα (λίτρα)', type: 'number', placeholder: 'π.χ. 1000' },
      { key: 'year', label: 'Χρονολογία κατασκευής', type: 'number', placeholder: 'π.χ. 2018' },
    ],
    yearlyFields: [
      { key: 'hours', label: 'Ώρες λειτουργίας' },
      { key: 'stremata', label: 'Στρέμματα εφαρμογής' },
    ],
  },
  'Μηχάνημα Συγκομιδής': {
    icon: '🌾',
    instanceFields: [
      { key: 'type', label: 'Τύπος Μηχανήματος Συγκομιδής', type: 'select', options: [
        'Θεριζοαλωνιστική μηχανή (Κομπίνα)',
        'Βαμβακοσυλλεκτική μηχανή',
        'Χορτοδετική / Χορτοσυλλεκτική μηχανή',
        'Τευτλοεξαγωγέας / Πατατοεξαγωγέας',
        'Μηχανή συγκομιδής βιομηχανικής τομάτας / καρότων',
        'Άλλο',
      ]},
      { key: 'year', label: 'Χρονολογία κατασκευής', type: 'number', placeholder: 'π.χ. 2018' },
    ],
    yearlyFields: [
      { key: 'hours', label: 'Ώρες λειτουργίας' },
      { key: 'stremata', label: 'Στρέμματα εφαρμογής' },
    ],
  },
  'Καταστροφέας': {
    icon: '✂️',
    instanceFields: [
      { key: 'type', label: 'Τύπος', type: 'select', options: ['Σφυριά', 'Μαχαίρια', 'Άλλο'] },
      { key: 'width', label: 'Πλάτος εργασίας (μέτρα)', type: 'number', placeholder: 'π.χ. 2.0' },
      { key: 'year', label: 'Χρονολογία κατασκευής', type: 'number', placeholder: 'π.χ. 2015' },
    ],
    yearlyFields: [
      { key: 'hours', label: 'Ώρες λειτουργίας' },
      { key: 'stremata', label: 'Στρέμματα εφαρμογής' },
    ],
  },
  'Άλλος εξοπλισμός': {
    icon: '🔧',
    instanceFields: [
      { key: 'type', label: 'Είδος εξοπλισμού', type: 'text', placeholder: 'π.χ. Μπαλιαστικό' },
      { key: 'description', label: 'Περιγραφή εξοπλισμού', type: 'text', placeholder: 'π.χ. Πλάτος 1.5μ, έτος κατασκευής 2010' },
    ],
    yearlyFields: [
      { key: 'hours', label: 'Ώρες λειτουργίας' },
      { key: 'stremata', label: 'Στρέμματα εφαρμογής' },
    ],
  },
};

export default function Equipment() {
  const router = useRouter();
  const [activeEquipment, setActiveEquipment] = useState([]);
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    if (!router.isReady) return;
    const has = router.query.has;
    if (has) {
      const items = has.split(',').map(i => i.trim()).filter(i => EQUIPMENT_SCHEMAS[i]);
      setActiveEquipment(items);
      if (items.length > 0) setActiveSection(items[0]);
    }
  }, [router.isReady, router.query]);

  const setMachineField = (eq, idx, f, v) => setFormData(p => ({
    ...p,
    [eq]: {
      ...p[eq],
      machines: (p[eq]?.machines || [{}]).map((m, i) => i === idx ? { ...m, [f]: v } : m),
    },
  }));

  const setEqCount = (eq, count) => {
    const n = Math.max(1, parseInt(count) || 1);
    setFormData(p => {
      const existing = p[eq]?.machines || [{}];
      const machines = Array.from({ length: n }, (_, i) => existing[i] || {});
      return { ...p, [eq]: { ...p[eq], count: String(n), machines } };
    });
  };

  const setYearField = (equip, year, field, value) => {
    setFormData(prev => ({
      ...prev,
      [equip]: {
        ...prev[equip],
        years: {
          ...(prev[equip]?.years || {}),
          [year]: {
            ...(prev[equip]?.years?.[year] || {}),
            [field]: value,
          },
        },
      },
    }));
  };

  const getCount = (eq) => parseInt(formData[eq]?.count) || 1;
  const getMachines = (eq) => {
    const n = getCount(eq);
    const existing = formData[eq]?.machines || [{}];
    return Array.from({ length: n }, (_, i) => existing[i] || {});
  };

  const submit = async () => {
    setLoading(true);
    try {
      await fetch('/api/submit-equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ equipment: formData, farmerId: router.query.id }),
      });
      setSubmitted(true);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div style={{ fontFamily: 'Inter, sans-serif', background: '#f4f7f4', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '3rem', textAlign: 'center', border: '1px solid #e0ead8', maxWidth: '400px' }}>
          <div style={{ fontSize: '48px', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ color: '#1a3d2b', fontSize: '20px', marginBottom: '8px' }}>Σας ευχαριστούμε!</h2>
          <p style={{ color: '#666', fontSize: '14px' }}>Τα στοιχεία εξοπλισμού σας υποβλήθηκαν επιτυχώς.</p>
        </div>
      </div>
    );
  }

  if (activeEquipment.length === 0) {
    return (
      <div style={{ fontFamily: 'Inter, sans-serif', background: '#f4f7f4', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#666' }}>Δεν βρέθηκε εξοπλισμός. Παρακαλούμε χρησιμοποιήστε τον σύνδεσμο που σας εστάλη.</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Roots of Carbon — Καταγραφή Εξοπλισμού</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: #f4f7f4; min-height: 100vh; padding: 2rem 1rem; }
        .wrap { max-width: 720px; margin: 0 auto; }
        .header { background: #1a3d2b; border-radius: 12px; padding: 1.5rem 2rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 1rem; }
        .header h1 { color: white; font-size: 18px; font-weight: 600; }
        .header p { color: rgba(255,255,255,0.65); font-size: 13px; margin-top: 2px; }
        .logo { width: 48px; height: 48px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
        .tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 1.5rem; }
        .tab { padding: 8px 16px; border-radius: 99px; border: 1px solid #d0d8cc; background: white; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.15s; color: #333; font-family: 'Inter', sans-serif; }
        .tab:hover { border-color: #4a8c2a; }
        .tab.active { background: #1a3d2b; color: white; border-color: #1a3d2b; }
        .card { background: white; border-radius: 12px; padding: 2rem; border: 1px solid #e0ead8; margin-bottom: 1rem; }
        .machine-card { background: #fafbfa; border: 1px solid #e0ead8; border-radius: 10px; padding: 1.25rem; margin-bottom: 1rem; }
        .machine-card-title { font-size: 13px; font-weight: 600; color: #1a3d2b; margin-bottom: 1rem; padding-bottom: 6px; border-bottom: 1px solid #e0ead8; }
        .section-title { font-size: 16px; font-weight: 600; color: #1a3d2b; margin-bottom: 4px; display: flex; align-items: center; gap: 8px; }
        .section-sub { font-size: 13px; color: #888; margin-bottom: 1.5rem; }
        label { display: block; font-size: 13px; font-weight: 500; color: #333; margin-bottom: 5px; }
        input, select { width: 100%; border: 1px solid #d0d8cc; border-radius: 8px; padding: 10px 12px; font-size: 14px; font-family: 'Inter', sans-serif; color: #333; background: white; outline: none; transition: border-color 0.2s; }
        input:focus, select:focus { border-color: #4a8c2a; box-shadow: 0 0 0 3px rgba(74,140,42,0.1); }
        .field { margin-bottom: 1rem; }
        .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .row3 { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
        .year-label { font-size: 11px; font-weight: 600; color: #1a3d2b; text-align: center; margin-bottom: 4px; }
        .year-section { margin-top: 1.5rem; }
        .year-title { font-size: 13px; font-weight: 600; color: #333; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #e0ead8; }
        .submit-row { margin-top: 2rem; display: flex; justify-content: flex-end; }
        .btn-submit { padding: 12px 32px; border: none; border-radius: 8px; background: #1a3d2b; color: white; font-size: 14px; font-weight: 500; cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.15s; }
        .btn-submit:hover { background: #4a8c2a; }
        .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .progress-dots { display: flex; gap: 6px; margin-bottom: 1.5rem; align-items: center; }
        .dot { width: 8px; height: 8px; border-radius: 50%; background: #d0d8cc; }
        .dot.done { background: #4a8c2a; }
        .dot.active { background: #1a3d2b; width: 24px; border-radius: 4px; }
        .radio-row { display: flex; gap: 12px; }
        .radio-opt { display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 13px; color: #333; }
        .smart-farming-row { background: #f0f7ec; border: 1px solid #c8e0b4; border-radius: 8px; padding: 10px 12px; margin-top: 8px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .smart-farming-label { font-size: 13px; font-weight: 500; color: #1a3d2b; }
      `}</style>

      <div className="wrap">
        <div className="header">
          <div className="logo">🌱</div>
          <div>
            <h1>Roots of Carbon</h1>
            <p>Καταγραφή γεωργικού εξοπλισμού</p>
          </div>
        </div>

        <div className="tabs">
          {activeEquipment.map(eq => {
            const tabLabel = eq === 'Άλλος εξοπλισμός' ? (formData[eq]?.machines?.[0]?.type || eq) : eq;
            return (
              <button key={eq} className={`tab ${activeSection === eq ? 'active' : ''}`} onClick={() => setActiveSection(eq)}>
                <span>{EQUIPMENT_SCHEMAS[eq].icon}</span>
                {tabLabel}
              </button>
            );
          })}
        </div>

        <div className="progress-dots">
          {activeEquipment.map(eq => (
            <div key={eq} className={`dot ${activeSection === eq ? 'active' : formData[eq] ? 'done' : ''}`} />
          ))}
          <span style={{ fontSize: '12px', color: '#888', marginLeft: '8px' }}>
            {activeEquipment.indexOf(activeSection) + 1} από {activeEquipment.length}
          </span>
        </div>

        {activeSection && EQUIPMENT_SCHEMAS[activeSection] && (() => {
          const schema = EQUIPMENT_SCHEMAS[activeSection];
          const count = getCount(activeSection);
          const machines = getMachines(activeSection);

          return (
            <div className="card">
              <div className="section-title">
                <span>{schema.icon}</span>
                {activeSection}
              </div>
              <div className="section-sub">Συμπληρώστε τα στοιχεία για τον εξοπλισμό σας.</div>

              <div className="field" style={{ maxWidth: '200px' }}>
                <label>Αριθμός μηχανημάτων</label>
                <input
                  type="number"
                  min="1"
                  value={count}
                  onChange={e => setEqCount(activeSection, e.target.value)}
                />
              </div>

              {machines.map((machine, idx) => (
                <div className="machine-card" key={idx}>
                  <div className="machine-card-title">Μηχάνημα {idx + 1}</div>
                  <div className="row2">
                    {schema.instanceFields.map(f => (
                      <div className="field" key={f.key}>
                        <label>{f.label}</label>
                        {f.type === 'select' ? (
                          <>
                            <select
                              value={machine[f.key] || ''}
                              onChange={e => setMachineField(activeSection, idx, f.key, e.target.value)}
                            >
                              <option value="">Επιλέξτε...</option>
                              {f.options.map(o => <option key={o}>{o}</option>)}
                            </select>
                            {machine[f.key] === 'Άλλο' && (
                              <input
                                type="text"
                                required
                                placeholder="Παρακαλώ προσδιορίστε..."
                                style={{ marginTop: '8px' }}
                                value={machine[`${f.key}_other`] || ''}
                                onChange={e => setMachineField(activeSection, idx, `${f.key}_other`, e.target.value)}
                              />
                            )}
                          </>
                        ) : (
                          <input
                            type={f.type}
                            placeholder={f.placeholder}
                            value={machine[f.key] || ''}
                            onChange={e => setMachineField(activeSection, idx, f.key, e.target.value)}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="smart-farming-row">
                    <span className="smart-farming-label">Διαθέτει λειτουργία έξυπνης γεωργίας;</span>
                    <div className="radio-row">
                      {['Ναι', 'Όχι'].map(opt => (
                        <label key={opt} className="radio-opt">
                          <input
                            type="radio"
                            name={`smart_farming_${activeSection}_${idx}`}
                            value={opt}
                            checked={machine.smart_farming === opt}
                            onChange={() => setMachineField(activeSection, idx, 'smart_farming', opt)}
                            style={{ width: 'auto' }}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <div className="year-section">
                <div className="year-title">Ιστορικά στοιχεία ανά έτος</div>
                {schema.yearlyFields.map(yf => (
                  <div className="field" key={yf.key}>
                    <label style={{ marginBottom: '8px' }}>{yf.label}</label>
                    <div className="row3">
                      {YEARS.map(year => (
                        <div key={year}>
                          <div className="year-label">{year}</div>
                          <input
                            type="number"
                            placeholder="—"
                            style={{ textAlign: 'center', padding: '8px 4px', fontSize: '13px' }}
                            value={formData[activeSection]?.years?.[year]?.[yf.key] || ''}
                            onChange={e => setYearField(activeSection, year, yf.key, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                {activeEquipment.indexOf(activeSection) > 0 && (
                  <button
                    className="btn-submit"
                    style={{ background: 'white', color: '#1a3d2b', border: '1px solid #d0d8cc' }}
                    onClick={() => setActiveSection(activeEquipment[activeEquipment.indexOf(activeSection) - 1])}
                  >
                    ← Προηγούμενο
                  </button>
                )}
                {activeEquipment.indexOf(activeSection) < activeEquipment.length - 1 ? (
                  <button
                    className="btn-submit"
                    style={{ marginLeft: 'auto' }}
                    onClick={() => setActiveSection(activeEquipment[activeEquipment.indexOf(activeSection) + 1])}
                  >
                    Επόμενο →
                  </button>
                ) : (
                  <button className="btn-submit" style={{ marginLeft: 'auto' }} onClick={submit} disabled={loading}>
                    {loading ? 'Υποβολή...' : 'Υποβολή φόρμας ✓'}
                  </button>
                )}
              </div>
            </div>
          );
        })()}
      </div>
    </>
  );
}
