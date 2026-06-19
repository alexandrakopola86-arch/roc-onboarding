import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';
const trackEvent = (name, params) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', name, params || {});
  }
};

const ALL_YEARS = [2021, 2022, 2023, 2024, 2025];
const MONTHS = ['Ιανουάριος','Φεβρουάριος','Μάρτιος','Απρίλιος','Μάιος','Ιούνιος','Ιούλιος','Αύγουστος','Σεπτέμβριος','Οκτώβριος','Νοέμβριος','Δεκέμβριος'];
const CROPS_LIST = ['Ελιά ελαιοποιήσιμη','Ελιά επιτραπέζια','Βαμβάκι','Μαλακό σιτάρι','Σκληρό σιτάρι','Κριθάρι','Αραβόσιτος','Βρώμη','Λούπινο','Ηλίανθος','Σόγια','Σουσάμι','Βίκος','Κουκί','Αγρανάπαυση','Πράσινο ακτινίδιο','Αμπέλι','Εσπεριδοειδή','Κηπευτικά','Άλλο','Καμία'];
const REGIONS = ['Αττική','Θεσσαλονίκη','Ηλεία','Λάρισα','Μαγνησία','Αχαΐα','Ηράκλειο','Δωδεκάνησα','Αιτωλοακαρνανία','Βοιωτία','Εύβοια','Φθιώτιδα','Κορινθία','Αρκαδία','Μεσσηνία','Λακωνία','Αργολίδα','Χαλκιδική','Σέρρες','Κιλκίς','Πέλλα','Ημαθία','Πιερία','Κοζάνη','Φλώρινα','Καστοριά','Γρεβενά','Ιωάννινα','Θεσπρωτία','Άρτα','Πρέβεζα','Καρδίτσα','Τρίκαλα','Άλλο'];
const ONBOARDING_CROPS = ['Ελιά','Σιτηρά','Βαμβάκι','Αμπέλι','Οπωροφόρα','Αρωματικά / Βότανα','Κηπευτικά','Άλλο'];
const EQUIPMENT_LIST = ['Ελκυστήρας','Μηχάνημα Κατεργασίας','Σπαρτική','Λιπασματοδιανομέας','Ψεκαστικό','Μηχάνημα Συγκομιδής','Θεριζοαλωνιστική','Βαμβακοσυλλεκτική','Καταστροφέας','Άλλος εξοπλισμός'];
const TILLAGE_TYPES = ['Συμβατική','Μειωμένη','Strip-till','Ακαλλιέργεια/No-till','Άλλο'];
const SOIL_TYPES = ['Αμμώδες','Αργιλώδες','Πηλώδες','Αμμοπηλώδες','Αργιλοπηλώδες','Άλλο'];
const NITROGEN_TYPES = ['Αμμωνιακή ουρία (46-0-0)','Θειική αμμωνία','Νιτρική αμμωνία','Νιτρική αμμωνία + ασβέστης (CAN)','Υγρή αμμωνία','Διαλύματα ουρίας-αμμωνίου (UAN)','Σύνθετο λίπασμα (π.χ. NPK)','Διαφυλλικό αζωτούχο','Άλλο'];
const ORGANIC_TYPES = ['Κοπριά βοοειδών','Υδαρής κοπριά βοοειδών (slurry)','Κοπριά χοίρων','Υδαρής κοπριά χοίρων','Κοπριά πουλερικών/Ορνιθώνα','Κοπριά αιγοπροβάτων','Κομπόστ','Χώνευμα/Υπολείμματα Βιοαερίου (Digestate)','Άλλο'];
const IRRIGATION_TYPES = ['Στάγδην','Μπεκ/Micro-sprinklers','Καρούλια/Κανόνια','Ράμπα οριζόντιου ποτίσματος','Κατάκλυση/Επιφανειακή','Άλλο'];
const PUMP_TYPES = ['Ηλεκτροκίνητη','Πετρελαιοκίνητη (Diesel)','Βενζινοκίνητη','Φωτοβολταϊκό/ΑΠΕ','Αρδευτικό δίκτυο ΤΟΕΒ','Άλλο'];
const FUEL_TYPES = ['Diesel','Βενζίνη','Ρεύμα Δικτύου','Άλλο'];
const LIME_TYPES = ['Ασβεστιτικός','Δολομιτικός','Άλλο'];
const RESIDUES_OPTIONS = ['Παραμονή/Ενσωμάτωση','Απομάκρυνση','Καύση','Άλλο'];
const CERT_TYPES = ['Βιολογική γεωργία','GlobalG.A.P.','AGRO 2.1-2.2','Rainforest Alliance','Demeter','Άλλο'];
const TERMINATION_OPTIONS = ['Ενσωμάτωση στο έδαφος','Χημική Καταστροφή','Βόσκηση','Συγκομιδή','Άλλο'];
const FUEL_OPTIONS = ['Diesel','Βενζίνη','Βιοντίζελ','Άλλο'];

const EQUIPMENT_SCHEMAS = {
  'Ελκυστήρας': { icon: '🚜',
    instanceFields: [
      { key: 'type', label: 'Τύπος Ελκυστήρα', type: 'select', options: ['Διαξονικός Ελκυστήρας (ανοιχτού πεδίου / δενδροκομικό)','Μονοαξονικός Ελκυστήρας / Μοτοσκαπτικό','Άλλο'] },
      { key: 'year', label: 'Χρονολογία κατασκευής', type: 'number', placeholder: 'π.χ. 2005' },
      { key: 'hp', label: 'Ιπποδύναμη (HP)', type: 'number', placeholder: 'π.χ. 120' },
      { key: 'fuel', label: 'Τύπος καυσίμου', type: 'select', options: FUEL_OPTIONS },
    ],
    yearlyFields: [{ key: 'hours', label: 'Ώρες λειτουργίας' },{ key: 'fuel_lt', label: 'Κατανάλωση καυσίμου (λίτρα)' }] },
  'Μηχάνημα Κατεργασίας': { icon: '⚙️',
    instanceFields: [
      { key: 'type', label: 'Τύπος', type: 'select', options: ['Άροτρο με υνιά (Βαθιά συμβατική κατεργασία)','Δισκάροτρο','Υπεδαφοκαλλιεργητής / Ρίπερ','Φρέζα','Δισκοσβάρνα / Σβάρνα (Μειωμένη κατεργασία)','Μηχάνημα τοπικής κατεργασίας γραμμών (Strip-till)','Άλλο'] },
      { key: 'width', label: 'Πλάτος εργασίας (μέτρα)', type: 'number', placeholder: 'π.χ. 2.5' },
      { key: 'year', label: 'Χρονολογία κατασκευής', type: 'number', placeholder: 'π.χ. 2010' },
    ],
    yearlyFields: [{ key: 'hours', label: 'Ώρες λειτουργίας' },{ key: 'stremata', label: 'Στρέμματα εφαρμογής' }] },
  'Σπαρτική': { icon: '🌱',
    instanceFields: [
      { key: 'type', label: 'Τύπος', type: 'select', options: ['Σπαρτική μηχανή απευθείας σποράς (No-till seeder)','Σπαρτική σιτηρών / ψυχανθών (Συμβατική)','Σπαρτική ακριβείας / πνευματική','Πατατοσπορέας','Άλλο'] },
      { key: 'width', label: 'Πλάτος εργασίας (μέτρα)', type: 'number', placeholder: 'π.χ. 3.0' },
      { key: 'year', label: 'Χρονολογία κατασκευής', type: 'number', placeholder: 'π.χ. 2015' },
    ],
    yearlyFields: [{ key: 'hours', label: 'Ώρες λειτουργίας' },{ key: 'stremata', label: 'Στρέμματα εφαρμογής' }] },
  'Λιπασματοδιανομέας': { icon: '📦',
    instanceFields: [
      { key: 'type', label: 'Τύπος', type: 'select', options: ['Φυγοκεντρικός διανομέας','Διανομέας Οργανικής Λίπανσης / Κοπριάς','Σύστημα Υδρολίπανσης','Διανομέας μεταβλητής δόσης (Γεωργία Ακριβείας)','Άλλο'] },
      { key: 'capacity', label: 'Χωρητικότητα (λίτρα)', type: 'number', placeholder: 'π.χ. 500' },
      { key: 'year', label: 'Χρονολογία κατασκευής', type: 'number', placeholder: 'π.χ. 2016' },
    ],
    yearlyFields: [{ key: 'hours', label: 'Ώρες λειτουργίας' },{ key: 'stremata', label: 'Στρέμματα εφαρμογής' }] },
  'Ψεκαστικό': { icon: '💧',
    instanceFields: [
      { key: 'type', label: 'Τύπος', type: 'select', options: ['Ψεκαστικό γραμμικών καλλιεργειών (Ράμπα)','Μηχανοκίνητος ψεκαστήρας (Νεφελοψεκαστήρας / Τουρμπίνα)','Επινώτιος ψεκαστήρας','Μηχανοκίνητος θειωτήρας','Ψεκαστικό μεταβλητής δόσης (Γεωργία Ακριβείας)','Άλλο'] },
      { key: 'capacity', label: 'Χωρητικότητα (λίτρα)', type: 'number', placeholder: 'π.χ. 1000' },
      { key: 'year', label: 'Χρονολογία κατασκευής', type: 'number', placeholder: 'π.χ. 2018' },
    ],
    yearlyFields: [{ key: 'hours', label: 'Ώρες λειτουργίας' },{ key: 'stremata', label: 'Στρέμματα εφαρμογής' }] },
  'Μηχάνημα Συγκομιδής': { icon: '🌾',
    instanceFields: [
      { key: 'type', label: 'Τύπος', type: 'select', options: ['Θεριζοαλωνιστική μηχανή (Κομπίνα)','Βαμβακοσυλλεκτική μηχανή','Χορτοδετική / Χορτοσυλλεκτική μηχανή','Τευτλοεξαγωγέας / Πατατοεξαγωγέας','Μηχανή συγκομιδής βιομηχανικής τομάτας / καρότων','Άλλο'] },
      { key: 'year', label: 'Χρονολογία κατασκευής', type: 'number', placeholder: 'π.χ. 2018' },
    ],
    yearlyFields: [{ key: 'hours', label: 'Ώρες λειτουργίας' },{ key: 'stremata', label: 'Στρέμματα εφαρμογής' }] },
  'Θεριζοαλωνιστική': { icon: '🌾',
    instanceFields: [
      { key: 'year', label: 'Χρονολογία κατασκευής', type: 'number', placeholder: 'π.χ. 2015' },
      { key: 'hp', label: 'Ιπποδύναμη (HP)', type: 'number', placeholder: 'π.χ. 250' },
      { key: 'fuel', label: 'Τύπος καυσίμου', type: 'select', options: FUEL_OPTIONS },
    ],
    yearlyFields: [{ key: 'hours', label: 'Ώρες λειτουργίας' },{ key: 'stremata', label: 'Στρέμματα εφαρμογής' }] },
  'Βαμβακοσυλλεκτική': { icon: '🌿',
    instanceFields: [
      { key: 'year', label: 'Χρονολογία κατασκευής', type: 'number', placeholder: 'π.χ. 2015' },
      { key: 'hp', label: 'Ιπποδύναμη (HP)', type: 'number', placeholder: 'π.χ. 200' },
      { key: 'fuel', label: 'Τύπος καυσίμου', type: 'select', options: FUEL_OPTIONS },
    ],
    yearlyFields: [{ key: 'hours', label: 'Ώρες λειτουργίας' },{ key: 'stremata', label: 'Στρέμματα εφαρμογής' }] },
  'Καταστροφέας': { icon: '✂️',
    instanceFields: [
      { key: 'type', label: 'Τύπος', type: 'select', options: ['Σφυριά','Μαχαίρια','Άλλο'] },
      { key: 'width', label: 'Πλάτος εργασίας (μέτρα)', type: 'number', placeholder: 'π.χ. 2.0' },
      { key: 'year', label: 'Χρονολογία κατασκευής', type: 'number', placeholder: 'π.χ. 2015' },
    ],
    yearlyFields: [{ key: 'hours', label: 'Ώρες λειτουργίας' },{ key: 'stremata', label: 'Στρέμματα εφαρμογής' }] },
  'Άλλος εξοπλισμός': { icon: '🔧',
    instanceFields: [
      { key: 'type', label: 'Είδος εξοπλισμού', type: 'text', placeholder: 'π.χ. Μπαλιαστικό' },
      { key: 'description', label: 'Περιγραφή εξοπλισμού', type: 'text', placeholder: 'π.χ. Πλάτος 1.5μ, έτος κατασκευής 2010' },
    ],
    yearlyFields: [{ key: 'hours', label: 'Ώρες λειτουργίας' },{ key: 'stremata', label: 'Στρέμματα εφαρμογής' }] },
};

const FIELD_SECTIONS = [
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
                <>
                  <select style={{ width: '100%', border: `1px solid ${data?.[f.key] ? '#4a8c2a' : '#d0d8cc'}`, borderRadius: '8px', padding: '10px 12px', fontSize: '14px', fontFamily: 'Inter, sans-serif', color: '#333', background: 'white', outline: 'none' }} value={data?.[f.key] || ''} onChange={e => onChange(year, f.key, e.target.value)}>
                    <option value="">Επιλέξτε...</option>
                    {f.options.map(o => <option key={o}>{o}</option>)}
                  </select>
                  {f.options?.includes('Άλλο') && data?.[f.key] === 'Άλλο' && (
                    <input type="text" required placeholder="Παρακαλώ προσδιορίστε..." style={{ marginTop: '6px', width: '100%', border: '1px solid #d0d8cc', borderRadius: '8px', padding: '8px 10px', fontSize: '13px', fontFamily: 'Inter, sans-serif', color: '#333', background: 'white', outline: 'none' }} value={data?.[`${f.key}_other`] || ''} onChange={e => onChange(year, `${f.key}_other`, e.target.value)} />
                  )}
                </>
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
    agronomist: '', agronomistNumber: '', source: '', source_other: '', comments: '', farm_size: '', farm_size_other: '', carbon_measured: '', carbonValue: '', motivation: '', motivation_other: '', crops_other: '', equipment_other: '',
    memberFirstName: '', memberLastName: '', memberEmail: '', memberPhone: '', memberRole: '',
    ownerFirstName: '', ownerLastName: '', ownerEmail: '', ownerPhone: '',
    companyRepName: '',
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
  const [submittedAt, setSubmittedAt] = useState(null);
  const [certFiles, setCertFiles] = useState({});
  const [gisFiles, setGisFiles] = useState({});
  const [soilFiles, setSoilFiles] = useState({});
  const [legalFiles, setLegalFiles] = useState({});
  const [agronomistFile, setAgronomistFile] = useState(null);
  const [carbonFile, setCarbonFile] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [savedProgress, setSavedProgress] = useState(null);
  const skipFirstSave = useRef(true);
  const [fromPreview, setFromPreview] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (new URLSearchParams(window.location.search).get('test') !== '1') return;

    const testYears = {};
    ALL_YEARS.forEach(yr => { testYears[yr] = { hours: '300', fuel_lt: '1100' }; });

    const testTillage = {};
    const testCrops = {};
    const testHarvestMain = {};
    const testFertN = {};
    ALL_YEARS.forEach(yr => {
      testTillage[yr]      = { type: 'Συμβατική', month: 'Μάρτιος', depth: '25' };
      testCrops[yr]        = { main: 'Ελιά ελαιοποιήσιμη', cover: 'Καμία', herbicides: 'Όχι' };
      testHarvestMain[yr]  = { sow: 'Σεπτέμβριος', harvest: 'Νοέμβριος', yield: '3000' };
      testFertN[yr]        = { type: 'Αμμωνιακή ουρία (46-0-0)', month: 'Φεβρουάριος', qty: '150' };
    });

    setOnb({
      type: 'Μεμονωμένος αγρότης',
      firstName: 'Γιώργος', lastName: 'Παπαδόπουλος',
      email: 'test@rootsofcarbon.gr', phone: '6901234567', orgName: '',
      region: 'Αττική', hectares: '5', plots: '1',
      crops: ['Ελιά'], equipment: ['Ελκυστήρας'],
      farm_size: 'Μικρός παραγωγός (έως 100 στρέμματα)',
      motivation: 'Carbon credits',
      carbon_measured: 'Όχι, είναι η πρώτη φορά',
      agronomist: 'Όχι', source: 'Αναζήτηση στο διαδίκτυο', comments: '',
      memberFirstName: '', memberLastName: '', memberEmail: '', memberPhone: '', memberRole: '',
    });

    setEquipData({
      'Ελκυστήρας': {
        count: '1',
        machines: [{ type: 'Διαξονικός Ελκυστήρας (ανοιχτού πεδίου / δενδροκομικό)', year: '2010', hp: '90', fuel: 'Diesel', smart_farming: 'Όχι' }],
        years: testYears,
      },
    });

    setFieldData({
      p1: {
        info: {
          region: 'Αττική', area: '50', gis_link: '',
          soil_analysis: 'Όχι', soil_type: 'Πηλώδες', cover_crops: 'Όχι',
          lime: 'Όχι', irrigated: 'Όχι', smart_irr: 'Όχι', grazing: 'Όχι',
          residues: 'Παραμονή/Ενσωμάτωση', notes: '',
        },
        tillage: testTillage,
        crops: testCrops,
        harvest_main: testHarvestMain,
        fertilizer_n: testFertN,
      },
    });

    setSubmittedAt(new Date());
    setPhase('done');
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('roc_progress');
    if (saved) {
      try {
        setSavedProgress(JSON.parse(saved));
        setShowResumeModal(true);
      } catch {
        localStorage.removeItem('roc_progress');
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (skipFirstSave.current) { skipFirstSave.current = false; return; }
    if (phase === 'done') return;
    const snapshot = { phase, onbStep, onb, equipData, equipYears, equipUndoStacks, fieldData, fieldYears, fieldUndoStacks, activePlot, activeEquip, activeFieldSection };
    localStorage.setItem('roc_progress', JSON.stringify(snapshot));
  }, [phase, onbStep, onb, equipData, equipYears, equipUndoStacks, fieldData, fieldYears, fieldUndoStacks, activePlot, activeEquip, activeFieldSection]);

  useEffect(() => {
    if (phase === 'onboarding') trackEvent('onboarding_step', { step: onbStep });
  }, [phase, onbStep]);

  useEffect(() => {
    if (phase === 'equipment' && activeEquip) trackEvent('equipment_view', { equipment: activeEquip });
  }, [phase, activeEquip]);

  useEffect(() => {
    if (phase === 'fields') trackEvent('field_section_view', { section: activeFieldSection, plot: activePlot });
  }, [phase, activeFieldSection, activePlot]);

  useEffect(() => {
    if (phase === 'preview' || phase === 'done') trackEvent('phase_change', { phase });
  }, [phase]);

  const setOnbField = (k, v) => setOnb(p => ({ ...p, [k]: v }));
  const toggleArr = (k, v) => setOnb(p => ({ ...p, [k]: p[k].includes(v) ? p[k].filter(x => x !== v) : [...p[k], v] }));

  const setMachineField = (eq, idx, f, v) => setEquipData(p => ({
    ...p,
    [eq]: {
      ...p[eq],
      machines: (p[eq]?.machines || [{}]).map((m, i) => i === idx ? { ...m, [f]: v } : m),
    },
  }));

  const setEqCount = (eq, count) => {
    const n = Math.max(1, parseInt(count) || 1);
    setEquipData(p => {
      const existing = p[eq]?.machines || [{}];
      const machines = Array.from({ length: n }, (_, i) => existing[i] || {});
      return { ...p, [eq]: { ...p[eq], count: String(n), machines } };
    });
  };

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

  const getEquipCount = (eq) => parseInt(equipData[eq]?.count) || 1;
  const getEquipMachines = (eq) => {
    const n = getEquipCount(eq);
    const existing = equipData[eq]?.machines || [{}];
    return Array.from({ length: n }, (_, i) => existing[i] || {});
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
      if (onb.type === 'Μεμονωμένος αγρότης') {
        if (!onb.firstName) e.firstName = true;
        if (!onb.lastName) e.lastName = true;
        if (!onb.email || !/\S+@\S+/.test(onb.email)) e.email = true;
        if (!onb.phone) e.phone = true;
        else if (!/^69\d{8}$/.test(onb.phone)) e.phoneFormat = true;
      }
      if (onb.type === 'Αγροτικός συνεταιρισμός') {
        if (!onb.orgName) e.orgName = true;
        if (!onb.memberFirstName) e.memberFirstName = true;
        if (!onb.memberLastName) e.memberLastName = true;
        if (!onb.ownerFirstName) e.ownerFirstName = true;
        if (!onb.ownerLastName) e.ownerLastName = true;
      }
      if (onb.type === 'Εταιρεία') {
        if (!onb.orgName) e.orgName = true;
        if (!onb.companyRepName) e.companyRepName = true;
        if (!onb.email || !/\S+@\S+/.test(onb.email)) e.email = true;
        if (!onb.phone) e.phone = true;
        else if (!/^69\d{8}$/.test(onb.phone)) e.phoneFormat = true;
      }
    }
    if (step === 3) { if (!onb.region) e.region = true; if (!onb.hectares) e.hectares = true; if (!onb.plots) e.plots = true; }
    if (step === 4 && onb.crops.length === 0) e.crops = true;
    if (step === 4 && onb.crops.includes('Άλλο') && !onb.crops_other) e.crops_other = true;
    if (step === 5 && onb.equipment.includes('Άλλος εξοπλισμός') && !onb.equipment_other) e.equipment_other = true;
    if (step === 6 && onb.farm_size === 'Άλλο' && !onb.farm_size_other) e.farm_size_other = true;
    if (step === 6 && onb.motivation === 'Άλλο' && !onb.motivation_other) e.motivation_other = true;
    if (step === 7) {
      if (onb.carbon_measured === 'Ναι, κατά προσέγγιση' && !onb.carbonValue) e.carbonValue = true;
      if (onb.carbon_measured === 'Ναι, έχω επίσημη μέτρηση' && !onb.carbonValue && !carbonFile) e.carbonRequired = true;
    }
    if (step === 8 && onb.source === 'Άλλο' && !onb.source_other) e.source_other = true;
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

  const validateEquipAllos = (eq) => {
    const machines = getEquipMachines(eq);
    const schema = EQUIPMENT_SCHEMAS[eq];
    for (const machine of machines) {
      for (const f of schema.instanceFields) {
        if (!machine[f.key]) return false;
        if (f.type === 'select' && machine[f.key] === 'Άλλο' && !machine[`${f.key}_other`]) return false;
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

  const validateInfoSection = (plot) => {
    if (fv(plot,'info','soil_type') === 'Άλλο' && !fv(plot,'info','soil_type_other')) return false;
    if (fv(plot,'info','lime') === 'Ναι') {
      if (!fv(plot,'info','lime_type')) return false;
      if (fv(plot,'info','lime_type') === 'Άλλο' && !fv(plot,'info','lime_type_other')) return false;
      if (!fv(plot,'info','lime_qty')) return false;
    }
    if (fv(plot,'info','residues') === 'Άλλο' && !fv(plot,'info','residues_other')) return false;
    if (fv(plot,'info','residues') === 'Απομάκρυνση' && !fv(plot,'info','residues_pct')) return false;
    if (fv(plot,'info','irrigated') === 'Ναι') {
      if (!fv(plot,'info','irr_qty')) return false;
      if (!fv(plot,'info','irr_type')) return false;
      if (fv(plot,'info','irr_type') === 'Άλλο' && !fv(plot,'info','irr_type_other')) return false;
      if (!fv(plot,'info','pump_type')) return false;
      if (fv(plot,'info','pump_type') === 'Άλλο' && !fv(plot,'info','pump_type_other')) return false;
      if (['Ηλεκτροκίνητη','Φωτοβολταϊκό/ΑΠΕ'].includes(fv(plot,'info','pump_type')) && !fv(plot,'info','pump_kwh')) return false;
      if (['Πετρελαιοκίνητη (Diesel)','Βενζινοκίνητη','Άλλο'].includes(fv(plot,'info','pump_type')) && !fv(plot,'info','fuel_liters')) return false;
    }
    return true;
  };

  const validateTillageEntries = (plot) => {
    const years = getFieldYears(plot, 'tillage');
    for (const yr of years) {
      for (const entry of getIdxTillageEntries(plot, yr)) {
        if (!entry.type || !entry.month || !entry.depth) return false;
        if (entry.type === 'Άλλο' && !entry.type_other) return false;
      }
    }
    return true;
  };

  const nextOnbStep = () => {
    if (!validateOnb(onbStep)) return;
    if (fromPreview) { setFromPreview(false); setPhase('preview'); return; }
    if (onbStep < ONB_TOTAL) { setOnbStep(s => s + 1); }
    else {
      if (activeEquipList.length > 0) { setActiveEquip(activeEquipList[0]); setPhase('equipment'); }
      else { setPhase('fields'); }
    }
  };

  const nextEquip = () => {
    if (!validateEquipAllos(activeEquip)) {
      setSectionErrors('Παρακαλούμε συμπληρώστε όλα τα υποχρεωτικά στοιχεία μηχανήματος (*).');
      return;
    }
    if (!validateEquipYears(activeEquip)) {
      setSectionErrors('Παρακαλούμε συμπληρώστε όλα τα πεδία για τα ορατά έτη.');
      return;
    }
    setSectionErrors('');
    if (fromPreview) { setFromPreview(false); setPhase('preview'); return; }
    const idx = activeEquipList.indexOf(activeEquip);
    if (idx < activeEquipList.length - 1) setActiveEquip(activeEquipList[idx + 1]);
    else setPhase('fields');
  };

  const FIELD_YEAR_SECTIONS = ['crops', 'harvest_main', 'harvest_cover'];

  const getIdxTillageEntries = (plot, year) => {
    const e = fieldData[`p${plot}`]?.tillage?.[year];
    return Array.isArray(e) ? e : [];
  };
  const setIdxTillageCount = (plot, year, n) => {
    const count = Math.max(0, Math.min(5, parseInt(n) || 0));
    setFieldData(p => {
      const curr = p[`p${plot}`]?.tillage?.[year];
      const entries = Array.isArray(curr) ? curr : [];
      const newEntries = Array.from({ length: count }, (_, i) => entries[i] || {});
      return { ...p, [`p${plot}`]: { ...p[`p${plot}`], tillage: { ...p[`p${plot}`]?.tillage, [year]: newEntries } } };
    });
  };
  const setIdxTillageField = (plot, year, idx, field, value) => setFieldData(p => {
    const curr = p[`p${plot}`]?.tillage?.[year];
    const entries = Array.isArray(curr) ? curr : [];
    return { ...p, [`p${plot}`]: { ...p[`p${plot}`], tillage: { ...p[`p${plot}`]?.tillage, [year]: entries.map((e, i) => i === idx ? { ...e, [field]: value } : e) } } };
  });

  const getFieldSectionFields = (sec) => {
    if (sec === 'tillage') return [{ key: 'type', label: 'Τύπος κατεργασίας', type: 'select', options: TILLAGE_TYPES }, { key: 'month', label: 'Μήνας εφαρμογής', type: 'select', options: MONTHS }, { key: 'depth', label: 'Βάθος εφαρμογής (cm)', type: 'number', placeholder: 'π.χ. 25' }];
    if (sec === 'crops') return [{ key: 'main', label: 'Κύρια καλλιέργεια', type: 'select', options: CROPS_LIST }, { key: 'cover', label: 'Δευτερεύουσα', type: 'select', options: CROPS_LIST }, { key: 'herbicides', label: 'Χρήση ζιζανιοκτόνων', type: 'select', options: ['Ναι', 'Όχι', 'Μερικώς'] }];
    if (sec === 'harvest_main') return [{ key: 'sow', label: 'Μήνας σποράς', type: 'select', options: MONTHS }, { key: 'harvest', label: 'Μήνας συγκομιδής', type: 'select', options: MONTHS }, { key: 'yield', label: 'Απόδοση (kg/στρέμμα)', type: 'number', placeholder: 'π.χ. 300' }];
    if (sec === 'harvest_cover') return [{ key: 'sow', label: 'Μήνας σποράς', type: 'select', options: MONTHS }, { key: 'harvest', label: 'Μήνας συγκομιδής', type: 'select', options: MONTHS }, { key: 'yield', label: 'Απόδοση (kg/στρέμμα)', type: 'number', placeholder: 'π.χ. 150' }];
    if (sec === 'fertilizer_n') return [{ key: 'type', label: 'Τύπος λιπάσματος', type: 'select', options: NITROGEN_TYPES }, { key: 'month', label: 'Μήνας εφαρμογής', type: 'select', options: MONTHS }, { key: 'qty', label: 'Ποσότητα (kg/στρέμμα)', type: 'number', placeholder: 'π.χ. 9.6' }];
    if (sec === 'fertilizer_org') return [{ key: 'type', label: 'Τύπος οργανικού', type: 'select', options: ORGANIC_TYPES }, { key: 'month', label: 'Μήνας εφαρμογής', type: 'select', options: MONTHS }, { key: 'qty', label: 'Ποσότητα (kg/στρέμμα)', type: 'number', placeholder: 'π.χ. 50' }];
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
    if (activeFieldSection === 'info' && !validateInfoSection(activePlot)) {
      setSectionErrors('Παρακαλούμε συμπληρώστε όλα τα υποχρεωτικά πεδία (*) της ενότητας.');
      return;
    }
    if (activeFieldSection === 'tillage') {
      const hasAny = ALL_YEARS.some(y => getIdxTillageEntries(activePlot, y).length > 0);
      if (!hasAny) {
        setSectionErrors('Παρακαλούμε καταχωρίστε κατεργασία για τουλάχιστον ένα έτος.');
        return;
      }
      if (!validateTillageEntries(activePlot)) {
        setSectionErrors('Παρακαλούμε συμπληρώστε τύπο, μήνα και βάθος για κάθε καταχώρηση κατεργασίας.');
        return;
      }
    }
    if (activeFieldSection === 'fertilizer_n' && fv(activePlot,'fertilizer_n','applied') === 'Ναι') {
      if (!validateFieldYears(activePlot, 'fertilizer_n', getFieldSectionFields('fertilizer_n'))) {
        setSectionErrors('Παρακαλούμε συμπληρώστε τύπο, μήνα και ποσότητα για κάθε έτος.');
        return;
      }
    }
    if (activeFieldSection === 'fertilizer_org' && fv(activePlot,'fertilizer_org','applied') === 'Ναι') {
      if (!validateFieldYears(activePlot, 'fertilizer_org', getFieldSectionFields('fertilizer_org'))) {
        setSectionErrors('Παρακαλούμε συμπληρώστε τύπο, μήνα και ποσότητα για κάθε έτος.');
        return;
      }
    }
    if (activeFieldSection === 'certification' && fv(activePlot, 'certification', 'has_cert') === 'Ναι') {
      if (!fv(activePlot, 'certification', 'cert_number') && !certFiles[`p${activePlot}`]) {
        setSectionErrors('Παρακαλώ συμπληρώστε τον αριθμό πιστοποίησης ή ανεβάστε το αρχείο πιστοποίησης.');
        return;
      }
    }
    if (activeFieldSection === 'legitimacy' && fv(activePlot, 'legitimacy', 'carbon_declaration') !== 'true') {
      setSectionErrors('Παρακαλούμε αποδεχτείτε την υπεύθυνη δήλωση για να συνεχίσετε.');
      return;
    }
    setSectionErrors('');
    if (fromPreview) { setFromPreview(false); setPhase('preview'); return; }
    const idx = FIELD_SECTIONS.findIndex(s => s.key === activeFieldSection);
    if (idx < FIELD_SECTIONS.length - 1) {
      setActiveFieldSection(FIELD_SECTIONS[idx + 1].key);
    } else if (activePlot < numPlots) {
      setActivePlot(p => p + 1);
      setActiveFieldSection('info');
    } else {
      setPhase('preview');
    }
  };

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ name: file.name, type: file.type, data: reader.result.split(',')[1] });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const submitAll = async () => {
    setLoading(true);
    try {
      const fileTasks = [];
      Object.values(gisFiles).forEach(f => { if (f) fileTasks.push(fileToBase64(f)); });
      Object.values(soilFiles).forEach(f => { if (f) fileTasks.push(fileToBase64(f)); });
      Object.values(certFiles).forEach(f => { if (f) fileTasks.push(fileToBase64(f)); });
      Object.values(legalFiles).forEach(files => { (files || []).forEach(f => fileTasks.push(fileToBase64(f))); });
      if (agronomistFile) fileTasks.push(fileToBase64(agronomistFile));
      if (carbonFile) fileTasks.push(fileToBase64(carbonFile));
      const attachments = await Promise.all(fileTasks);

      const fileNames = {
        gis: Object.fromEntries(Object.entries(gisFiles).map(([k, f]) => [k, f?.name || null])),
        soil: Object.fromEntries(Object.entries(soilFiles).map(([k, f]) => [k, f?.name || null])),
        cert: Object.fromEntries(Object.entries(certFiles).map(([k, f]) => [k, f?.name || null])),
        legal: Object.fromEntries(Object.entries(legalFiles).map(([k, files]) => [k, (files || []).map(f => f.name)])),
        agronomist: agronomistFile?.name || null,
        carbon: carbonFile?.name || null,
      };
      await fetch('/api/submit-simple', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ onboarding: onb, equipment: equipData, fields: fieldData, fileNames, attachments }) });
      setSubmittedAt(new Date());
      setPhase('done');
      localStorage.removeItem('roc_progress');
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const restoreProgress = () => {
    if (!savedProgress) return;
    if (savedProgress.phase) setPhase(savedProgress.phase);
    if (savedProgress.onbStep) setOnbStep(savedProgress.onbStep);
    if (savedProgress.onb) setOnb(savedProgress.onb);
    if (savedProgress.equipData) setEquipData(savedProgress.equipData);
    if (savedProgress.equipYears) setEquipYears(savedProgress.equipYears);
    if (savedProgress.equipUndoStacks) setEquipUndoStacks(savedProgress.equipUndoStacks);
    if (savedProgress.fieldData) setFieldData(savedProgress.fieldData);
    if (savedProgress.fieldYears) setFieldYears(savedProgress.fieldYears);
    if (savedProgress.fieldUndoStacks) setFieldUndoStacks(savedProgress.fieldUndoStacks);
    if (savedProgress.activePlot) setActivePlot(savedProgress.activePlot);
    if (savedProgress.activeEquip !== undefined) setActiveEquip(savedProgress.activeEquip);
    if (savedProgress.activeFieldSection) setActiveFieldSection(savedProgress.activeFieldSection);
    setShowResumeModal(false);
  };

  const clearProgress = () => {
    localStorage.removeItem('roc_progress');
    setSavedProgress(null);
    setShowResumeModal(false);
  };

  const onbProgress = Math.round((onbStep / ONB_TOTAL) * 100);

  const isLastFieldSectionOfLastPlot = activeFieldSection === FIELD_SECTIONS[FIELD_SECTIONS.length - 1].key && activePlot === numPlots;

  return (
    <>
      <Head>
        <title>Roots of Carbon — Εγγραφή</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
        {GA_ID && <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}></script>}
        {GA_ID && <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        ` }} />}
      </Head>
      {showResumeModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', maxWidth: '420px', width: '90%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌱</div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1a3d2b', marginBottom: '0.75rem' }}>Αποθηκευμένη πρόοδος</h2>
            <p style={{ color: '#555', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>Έχετε αποθηκευμένη πρόοδο. Θέλετε να συνεχίσετε εκεί που έχετε μείνει;</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={clearProgress} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #d0d8cc', background: 'white', color: '#555', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', cursor: 'pointer', fontWeight: '500' }}>Από την αρχή</button>
              <button onClick={restoreProgress} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: '#1a3d2b', color: 'white', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', cursor: 'pointer', fontWeight: '600' }}>Συνέχεια</button>
            </div>
          </div>
        </div>
      )}
      <style dangerouslySetInnerHTML={{ __html: `
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
        .card{background:white;border-radius:12px;padding:2rem;border:1px solid #e0ead8;overflow:hidden;word-break:break-word}
        .step-title{font-size:15px;font-weight:600;color:#1a3d2b;margin-bottom:4px}
        .step-sub{font-size:13px;color:#888;margin-bottom:1.5rem}
        label{display:block;font-size:13px;font-weight:500;color:#333;margin-bottom:5px}
        input,select,textarea{width:100%;border:1px solid #d0d8cc;border-radius:8px;padding:10px 12px;font-size:14px;font-family:'Inter',sans-serif;color:#333;background:white;outline:none;transition:border-color 0.2s}
        input:not([type=file]):not([type=checkbox]):not([type=radio]),select{height:38px;padding:0 12px}
        textarea{padding:10px 12px}
        input:focus,select:focus,textarea:focus{border-color:#4a8c2a;box-shadow:0 0 0 3px rgba(74,140,42,0.1)}
        input.err,select.err{border-color:#e24b4a}
        .err-msg{font-size:12px;color:#e24b4a;margin-top:6px}
        .field{margin-bottom:1rem}
        .row2{display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:flex-end}
        .row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;align-items:flex-end}
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
        .machine-card{background:#fafbfa;border:1px solid #e0ead8;border-radius:10px;padding:1.25rem;margin-bottom:1rem}
        .machine-card-title{font-size:13px;font-weight:600;color:#1a3d2b;margin-bottom:1rem;padding-bottom:6px;border-bottom:1px solid #e0ead8}
        .smart-row{background:#f0f7ec;border:1px solid #c8e0b4;border-radius:8px;padding:10px 12px;margin-top:8px;display:flex;align-items:center;gap:12px;flex-wrap:wrap}
        .radio-row{display:flex;gap:12px}
        .radio-opt{display:flex;align-items:center;gap:6px;cursor:pointer;font-size:13px;color:#333}
        .member-box{background:#f0f7ec;border:1px solid #c8e0b4;border-radius:8px;padding:1rem 1.25rem;margin-bottom:1rem}
        .member-box-header{font-size:13px;font-weight:600;color:#1a3d2b;margin-bottom:1rem}
        .btn-edit{padding:4px 12px;border:1px solid #4a8c2a;border-radius:6px;background:white;color:#1a3d2b;font-size:12px;cursor:pointer;font-family:'Inter',sans-serif;font-weight:500}
        .btn-edit:hover{background:#f0f7ec}
        .print-summary{display:none}
        @keyframes spin{to{transform:rotate(360deg)}}
        @media print{
          .print-summary{display:block!important}
          body{background:white!important;padding:0!important}
          .no-print{display:none!important}
          .phase-bar,.header{display:none!important}
          .wrap{max-width:100%!important;margin:0!important}
          .card{border:none!important;border-radius:0!important;padding:0!important}
          table{page-break-inside:avoid}
        }
      ` }} />

      <div className="wrap">
        <div className="header">
          <div className="logo-wrap"><img src="/roc_logo.jpeg" alt="Roots of Carbon" /></div>
          <div>
            <h1>Roots of Carbon</h1>
            <p>{phase === 'onboarding' ? 'Φόρμα εκδήλωσης ενδιαφέροντος' : phase === 'equipment' ? 'Καταγραφή γεωργικού εξοπλισμού' : phase === 'fields' ? 'Καταγραφή στοιχείων αγροτεμαχίων' : 'Ολοκλήρωση'}</p>
          </div>
        </div>

        {!['done', 'preview'].includes(phase) && (
          <div className="phase-bar">
            <div className={`phase-item ${phase === 'onboarding' ? 'active' : ['equipment','fields'].includes(phase) ? 'done' : ''}`}>1. Εγγραφή</div>
            <div className={`phase-item ${phase === 'equipment' ? 'active' : phase === 'fields' ? 'done' : ''}`}>2. Εξοπλισμός</div>
            <div className={`phase-item ${phase === 'fields' ? 'active' : ''}`}>3. Αγροτεμάχια</div>
          </div>
        )}

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
                {onb.type === 'Μεμονωμένος αγρότης' && (<>
                  <div className="row2">
                    <div className="field"><label>Όνομα <span className="required">*</span></label><input className={onbErrors.firstName ? 'err' : ''} value={onb.firstName} onChange={e => setOnbField('firstName', e.target.value)} placeholder="π.χ. Γιώργος" /></div>
                    <div className="field"><label>Επώνυμο <span className="required">*</span></label><input className={onbErrors.lastName ? 'err' : ''} value={onb.lastName} onChange={e => setOnbField('lastName', e.target.value)} placeholder="π.χ. Παπαδόπουλος" /></div>
                  </div>
                  <div className="field"><label>Διεύθυνση email <span className="required">*</span></label><input className={onbErrors.email ? 'err' : ''} type="email" value={onb.email} onChange={e => setOnbField('email', e.target.value)} placeholder="email@example.com" />{onbErrors.email && <div className="err-msg">Εισάγετε έγκυρη διεύθυνση email.</div>}</div>
                  <div className="field">
                    <label>Τηλέφωνο επικοινωνίας <span className="required">*</span></label>
                    <input className={onbErrors.phone || onbErrors.phoneFormat ? 'err' : ''} type="tel" value={onb.phone} onChange={e => setOnbField('phone', e.target.value)} placeholder="π.χ. 6901234567" />
                    {(onbErrors.phone || onbErrors.phoneFormat) && <div className="err-msg">Το κινητό πρέπει να είναι μορφής 69XXXXXXXX</div>}
                  </div>
                </>)}
                {onb.type !== 'Μεμονωμένος αγρότης' && (
                  <div className="field">
                    <label>Επωνυμία {onb.type === 'Αγροτικός συνεταιρισμός' ? 'συνεταιρισμού' : 'εταιρείας'} <span className="required">*</span></label>
                    <input className={onbErrors.orgName ? 'err' : ''} value={onb.orgName} onChange={e => setOnbField('orgName', e.target.value)} placeholder={onb.type === 'Αγροτικός συνεταιρισμός' ? 'π.χ. ΑΣ Οροπεδίου Φολόης' : 'π.χ. ΑΒΓΕ ΑΕ'} />
                    {onbErrors.orgName && <div className="err-msg">Παρακαλούμε εισάγετε την επωνυμία.</div>}
                  </div>
                )}
                {onb.type === 'Εταιρεία' && (<>
                  <div className="member-box">
                    <div className="member-box-header">🏢 Στοιχεία εκπροσώπου εταιρείας</div>
                    <div className="field">
                      <label>Ονοματεπώνυμο εκπροσώπου <span className="required">*</span></label>
                      <input className={onbErrors.companyRepName ? 'err' : ''} value={onb.companyRepName} onChange={e => setOnbField('companyRepName', e.target.value)} placeholder="π.χ. Μαρία Παπανικολάου" />
                      {onbErrors.companyRepName && <div className="err-msg">Παρακαλούμε εισάγετε ονοματεπώνυμο εκπροσώπου.</div>}
                    </div>
                  </div>
                  <div className="field"><label>Διεύθυνση email <span className="required">*</span></label><input className={onbErrors.email ? 'err' : ''} type="email" value={onb.email} onChange={e => setOnbField('email', e.target.value)} placeholder="email@example.com" />{onbErrors.email && <div className="err-msg">Εισάγετε έγκυρη διεύθυνση email.</div>}</div>
                  <div className="field">
                    <label>Τηλέφωνο επικοινωνίας <span className="required">*</span></label>
                    <input className={onbErrors.phone || onbErrors.phoneFormat ? 'err' : ''} type="tel" value={onb.phone} onChange={e => setOnbField('phone', e.target.value)} placeholder="π.χ. 6901234567" />
                    {(onbErrors.phone || onbErrors.phoneFormat) && <div className="err-msg">Το κινητό πρέπει να είναι μορφής 69XXXXXXXX</div>}
                  </div>
                </>)}
                {onb.type === 'Αγροτικός συνεταιρισμός' && (
                  <>
                    <div className="member-box">
                      <div className="member-box-header">👤 Στοιχεία εκπροσώπου</div>
                      <div className="row2">
                        <div className="field">
                          <label>Όνομα εκπροσώπου <span className="required">*</span></label>
                          <input className={onbErrors.memberFirstName ? 'err' : ''} value={onb.memberFirstName} onChange={e => setOnbField('memberFirstName', e.target.value)} placeholder="π.χ. Κώστας" />
                        </div>
                        <div className="field">
                          <label>Επώνυμο εκπροσώπου <span className="required">*</span></label>
                          <input className={onbErrors.memberLastName ? 'err' : ''} value={onb.memberLastName} onChange={e => setOnbField('memberLastName', e.target.value)} placeholder="π.χ. Νικολάου" />
                        </div>
                      </div>
                      <div className="row2">
                        <div className="field">
                          <label>Email εκπροσώπου</label>
                          <input type="email" value={onb.memberEmail} onChange={e => setOnbField('memberEmail', e.target.value)} placeholder="email@example.com" />
                        </div>
                        <div className="field">
                          <label>Τηλέφωνο εκπροσώπου</label>
                          <input type="tel" value={onb.memberPhone} onChange={e => setOnbField('memberPhone', e.target.value)} placeholder="π.χ. 6971234567" />
                        </div>
                      </div>
                      <div className="field">
                        <label>Ρόλος / θέση στον συνεταιρισμό</label>
                        <input value={onb.memberRole} onChange={e => setOnbField('memberRole', e.target.value)} placeholder="π.χ. Πρόεδρος, Γεν. Γραμματέας" />
                      </div>
                    </div>
                    <div className="member-box" style={{ marginTop: '12px' }}>
                      <div className="member-box-header">🏡 Στοιχεία ιδιοκτήτη αγροτεμαχίου</div>
                      <div className="row2">
                        <div className="field">
                          <label>Όνομα ιδιοκτήτη <span className="required">*</span></label>
                          <input className={onbErrors.ownerFirstName ? 'err' : ''} value={onb.ownerFirstName} onChange={e => setOnbField('ownerFirstName', e.target.value)} placeholder="π.χ. Γιώργος" />
                          {onbErrors.ownerFirstName && <div className="err-msg">Υποχρεωτικό πεδίο.</div>}
                        </div>
                        <div className="field">
                          <label>Επώνυμο ιδιοκτήτη <span className="required">*</span></label>
                          <input className={onbErrors.ownerLastName ? 'err' : ''} value={onb.ownerLastName} onChange={e => setOnbField('ownerLastName', e.target.value)} placeholder="π.χ. Παπαδόπουλος" />
                          {onbErrors.ownerLastName && <div className="err-msg">Υποχρεωτικό πεδίο.</div>}
                        </div>
                      </div>
                      <div className="row2">
                        <div className="field">
                          <label>Email ιδιοκτήτη</label>
                          <input type="email" value={onb.ownerEmail} onChange={e => setOnbField('ownerEmail', e.target.value)} placeholder="email@example.com" />
                        </div>
                        <div className="field">
                          <label>Τηλέφωνο ιδιοκτήτη</label>
                          <input type="tel" value={onb.ownerPhone} onChange={e => setOnbField('ownerPhone', e.target.value)} placeholder="π.χ. 6981234567" />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>)}

              {onbStep === 3 && (<>
                <div className="step-title">Τοποθεσία και έκταση</div>
                <div className="step-sub">Πού βρίσκονται τα αγροτεμάχιά σας;</div>
                <div className="field"><label>Νομός / Περιφέρεια <span className="required">*</span></label><select className={onbErrors.region ? 'err' : ''} value={onb.region} onChange={e => setOnbField('region', e.target.value)}><option value="">Επιλέξτε...</option>{REGIONS.map(r => <option key={r}>{r}</option>)}</select></div>
                <div className="row2">
                  <div className="field"><label>Συνολικά στρέμματα <span className="required">*</span></label><input className={onbErrors.hectares ? 'err' : ''} type="number" min="0" step="0.1" value={onb.hectares} onChange={e => setOnbField('hectares', e.target.value)} placeholder="π.χ. 150" /></div>
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
                {onb.crops.includes('Άλλο') && (
                  <div className="field" style={{marginTop:'10px'}}>
                    <input className={onbErrors.crops_other ? 'err' : ''} value={onb.crops_other || ''} onChange={e => setOnbField('crops_other', e.target.value)} placeholder="Παρακαλώ προσδιορίστε καλλιέργεια..." />
                    {onbErrors.crops_other && <div className="err-msg" style={{marginTop:'4px'}}>Παρακαλούμε προσδιορίστε την καλλιέργεια.</div>}
                  </div>
                )}
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
                {onb.equipment.includes('Άλλος εξοπλισμός') && (
                  <div className="field" style={{marginTop:'10px'}}>
                    <label>Παρακαλώ προσδιορίστε τον εξοπλισμό</label>
                    <input className={onbErrors.equipment_other ? 'err' : ''} value={onb.equipment_other || ''} onChange={e => setOnbField('equipment_other', e.target.value)} placeholder="π.χ. Μπαλιαστικό..." />
                    {onbErrors.equipment_other && <div className="err-msg" style={{marginTop:'4px'}}>Παρακαλούμε προσδιορίστε τον εξοπλισμό.</div>}
                  </div>
                )}
              </>)}

              {onbStep === 6 && (<>
                <div className="step-title">Μέγεθος εκμετάλλευσης και κίνητρο</div>
                <div className="step-sub">Μερικές ακόμα πληροφορίες για να σας εξυπηρετήσουμε καλύτερα.</div>
                <div className="field">
                  <label>Μέγεθος γεωργικής εκμετάλλευσης</label>
                  <div className="radio-group" style={{marginTop:'6px'}}>
                    {['Μικρός παραγωγός (έως 100 στρέμματα)','Μεσαίος παραγωγός (100–500 στρέμματα)','Μεγάλος παραγωγός (άνω των 500 στρεμμάτων)','Άλλο'].map(o => (
                      <div key={o} className={`radio-item ${onb.farm_size === o ? 'sel' : ''}`} onClick={() => setOnbField('farm_size', o)}>
                        <div className="radio-dot"><div className="radio-inner" /></div><span>{o}</span>
                      </div>
                    ))}
                    {onb.farm_size === 'Άλλο' && <input style={{marginTop:'8px'}} className={onbErrors.farm_size_other ? 'err' : ''} value={onb.farm_size_other || ''} onChange={e => setOnbField('farm_size_other', e.target.value)} placeholder="Παρακαλώ προσδιορίστε..." />}
                    {onbErrors.farm_size_other && <div className="err-msg" style={{marginTop:'4px'}}>Παρακαλούμε προσδιορίστε το μέγεθος.</div>}
                  </div>
                </div>
                <div className="field" style={{marginTop:'1.25rem'}}>
                  <label>Κύριο κίνητρο συμμετοχής</label>
                  <div className="radio-group" style={{marginTop:'6px'}}>
                    {['Carbon credits','Επιδοτήσεις','Πιστοποίηση βιώσιμης γεωργίας','Βελτίωση γεωργικών πρακτικών','Συνδυασμός των παραπάνω','Άλλο'].map(o => (
                      <div key={o} className={`radio-item ${onb.motivation === o ? 'sel' : ''}`} onClick={() => setOnbField('motivation', o)}>
                        <div className="radio-dot"><div className="radio-inner" /></div><span>{o}</span>
                      </div>
                    ))}
                    {onb.motivation === 'Άλλο' && <input style={{marginTop:'8px'}} className={onbErrors.motivation_other ? 'err' : ''} value={onb.motivation_other || ''} onChange={e => setOnbField('motivation_other', e.target.value)} placeholder="Παρακαλώ προσδιορίστε..." />}
                    {onbErrors.motivation_other && <div className="err-msg" style={{marginTop:'4px'}}>Παρακαλούμε προσδιορίστε το κίνητρο.</div>}
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
                {(onb.carbon_measured === 'Ναι, έχω επίσημη μέτρηση' || onb.carbon_measured === 'Ναι, κατά προσέγγιση') && (
                  <div style={{ marginTop: '1.25rem', background: '#f0f7ec', borderRadius: '8px', padding: '1rem', border: '1px solid #c8e0b4' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a3d2b', marginBottom: '0.75rem' }}>Στοιχεία μέτρησης</div>
                    <div className="field">
                      <label>Εκτιμώμενη τιμή αποτυπώματος (tCO₂e/στρέμμα){onb.carbon_measured === 'Ναι, κατά προσέγγιση' && <span className="required"> *</span>}</label>
                      <input type="number" step="0.01" placeholder="π.χ. 0.45" className={onbErrors.carbonValue ? 'err' : ''} value={onb.carbonValue} onChange={e => setOnbField('carbonValue', e.target.value)} />
                      {onbErrors.carbonValue && <div className="err-msg">Η τιμή αποτυπώματος είναι υποχρεωτική.</div>}
                    </div>
                    {onb.carbon_measured === 'Ναι, έχω επίσημη μέτρηση' && (<>
                      {onbErrors.carbonRequired && <div className="err-msg" style={{marginBottom:'8px'}}>Απαιτείται τιμή ή αρχείο επίσημης μέτρησης (τουλάχιστον ένα).</div>}
                      <div className="field">
                        <label>Αρχείο επίσημης μέτρησης (.pdf)</label>
                        <input type="file" accept=".pdf,.doc,.docx" style={{ padding: '8px 0', border: 'none' }} onChange={e => setCarbonFile(e.target.files[0])} />
                        {carbonFile && <div style={{ fontSize: '12px', color: '#4a8c2a', marginTop: '4px' }}>✓ {carbonFile.name}</div>}
                      </div>
                    </>)}
                  </div>
                )}
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
                {(onb.agronomist === 'Ναι, τακτικά' || onb.agronomist === 'Ναι, περιστασιακά') && (
                  <div style={{ background: '#f0f7ec', borderRadius: '8px', padding: '1rem', border: '1px solid #c8e0b4', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a3d2b', marginBottom: '0.75rem' }}>Στοιχεία γεωπόνου / συμβούλου</div>
                    <div className="field">
                      <label>Αριθμός μητρώου (ΓΕΩΤΕΕ)</label>
                      <input type="text" placeholder="π.χ. 12345" value={onb.agronomistNumber} onChange={e => setOnbField('agronomistNumber', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Αρχείο συνεργασίας (pdf, προαιρετικά)</label>
                      <input type="file" accept=".pdf,.doc,.docx" style={{ padding: '8px 0', border: 'none' }} onChange={e => setAgronomistFile(e.target.files[0])} />
                      {agronomistFile && <div style={{ fontSize: '12px', color: '#4a8c2a', marginTop: '4px' }}>✓ {agronomistFile.name}</div>}
                    </div>
                  </div>
                )}
                <div className="field" style={{marginTop:'1.25rem'}}>
                  <label>Πώς πληροφορηθήκατε για την Roots of Carbon;</label>
                  <div className="radio-group" style={{marginTop:'6px'}}>
                    {['Σύσταση από γνωστό ή συνεργάτη','Μέσα κοινωνικής δικτύωσης','Εκδήλωση / συνέδριο','Αναζήτηση στο διαδίκτυο','Άλλο'].map(o => (
                      <div key={o} className={`radio-item ${onb.source === o ? 'sel' : ''}`} onClick={() => setOnbField('source', o)}>
                        <div className="radio-dot"><div className="radio-inner" /></div><span>{o}</span>
                      </div>
                    ))}
                  </div>
                  {onb.source === 'Άλλο' && <input style={{marginTop:'8px'}} className={onbErrors.source_other ? 'err' : ''} value={onb.source_other || ''} onChange={e => setOnbField('source_other', e.target.value)} placeholder="Παρακαλώ προσδιορίστε..." />}
                  {onbErrors.source_other && <div className="err-msg" style={{marginTop:'4px'}}>Παρακαλούμε προσδιορίστε την πηγή.</div>}
                </div>
              </>)}

              {onbStep === 9 && (<>
                <div className="step-title">Πρόσθετες πληροφορίες</div>
                <div className="step-sub">Εάν επιθυμείτε, μπορείτε να προσθέσετε οποιαδήποτε πρόσθετη πληροφορία.</div>
                <div className="field"><textarea rows={5} value={onb.comments} onChange={e => setOnbField('comments', e.target.value)} placeholder="π.χ. Διαθέτω ήδη εδαφολογικές αναλύσεις, ενδιαφέρομαι κυρίως για..." /></div>
              </>)}

              <div className="nav">
                {fromPreview
                  ? <button className="btn-back" onClick={() => { setFromPreview(false); setPhase('preview'); }}>← Προεπισκόπηση</button>
                  : onbStep > 1 && <button className="btn-back" onClick={() => setOnbStep(s => s - 1)}>← Προηγούμενο</button>}
                <button className="btn-next" onClick={nextOnbStep}>{fromPreview ? 'Αποθήκευση →' : (onbStep === ONB_TOTAL ? (activeEquipList.length > 0 ? 'Επόμενο: Εξοπλισμός →' : 'Επόμενο: Αγροτεμάχια →') : 'Επόμενο →')}</button>
              </div>
            </div>
          </>
        )}

        {/* ====== EQUIPMENT ====== */}
        {phase === 'equipment' && activeEquip && (() => {
          const schema = EQUIPMENT_SCHEMAS[activeEquip];
          const count = getEquipCount(activeEquip);
          const machines = getEquipMachines(activeEquip);
          return (
            <>
              <div className="tabs">
                {activeEquipList.map(eq => {
                  const tabLabel = eq === 'Άλλος εξοπλισμός' ? (equipData[eq]?.machines?.[0]?.type || eq) : eq;
                  return <button key={eq} className={`tab ${activeEquip === eq ? 'active' : ''}`} onClick={() => { setSectionErrors(''); setActiveEquip(eq); }}>{EQUIPMENT_SCHEMAS[eq].icon} {tabLabel}</button>;
                })}
              </div>
              <div className="card">
                <div className="step-title">{schema.icon} {activeEquip}</div>
                <div className="step-sub">Συμπληρώστε τα στοιχεία για τον εξοπλισμό σας.</div>

                <div className="field" style={{ maxWidth: '200px' }}>
                  <label>Αριθμός μηχανημάτων</label>
                  <input type="number" min="1" value={count} onChange={e => setEqCount(activeEquip, e.target.value)} />
                </div>

                {machines.map((machine, idx) => (
                  <div className="machine-card" key={idx}>
                    <div className="machine-card-title">Μηχάνημα {idx + 1}</div>
                    <div className="row2">
                      {schema.instanceFields.map(f => (
                        <div className="field" key={f.key}>
                          <label>{f.label} <span style={{color:'#e24b4a'}}>*</span></label>
                          {f.type === 'select' ? (
                            <>
                              <select value={machine[f.key] || ''} onChange={e => setMachineField(activeEquip, idx, f.key, e.target.value)}>
                                <option value="">Επιλέξτε...</option>
                                {f.options.map(o => <option key={o}>{o}</option>)}
                              </select>
                              {machine[f.key] === 'Άλλο' && (
                                <input type="text" required placeholder="Παρακαλώ προσδιορίστε..." style={{ marginTop: '8px' }} value={machine[`${f.key}_other`] || ''} onChange={e => setMachineField(activeEquip, idx, `${f.key}_other`, e.target.value)} />
                              )}
                            </>
                          ) : (
                            <input type={f.type} placeholder={f.placeholder} value={machine[f.key] || ''} onChange={e => setMachineField(activeEquip, idx, f.key, e.target.value)} />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="smart-row">
                      <span style={{ fontSize: '13px', fontWeight: '500', color: '#1a3d2b' }}>Διαθέτει λειτουργία έξυπνης γεωργίας;</span>
                      <div className="radio-row">
                        {['Ναι', 'Όχι'].map(opt => (
                          <label key={opt} className="radio-opt">
                            <input type="radio" name={`smart_${activeEquip}_${idx}`} value={opt} checked={machine.smart_farming === opt} onChange={() => setMachineField(activeEquip, idx, 'smart_farming', opt)} style={{ width: 'auto' }} />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

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
                      fields={schema.yearlyFields}
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
                  {fromPreview
                    ? <button className="btn-back" onClick={() => { setFromPreview(false); setPhase('preview'); }}>← Προεπισκόπηση</button>
                    : activeEquipList.indexOf(activeEquip) > 0 && <button className="btn-back" onClick={() => { setSectionErrors(''); setActiveEquip(activeEquipList[activeEquipList.indexOf(activeEquip) - 1]); }}>← Προηγούμενο</button>}
                  <button className="btn-next" onClick={nextEquip}>{fromPreview ? 'Αποθήκευση →' : (activeEquipList.indexOf(activeEquip) < activeEquipList.length - 1 ? 'Επόμενο →' : 'Επόμενο: Αγροτεμάχια →')}</button>
                </div>
              </div>
            </>
          );
        })()}

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

              {/* INFO */}
              {activeFieldSection === 'info' && (<>
                <div className="step-title">📋 Στοιχεία αγροτεμαχίου {activePlot}</div>
                <div className="step-sub">Βασικές πληροφορίες για το αγροτεμάχιο.</div>
                <div className="row2">
                  <div className="field"><label>Περιοχή</label><input placeholder="π.χ. Ηλεία" value={fv(activePlot,'info','region')} onChange={e => setFld(activePlot,'info','region',e.target.value)} /></div>
                  <div className="field"><label>Έκταση (στρέμματα)</label><input type="number" step="0.1" placeholder="π.χ. 50" value={fv(activePlot,'info','area')} onChange={e => setFld(activePlot,'info','area',e.target.value)} /></div>
                </div>
                <div className="field">
                  <label>Συντεταγμένες / Αρχείο GIS</label>
                  <input placeholder="Συντεταγμένες ή σύνδεσμος (π.χ. Google Maps link)" value={fv(activePlot,'info','gis_link')} onChange={e => setFld(activePlot,'info','gis_link',e.target.value)} />
                  <a href="https://maps.google.com" target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#4a8c2a', display: 'inline-block', marginTop: '4px' }}>Άνοιγμα Google Maps για εύρεση συντεταγμένων</a>
                  <div style={{ marginTop: '8px' }}>
                    <label style={{ marginBottom: '4px' }}>Αρχείο KML/Shapefile</label>
                    <input type="file" accept=".kml,.shp,.zip" style={{ padding: '8px 0', border: 'none' }} onChange={e => setGisFiles(prev => ({ ...prev, [`p${activePlot}`]: e.target.files[0] }))} />
                    {gisFiles[`p${activePlot}`] && <div style={{ fontSize: '12px', color: '#4a8c2a', marginTop: '4px' }}>✓ {gisFiles[`p${activePlot}`].name}</div>}
                  </div>
                </div>
                <div className="row2">
                  <div className="field"><label>Εδαφική ανάλυση</label><select value={fv(activePlot,'info','soil_analysis')} onChange={e => setFld(activePlot,'info','soil_analysis',e.target.value)}><option value="">Επιλέξτε...</option><option>Ναι</option><option>Όχι</option></select></div>
                  {fv(activePlot,'info','soil_analysis') === 'Ναι' && (
                    <div className="field">
                      <label>Link εδαφολογικής ανάλυσης</label>
                      <input placeholder="URL ή σύνδεσμος" value={fv(activePlot,'info','soil_link')} onChange={e => setFld(activePlot,'info','soil_link',e.target.value)} />
                      <div style={{ marginTop: '6px' }}>
                        <label style={{ fontSize: '12px', color: '#666', fontWeight: '400', marginBottom: '4px' }}>ή ανεβάστε αρχείο (.pdf, .jpg, .png)</label>
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ padding: '6px 0', border: 'none' }} onChange={e => setSoilFiles(prev => ({ ...prev, [`p${activePlot}`]: e.target.files[0] }))} />
                        {soilFiles[`p${activePlot}`] && <div style={{ fontSize: '12px', color: '#4a8c2a', marginTop: '4px' }}>✓ {soilFiles[`p${activePlot}`].name}</div>}
                      </div>
                    </div>
                  )}
                </div>
                <div className="row2">
                  <div className="field">
                    <label>Τύπος εδάφους</label>
                    <select value={fv(activePlot,'info','soil_type')} onChange={e => setFld(activePlot,'info','soil_type',e.target.value)}>
                      <option value="">Επιλέξτε...</option>
                      {SOIL_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                    {fv(activePlot,'info','soil_type') === 'Άλλο' && <input type="text" required placeholder="Παρακαλώ προσδιορίστε..." style={{ marginTop: '8px' }} value={fv(activePlot,'info','soil_type_other')} onChange={e => setFld(activePlot,'info','soil_type_other',e.target.value)} />}
                  </div>
                  <div className="field"><label>Φυτοκάλυψη χειμώνα (cover crops)</label><select value={fv(activePlot,'info','cover_crops')} onChange={e => setFld(activePlot,'info','cover_crops',e.target.value)}><option value="">Επιλέξτε...</option><option>Ναι, τακτικά</option><option>Ναι, περιστασιακά</option><option>Όχι</option></select></div>
                </div>
                <div className="row2">
                  <div className="field">
                    <label>Εφαρμογή εδαφικού ασβέστη</label>
                    <select value={fv(activePlot,'info','lime')} onChange={e => setFld(activePlot,'info','lime',e.target.value)}><option value="">Επιλέξτε...</option><option>Ναι</option><option>Όχι</option></select>
                  </div>
                  {fv(activePlot,'info','lime') === 'Ναι' && (
                    <div className="field">
                      <label>Τύπος ασβέστη *</label>
                      <select required value={fv(activePlot,'info','lime_type')} onChange={e => setFld(activePlot,'info','lime_type',e.target.value)}>
                        <option value="">Επιλέξτε...</option>
                        {LIME_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                      {fv(activePlot,'info','lime_type') === 'Άλλο' && <input type="text" required placeholder="Παρακαλώ προσδιορίστε..." style={{ marginTop: '8px' }} value={fv(activePlot,'info','lime_type_other')} onChange={e => setFld(activePlot,'info','lime_type_other',e.target.value)} />}
                    </div>
                  )}
                </div>
                {fv(activePlot,'info','lime') === 'Ναι' && (
                  <div className="field"><label>Ποσότητα ασβέστη (tn/στρέμμα) *</label><input required type="number" step="0.01" placeholder="π.χ. 0.25" value={fv(activePlot,'info','lime_qty')} onChange={e => setFld(activePlot,'info','lime_qty',e.target.value)} /></div>
                )}
                <div className="row3">
                  <div className="field">
                    <label>Διαχείριση υπολειμμάτων</label>
                    <select value={fv(activePlot,'info','residues')} onChange={e => setFld(activePlot,'info','residues',e.target.value)}>
                      <option value="">Επιλέξτε...</option>
                      {RESIDUES_OPTIONS.map(o => <option key={o}>{o}</option>)}
                    </select>
                    {fv(activePlot,'info','residues') === 'Άλλο' && <input type="text" required placeholder="Παρακαλώ προσδιορίστε..." style={{ marginTop: '8px' }} value={fv(activePlot,'info','residues_other')} onChange={e => setFld(activePlot,'info','residues_other',e.target.value)} />}
                  </div>
                  <div className="field"><label>Αρδευόμενο</label><select value={fv(activePlot,'info','irrigated')} onChange={e => setFld(activePlot,'info','irrigated',e.target.value)}><option value="">Επιλέξτε...</option><option>Ναι</option><option>Όχι</option></select></div>
                  <div className="field"><label>Έξυπνη άρδευση</label><select value={fv(activePlot,'info','smart_irr')} onChange={e => setFld(activePlot,'info','smart_irr',e.target.value)}><option value="">Επιλέξτε...</option><option>Ναι</option><option>Όχι</option></select></div>
                </div>
                {fv(activePlot,'info','residues') === 'Απομάκρυνση' && (
                  <div className="field"><label>Ποσοστό (%) υπολειμμάτων που απομακρύνθηκε *</label><input required type="number" min="0" max="100" placeholder="π.χ. 80" value={fv(activePlot,'info','residues_pct')} onChange={e => setFld(activePlot,'info','residues_pct',e.target.value)} /></div>
                )}
                {fv(activePlot,'info','irrigated') === 'Ναι' && (<>
                  <div className="row2">
                    <div className="field"><label>Ποσότητα νερού (m³/στρέμμα) *</label><input required type="number" placeholder="π.χ. 50" value={fv(activePlot,'info','irr_qty')} onChange={e => setFld(activePlot,'info','irr_qty',e.target.value)} /></div>
                    <div className="field">
                      <label>Τύπος Άρδευσης *</label>
                      <select required value={fv(activePlot,'info','irr_type')} onChange={e => setFld(activePlot,'info','irr_type',e.target.value)}>
                        <option value="">Επιλέξτε...</option>
                        {IRRIGATION_TYPES.map(o => <option key={o}>{o}</option>)}
                      </select>
                      {fv(activePlot,'info','irr_type') === 'Άλλο' && <input type="text" required placeholder="Παρακαλώ προσδιορίστε..." style={{ marginTop: '8px' }} value={fv(activePlot,'info','irr_type_other')} onChange={e => setFld(activePlot,'info','irr_type_other',e.target.value)} />}
                    </div>
                  </div>
                  <div className="row2">
                    <div className="field">
                      <label>Τύπος Αντλίας *</label>
                      <select required value={fv(activePlot,'info','pump_type')} onChange={e => setFld(activePlot,'info','pump_type',e.target.value)}>
                        <option value="">Επιλέξτε...</option>
                        {PUMP_TYPES.map(o => <option key={o}>{o}</option>)}
                      </select>
                      {fv(activePlot,'info','pump_type') === 'Άλλο' && <input type="text" required placeholder="Παρακαλώ προσδιορίστε..." style={{ marginTop: '8px' }} value={fv(activePlot,'info','pump_type_other')} onChange={e => setFld(activePlot,'info','pump_type_other',e.target.value)} />}
                    </div>
                    {['Ηλεκτροκίνητη','Φωτοβολταϊκό/ΑΠΕ'].includes(fv(activePlot,'info','pump_type')) && (
                      <div className="field">
                        <label>Κατανάλωση ρεύματος (kWh/έτος) *</label>
                        <input required type="number" placeholder="π.χ. 1200" value={fv(activePlot,'info','pump_kwh')} onChange={e => setFld(activePlot,'info','pump_kwh',e.target.value)} />
                      </div>
                    )}
                    {['Πετρελαιοκίνητη (Diesel)','Βενζινοκίνητη','Άλλο'].includes(fv(activePlot,'info','pump_type')) && (
                      <div className="field">
                        <label>Κατανάλωση καυσίμου (λίτρα/έτος) *</label>
                        <input required type="number" placeholder="π.χ. 800" value={fv(activePlot,'info','fuel_liters')} onChange={e => setFld(activePlot,'info','fuel_liters',e.target.value)} />
                      </div>
                    )}
                  </div>
                </>)}
                <div className="row2">
                  <div className="field"><label>Βόσκηση</label><select value={fv(activePlot,'info','grazing')} onChange={e => setFld(activePlot,'info','grazing',e.target.value)}><option value="">Επιλέξτε...</option><option>Ναι</option><option>Όχι</option></select></div>
                  {fv(activePlot,'info','grazing') === 'Ναι' && <div className="field"><label>Αριθμός ζώων</label><input type="number" placeholder="π.χ. 50" value={fv(activePlot,'info','animals')} onChange={e => setFld(activePlot,'info','animals',e.target.value)} /></div>}
                </div>
                <div className="field"><label>Σχόλια</label><textarea rows={3} placeholder="Προαιρετικά σχόλια..." value={fv(activePlot,'info','notes')} onChange={e => setFld(activePlot,'info','notes',e.target.value)} /></div>
              </>)}

              {/* TILLAGE */}
              {activeFieldSection === 'tillage' && (() => {
                const years = getFieldYears(activePlot, 'tillage');
                return (<>
                  <div className="step-title">🔨 Κατεργασία — Αγροτεμάχιο {activePlot}</div>
                  <div className="step-sub">Καταχωρίστε τον αριθμό κατεργασιών για κάθε έτος.</div>
                  {years.map(yr => (
                    <div key={yr} style={{border:'1px solid #e0ead8',borderRadius:'8px',padding:'1rem',marginBottom:'10px',position:'relative'}}>
                      <span style={{display:'inline-block',background:'#1a3d2b',color:'white',fontSize:'11px',fontWeight:'600',padding:'2px 8px',borderRadius:'4px',marginBottom:'10px'}}>{yr}</span>
                      <div className="field" style={{maxWidth:'200px'}}>
                        <label>Πόσες φορές κάνατε κατεργασία;</label>
                        <select
                          value={getIdxTillageEntries(activePlot, yr).length}
                          onChange={e => {
                            const newN = parseInt(e.target.value) || 0;
                            const oldN = getIdxTillageEntries(activePlot, yr).length;
                            if (newN < oldN) {
                              const hasData = getIdxTillageEntries(activePlot, yr).slice(newN).some(en => en.type || en.month || en.depth);
                              if (hasData && !window.confirm(`Θα διαγραφούν ${oldN - newN} εγγραφές κατεργασίας. Συνέχεια;`)) return;
                            }
                            setIdxTillageCount(activePlot, yr, newN);
                          }}
                        >
                          {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n === 0 ? '—' : n}</option>)}
                        </select>
                      </div>
                      {getIdxTillageEntries(activePlot, yr).map((entry, idx) => (
                        <div key={idx} style={{background:'#fafbfa',border:'1px solid #e8f0e4',borderRadius:'6px',padding:'12px 12px 6px',marginBottom:'8px'}}>
                          <div style={{fontSize:'12px',fontWeight:'600',color:'#1a3d2b',marginBottom:'10px'}}>Εργασία {idx + 1}</div>
                          <div className="row2">
                            <div className="field">
                              <label>Τύπος κατεργασίας</label>
                              <select value={entry.type || ''} onChange={e => setIdxTillageField(activePlot, yr, idx, 'type', e.target.value)}>
                                <option value="">Επιλέξτε...</option>
                                {TILLAGE_TYPES.map(t => <option key={t}>{t}</option>)}
                              </select>
                              {entry.type === 'Άλλο' && <input type="text" placeholder="Παρακαλώ προσδιορίστε..." style={{marginTop:'6px'}} value={entry.type_other || ''} onChange={e => setIdxTillageField(activePlot, yr, idx, 'type_other', e.target.value)} />}
                            </div>
                            <div className="field">
                              <label>Μήνας εφαρμογής</label>
                              <select value={entry.month || ''} onChange={e => setIdxTillageField(activePlot, yr, idx, 'month', e.target.value)}>
                                <option value="">Επιλέξτε...</option>
                                {MONTHS.map(m => <option key={m}>{m}</option>)}
                              </select>
                            </div>
                          </div>
                          <div className="field" style={{maxWidth:'200px'}}>
                            <label>Βάθος εφαρμογής (cm)</label>
                            <input type="number" placeholder="π.χ. 25" value={entry.depth || ''} onChange={e => setIdxTillageField(activePlot, yr, idx, 'depth', e.target.value)} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </>);
              })()}

              {/* FERTILIZER_N */}
              {activeFieldSection === 'fertilizer_n' && (<>
                <div className="step-title">🧪 Λιπάσματα Αζωτούχα — Αγροτεμάχιο {activePlot}</div>
                <div className="step-sub">Τύπος, μήνας εφαρμογής και ποσότητα ανά έτος.</div>
                <div className="field" style={{marginBottom:'1.5rem'}}>
                  <label>Χρησιμοποιήσατε λιπάσματα με άζωτο;</label>
                  <div className="radio-row" style={{marginTop:'6px'}}>
                    {['Ναι','Όχι'].map(opt => (
                      <label key={opt} className="radio-opt">
                        <input type="radio" name={`fert_n_${activePlot}`} value={opt} checked={fv(activePlot,'fertilizer_n','applied') === opt} onChange={() => setFld(activePlot,'fertilizer_n','applied',opt)} style={{width:'auto'}} />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
                {fv(activePlot,'fertilizer_n','applied') === 'Ναι' && getFieldYears(activePlot,'fertilizer_n').map(yr => (
                  <YearBlock
                    key={yr}
                    year={yr}
                    fields={getFieldSectionFields('fertilizer_n')}
                    data={fieldData[`p${activePlot}`]?.fertilizer_n?.[yr]}
                    onChange={(y, f, v) => setFldY(activePlot, 'fertilizer_n', y, f, v)}
                    onRemove={(y) => removeFieldYear(activePlot, 'fertilizer_n', y)}
                    canRemove={getFieldYears(activePlot,'fertilizer_n').length > 1}
                    isEquip={false}
                  />
                ))}
              </>)}

              {/* FERTILIZER_ORG */}
              {activeFieldSection === 'fertilizer_org' && (<>
                <div className="step-title">🌿 Λιπάσματα Οργανικά — Αγροτεμάχιο {activePlot}</div>
                <div className="step-sub">Τύπος, μήνας εφαρμογής και ποσότητα ανά έτος.</div>
                <div className="field" style={{marginBottom:'1.5rem'}}>
                  <label>Χρησιμοποιήσατε οργανικά λιπάσματα;</label>
                  <div className="radio-row" style={{marginTop:'6px'}}>
                    {['Ναι','Όχι'].map(opt => (
                      <label key={opt} className="radio-opt">
                        <input type="radio" name={`fert_org_${activePlot}`} value={opt} checked={fv(activePlot,'fertilizer_org','applied') === opt} onChange={() => setFld(activePlot,'fertilizer_org','applied',opt)} style={{width:'auto'}} />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
                {fv(activePlot,'fertilizer_org','applied') === 'Ναι' && getFieldYears(activePlot,'fertilizer_org').map(yr => (
                  <YearBlock
                    key={yr}
                    year={yr}
                    fields={getFieldSectionFields('fertilizer_org')}
                    data={fieldData[`p${activePlot}`]?.fertilizer_org?.[yr]}
                    onChange={(y, f, v) => setFldY(activePlot, 'fertilizer_org', y, f, v)}
                    onRemove={(y) => removeFieldYear(activePlot, 'fertilizer_org', y)}
                    canRemove={getFieldYears(activePlot,'fertilizer_org').length > 1}
                    isEquip={false}
                  />
                ))}
              </>)}

              {/* YEAR-BASED SECTIONS */}
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

              {/* CERTIFICATION */}
              {activeFieldSection === 'certification' && (<>
                <div className="step-title">📜 Πιστοποίηση καλλιέργειας — Αγροτεμάχιο {activePlot}</div>
                <div className="step-sub">Στοιχεία πιστοποίησης για το αγροτεμάχιο.</div>
                <div className="field">
                  <label>Διαθέτετε πιστοποίηση για την καλλιέργειά σας;</label>
                  <div className="radio-row" style={{ marginTop: '6px' }}>
                    {['Ναι', 'Όχι'].map(opt => (
                      <label key={opt} className="radio-opt">
                        <input type="radio" name={`has_cert_${activePlot}`} value={opt} checked={fv(activePlot,'certification','has_cert') === opt} onChange={() => setFld(activePlot,'certification','has_cert',opt)} style={{ width: 'auto' }} />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
                {fv(activePlot,'certification','has_cert') === 'Ναι' && (<>
                  <div className="field">
                    <label>Τύπος πιστοποίησης</label>
                    <select value={fv(activePlot,'certification','cert_type')} onChange={e => setFld(activePlot,'certification','cert_type',e.target.value)}>
                      <option value="">Επιλέξτε...</option>
                      {CERT_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                    {fv(activePlot,'certification','cert_type') === 'Άλλο' && <input type="text" required placeholder="Παρακαλώ προσδιορίστε..." style={{ marginTop: '8px' }} value={fv(activePlot,'certification','cert_type_other')} onChange={e => setFld(activePlot,'certification','cert_type_other',e.target.value)} />}
                  </div>
                  <div className="field">
                    <label>Αριθμός πιστοποίησης (προαιρετικά αν ανεβάσετε αρχείο)</label>
                    <input type="text" placeholder="π.χ. GR-ORG-001" value={fv(activePlot,'certification','cert_number')} onChange={e => setFld(activePlot,'certification','cert_number',e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Αρχείο πιστοποίησης</label>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ padding: '8px 0', border: 'none' }} onChange={e => setCertFiles(prev => ({ ...prev, [`p${activePlot}`]: e.target.files[0] }))} />
                    {certFiles[`p${activePlot}`] && <div style={{ fontSize: '12px', color: '#4a8c2a', marginTop: '4px' }}>✓ {certFiles[`p${activePlot}`].name}</div>}
                  </div>
                </>)}
              </>)}

              {/* LEGITIMACY */}
              {activeFieldSection === 'legitimacy' && (<>
                <div className="step-title">📄 Νομιμοποιητικά — Αγροτεμάχιο {activePlot}</div>
                <div className="step-sub">Δικαιολογητικά και υπεύθυνη δήλωση για τα αγροτεμάχια.</div>
                <div className="field">
                  <label>ΟΣΔΕ / Ενοικιαστήρια (αρχεία)</label>
                  <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" style={{ padding: '8px 0', border: 'none' }} onChange={e => { const files = Array.from(e.target.files); setLegalFiles(prev => ({ ...prev, [`p${activePlot}`]: files })); }} />
                  {(legalFiles[`p${activePlot}`] || []).map(f => <div key={f.name} style={{ fontSize: '12px', color: '#4a8c2a', marginTop: '2px' }}>✓ {f.name}</div>)}
                </div>
                <div className="field" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <input type="checkbox" id={`carbon_decl_${activePlot}`} required style={{ width: 'auto', marginTop: '3px', flexShrink: 0, accentColor: '#1a3d2b' }} checked={fv(activePlot,'legitimacy','carbon_declaration') === 'true'} onChange={e => setFld(activePlot,'legitimacy','carbon_declaration', e.target.checked ? 'true' : '')} />
                  <label htmlFor={`carbon_decl_${activePlot}`} style={{ fontWeight: '400', cursor: 'pointer', lineHeight: '1.5' }}>
                    Δηλώνω υπεύθυνα ότι τα αναγραφόμενα αγροτεμάχια δεν συμμετέχουν σε κανένα άλλο πρόγραμμα Carbon Credits *
                  </label>
                </div>
              </>)}

              {sectionErrors && <div className="err-msg">{sectionErrors}</div>}
              <div className="nav">
                {fromPreview
                  ? <button className="btn-back" onClick={() => { setFromPreview(false); setPhase('preview'); }}>← Προεπισκόπηση</button>
                  : FIELD_SECTIONS.findIndex(s => s.key === activeFieldSection) > 0 && (
                    <button className="btn-back" onClick={() => { setSectionErrors(''); setActiveFieldSection(FIELD_SECTIONS[FIELD_SECTIONS.findIndex(s => s.key === activeFieldSection) - 1].key); }}>← Προηγούμενο</button>
                  )}
                <button className="btn-next" onClick={nextFieldSection}>
                  {fromPreview ? 'Αποθήκευση →' : (isLastFieldSectionOfLastPlot ? 'Επόμενο: Προεπισκόπηση →' : 'Επόμενο →')}
                </button>
              </div>
            </div>
          </>
        )}

        {/* ====== LOADING OVERLAY ====== */}
        {loading && (
          <div style={{position:'fixed',inset:0,background:'rgba(255,255,255,0.92)',zIndex:9998,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'1rem'}}>
            <div style={{width:'40px',height:'40px',border:'4px solid #e0ead8',borderTopColor:'#1a3d2b',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} />
            <div style={{color:'#1a3d2b',fontWeight:'600',fontSize:'14px'}}>Υποβολή σε εξέλιξη...</div>
          </div>
        )}

        {/* ====== PREVIEW ====== */}
        {phase === 'preview' && (
          <>
            <div className="card" style={{marginBottom:'1rem',padding:'1.25rem 1.5rem'}}>
              <div style={{fontSize:'16px',fontWeight:'700',color:'#1a3d2b',marginBottom:'2px'}}>📋 Προεπισκόπηση Υποβολής</div>
              <div style={{fontSize:'13px',color:'#888'}}>Ελέγξτε τα δεδομένα σας πριν την τελική υποβολή.</div>
            </div>

            <div className="card" style={{marginBottom:'1rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem',paddingBottom:'10px',borderBottom:'1px solid #e0ead8'}}>
                <div style={{fontWeight:'600',color:'#1a3d2b',fontSize:'14px'}}>📝 Στοιχεία Εγγραφής</div>
                <button className="btn-edit" onClick={() => { setFromPreview(true); setPhase('onboarding'); setOnbStep(1); }}>✏️ Επεξεργασία</button>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'3px 16px',overflow:'hidden'}}>
                {[
                  ['Τύπος', onb.type],
                  onb.orgName ? ['Επωνυμία', onb.orgName] : null,
                  onb.companyRepName ? ['Εκπρόσωπος εταιρείας', onb.companyRepName] : null,
                  (onb.firstName) ? ['Ονοματεπώνυμο', `${onb.firstName} ${onb.lastName}`.trim()] : null,
                  onb.memberFirstName ? ['Εκπρόσωπος συν.', `${onb.memberFirstName} ${onb.memberLastName}`.trim()] : null,
                  onb.ownerFirstName ? ['Ιδιοκτήτης', `${onb.ownerFirstName} ${onb.ownerLastName}`.trim()] : null,
                  ['Email', onb.email || '—'],
                  ['Τηλέφωνο', onb.phone || '—'],
                  ['Νομός', onb.region || '—'],
                  ['Στρέμματα', onb.hectares ? `${onb.hectares} στρ.` : '—'],
                  ['Τεμάχια', onb.plots || '—'],
                  ['Καλλιέργειες', onb.crops.length ? onb.crops.map(c => c === 'Άλλο' && onb.crops_other ? `Άλλο: ${onb.crops_other}` : c).join(', ') : '—'],
                  ['Εξοπλισμός', onb.equipment.length ? onb.equipment.map(e => e === 'Άλλος εξοπλισμός' && onb.equipment_other ? `Άλλος: ${onb.equipment_other}` : e).join(', ') : '—'],
                  ['Μέγεθος εκμ.', onb.farm_size ? (onb.farm_size === 'Άλλο' ? onb.farm_size_other || 'Άλλο' : onb.farm_size) : '—'],
                  ['Κίνητρο', onb.motivation ? (onb.motivation === 'Άλλο' ? onb.motivation_other || 'Άλλο' : onb.motivation) : '—'],
                  ['Αποτύπωμα CO₂', onb.carbon_measured || '—'],
                  onb.carbonValue ? ['Τιμή CO₂', `${onb.carbonValue} tCO₂e/στρ.`] : null,
                  ['Γεωπόνος', onb.agronomist || '—'],
                  onb.agronomistNumber ? ['Αρ. ΓΕΩΤΕΕ', onb.agronomistNumber] : null,
                  ['Πηγή', onb.source ? (onb.source === 'Άλλο' ? onb.source_other || 'Άλλο' : onb.source) : '—'],
                  carbonFile ? ['Αρχείο CO₂', carbonFile.name] : null,
                  agronomistFile ? ['Αρχείο γεωπόνου', agronomistFile.name] : null,
                ].filter(r => r && r[1]).map(([k, v]) => (
                  <div key={k} style={{display:'flex',gap:'6px',fontSize:'12px',padding:'2px 0',minWidth:0,overflow:'hidden'}}>
                    <span style={{color:'#999',width:'110px',flexShrink:0}}>{k}</span>
                    <span style={{color:'#333',fontWeight:'500',overflow:'hidden',wordBreak:'break-word',minWidth:0}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {activeEquipList.length > 0 && (
              <div className="card" style={{marginBottom:'1rem'}}>
                <div style={{fontWeight:'600',color:'#1a3d2b',fontSize:'14px',marginBottom:'1rem',paddingBottom:'10px',borderBottom:'1px solid #e0ead8'}}>⚙️ Εξοπλισμός</div>
                {activeEquipList.map(eq => {
                  const label = eq === 'Άλλος εξοπλισμός' ? (equipData[eq]?.machines?.[0]?.type || eq) : eq;
                  return (
                    <div key={eq} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:'1px solid #f0f5ea'}}>
                      <div style={{fontSize:'13px',color:'#333'}}>{EQUIPMENT_SCHEMAS[eq].icon} {label} · {getEquipCount(eq)} μηχ. · {getEquipYears(eq).length} έτη</div>
                      <button className="btn-edit" onClick={() => { setFromPreview(true); setPhase('equipment'); setActiveEquip(eq); }}>✏️ Επεξεργασία</button>
                    </div>
                  );
                })}
              </div>
            )}

            {Array.from({length:numPlots},(_,i)=>i+1).map(p => {
              const pData = fieldData[`p${p}`] || {};
              const info = pData.info || {};
              const cert = pData.certification || {};
              const fnVals = (sec, yr, keys) => keys.map(k => fyv(p,sec,yr,k)).filter(Boolean).join(' · ');
              return (
                <div key={p} className="card" style={{marginBottom:'1rem'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px',paddingBottom:'10px',borderBottom:'1px solid #e0ead8'}}>
                    <div style={{fontWeight:'700',fontSize:'14px',color:'#1a3d2b'}}>📍 Αγροτεμάχιο {p}</div>
                    <button className="btn-edit" onClick={() => { setFromPreview(true); setPhase('fields'); setActivePlot(p); setActiveFieldSection('info'); }}>✏️ Επεξεργασία</button>
                  </div>

                  {/* Βασικά στοιχεία */}
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'2px 12px',fontSize:'12px',marginBottom:'10px',overflow:'hidden'}}>
                    {[['Περιοχή',info.region],['Έκταση',info.area?`${info.area} στρ.`:null],['Αρδευόμενο',info.irrigated],['Τύπος εδάφους',info.soil_type],['Cover crops',info.cover_crops],['Βόσκηση',info.grazing]].filter(r=>r&&r[1]).map(([k,v])=>(
                      <div key={k} style={{display:'flex',gap:'4px',minWidth:0,overflow:'hidden'}}><span style={{color:'#999',width:'100px',flexShrink:0}}>{k}</span><span style={{color:'#333',fontWeight:'500',minWidth:0,overflow:'hidden',wordBreak:'break-word'}}>{v}</span></div>
                    ))}
                  </div>
                  {(gisFiles[`p${p}`]||soilFiles[`p${p}`]||certFiles[`p${p}`]||(legalFiles[`p${p}`]||[]).length>0) && (
                    <div style={{fontSize:'11px',marginBottom:'10px',display:'flex',flexWrap:'wrap',gap:'6px',overflow:'hidden'}}>
                      {gisFiles[`p${p}`]&&<span onClick={()=>window.open(URL.createObjectURL(gisFiles[`p${p}`]))} style={{color:'#4a8c2a',textDecoration:'underline',cursor:'pointer',wordBreak:'break-all'}}>GIS: {gisFiles[`p${p}`].name}</span>}
                      {soilFiles[`p${p}`]&&<span onClick={()=>window.open(URL.createObjectURL(soilFiles[`p${p}`]))} style={{color:'#4a8c2a',textDecoration:'underline',cursor:'pointer',wordBreak:'break-all'}}>Εδαφ.: {soilFiles[`p${p}`].name}</span>}
                      {certFiles[`p${p}`]&&<span onClick={()=>window.open(URL.createObjectURL(certFiles[`p${p}`]))} style={{color:'#4a8c2a',textDecoration:'underline',cursor:'pointer',wordBreak:'break-all'}}>Πιστ.: {certFiles[`p${p}`].name}</span>}
                      {(legalFiles[`p${p}`]||[]).map(f=><span key={f.name} onClick={()=>window.open(URL.createObjectURL(f))} style={{color:'#4a8c2a',textDecoration:'underline',cursor:'pointer',wordBreak:'break-all'}}>ΟΣΔΕ: {f.name}</span>)}
                    </div>
                  )}

                  {/* Καλλιέργειες & Κατεργασία */}
                  {getFieldYears(p,'crops').some(yr => fyv(p,'crops',yr,'main')) && (
                    <div style={{marginBottom:'8px'}}>
                      <div style={{fontSize:'11px',fontWeight:'600',color:'#555',marginBottom:'4px'}}>🌾 Καλλιέργειες</div>
                      {getFieldYears(p,'crops').filter(yr=>fyv(p,'crops',yr,'main')).map(yr=>(
                        <div key={yr} style={{fontSize:'11px',color:'#444',padding:'1px 0'}}><span style={{fontWeight:'600',color:'#1a3d2b',marginRight:'6px'}}>{yr}</span>{fyv(p,'crops',yr,'main')}{fyv(p,'crops',yr,'cover') && ` · ${fyv(p,'crops',yr,'cover')}`}</div>
                      ))}
                    </div>
                  )}
                  {getFieldYears(p,'harvest_main').some(yr=>fyv(p,'harvest_main',yr,'yield')) && (
                    <div style={{marginBottom:'8px'}}>
                      <div style={{fontSize:'11px',fontWeight:'600',color:'#555',marginBottom:'4px'}}>📅 Συγκομιδή</div>
                      {getFieldYears(p,'harvest_main').filter(yr=>fyv(p,'harvest_main',yr,'yield')).map(yr=>(
                        <div key={yr} style={{fontSize:'11px',color:'#444',padding:'1px 0'}}><span style={{fontWeight:'600',color:'#1a3d2b',marginRight:'6px'}}>{yr}</span>{fnVals('harvest_main',yr,['sow','harvest'])} · {fyv(p,'harvest_main',yr,'yield')} kg/στρ.</div>
                      ))}
                    </div>
                  )}

                  {/* Λιπάσματα */}
                  {pData.fertilizer_n?.applied === 'Ναι' && getFieldYears(p,'fertilizer_n').some(yr=>fyv(p,'fertilizer_n',yr,'type')) && (
                    <div style={{marginBottom:'8px'}}>
                      <div style={{fontSize:'11px',fontWeight:'600',color:'#555',marginBottom:'4px'}}>🧪 Αζωτούχα Λιπάσματα</div>
                      {getFieldYears(p,'fertilizer_n').filter(yr=>fyv(p,'fertilizer_n',yr,'type')).map(yr=>(
                        <div key={yr} style={{fontSize:'11px',color:'#444',padding:'1px 0'}}><span style={{fontWeight:'600',color:'#1a3d2b',marginRight:'6px'}}>{yr}</span>{fyv(p,'fertilizer_n',yr,'type')} {fyv(p,'fertilizer_n',yr,'qty') && `· ${fyv(p,'fertilizer_n',yr,'qty')} kg/στρ.`}</div>
                      ))}
                    </div>
                  )}
                  {pData.fertilizer_org?.applied === 'Ναι' && getFieldYears(p,'fertilizer_org').some(yr=>fyv(p,'fertilizer_org',yr,'type')) && (
                    <div style={{marginBottom:'8px'}}>
                      <div style={{fontSize:'11px',fontWeight:'600',color:'#555',marginBottom:'4px'}}>🌿 Οργανικά Λιπάσματα</div>
                      {getFieldYears(p,'fertilizer_org').filter(yr=>fyv(p,'fertilizer_org',yr,'type')).map(yr=>(
                        <div key={yr} style={{fontSize:'11px',color:'#444',padding:'1px 0'}}><span style={{fontWeight:'600',color:'#1a3d2b',marginRight:'6px'}}>{yr}</span>{fyv(p,'fertilizer_org',yr,'type')} {fyv(p,'fertilizer_org',yr,'qty') && `· ${fyv(p,'fertilizer_org',yr,'qty')} kg/στρ.`}</div>
                      ))}
                    </div>
                  )}

                  {/* Πιστοποίηση & Νομιμοποιητικά */}
                  {cert.has_cert === 'Ναι' && (
                    <div style={{fontSize:'11px',color:'#444',marginBottom:'6px'}}>
                      📜 Πιστοποίηση: {cert.cert_type || '—'}{cert.cert_number && ` · Αρ. ${cert.cert_number}`}
                    </div>
                  )}
                  {fv(p,'legitimacy','carbon_declaration') === 'true' && (
                    <div style={{fontSize:'11px',color:'#4a8c2a'}}>✓ Δήλωση Carbon Credits</div>
                  )}
                </div>
              );
            })}

            <div className="nav" style={{justifyContent:'flex-end',marginBottom:'2rem'}}>
              <button className="btn-next" onClick={submitAll} disabled={loading}>
                {loading ? 'Υποβολή...' : 'Υποβολή φόρμας ✓'}
              </button>
            </div>
          </>
        )}

        {/* ====== DONE ====== */}
        {phase === 'done' && (
          <>
            <div className="no-print" style={{textAlign:'center',padding:'2.5rem 1rem'}}>
              <div style={{width:'80px',height:'80px',borderRadius:'50%',overflow:'hidden',margin:'0 auto 1rem',background:'white',border:'2px solid #e0ead8',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <img src="/roc_logo.jpeg" alt="Roots of Carbon" style={{width:'90%',height:'90%',objectFit:'contain'}} />
              </div>
              <div style={{fontSize:'40px',marginBottom:'8px'}}>✅</div>
              <h2 style={{color:'#1a3d2b',fontSize:'20px',fontWeight:'700',marginBottom:'8px'}}>Σας ευχαριστούμε!</h2>
              <p style={{color:'#666',fontSize:'14px',lineHeight:'1.6',maxWidth:'420px',margin:'0 auto 1.5rem'}}>Λάβαμε όλα τα στοιχεία σας. Θα επικοινωνήσουμε μαζί σας σύντομα.</p>
              <button onClick={() => window.print()} style={{padding:'12px 28px',border:'none',borderRadius:'8px',background:'#1a3d2b',color:'white',fontSize:'14px',fontWeight:'600',cursor:'pointer',fontFamily:'Inter,sans-serif',display:'inline-flex',alignItems:'center',gap:'8px'}}>
                🖨 Εκτύπωση / Αποθήκευση PDF
              </button>
            </div>

            <div className="print-summary">
              <div style={{background:'white',borderRadius:'12px',border:'1px solid #e0ead8',overflow:'hidden',marginBottom:'2rem'}}>
                <div style={{background:'#1a3d2b',padding:'1.25rem 2rem',display:'flex',alignItems:'center',gap:'1rem'}}>
                  <div style={{width:'44px',height:'44px',background:'white',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',flexShrink:0}}>
                    <img src="/roc_logo.jpeg" alt="RoC" style={{width:'100%',height:'100%',objectFit:'contain'}} />
                  </div>
                  <div style={{flex:1}}>
                    <div style={{color:'white',fontSize:'15px',fontWeight:'600'}}>Roots of Carbon — Φόρμα Εκδήλωσης Ενδιαφέροντος</div>
                    <div style={{color:'rgba(255,255,255,0.7)',fontSize:'12px'}}>Ημερομηνία υποβολής: {submittedAt ? submittedAt.toLocaleDateString('el-GR',{day:'2-digit',month:'2-digit',year:'numeric'}) + ' ' + submittedAt.toLocaleTimeString('el-GR',{hour:'2-digit',minute:'2-digit'}) : '—'}</div>
                  </div>
                </div>

                <div style={{padding:'1.5rem 2rem',borderBottom:'3px solid #2D5016'}}>
                  <div style={{fontSize:'13px',fontWeight:'700',color:'#2D5016',marginBottom:'1rem',paddingBottom:'6px',borderBottom:'1px solid #c8e0b4'}}>Στοιχεία Εγγραφής</div>
                  {[
                    ['Τύπος οντότητας', onb.type],
                    ['Ονοματεπώνυμο', `${onb.firstName} ${onb.lastName}`.trim() || null],
                    onb.orgName ? ['Επωνυμία', onb.orgName] : null,
                    onb.companyRepName ? ['Εκπρόσωπος εταιρείας', onb.companyRepName] : null,
                    (onb.type === 'Αγροτικός συνεταιρισμός' && onb.memberFirstName) ? ['Εκπρόσωπος', `${onb.memberFirstName} ${onb.memberLastName}`.trim()] : null,
                    (onb.type === 'Αγροτικός συνεταιρισμός' && onb.ownerFirstName) ? ['Ιδιοκτήτης', `${onb.ownerFirstName} ${onb.ownerLastName}`.trim()] : null,
                    ['Email', onb.email], ['Τηλέφωνο', onb.phone], ['Νομός', onb.region],
                    ['Στρέμματα', onb.hectares ? `${onb.hectares} στρ.` : null],
                    ['Τεμάχια', onb.plots || null],
                    ['Καλλιέργειες', onb.crops.length ? onb.crops.join(', ') : null],
                    ['Μέγεθος εκμ.', onb.farm_size || null], ['Κίνητρο', onb.motivation || null],
                    ['Αποτύπωμα CO₂', onb.carbon_measured || null],
                    onb.carbonValue ? ['Τιμή CO₂', `${onb.carbonValue} tCO₂e/στρ.`] : null,
                    ['Γεωπόνος', onb.agronomist || null],
                    onb.agronomistNumber ? ['Αρ. ΓΕΩΤΕΕ', onb.agronomistNumber] : null,
                    ['Πηγή', onb.source || null], onb.comments ? ['Σχόλια', onb.comments] : null,
                    carbonFile ? ['Αρχείο CO₂', carbonFile.name] : null,
                    agronomistFile ? ['Αρχείο γεωπόνου', agronomistFile.name] : null,
                  ].filter(r => r && r[1]).map(([k, v]) => (
                    <div key={k} style={{display:'flex',gap:'12px',padding:'4px 0',borderBottom:'1px solid #f5f8f2',fontSize:'12px'}}>
                      <span style={{color:'#888',width:'180px',flexShrink:0}}>{k}</span>
                      <span style={{color:'#1a3d2b',fontWeight:'500',flex:1}}>{v}</span>
                    </div>
                  ))}
                </div>

                {activeEquipList.length > 0 && (
                  <div style={{padding:'1.5rem 2rem',borderBottom:'3px solid #2D5016'}}>
                    <div style={{fontSize:'13px',fontWeight:'700',color:'#2D5016',marginBottom:'1rem',paddingBottom:'6px',borderBottom:'1px solid #c8e0b4'}}>Εξοπλισμός</div>
                    {activeEquipList.map(eq => {
                      const schema = EQUIPMENT_SCHEMAS[eq]; const eqEntry = equipData[eq] || {};
                      const years = getEquipYears(eq); const machines = eqEntry.machines || [{}];
                      const eqLabel = eq === 'Άλλος εξοπλισμός' && onb.equipment_other ? `${eq} (${onb.equipment_other})` : eq;
                      return (
                        <div key={eq} style={{marginBottom:'1.25rem',paddingBottom:'1rem',borderBottom:'1px solid #e8f0e0'}}>
                          <div style={{fontSize:'12px',fontWeight:'700',color:'#2D5016',marginBottom:'6px'}}>{schema.icon} {eqLabel}</div>
                          {machines.map((m, i) => (
                            <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'2px 12px',marginBottom:'6px',fontSize:'12px'}}>
                              {schema.instanceFields.map(f => {
                                const v = m[f.key] === 'Άλλο' ? (m[`${f.key}_other`] || 'Άλλο') : m[f.key];
                                if (!v) return null;
                                return <div key={f.key} style={{display:'flex',gap:'6px'}}><span style={{color:'#999',width:'100px',flexShrink:0}}>{f.label}</span><span style={{color:'#333',fontWeight:'500'}}>{v}</span></div>;
                              })}
                            </div>
                          ))}
                          <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px',marginTop:'6px'}}>
                            <thead><tr style={{background:'#f0f7ec'}}><th style={{padding:'5px 8px',textAlign:'left',color:'#2D5016',fontWeight:'600'}}>Έτος</th>{schema.yearlyFields.map(yf => <th key={yf.key} style={{padding:'5px 8px',textAlign:'left',color:'#2D5016',fontWeight:'600'}}>{yf.label}</th>)}</tr></thead>
                            <tbody>{years.map(yr => {
                              const rowHasData = schema.yearlyFields.some(yf => eqEntry.years?.[yr]?.[yf.key]);
                              if (!rowHasData) return null;
                              return <tr key={yr} style={{borderBottom:'1px solid #f0f5ea'}}><td style={{padding:'5px 8px',color:'#2D5016',fontWeight:'600'}}>{yr}</td>{schema.yearlyFields.map(yf => <td key={yf.key} style={{padding:'5px 8px',color:'#444'}}>{eqEntry.years?.[yr]?.[yf.key] || ''}</td>)}</tr>;
                            })}</tbody>
                          </table>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div style={{padding:'1.5rem 2rem'}}>
                  <div style={{fontSize:'13px',fontWeight:'700',color:'#2D5016',marginBottom:'1rem',paddingBottom:'6px',borderBottom:'1px solid #c8e0b4'}}>Αγροτεμάχια</div>
                  {Array.from({length:numPlots},(_,i)=>i+1).map(plot => {
                    const pData = fieldData[`p${plot}`] || {}; const info = pData.info || {}; const cert = pData.certification || {};
                    return (
                      <div key={plot} style={{marginBottom:'2rem',paddingBottom:'1rem',borderBottom:'1px solid #e8f0e0'}}>
                        <div style={{background:'#f0f7ec',padding:'6px 12px',borderRadius:'4px',fontSize:'12px',fontWeight:'700',color:'#2D5016',marginBottom:'10px',borderLeft:'3px solid #2D5016'}}>📍 Αγροτεμάχιο {plot}</div>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'3px 12px',fontSize:'12px',marginBottom:'8px'}}>
                          {[['Περιοχή',info.region],['Έκταση',info.area?`${info.area} στρ.`:null],['Αρδευόμενο',info.irrigated],['Τύπος εδάφους',info.soil_type],['Cover crops',info.cover_crops],['Βόσκηση',info.grazing],['Υπολείμματα',info.residues],cert.has_cert==='Ναι'?['Πιστοποίηση',cert.cert_type]:null,cert.has_cert==='Ναι'&&cert.cert_number?['Αρ. Πιστ.',cert.cert_number]:null].filter(r=>r&&r[1]).map(([k,v]) => (
                            <div key={k} style={{display:'flex',gap:'6px',padding:'2px 0'}}><span style={{color:'#888',width:'120px',flexShrink:0}}>{k}</span><span style={{color:'#333',fontWeight:'500'}}>{v}</span></div>
                          ))}
                        </div>
                        {(gisFiles[`p${plot}`]||certFiles[`p${plot}`]||soilFiles[`p${plot}`]||(legalFiles[`p${plot}`]||[]).length>0) && (
                          <div style={{fontSize:'11px',color:'#4a8c2a',marginBottom:'8px'}}>
                            {gisFiles[`p${plot}`]&&<span>📎 GIS: {gisFiles[`p${plot}`].name} </span>}
                            {soilFiles[`p${plot}`]&&<span>📎 Εδαφ.: {soilFiles[`p${plot}`].name} </span>}
                            {certFiles[`p${plot}`]&&<span>📎 Πιστ.: {certFiles[`p${plot}`].name} </span>}
                            {(legalFiles[`p${plot}`]||[]).map(f=><span key={f.name}>📎 ΟΣΔΕ: {f.name} </span>)}
                          </div>
                        )}
                        {/* Tillage (array-based) */}
                        {ALL_YEARS.some(yr => (getIdxTillageEntries(plot, yr)||[]).length > 0) && (
                          <div style={{marginBottom:'10px'}}>
                            <div style={{fontSize:'12px',fontWeight:'600',color:'#2D5016',marginBottom:'4px'}}>🔨 Κατεργασία</div>
                            {ALL_YEARS.map(yr => {
                              const entries = getIdxTillageEntries(plot, yr);
                              if (!entries.length) return null;
                              return entries.map((en, idx) => en.type ? (
                                <div key={`${yr}_${idx}`} style={{fontSize:'11px',color:'#444',padding:'1px 0'}}><span style={{fontWeight:'600',color:'#2D5016',marginRight:'6px'}}>{yr} Εργ.{idx+1}</span>{en.type}{en.month&&` · ${en.month}`}{en.depth&&` · ${en.depth}cm`}</div>
                              ) : null);
                            })}
                          </div>
                        )}
                        {FIELD_YEAR_SECTIONS.map(sec => {
                          const secObj = FIELD_SECTIONS.find(s => s.key === sec); const fields = getFieldSectionFields(sec);
                          const years = getFieldYears(plot, sec); const secData = pData[sec] || {};
                          const hasData = years.some(yr => fields.some(f => secData[yr]?.[f.key]));
                          if (!hasData) return null;
                          return (
                            <div key={sec} style={{marginBottom:'10px'}}>
                              <div style={{fontSize:'12px',fontWeight:'600',color:'#2D5016',marginBottom:'4px'}}>{secObj.icon} {secObj.label}</div>
                              <table style={{width:'100%',borderCollapse:'collapse',fontSize:'11px'}}><thead><tr style={{background:'#f0f7ec'}}><th style={{padding:'4px 6px',textAlign:'left',color:'#2D5016',fontWeight:'600'}}>Έτος</th>{fields.map(f=><th key={f.key} style={{padding:'4px 6px',textAlign:'left',color:'#2D5016',fontWeight:'600'}}>{f.label}</th>)}</tr></thead><tbody>{years.map(yr=>{
                                const rowHasData = fields.some(f => secData[yr]?.[f.key]);
                                if (!rowHasData) return null;
                                return <tr key={yr} style={{borderBottom:'1px solid #f0f5ea'}}><td style={{padding:'4px 6px',color:'#2D5016',fontWeight:'600'}}>{yr}</td>{fields.map(f=><td key={f.key} style={{padding:'4px 6px',color:'#444'}}>{secData[yr]?.[f.key]||''}</td>)}</tr>;
                              })}</tbody></table>
                            </div>
                          );
                        })}
                        {/* Fertilizer N */}
                        {pData.fertilizer_n?.applied === 'Ναι' && getFieldYears(plot,'fertilizer_n').some(yr=>fyv(plot,'fertilizer_n',yr,'type')) && (
                          <div style={{marginBottom:'10px'}}>
                            <div style={{fontSize:'12px',fontWeight:'600',color:'#2D5016',marginBottom:'4px'}}>🧪 Αζωτούχα Λιπάσματα</div>
                            {getFieldYears(plot,'fertilizer_n').filter(yr=>fyv(plot,'fertilizer_n',yr,'type')).map(yr=>(
                              <div key={yr} style={{fontSize:'11px',color:'#444',padding:'1px 0'}}><span style={{fontWeight:'600',color:'#2D5016',marginRight:'6px'}}>{yr}</span>{fyv(plot,'fertilizer_n',yr,'type')}{fyv(plot,'fertilizer_n',yr,'qty')&&` · ${fyv(plot,'fertilizer_n',yr,'qty')} kg/στρ.`}</div>
                            ))}
                          </div>
                        )}
                        {/* Fertilizer Org */}
                        {pData.fertilizer_org?.applied === 'Ναι' && getFieldYears(plot,'fertilizer_org').some(yr=>fyv(plot,'fertilizer_org',yr,'type')) && (
                          <div style={{marginBottom:'10px'}}>
                            <div style={{fontSize:'12px',fontWeight:'600',color:'#2D5016',marginBottom:'4px'}}>🌿 Οργανικά Λιπάσματα</div>
                            {getFieldYears(plot,'fertilizer_org').filter(yr=>fyv(plot,'fertilizer_org',yr,'type')).map(yr=>(
                              <div key={yr} style={{fontSize:'11px',color:'#444',padding:'1px 0'}}><span style={{fontWeight:'600',color:'#2D5016',marginRight:'6px'}}>{yr}</span>{fyv(plot,'fertilizer_org',yr,'type')}{fyv(plot,'fertilizer_org',yr,'qty')&&` · ${fyv(plot,'fertilizer_org',yr,'qty')} kg/στρ.`}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </>
        )}
      </div>
    </>
  );
}
