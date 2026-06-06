import { useState } from 'react';
import Head from 'next/head';

const ALL_YEARS = [2021, 2022, 2023, 2024, 2025];
const MONTHS = ['Ιανουάριος','Φεβρουάριος','Μάρτιος','Απρίλιος','Μάιος','Ιούνιος','Ιούλιος','Αύγουστος','Σεπτέμβριος','Οκτώβριος','Νοέμβριος','Δεκέμβριος'];
const CROPS_LIST = ['Ελιά ελαιοποιήσιμη','Ελιά επιτραπέζια','Βαμβάκι','Μαλακό σιτάρι','Σκληρό σιτάρι','Κριθάρι','Αραβόσιτος','Βρώμη','Λούπινο','Ηλίανθος','Σόγια','Σουσάμι','Βίκος','Κουκί','Αγρανάπαυση','Πράσινο ακτινίδιο','Αμπέλι','Εσπεριδοειδή','Κηπευτικά','Άλλο','Καμία'];
const REGIONS = ['Αττική','Θεσσαλονίκη','Ηλεία','Λάρισα','Μαγνησία','Αχαΐα','Ηράκλειο','Δωδεκάνησα','Αιτωλοακαρνανία','Βοιωτία','Εύβοια','Φθιώτιδα','Κορινθία','Αρκαδία','Μεσσηνία','Λακωνία','Αργολίδα','Χαλκιδική','Σέρρες','Κιλκίς','Πέλλα','Ημαθία','Πιερία','Κοζάνη','Φλώρινα','Καστοριά','Γρεβενά','Ιωάννινα','Θεσπρωτία','Άρτα','Πρέβεζα','Καρδίτσα','Τρίκαλα','Άλλο'];
const ONBOARDING_CROPS = ['Ελιά','Σιτηρά','Βαμβάκι','Αμπέλι','Οπωροφόρα','Αρωματικά / Βότανα','Κηπευτικά','Άλλο'];
const EQUIPMENT_LIST = ['Ελκυστήρας','Άροτρο','Καλλιεργητής','Φρέζα','Καταστροφέας','Λιπασματοδιανομέας','Ψεκαστικό','Άλλος εξοπλισμός'];
const TILLAGE_TYPES = ['Βαθιά άροση','Ελαφρά κατεργασία','Φρεζάρισμα','Καλλιέργεια','Χωρίς κατεργασία','Ελάχιστη κατεργασία'];
const SOIL_TYPES = ['Αμμώδες','Αργιλώδες','Πηλώδες','Αμμοπηλώδες','Αργιλοπηλώδες'];

const EQUIPMENT_SCHEMAS = {
  'Ελκυστήρας': { icon: '🚜', fields: [
    { key: 'type', label: 'Τύπος', type: 'select', options: ['Δενδροκομικό','Αροτραίων','Αμπελουργικό','Γενικής χρήσης'] },
    { key: 'year_built', label: 'Χρονολογία κατασκευής', type: 'number', placeholder: 'π.χ. 2005' },
    { key: 'hp', label: 'Ιπποδύναμη (HP)', type: 'number', placeholder: 'π.χ. 120' },
    { key: 'fuel', label: 'Τύπος καυσίμου', type: 'select', options: ['Πετρέλαιο','Βενζίνη','Πετρέλαιο + Biodiesel'] },
    { key: 'renewal', label: 'Πρόθεση ανανέωσης', type: 'select', options: ['Ναι, άμεσα','Ναι, μελλοντικά','Όχι'] },
    { key: 'maintenance', label: 'Επίπεδο συντήρησης', type: 'select', options: ['Τακτική','Περιστασιακή','Καμία'] },
  ], yearlyFields: [{ key: 'hours', label: 'Ώρες λειτουργίας' },{ key: 'fuel_lt', label: 'Κατανάλωση καυσίμου (λίτρα)' }] },
  'Άροτρο': { icon: '🌾', fields: [
    { key: 'type', label: 'Τύπος', type: 'select', options: ['Αναστρεφόμενο','Δίυνο','Τρίυνο','Πολύυνο'] },
    { key: 'width', label: 'Πλάτος εργασίας (μ)', type: 'number', placeholder: 'π.χ. 1.5' },
    { key: 'year_built', label: 'Χρονολογία κατασκευής', type: 'number', placeholder: 'π.χ. 2010' },
    { key: 'renewal', label: 'Πρόθεση ανανέωσης', type: 'select', options: ['Ναι, άμεσα','Ναι, μελλοντικά','Όχι'] },
    { key: 'maintenance', label: 'Επίπεδο συντήρησης', type: 'select', options: ['Τακτική','Περιστασιακή','Καμία'] },
  ], yearlyFields: [{ key: 'hours', label: 'Ώρες λειτουργίας' },{ key: 'ha', label: 'Στρέμματα εφαρμογής' }] },
  'Καλλιεργητής': { icon: '⚙️', fields: [
    { key: 'type', label: 'Τύπος', type: 'select', options: ['Με ελατήρια','Βαρέως τύπου','Ρίπερ'] },
    { key: 'bodies', label: 'Αριθμός σωμάτων', type: 'number', placeholder: 'π.χ. 9' },
    { key: 'width', label: 'Πλάτος εργασίας (μ)', type: 'number', placeholder: 'π.χ. 2.5' },
    { key: 'year_built', label: 'Χρονολογία κατασκευής', type: 'number', placeholder: 'π.χ. 2008' },
    { key: 'renewal', label: 'Πρόθεση ανανέωσης', type: 'select', options: ['Ναι, άμεσα','Ναι, μελλοντικά','Όχι'] },
    { key: 'maintenance', label: 'Επίπεδο συντήρησης', type: 'select', options: ['Τακτική','Περιστασιακή','Καμία'] },
  ], yearlyFields: [{ key: 'hours', label: 'Ώρες λειτουργίας' },{ key: 'ha', label: 'Στρέμματα εφαρμογής' }] },
  'Φρέζα': { icon: '🔄', fields: [
    { key: 'type', label: 'Τύπος', type: 'select', options: ['Σταθερή','Μετατοπιζόμενη'] },
    { key: 'width', label: 'Πλάτος εργασίας (μ)', type: 'number', placeholder: 'π.χ. 1.8' },
    { key: 'year_built', label: 'Χρονολογία κατασκευής', type: 'number', placeholder: 'π.χ. 2012' },
    { key: 'renewal', label: 'Πρόθεση ανανέωσης', type: 'select', options: ['Ναι, άμεσα','Ναι, μελλοντικά','Όχι'] },
    { key: 'maintenance', label: 'Επίπεδο συντήρησης', type: 'select', options: ['Τακτική','Περιστασιακή','Καμία'] },
  ], yearlyFields: [{ key: 'hours', label: 'Ώρες λειτουργίας' },{ key: 'ha', label: 'Στρέμματα εφαρμογής' }] },
  'Καταστροφέας': { icon: '✂️', fields: [
    { key: 'type', label: 'Τύπος', type: 'select', options: ['Σφυριά','Μαχαίρια'] },
    { key: 'width', label: 'Πλάτος εργασίας (μ)', type: 'number', placeholder: 'π.χ. 2.0' },
    { key: 'year_built', label: 'Χρονολογία κατασκευής', type: 'number', placeholder: 'π.χ. 2015' },
    { key: 'renewal', label: 'Πρόθεση ανανέωσης', type: 'select', options: ['Ναι, άμεσα','Ναι, μελλοντικά','Όχι'] },
    { key: 'maintenance', label: 'Επίπεδο συντήρησης', type: 'select', options: ['Τακτική','Περιστασιακή','Καμία'] },
  ], yearlyFields: [{ key: 'hours', label: 'Ώρες λειτουργίας' },{ key: 'ha', label: 'Στρέμματα εφαρμογής' }] },
  'Λιπασματοδιανομέας': { icon: '📦', fields: [
    { key: 'type', label: 'Τύπος', type: 'select', options: ['Μονός δίσκος','Διπλός δίσκος','Συρόμενος'] },
    { key: 'spread_width', label: 'Πλάτος διασποράς (μ)', type: 'number', placeholder: 'π.χ. 12' },
    { key: 'capacity', label: 'Χωρητικότητα (λίτρα)', type: 'number', placeholder: 'π.χ. 500' },
    { key: 'year_built', label: 'Χρονολογία κατασκευής', type: 'number', placeholder: 'π.χ. 2016' },
    { key: 'renewal', label: 'Πρόθεση ανανέωσης', type: 'select', options: ['Ναι, άμεσα','Ναι, μελλοντικά','Όχι'] },
    { key: 'maintenance', label: 'Επίπεδο συντήρησης', type: 'select', options: ['Τακτική','Περιστασιακή','Καμία'] },
  ], yearlyFields: [{ key: 'hours', label: 'Ώρες λειτουργίας' },{ key: 'ha', label: 'Στρέμματα εφαρμογής' }] },
  'Ψεκαστικό': { icon: '💧', fields: [
    { key: 'type', label: 'Τύπος', type: 'select', options: ['Νεφελοψεκαστήρας για δέντρα','Ψεκαστικό μπάρας','Νεφελοψεκαστήρας'] },
    { key: 'electrostatic', label: 'Ηλεκτροστατικός ψεκασμός', type: 'select', options: ['Ναι','Όχι'] },
    { key: 'tow', label: 'Τρόπος ρυμούλκησης', type: 'select', options: ['Συρόμενο','Αναρτόμενο'] },
    { key: 'capacity', label: 'Χωρητικότητα (λίτρα)', type: 'number', placeholder: 'π.χ. 1000' },
    { key: 'year_built', label: 'Χρονολογία κατασκευής', type: 'number', placeholder: 'π.χ. 2018' },
    { key: 'renewal', label: 'Πρόθεση ανανέωσης', type: 'select', options: ['Ναι, άμεσα','Ναι, μελλοντικά','Όχι'] },
    { key: 'maintenance', label: 'Επίπεδο συντήρησης', type: 'select', options: ['Τακτική','Περιστασιακή','Καμία'] },
  ], yearlyFields: [{ key: 'hours', label: 'Ώρες λειτουργίας' },{ key: 'ha', label: 'Στρέμματα εφαρμογής' }] },
  'Άλλος εξοπλισμός': { icon: '🔧', fields: [
    { key: 'type', label: 'Είδος εξοπλισμού', type: 'text', placeholder: 'π.χ. Μπαλιαστικό' },
    { key: 'capacity_kg', label: 'Χωρητικότητα (κιλά)', type: 'number', placeholder: 'π.χ. 500' },
    { key: 'hp', label: 'Ιπποδύναμη (HP)', type: 'number', placeholder: 'π.χ. 80' },
    { key: 'year_built', label: 'Χρονολογία κατασκευής', type: 'number', placeholder: 'π.χ. 2014' },
    { key: 'renewal', label: 'Πρόθεση ανανέωσης', type: 'select', options: ['Ναι, άμεσα','Ναι, μελλοντικά','Όχι'] },
    { key: 'maintenance', label: 'Επίπεδο συντήρησης', type: 'select', options: ['Τακτική','Περιστασιακή','Καμία'] },
  ], yearlyFields: [{ key: 'hours', label: 'Ώρες λειτουργίας' },{ key: 'ha', label: 'Στρέμματα εφαρμογής' }] },
};

const FIELD_SECTIONS = [
  { key: 'info', label: 'Στοιχεία', icon: '📋' },
  { key: 'tillage', label: 'Κατεργασία', icon: '🔨' },
  { key: 'crops', label: 'Καλλιέργειες', icon: '🌾' },
  { key: 'harvest_main', label: 'Συγκομιδή Κύρια', icon: '📅' },
  { key: 'harvest_cover', label: 'Συγκομιδή Επίσπορη', icon: '📅' },
  { key: 'fertilizer_n', label: 'Λιπάσματα Αζωτούχα', icon: '🧪' },
  { key: 'fertilizer_org', label: 'Λιπάσματα Οργανικά', icon: '🌿' },
];

// Year manager hook
function useYearManager(id) {
  const [visibleYears, setVisibleYears] = useState([...ALL_YEARS]);
  const [undoStack, setUndoStack] = useState([]);

  const removeYear = (yr) => {
    if (visibleYears.length <= 1) return;
    setUndoStack(s => [...s, yr]);
    setVisibleYears(y => y.filter(x => x !== yr));
  };

  const undo = () => {
    if (undoStack.length === 0) return;
    const last = undoStack[undoStack.length - 1];
    setUndoStack(s => s.slice(0, -1));
    setVisibleYears(y => [...y, last].sort());
  };

  return { visibleYears, removeYear, undo, canUndo: undoStack.length > 0 };
}

// YearBlock component
function YearBlock({ year, fields, data, onChange, onRemove, canRemove, isEquip }) {
  const allFilled = fields.every(f => data?.[f.key]);
  return (
    <div style={{ border: `1px solid ${allFilled ? '#4a8c2a' : '#e0ead8'}`, borderRadius: '8px', padding: '1rem', marginBottom: '10px', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{ display: 'inline-block', background: '#1a3d2b', color: 'white', fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px' }}>{year}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {allFilled && <span style={{ fontSize: '11px', color: '#4a8c2a', fontWeight: '500' }}>✓ Συμπληρώθηκε</span>}
          {canRemove && (
            <button onClick={() => onRemove(year)} title="Απόκρυψη έτους" style={{ background: 'none', border: '1px solid #d0d8cc', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', color: '#888', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>✕</button>
          )}
        </div>
      </div>
      {isEquip ? (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${fields.length}, 1fr)`, gap: '8px' }}>
          {fields.map(f => (
            <div key={f.key}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#1a3d2b', textAlign: 'center', marginBottom: '4px' }}>{f.label} <span style={{ color: '#e24b4a' }}>*</span></label>
              <input type="number" placeholder="—" style={{ width: '100%', textAlign: 'center', padding: '8px 4px', fontSize: '13px', border: `1px solid ${data?.[f.key] ? '#4a8c2a' : '#d0d8cc'}`, borderRadius: '8px', outline: 'none', fontFamily: 'Inter, sans-serif' }} value={data?.[f.key] || ''} onChange={e => onChange(year, f.key, e.target.value)} />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {fields.map(f => (
            <div key={f.key}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#333', marginBottom: '5px' }}>{f.label} <span style={{ color: '#e24b4a' }}>*</span></label>
              {f.type === 'select' ? (
                <select style={{ width: '100%', border: `1px solid ${data?.[f.key] ? '#4a8c2a' : '#d0d8cc'}`, borderRadius: '8px', padding: '10px 12px', fontSize: '14px', fontFamily: 'Inter, sans-serif', color: '#333', background: 'white', outline: 'none' }} value={data?.[f.key] || ''} onChange={e => onChange(year, f.key, e.target.value)}>
                  <option value="">Επιλέξτε...</option>
                  {f.options.map(o => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input type={f.type || 'text'} placeholder={f.placeholder || '—'} style={{ width: '100%', border: `1px solid ${data?.[f.key] ? '#4a8c2a' : '#d0d8cc'}`, borderRadius: '8px', padding: '10px 12px', fontSize: '14px', fontFamily: 'Inter, sans-serif', color: '#333', background: 'white', outline: 'none' }} value={data?.[f.key] || ''} onChange={e => onChange(year, f.key, e.target.value)} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [phase, setPhase] = useState('onboarding');
  const [onbStep, setOnbStep] = useState(1);
  const [onbErrors, setOnbErrors] = useState({});
  const [onb, setOnb] = useState({
    type: '', firstName: '', lastName: '', email: '', phone: '', orgName: '',
    region: '', hectares: '', plots: '', crops: [], equipment: [],
    agronomist: '', source: '', comments: '', farm_size: '', carbon_measured: '', motivation: '',
  });
  const [activeEquip, setActiveEquip] = useState(null);
  const [equipData, setEquipData] = useState({});
  const [equipYears, setEquipYears] = useState({});
  const [equipUndoStacks, setEquipUndoStacks] = useState({});
  const [activePlot, setActivePlot] = useState(1);
  const [activeFieldSection, setActiveFieldSection] = useState('info');
  const [fieldData, setFieldData] = useState({});
  const [fieldYears, setFieldYears] = useState({});
  const [fieldUndoStacks, setFieldUndoStacks] = useState({});
  const [sectionErrors, setSectionErrors] = useState('');
  const [loading, setLoading] = useState(false);

  const setOnbField = (k, v) => setOnb(p => ({ ...p, [k]: v }));
  const toggleArr = (k, v) => setOnb(p => ({ ...p, [k]: p[k].includes(v) ? p[k].filter(x => x !== v) : [...p[k], v] }));

  const setEq = (eq, f, v) => setEquipData(p => ({ ...p, [eq]: { ...p[eq], [f]: v } }));
  const setEqY = (eq, yr, f, v) => setEquipData(p => ({ ...p, [eq]: { ...p[eq], years: { ...p[eq]?.years, [yr]: { ...p[eq]?.years?.[yr], [f]: v } } } }));

  const getEquipYears = (eq) => equipYears[eq] || [...ALL_YEARS];
  const removeEquipYear = (eq, yr) => {
    const cur = getEquipYears(eq);
    if (cur.length <= 1) return;
    setEquipUndoStacks(s => ({ ...s, [eq]: [...(s[eq] || []), yr] }));
    setEquipYears(s => ({ ...s, [eq]: cur.filter(x => x !== yr) }));
  };
  const undoEquipYear = (eq) => {
    const stack = equipUndoStacks[eq] || [];
    if (!stack.length) return;
    const last = stack[stack.length - 1];
    setEquipUndoStacks(s => ({ ...s, [eq]: stack.slice(0, -1) }));
    setEquipYears(s => ({ ...s, [eq]: [...getEquipYears(eq), last].sort() }));
  };

  const setFld = (plot, sec, f, v) => setFieldData(p => ({ ...p, [`p${plot}`]: { ...p[`p${plot}`], [sec]: { ...p[`p${plot}`]?.[sec], [f]: v } } }));
  const setFldY = (plot, sec, yr, f, v) => setFieldData(p => ({ ...p, [`p${plot}`]: { ...p[`p${plot}`], [sec]: { ...p[`p${plot}`]?.[sec], [yr]: { ...p[`p${plot}`]?.[sec]?.[yr], [f]: v } } } }));
  const fv = (plot, sec, f) => fieldData[`p${plot}`]?.[sec]?.[f] || '';
  const fyv = (plot, sec, yr, f) => fieldData[`p${plot}`]?.[sec]?.[yr]?.[f] || '';

  const getFieldYears = (plot, sec) => fieldYears[`${plot}_${sec}`] || [...ALL_YEARS];
  const removeFieldYear = (plot, sec, yr) => {
    const key = `${plot}_${sec}`;
    const cur = getFieldYears(plot, sec);
    if (cur.length <= 1) return;
    setFieldUndoStacks(s => ({ ...s, [key]: [...(s[key] || []), yr] }));
    setFieldYears(s => ({ ...s, [key]: cur.filter(x => x !== yr) }));
  };
  const undoFieldYear = (plot, sec) => {
    const key = `${plot}_${sec}`;
    const stack = fieldUndoStacks[key] || [];
    if (!stack.length) return;
    const last = stack[stack.length - 1];
    setFieldUndoStacks(s => ({ ...s, [key]: stack.slice(0, -1) }));
    setFieldYears(s => ({ ...s, [key]: [...getFieldYears(plot, sec), last].sort() }));
  };

  const numPlots = parseInt(onb.plots) || 1;
  const activeEquipList = onb.equipment.filter(e => EQUIPMENT_SCHEMAS[e]);
  const ONB_TOTAL = 9;

  const validateOnb = (step) => {
    const e = {};
    if (step === 1 && !onb.type) e.type = true;
    if (step === 2) {
      if (!onb.firstName) e.firstName = true;
      if (!onb.lastName) e.lastName = true;
      if (!onb.email || !/\S+@\S+/.test(onb.email)) e.email = true;
      if (!onb.phone) e.phone = true;
    }
    if (step === 3) { if (!onb.region) e.region = true; if (!onb.hectares) e.hectares = true; if (!onb.plots) e.plots = true; }
    if (step === 4 && onb.crops.length === 0) e.crops = true;
    setOnbErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateEquipYears = (eq) => {
    const years = getEquipYears(eq);
    const schema = EQUIPMENT_SCHEMAS[eq];
    for (const yr of years) {
      for (const f of schema.yearlyFields) {
        if (!equipData[eq]?.years?.[yr]?.[f.key]) return false;
      }
    }
    return true;
  };

  const validateFieldYears = (plot, sec, fields) => {
    const years = getFieldYears(plot, sec);
    for (const yr of years) {
      for (const f of fields) {
        if (!fieldData[`p${plot}`]?.[sec]?.[yr]?.[f.key]) return false;
      }
    }
    return true;
  };

  const nextOnbStep = () => {
    if (!validateOnb(onbStep)) return;
    if (onbStep < ONB_TOTAL) { setOnbStep(s => s + 1); }
    else {
      if (activeEquipList.length > 0) { setActiveEquip(activeEquipList[0]); setPhase('equipment'); }
      else { setPhase('fields'); }
    }
  };

  const nextEquip = () => {
    if (!validateEquipYears(activeEquip)) {
      setSectionErrors('Παρακαλούμε συμπληρώστε όλα τα πεδία για τα ορατά έτη.');
      return;
    }
    setSectionErrors('');
    const idx = activeEquipList.indexOf(activeEquip);
    if (idx < activeEquipList.length - 1) setActiveEquip(activeEquipList[idx + 1]);
    else setPhase('fields');
  };

  const FIELD_YEAR_SECTIONS = ['tillage', 'crops', 'harvest_main', 'harvest_cover', 'fertilizer_n', 'fertilizer_org'];

  const getFieldSectionFields = (sec) => {
    if (sec === 'tillage') return [{ key: 'type', label: 'Τύπος κατεργασίας', type: 'select', options: TILLAGE_TYPES }, { key: 'month', label: 'Μήνας εφαρμογής', type: 'select', options: MONTHS }, { key: 'depth', label: 'Βάθος εφαρμογής (cm)', type: 'number', placeholder: 'π.χ. 25' }];
    if (sec === 'crops') return [{ key: 'main', label: 'Κύρια καλλιέργεια', type: 'select', options: CROPS_LIST }, { key: 'cover', label: 'Δευτερεύουσα', type: 'select', options: CROPS_LIST }, { key: 'herbicides', label: 'Χρήση ζιζανιοκτόνων', type: 'select', options: ['Ναι', 'Όχι', 'Μερικώς'] }];
    if (sec === 'harvest_main') return [{ key: 'sow', label: 'Μήνας σποράς', type: 'select', options: MONTHS }, { key: 'harvest', label: 'Μήνας συγκομιδής', type: 'select', options: MONTHS }, { key: 'yield', label: 'Απόδοση (kg/ha)', type: 'number', placeholder: 'π.χ. 3000' }];
    if (sec === 'harvest_cover') return [{ key: 'sow', label: 'Μήνας σποράς', type: 'select', options: MONTHS }, { key: 'harvest', label: 'Μήνας συγκομιδής', type: 'select', options: MONTHS }, { key: 'yield', label: 'Απόδοση (kg/ha)', type: 'number', placeholder: 'π.χ. 1500' }];
    if (sec === 'fertilizer_n') return [{ key: 'type', label: 'Τύπος λιπάσματος', type: 'select', options: ['Στερεό', 'Υγρό', 'Αργής αποδέσμευσης', 'Ουρία', 'Θειική αμμωνία'] }, { key: 'month', label: 'Μήνας εφαρμογής', type: 'select', options: MONTHS }, { key: 'qty', label: 'Ποσότητα (kg/ha)', type: 'number', placeholder: 'π.χ. 96' }];
    if (sec === 'fertilizer_org') return [{ key: 'type', label: 'Τύπος οργανικού', type: 'select', options: ['Κομπόστ', 'Κοπριά βοοειδών', 'Κοπριά χοίρων', 'Κοπριά πουλερικών', 'Πράσινη λίπανση', 'Άλλο'] }, { key: 'month', label: 'Μήνας εφαρμογής', type: 'select', options: MONTHS }, { key: 'qty', label: 'Ποσότητα (kg/ha)', type: 'number', placeholder: 'π.χ. 500' }];
    return [];
  };

  const nextFieldSection = () => {
    if (FIELD_YEAR_SECTIONS.includes(activeFieldSection)) {
      const fields = getFieldSectionFields(activeFieldSection);
      if (!validateFieldYears(activePlot, activeFieldSection, fields)) {
        setSectionErrors('Παρακαλούμε συμπληρώστε όλα τα πεδία για τα ορατά έτη.');
        return;
      }
    }
    setSectionErrors('');
    const idx = FIELD_SECTIONS.findIndex(s => s.key === activeFieldSection);
    if (idx < FIELD_SECTIONS.length - 1) {
      setActiveFieldSection(FIELD_SECTIONS[idx + 1].key);
    } else if (activePlot < numPlots) {
      setActivePlot(p => p + 1);
      setActiveFieldSection('info');
    } else {
      submitAll();
    }
  };

  const submitAll = async () => {
    setLoading(true);
    try {
      await fetch('/api/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ onboarding: onb, equipment: equipData, fields: fieldData }) });
      setPhase('done');
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const onbProgress = Math.round((onbStep / ONB_TOTAL) * 100);

  return (
    <>
      <Head>
        <title>Roots of Carbon — Εγγραφή</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Inter',sans-serif;background:#f4f7f4;min-height:100vh;padding:2rem 1rem}
        .wrap{max-width:640px;margin:0 auto}
        .header{background:#1a3d2b;border-radius:12px;padding:1.5rem 2rem;margin-bottom:1.5rem;display:flex;align-items:center;gap:1rem}
        .logo-wrap{width:90px;height:90px;background:white;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;padding:2px}
        .logo-wrap img{width:100%;height:100%;object-fit:contain}
        .header h1{color:white;font-size:18px;font-weight:600}
        .header p{color:rgba(255,255,255,0.65);font-size:13px;margin-top:2px}
        .phase-bar{display:flex;margin-bottom:1.5rem;border-radius:99px;overflow:hidden;border:1px solid #d0d8cc}
        .phase-item{flex:1;padding:8px;text-align:center;font-size:12px;background:white;color:#888;transition:all 0.2s}
        .phase-item.active{background:#1a3d2b;color:white;font-weight:500}
        .phase-item.done{background:#e8f4e0;color:#1a3d2b}
        .prog-bar{background:#dde8d8;border-radius:99px;height:4px;margin-bottom:1.5rem;overflow:hidden}
        .prog-fill{background:#4a8c2a;height:100%;border-radius:99px;transition:width 0.4s}
        .prog-label{font-size:12px;color:#666;margin-bottom:6px}
        .card{background:white;border-radius:12px;padding:2rem;border:1px solid #e0ead8}
        .step-title{font-size:15px;font-weight:600;color:#1a3d2b;margin-bottom:4px}
        .step-sub{font-size:13px;color:#888;margin-bottom:1.5rem}
        label{display:block;font-size:13px;font-weight:500;color:#333;margin-bottom:5px}
        input,select,textarea{width:100%;border:1px solid #d0d8cc;border-radius:8px;padding:10px 12px;font-size:14px;font-family:'Inter',sans-serif;color:#333;background:white;outline:none;transition:border-color 0.2s}
        input:focus,select:focus,textarea:focus{border-color:#4a8c2a;box-shadow:0 0 0 3px rgba(74,140,42,0.1)}
        input.err,select.err{border-color:#e24b4a}
        .err-msg{font-size:12px;color:#e24b4a;margin-top:6px}
        .field{margin-bottom:1rem}
        .row2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
        .type-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
        .type-card{border:1px solid #d0d8cc;border-radius:10px;padding:16px 12px;cursor:pointer;text-align:center;transition:all 0.15s;background:white}
        .type-card:hover{border-color:#4a8c2a;background:#f0f7ec}
        .type-card.sel{border:2px solid #4a8c2a;background:#f0f7ec}
        .type-card .icon{font-size:28px;margin-bottom:6px}
        .type-card .name{font-size:13px;font-weight:600;color:#1a3d2b}
        .type-card .desc{font-size:11px;color:#888;margin-top:2px}
        .check-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
        .check-item{border:1px solid #d0d8cc;border-radius:8px;padding:10px 12px;cursor:pointer;display:flex;align-items:center;gap:8px;transition:all 0.15s;background:white}
        .check-item:hover{border-color:#4a8c2a}
        .check-item.sel{border-color:#4a8c2a;background:#f0f7ec}
        .check-box{width:16px;height:16px;border:1.5px solid #ccc;border-radius:4px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:10px}
        .check-item.sel .check-box{background:#4a8c2a;border-color:#4a8c2a;color:white}
        .check-item span{font-size:13px;color:#333}
        .radio-group{display:flex;flex-direction:column;gap:8px}
        .radio-item{border:1px solid #d0d8cc;border-radius:8px;padding:11px 14px;cursor:pointer;display:flex;align-items:center;gap:10px;transition:all 0.15s;background:white}
        .radio-item:hover{border-color:#4a8c2a}
        .radio-item.sel{border-color:#4a8c2a;background:#f0f7ec}
        .radio-dot{width:16px;height:16px;border:1.5px solid #ccc;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center}
        .radio-item.sel .radio-dot{border-color:#4a8c2a}
        .radio-inner{width:8px;height:8px;border-radius:50%;background:#4a8c2a;display:none}
        .radio-item.sel .radio-inner{display:block}
        .radio-item span{font-size:13px;color:#333}
        .tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:1rem}
        .tab{padding:8px 16px;border-radius:99px;border:1px solid #d0d8cc;background:white;font-size:13px;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.15s;color:#333}
        .tab:hover{border-color:#4a8c2a}
        .tab.active{background:#1a3d2b;color:white;border-color:#1a3d2b}
        .sec-nav{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:1.5rem}
        .sec-btn{padding:6px 12px;border-radius:8px;border:1px solid #d0d8cc;background:white;font-size:12px;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.15s;color:#555}
        .sec-btn:hover{border-color:#4a8c2a;color:#1a3d2b}
        .sec-btn.active{background:#e8f4e0;border-color:#4a8c2a;color:#1a3d2b;font-weight:500}
        .nav{display:flex;justify-content:space-between;align-items:center;margin-top:2rem;gap:12px}
        .btn-back{padding:10px 20px;border:1px solid #d0d8cc;border-radius:8px;background:transparent;color:#666;font-size:14px;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.15s}
        .btn-back:hover{background:#f5f5f5}
        .btn-next{padding:10px 28px;border:none;border-radius:8px;background:#1a3d2b;color:white;font-size:14px;font-weight:500;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.15s;margin-left:auto}
        .btn-next:hover{background:#4a8c2a}
        .btn-next:disabled{opacity:0.5;cursor:not-allowed}
        .btn-undo{padding:7px 14px;border:1px solid #d0d8cc;border-radius:8px;background:white;color:#555;font-size:12px;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.15s}
        .btn-undo:hover{border-color:#4a8c2a;color:#1a3d2b}
        .hint{font-size:12px;color:#888;margin-top:4px}
        .required{color:#4a8c2a}
        .years-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
        .years-title{font-size:13px;font-weight:600;color:#1a3d2b}
        .summary{background:#f4f7f4;border-radius:8px;padding:1rem 1.25rem;margin-top:1.5rem}
        .sum-row{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #e0e8d8;gap:12px;font-size:13px}
        .sum-row:last-child{border-bottom:none}
        .sum-k{color:#888;flex-shrink:0}
        .sum-v{color:#1a3d2b;font-weight:500;text-align:right}
      `}</style>

      <div className="wrap">
        <div className="header">
          <div className="logo-wrap"><img src="/roc_logo.jpeg" alt="Roots of Carbon" /></div>
          <div>
            <h1>Roots of Carbon</h1>
            <p>{phase === 'onboarding' ? 'Φόρμα εκδήλωσης ενδιαφέροντος' : phase === 'equipment' ? 'Καταγραφή γεωργικού εξοπλισμού' : phase === 'fields' ? 'Καταγραφή στοιχείων αγροτεμαχίων' : 'Ολοκλήρωση'}</p>
          </div>
        </div>

        <div className="phase-bar">
          <div className={`phase-item ${phase === 'onboarding' ? 'active' : ['equipment','fields','done'].includes(phase) ? 'done' : ''}`}>1. Εγγραφή</div>
          <div className={`phase-item ${phase === 'equipment' ? 'active' : ['fields','done'].includes(phase) ? 'done' : ''}`}>2. Εξοπλισμός</div>
          <div className={`phase-item ${phase === 'fields' ? 'active' : phase === 'done' ? 'done' : ''}`}>3. Αγροτεμάχια</div>
        </div>

        {/* ====== ONBOARDING ====== */}
        {phase === 'onboarding' && (
          <>
            <div className="prog-label">Βήμα {onbStep} από {ONB_TOTAL}</div>
            <div className="prog-bar"><div className="prog-fill" style={{ width: onbProgress + '%' }} /></div>
            <div className="card">
              {onbStep === 1 && (<>
                <div className="step-title">Ποιός είστε;</div>
                <div className="step-sub">Παρακαλούμε επιλέξτε τον τύπο που σας εκπροσωπεί.</div>
                <div className="type-grid">
                  {[{v:'Μεμονωμένος αγρότης',i:'🧑‍🌾',n:'Αγρότης',d:'Μεμονωμένος παραγωγός'},{v:'Αγροτικός συνεταιρισμός',i:'🤝',n:'Συνεταιρισμός',d:'Αγροτική ένωση'},{v:'Εταιρεία',i:'🏢',n:'Εταιρεία',d:'Νομικό πρόσωπο'}].map(t => (
                    <div key={t.v} className={`type-card ${onb.type === t.v ? 'sel' : ''}`} onClick={() => setOnbField('type', t.v)}>
                      <div className="icon">{t.i}</div><div className="name">{t.n}</div><div className="desc">{t.d}</div>
                    </div>
                  ))}
                </div>
                {onbErrors.type && <div className="err-msg">Παρακαλούμε επιλέξτε τύπο οντότητας.</div>}
              </>)}
              {onbStep === 2 && (<>
                <div className="step-title">Στοιχεία επικοινωνίας</div>
                <div className="step-sub">Συμπληρώστε τα στοιχεία σας για να επικοινωνήσουμε μαζί σας.</div>
                <div className="row2">
                  <div className="field"><label>Όνομα <span className="required">*</span></label><input className={onbErrors.firstName ? 'err' : ''} value={onb.firstName} onChange={e => setOnbField('firstName', e.target.value)} placeholder="π.χ. Γιώργος" /></div>
                  <div className="field"><label>Επώνυμο <span className="required">*</span></label><input className={onbErrors.lastName ? 'err' : ''} value={onb.lastName} onChange={e => setOnbField('lastName', e.target.value)} placeholder="π.χ. Παπαδόπουλος" /></div>
                </div>
                <div className="field"><label>Διεύθυνση email <span className="required">*</span></label><input className={onbErrors.email ? 'err' : ''} type="email" value={onb.email} onChange={e => setOnbField('email', e.target.value)} placeholder="email@example.com" />{onbErrors.email && <div className="err-msg">Εισάγετε έγκυρη διεύθυνση email.</div>}</div>
                <div className="field"><label>Τηλέφωνο επικοινωνίας <span className="required">*</span></label><input className={onbErrors.phone ? 'err' : ''} type="tel" value={onb.phone} onChange={e => setOnbField('phone', e.target.value)} placeholder="π.χ. 6901234567" />{onbErrors.phone && <div className="err-msg">Παρακαλούμε εισάγετε αριθμό τηλεφώνου.</div>}</div>
                {onb.type !== 'Μεμονωμένος αγρότης' && <div className="field"><label>Επωνυμία {onb.type === 'Εταιρεία' ? 'εταιρείας' : 'συνεταιρισμού'}</label><input value={onb.orgName} onChange={e => setOnbField('orgName', e.target.value)} placeholder="π.χ. ΑΣ Οροπεδίου Φολόης" /></div>}
              </>)}
              {onbStep === 3 && (<>
                <div className="step-title">Τοποθεσία και έκταση</div>
                <div className="step-sub">Πού βρίσκονται τα αγροτεμάχιά σας;</div>
                <div className="field"><label>Νομός / Περιφέρεια <span className="required">*</span></label><select className={onbErrors.region ? 'err' : ''} value={onb.region} onChange={e => setOnbField('region', e.target.value)}><option value="">Επιλέξτε...</option>{REGIONS.map(r => <option key={r}>{r}</option>)}</select></div>
                <div className="row2">
                  <div className="field"><label>Συνολική έκταση (ha) <span className="required">*</span></label><input className={onbErrors.hectares ? 'err' : ''} type="number" min="0" step="0.1" value={onb.hectares} onChange={e => setOnbField('hectares', e.target.value)} placeholder="π.χ. 15" /><div className="hint">1 ha = 10 στρέμματα</div></div>
                  <div className="field"><label>Αριθμός αγροτεμαχίων <span className="required">*</span></label><input className={onbErrors.plots ? 'err' : ''} type="number" min="1" step="1" value={onb.plots} onChange={e => setOnbField('plots', e.target.value)} placeholder="π.χ. 3" /></div>
                </div>
                {(onbErrors.region || onbErrors.hectares || onbErrors.plots) && <div className="err-msg">Παρακαλούμε συμπληρώστε όλα τα υποχρεωτικά πεδία.</div>}
              </>)}
              {onbStep === 4 && (<>
                <div className="step-title">Κύριες καλλιέργειες</div>
                <div className="step-sub">Επιλέξτε τις καλλιέργειες που αφορούν τα αγροτεμάχιά σας.</div>
                <div className="check-grid">
                  {ONBOARDING_CROPS.map(c => (
                    <div key={c} className={`check-item ${onb.crops.includes(c) ? 'sel' : ''}`} onClick={() => toggleArr('crops', c)}>
                      <div className="check-box">{onb.crops.includes(c) ? '✓' : ''}</div><span>{c}</span>
                    </div>
                  ))}
                </div>
                {onbErrors.crops && <div className="err-msg" style={{marginTop:'8px'}}>Παρακαλούμε επιλέξτε τουλάχιστον μία καλλιέργεια.</div>}
              </>)}
              {onbStep === 5 && (<>
                <div className="step-title">Διαθέσιμος γεωργικός εξοπλισμός</div>
                <div className="step-sub">Επιλέξτε τον εξοπλισμό που διαθέτετε.</div>
                <div className="check-grid">
                  {EQUIPMENT_LIST.map(e => (
                    <div key={e} className={`check-item ${onb.equipment.includes(e) ? 'sel' : ''}`} onClick={() => toggleArr('equipment', e)}>
                      <div className="check-box">{onb.equipment.includes(e) ? '✓' : ''}</div><span>{e}</span>
                    </div>
                  ))}
                </div>
              </>)}
              {onbStep === 6 && (<>
                <div className="step-title">Μέγεθος εκμετάλλευσης και κίνητρο</div>
                <div className="step-sub">Μερικές ακόμα πληροφορίες για να σας εξυπηρετήσουμε καλύτερα.</div>
                <div className="field">
                  <label>Μέγεθος γεωργικής εκμετάλλευσης</label>
                  <div className="radio-group" style={{marginTop:'6px'}}>
                    {['Μικρός παραγωγός (έως 10 ha)','Μεσαίος παραγωγός (10–50 ha)','Μεγάλος παραγωγός (άνω των 50 ha)'].map(o => (
                      <div key={o} className={`radio-item ${onb.farm_size === o ? 'sel' : ''}`} onClick={() => setOnbField('farm_size', o)}>
                        <div className="radio-dot"><div className="radio-inner" /></div><span>{o}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="field" style={{marginTop:'1.25rem'}}>
                  <label>Κύριο κίνητρο συμμετοχής</label>
                  <div className="radio-group" style={{marginTop:'6px'}}>
                    {['Carbon credits','Επιδοτήσεις','Πιστοποίηση βιώσιμης γεωργίας','Βελτίωση γεωργικών πρακτικών','Συνδυασμός των παραπάνω'].map(o => (
                      <div key={o} className={`radio-item ${onb.motivation === o ? 'sel' : ''}`} onClick={() => setOnbField('motivation', o)}>
                        <div className="radio-dot"><div className="radio-inner" /></div><span>{o}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>)}
              {onbStep === 7 && (<>
                <div className="step-title">Αποτύπωμα άνθρακα</div>
                <div className="step-sub">Έχετε προηγουμένως μετρήσει το αποτύπωμα άνθρακα της εκμετάλλευσής σας;</div>
                <div className="radio-group">
                  {['Ναι, έχω επίσημη μέτρηση','Ναι, κατά προσέγγιση','Όχι, είναι η πρώτη φορά','Δεν γνωρίζω'].map(o => (
                    <div key={o} className={`radio-item ${onb.carbon_measured === o ? 'sel' : ''}`} onClick={() => setOnbField('carbon_measured', o)}>
                      <div className="radio-dot"><div className="radio-inner" /></div><span>{o}</span>
                    </div>
                  ))}
                </div>
              </>)}
              {onbStep === 8 && (<>
                <div className="step-title">Συνεργάτες και πηγή ενημέρωσης</div>
                <div className="step-sub">Οι πληροφορίες αυτές μας βοηθούν να κατανοήσουμε καλύτερα τις ανάγκες σας.</div>
                <div className="field">
                  <label>Συνεργάζεστε με γεωπόνο ή γεωτεχνικό σύμβουλο;</label>
                  <div className="radio-group" style={{marginTop:'6px'}}>
                    {['Ναι, τακτικά','Ναι, περιστασιακά','Όχι'].map(o => (
                      <div key={o} className={`radio-item ${onb.agronomist === o ? 'sel' : ''}`} onClick={() => setOnbField('agronomist', o)}>
                        <div className="radio-dot"><div className="radio-inner" /></div><span>{o}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="field" style={{marginTop:'1.25rem'}}>
                  <label>Πώς πληροφορηθήκατε για την Roots of Carbon;</label>
                  <div className="radio-group" style={{marginTop:'6px'}}>
                    {['Σύσταση από γνωστό ή συνεργάτη','Μέσα κοινωνικής δικτύωσης','Εκδήλωση / συνέδριο','Αναζήτηση στο διαδίκτυο','Άλλο'].map(o => (
                      <div key={o} className={`radio-item ${onb.source === o ? 'sel' : ''}`} onClick={() => setOnbField('source', o)}>
                        <div className="radio-dot"><div className="radio-inner" /></div><span>{o}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>)}
              {onbStep === 9 && (<>
                <div className="step-title">Πρόσθετες πληροφορίες</div>
                <div className="step-sub">Εάν επιθυμείτε, μπορείτε να προσθέσετε οποιαδήποτε πρόσθετη πληροφορία.</div>
                <div className="field"><textarea rows={5} value={onb.comments} onChange={e => setOnbField('comments', e.target.value)} placeholder="π.χ. Διαθέτω ήδη εδαφολογικές αναλύσεις, ενδιαφέρομαι κυρίως για..." /></div>
              </>)}
              <div className="nav">
                {onbStep > 1 && <button className="btn-back" onClick={() => setOnbStep(s => s - 1)}>← Προηγούμενο</button>}
                <button className="btn-next" onClick={nextOnbStep}>{onbStep === ONB_TOTAL ? (activeEquipList.length > 0 ? 'Επόμενο: Εξοπλισμός →' : 'Επόμενο: Αγροτεμάχια →') : 'Επόμενο →'}</button>
              </div>
            </div>
          </>
        )}

        {/* ====== EQUIPMENT ====== */}
        {phase === 'equipment' && activeEquip && (
          <>
            <div className="tabs">
              {activeEquipList.map(eq => <button key={eq} className={`tab ${activeEquip === eq ? 'active' : ''}`} onClick={() => { setSectionErrors(''); setActiveEquip(eq); }}>{EQUIPMENT_SCHEMAS[eq].icon} {eq}</button>)}
            </div>
            <div className="card">
              <div className="step-title">{EQUIPMENT_SCHEMAS[activeEquip].icon} {activeEquip}</div>
              <div className="step-sub">Συμπληρώστε τα στοιχεία για τον εξοπλισμό σας.</div>
              <div className="row2">
                {EQUIPMENT_SCHEMAS[activeEquip].fields.map(f => (
                  <div className="field" key={f.key}>
                    <label>{f.label}</label>
                    {f.type === 'select'
                      ? <select value={equipData[activeEquip]?.[f.key] || ''} onChange={e => setEq(activeEquip, f.key, e.target.value)}><option value="">Επιλέξτε...</option>{f.options.map(o => <option key={o}>{o}</option>)}</select>
                      : <input type={f.type} placeholder={f.placeholder} value={equipData[activeEquip]?.[f.key] || ''} onChange={e => setEq(activeEquip, f.key, e.target.value)} />
                    }
                  </div>
                ))}
              </div>
              <div style={{marginTop:'1.5rem'}}>
                <div className="years-header">
                  <span className="years-title">Ιστορικά στοιχεία ανά έτος <span style={{color:'#e24b4a'}}>*</span></span>
                  {(equipUndoStacks[activeEquip] || []).length > 0 && (
                    <button className="btn-undo" onClick={() => undoEquipYear(activeEquip)}>↩ Undo</button>
                  )}
                </div>
                {getEquipYears(activeEquip).map(yr => (
                  <YearBlock
                    key={yr}
                    year={yr}
                    fields={EQUIPMENT_SCHEMAS[activeEquip].yearlyFields}
                    data={equipData[activeEquip]?.years?.[yr]}
                    onChange={(y, f, v) => setEqY(activeEquip, y, f, v)}
                    onRemove={(y) => removeEquipYear(activeEquip, y)}
                    canRemove={getEquipYears(activeEquip).length > 1}
                    isEquip={true}
                  />
                ))}
              </div>
              {sectionErrors && <div className="err-msg">{sectionErrors}</div>}
              <div className="nav">
                {activeEquipList.indexOf(activeEquip) > 0 && <button className="btn-back" onClick={() => { setSectionErrors(''); setActiveEquip(activeEquipList[activeEquipList.indexOf(activeEquip) - 1]); }}>← Προηγούμενο</button>}
                <button className="btn-next" onClick={nextEquip}>{activeEquipList.indexOf(activeEquip) < activeEquipList.length - 1 ? 'Επόμενο →' : 'Επόμενο: Αγροτεμάχια →'}</button>
              </div>
            </div>
          </>
        )}

        {/* ====== FIELDS ====== */}
        {phase === 'fields' && (
          <>
            <div className="tabs">
              {Array.from({ length: numPlots }, (_, i) => i + 1).map(p => <button key={p} className={`tab ${activePlot === p ? 'active' : ''}`} onClick={() => { setSectionErrors(''); setActivePlot(p); setActiveFieldSection('info'); }}>📍 Αγροτεμάχιο {p}</button>)}
            </div>
            <div className="sec-nav">
              {FIELD_SECTIONS.map(s => <button key={s.key} className={`sec-btn ${activeFieldSection === s.key ? 'active' : ''}`} onClick={() => { setSectionErrors(''); setActiveFieldSection(s.key); }}>{s.icon} {s.label}</button>)}
            </div>
            <div className="card">
              {activeFieldSection === 'info' && (<>
                <div className="step-title">📋 Στοιχεία αγροτεμαχίου {activePlot}</div>
                <div className="step-sub">Βασικές πληροφορίες για το αγροτεμάχιο.</div>
                <div className="row2">
                  <div className="field"><label>Περιοχή</label><input placeholder="π.χ. Ηλεία" value={fv(activePlot,'info','region')} onChange={e => setFld(activePlot,'info','region',e.target.value)} /></div>
                  <div className="field"><label>Έκταση (ha)</label><input type="number" step="0.1" placeholder="π.χ. 5" value={fv(activePlot,'info','area')} onChange={e => setFld(activePlot,'info','area',e.target.value)} /></div>
                </div>
                <div className="field"><label>Συντεταγμένες GIS</label><input placeholder="π.χ. 37.7N 21.7E" value={fv(activePlot,'info','gis')} onChange={e => setFld(activePlot,'info','gis',e.target.value)} /></div>
                <div className="row2">
                  <div className="field"><label>Εδαφική ανάλυση</label><select value={fv(activePlot,'info','soil_analysis')} onChange={e => setFld(activePlot,'info','soil_analysis',e.target.value)}><option value="">Επιλέξτε...</option><option>Ναι</option><option>Όχι</option></select></div>
                  {fv(activePlot,'info','soil_analysis') === 'Ναι' && <div className="field"><label>Link / αρχείο εδαφολογικής</label><input placeholder="π.χ. soilfile.pdf" value={fv(activePlot,'info','soil_file')} onChange={e => setFld(activePlot,'info','soil_file',e.target.value)} /></div>}
                </div>
                <div className="row2">
                  <div className="field"><label>Τύπος εδάφους</label><select value={fv(activePlot,'info','soil_type')} onChange={e => setFld(activePlot,'info','soil_type',e.target.value)}><option value="">Επιλέξτε...</option>{SOIL_TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
                  <div className="field"><label>Φυτοκάλυψη χειμώνα (cover crops)</label><select value={fv(activePlot,'info','cover_crops')} onChange={e => setFld(activePlot,'info','cover_crops',e.target.value)}><option value="">Επιλέξτε...</option><option>Ναι, τακτικά</option><option>Ναι, περιστασιακά</option><option>Όχι</option></select></div>
                </div>
                <div className="row2">
                  <div className="field"><label>Εφαρμογή εδαφικού ασβέστη</label><select value={fv(activePlot,'info','lime')} onChange={e => setFld(activePlot,'info','lime',e.target.value)}><option value="">Επιλέξτε...</option><option>Ναι</option><option>Όχι</option></select></div>
                  {fv(activePlot,'info','lime') === 'Ναι' && <div className="field"><label>Ποσότητα ασβέστη (kg/ha)</label><input type="number" placeholder="π.χ. 2500" value={fv(activePlot,'info','lime_qty')} onChange={e => setFld(activePlot,'info','lime_qty',e.target.value)} /></div>}
                </div>
                <div className="row3">
                  <div className="field"><label>Αρδευόμενο</label><select value={fv(activePlot,'info','irrigated')} onChange={e => setFld(activePlot,'info','irrigated',e.target.value)}><option value="">Επιλέξτε...</option><option>Ναι</option><option>Όχι</option></select></div>
                  <div className="field"><label>Έξυπνη άρδευση</label><select value={fv(activePlot,'info','smart_irr')} onChange={e => setFld(activePlot,'info','smart_irr',e.target.value)}><option value="">Επιλέξτε...</option><option>Ναι</option><option>Όχι</option></select></div>
                  <div className="field"><label>Βόσκηση</label><select value={fv(activePlot,'info','grazing')} onChange={e => setFld(activePlot,'info','grazing',e.target.value)}><option value="">Επιλέξτε...</option><option>Ναι</option><option>Όχι</option></select></div>
                </div>
                {fv(activePlot,'info','grazing') === 'Ναι' && <div className="field"><label>Αριθμός ζώων</label><input type="number" placeholder="π.χ. 50" value={fv(activePlot,'info','animals')} onChange={e => setFld(activePlot,'info','animals',e.target.value)} /></div>}
                <div className="field"><label>Διαχείριση υπολειμμάτων</label><select value={fv(activePlot,'info','residues')} onChange={e => setFld(activePlot,'info','residues',e.target.value)}><option value="">Επιλέξτε...</option><option>Ενσωμάτωση</option><option>Παραμονή επιφανειακά</option><option>Απόρριψη</option><option>Καύση</option></select></div>
                <div className="field"><label>Σχόλια</label><textarea rows={3} placeholder="Προαιρετικά σχόλια..." value={fv(activePlot,'info','notes')} onChange={e => setFld(activePlot,'info','notes',e.target.value)} /></div>
              </>)}

              {FIELD_YEAR_SECTIONS.includes(activeFieldSection) && (() => {
                const sec = activeFieldSection;
                const fields = getFieldSectionFields(sec);
                const secObj = FIELD_SECTIONS.find(s => s.key === sec);
                const years = getFieldYears(activePlot, sec);
                const undoStack = fieldUndoStacks[`${activePlot}_${sec}`] || [];
                return (<>
                  <div className="step-title">{secObj.icon} {secObj.label} — Αγροτεμάχιο {activePlot}</div>
                  <div className="step-sub">Συμπληρώστε τα στοιχεία ανά έτος.</div>
                  <div className="years-header">
                    <span className="years-title">Έτη καταγραφής <span style={{color:'#e24b4a'}}>*</span></span>
                    {undoStack.length > 0 && <button className="btn-undo" onClick={() => undoFieldYear(activePlot, sec)}>↩ Undo</button>}
                  </div>
                  {years.map(yr => (
                    <YearBlock
                      key={yr}
                      year={yr}
                      fields={fields}
                      data={fieldData[`p${activePlot}`]?.[sec]?.[yr]}
                      onChange={(y, f, v) => setFldY(activePlot, sec, y, f, v)}
                      onRemove={(y) => removeFieldYear(activePlot, sec, y)}
                      canRemove={years.length > 1}
                      isEquip={false}
                    />
                  ))}
                </>);
              })()}

              {sectionErrors && <div className="err-msg">{sectionErrors}</div>}
              <div className="nav">
                {FIELD_SECTIONS.findIndex(s => s.key === activeFieldSection) > 0 && (
                  <button className="btn-back" onClick={() => { setSectionErrors(''); setActiveFieldSection(FIELD_SECTIONS[FIELD_SECTIONS.findIndex(s => s.key === activeFieldSection) - 1].key); }}>← Προηγούμενο</button>
                )}
                <button className="btn-next" onClick={nextFieldSection} disabled={loading}>
                  {activeFieldSection === 'fertilizer_org' && activePlot === numPlots ? (loading ? 'Υποβολή...' : 'Υποβολή φόρμας ✓') : 'Επόμενο →'}
                </button>
              </div>
            </div>
          </>
        )}

        {phase === 'done' && (
          <div className="card" style={{textAlign:'center',padding:'3rem 2rem'}}>
            <div style={{fontSize:'52px',marginBottom:'1rem'}}>✅</div>
            <h2 style={{color:'#1a3d2b',fontSize:'20px',marginBottom:'8px'}}>Σας ευχαριστούμε!</h2>
            <p style={{color:'#666',fontSize:'14px',lineHeight:'1.6'}}>Λάβαμε όλα τα στοιχεία σας. Θα επικοινωνήσουμε μαζί σας σύντομα.</p>
            <div className="summary">
              {[['Τύπος οντότητας',onb.type],['Ονοματεπώνυμο',onb.orgName||`${onb.firstName} ${onb.lastName}`],['Email',onb.email],['Τηλέφωνο',onb.phone],['Περιοχή',onb.region],['Έκταση',onb.hectares?`${onb.hectares} ha · ${onb.plots} αγροτεμάχια`:'—'],['Καλλιέργειες',onb.crops.join(', ')||'—'],['Κίνητρο',onb.motivation||'—'],['Εξοπλισμός',onb.equipment.join(', ')||'—']].map(([k,v]) => (
                <div className="sum-row" key={k}><span className="sum-k">{k}</span><span className="sum-v">{v||'—'}</span></div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
