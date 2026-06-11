import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const YEARS = [2021, 2022, 2023, 2024, 2025];

const EQUIPMENT_SCHEMAS = {
  'Ελκυστήρας': {
    icon: '🚜',
    fields: [
      { key: 'type', label: 'Τύπος Ελκυστήρα', type: 'select', options: [
        'Διαξονικός Ελκυστήρας (ανοιχτού πεδίου / δενδροκομικό)',
        'Μονοαξονικός Ελκυστήρας / Μοτοσκαπτικό',
      ]},
      { key: 'year', label: 'Χρονολογία κατασκευής', type: 'number', placeholder: 'π.χ. 2005' },
      { key: 'hp', label: 'Ιπποδύναμη (HP)', type: 'number', placeholder: 'π.χ. 120' },
      { key: 'fuel', label: 'Τύπος καυσίμου', type: 'select', options: ['Diesel', 'Βενζίνη', 'Βιοντίζελ'] },
    ],
    yearlyFields: [
      { key: 'hours', label: 'Ώρες λειτουργίας' },
      { key: 'fuel_consumption', label: 'Κατανάλωση καυσίμου (λίτρα)' },
    ],
  },
  'Μηχάνημα Κατεργασίας': {
    icon: '⚙️',
    fields: [
      { key: 'type', label: 'Τύπος Μηχανήματος Κατεργασίας', type: 'select', options: [
        'Άροτρο με υνιά (Βαθιά συμβατική κατεργασία)',
        'Δισκάροτρο',
        'Υπεδαφοκαλλιεργητής / Ρίπερ',
        'Φρέζα',
        'Δισκοσβάρνα / Σβάρνα (Μειωμένη κατεργασία)',
        'Μηχάνημα τοπικής κατεργασίας γραμμών (Strip-till)',
      ]},
      { key: 'width', label: 'Πλάτος εργασίας (μέτρα)', type: 'number', placeholder: 'π.χ. 2.5' },
      { key: 'year', label: 'Χρονολογία κατασκευής', type: 'number', placeholder: 'π.χ. 2010' },
    ],
    yearlyFields: [
      { key: 'hours', label: 'Ώρες λειτουργίας' },
      { key: 'hectares', label: 'Στρέμματα εφαρμογής' },
    ],
  },
  'Σπαρτική': {
    icon: '🌱',
    fields: [
      { key: 'type', label: 'Τύπος Σπαρτικής', type: 'select', options: [
        'Σπαρτική μηχανή απευθείας σποράς (No-till seeder)',
        'Σπαρτική σιτηρών / ψυχανθών (Συμβατική)',
        'Σπαρτική ακριβείας / πνευματική',
        'Πατατοσπορέας',
      ]},
      { key: 'width', label: 'Πλάτος εργασίας (μέτρα)', type: 'number', placeholder: 'π.χ. 3.0' },
      { key: 'year', label: 'Χρονολογία κατασκευής', type: 'number', placeholder: 'π.χ. 2015' },
    ],
    yearlyFields: [
      { key: 'hours', label: 'Ώρες λειτουργίας' },
      { key: 'hectares', label: 'Στρέμματα εφαρμογής' },
    ],
  },
  'Λιπασματοδιανομέας': {
    icon: '📦',
    fields: [
      { key: 'type', label: 'Τύπος Διανομέα Λιπάσματος', type: 'select', options: [
        'Φυγοκεντρικός διανομέας',
        'Διανομέας Οργανικής Λίπανσης / Κοπριάς',
        'Σύστημα Υδρολίπανσης',
        'Διανομέας μεταβλητής δόσης (Γεωργία Ακριβείας)',
      ]},
      { key: 'capacity', label: 'Χωρητικότητα (λίτρα)', type: 'number', placeholder: 'π.χ. 500' },
      { key: 'year', label: 'Χρονολογία κατασκευής', type: 'number', placeholder: 'π.χ. 2016' },
    ],
    yearlyFields: [
      { key: 'hours', label: 'Ώρες λειτουργίας' },
      { key: 'hectares', label: 'Στρέμματα εφαρμογής' },
    ],
  },
  'Ψεκαστικό': {
    icon: '💧',
    fields: [
      { key: 'type', label: 'Τύπος Ψεκαστικού', type: 'select', options: [
        'Ψεκαστικό γραμμικών καλλιεργειών (Ράμπα)',
        'Μηχανοκίνητος ψεκαστήρας (Νεφελοψεκαστήρας / Τουρμπίνα)',
        'Επινώτιος ψεκαστήρας',
        'Μηχανοκίνητος θειωτήρας',
        'Ψεκαστικό μεταβλητής δόσης (Γεωργία Ακριβείας)',
      ]},
      { key: 'capacity', label: 'Χωρητικότητα (λίτρα)', type: 'number', placeholder: 'π.χ. 1000' },
      { key: 'year', label: 'Χρονολογία κατασκευής', type: 'number', placeholder: 'π.χ. 2018' },
    ],
    yearlyFields: [
      { key: 'hours', label: 'Ώρες λειτουργίας' },
      { key: 'hectares', label: 'Στρέμματα εφαρμογής' },
    ],
  },
  'Μηχάνημα Συγκομιδής': {
    icon: '🌾',
    fields: [
      { key: 'type', label: 'Τύπος Μηχανήματος Συγκομιδής', type: 'select', options: [
        'Θεριζοαλωνιστική μηχανή (Κομπίνα)',
        'Βαμβακοσυλλεκτική μηχανή',
        'Χορτοδετική / Χορτοσυλλεκτική μηχανή',
        'Τευτλοεξαγωγέας / Πατατοεξαγωγέας',
        'Μηχανή συγκομιδής βιομηχανικής τομάτας / καρότων',
      ]},
      { key: 'year', label: 'Χρονολογία κατασκευής', type: 'number', placeholder: 'π.χ. 2018' },
    ],
    yearlyFields: [
      { key: 'hours', label: 'Ώρες λειτουργίας' },
      { key: 'hectares', label: 'Στρέμματα εφαρμογής' },
    ],
  },
  'Καταστροφέας': {
    icon: '✂️',
    fields: [
      { key: 'type', label: 'Τύπος', type: 'select', options: ['Σφυριά', 'Μαχαίρια'] },
      { key: 'width', label: 'Πλάτος εργασίας (μέτρα)', type: 'number', placeholder: 'π.χ. 2.0' },
      { key: 'year', label: 'Χρονολογία κατασκευής', type: 'number', placeholder: 'π.χ. 2015' },
    ],
    yearlyFields: [
      { key: 'hours', label: 'Ώρες λειτουργίας' },
      { key: 'hectares', label: 'Στρέμματα εφαρμογής' },
    ],
  },
  'Άλλος εξοπλισμός': {
    icon: '🔧',
    fields: [
      { key: 'type', label: 'Είδος εξοπλισμού', type: 'text', placeholder: 'π.χ. Μπαλιαστικό' },
      { key: 'capacity', label: 'Χωρητικότητα (κιλά)', type: 'number', placeholder: 'π.χ. 500' },
      { key: 'hp', label: 'Ιπποδύναμη (HP)', type: 'number', placeholder: 'π.χ. 80' },
    ],
    yearlyFields: [
      { key: 'hours', label: 'Ώρες λειτουργίας' },
      { key: 'hectares', label: 'Στρέμματα εφαρμογής' },
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

  const setField = (equip, field, value) => {
    setFormData(prev => ({
      ...prev,
      [equip]: { ...prev[equip], [field]: value }
    }));
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
            [field]: value
          }
        }
      }
    }));
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
        .wrap { max-width: 680px; margin: 0 auto; }
        .header { background: #1a3d2b; border-radius: 12px; padding: 1.5rem 2rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 1rem; }
        .header h1 { color: white; font-size: 18px; font-weight: 600; }
        .header p { color: rgba(255,255,255,0.65); font-size: 13px; margin-top: 2px; }
        .logo { width: 48px; height: 48px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
        .tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 1.5rem; }
        .tab { padding: 8px 16px; border-radius: 99px; border: 1px solid #d0d8cc; background: white; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.15s; color: #333; font-family: 'Inter', sans-serif; }
        .tab:hover { border-color: #4a8c2a; }
        .tab.active { background: #1a3d2b; color: white; border-color: #1a3d2b; }
        .card { background: white; border-radius: 12px; padding: 2rem; border: 1px solid #e0ead8; margin-bottom: 1rem; }
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
          {activeEquipment.map(eq => (
            <button key={eq} className={`tab ${activeSection === eq ? 'active' : ''}`} onClick={() => setActiveSection(eq)}>
              <span>{EQUIPMENT_SCHEMAS[eq].icon}</span>
              {eq}
            </button>
          ))}
        </div>

        <div className="progress-dots">
          {activeEquipment.map(eq => (
            <div key={eq} className={`dot ${activeSection === eq ? 'active' : formData[eq] ? 'done' : ''}`} />
          ))}
          <span style={{ fontSize: '12px', color: '#888', marginLeft: '8px' }}>
            {activeEquipment.indexOf(activeSection) + 1} από {activeEquipment.length}
          </span>
        </div>

        {activeSection && EQUIPMENT_SCHEMAS[activeSection] && (
          <div className="card">
            <div className="section-title">
              <span>{EQUIPMENT_SCHEMAS[activeSection].icon}</span>
              {activeSection}
            </div>
            <div className="section-sub">Συμπληρώστε τα στοιχεία για τον εξοπλισμό σας.</div>

            <div className="row2">
              {EQUIPMENT_SCHEMAS[activeSection].fields.map(f => (
                <div className="field" key={f.key}>
                  <label>{f.label}</label>
                  {f.type === 'select' ? (
                    <select value={formData[activeSection]?.[f.key] || ''} onChange={e => setField(activeSection, f.key, e.target.value)}>
                      <option value="">Επιλέξτε...</option>
                      {f.options.map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type={f.type} placeholder={f.placeholder} value={formData[activeSection]?.[f.key] || ''} onChange={e => setField(activeSection, f.key, e.target.value)} />
                  )}
                </div>
              ))}
            </div>

            <div className="year-section">
              <div className="year-title">Ιστορικά στοιχεία ανά έτος</div>
              {EQUIPMENT_SCHEMAS[activeSection].yearlyFields.map(yf => (
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
                <button className="btn-submit" style={{ background: 'white', color: '#1a3d2b', border: '1px solid #d0d8cc' }}
                  onClick={() => setActiveSection(activeEquipment[activeEquipment.indexOf(activeSection) - 1])}>
                  ← Προηγούμενο
                </button>
              )}
              {activeEquipment.indexOf(activeSection) < activeEquipment.length - 1 ? (
                <button className="btn-submit" style={{ marginLeft: 'auto' }}
                  onClick={() => setActiveSection(activeEquipment[activeEquipment.indexOf(activeSection) + 1])}>
                  Επόμενο →
                </button>
              ) : (
                <button className="btn-submit" style={{ marginLeft: 'auto' }} onClick={submit} disabled={loading}>
                  {loading ? 'Υποβολή...' : 'Υποβολή φόρμας ✓'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
