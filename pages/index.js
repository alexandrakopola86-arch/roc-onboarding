import { useState } from 'react';
import Head from 'next/head';

const TOTAL_STEPS = 7;

const CROPS = ['Ελιά', 'Σιτηρά', 'Βαμβάκι', 'Αμπέλι', 'Οπωροφόρα', 'Αρωματικά / Βότανα', 'Κηπευτικά', 'Άλλο'];
const EQUIPMENT = ['Ελκυστήρας', 'Άροτρο', 'Καλλιεργητής', 'Φρέζα', 'Καταστροφέας', 'Λιπασματοδιανομέας', 'Ψεκαστικό', 'Άλλος εξοπλισμός'];
const REGIONS = ['Αττική','Θεσσαλονίκη','Ηλεία','Λάρισα','Μαγνησία','Αχαΐα','Ηράκλειο','Δωδεκάνησα','Αιτωλοακαρνανία','Βοιωτία','Εύβοια','Φθιώτιδα','Κορινθία','Αρκαδία','Μεσσηνία','Λακωνία','Αργολίδα','Χαλκιδική','Σέρρες','Κιλκίς','Πέλλα','Ημαθία','Πιερία','Κοζάνη','Φλώρινα','Καστοριά','Γρεβενά','Ιωάννινα','Θεσπρωτία','Άρτα','Πρέβεζα','Καρδίτσα','Τρίκαλα','Άλλο'];

export default function Home() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    type: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    orgName: '',
    region: '',
    hectares: '',
    plots: '',
    crops: [],
    equipment: [],
    agronomist: '',
    source: '',
    comments: '',
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const toggleArray = (key, val) => {
    setForm(f => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val],
    }));
  };

  const validate = (s) => {
    const e = {};
    if (s === 1 && !form.type) e.type = true;
    if (s === 2) {
      if (!form.firstName) e.firstName = true;
      if (!form.lastName) e.lastName = true;
      if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = true;
    }
    if (s === 3) {
      if (!form.region) e.region = true;
      if (!form.hectares) e.hectares = true;
      if (!form.plots) e.plots = true;
    }
    if (s === 4 && form.crops.length === 0) e.crops = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate(step)) setStep(s => s + 1); };
  const prev = () => setStep(s => s - 1);

  const submit = async () => {
    setLoading(true);
    try {
      await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const progress = Math.round((step / TOTAL_STEPS) * 100);

  const displayName = form.orgName || [form.firstName, form.lastName].filter(Boolean).join(' ') || '—';

  return (
    <>
      <Head>
        <title>Roots of Carbon — Onboarding</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: #f4f7f4; min-height: 100vh; padding: 2rem 1rem; }
        .wrap { max-width: 580px; margin: 0 auto; }
        .header { background: #1a3d2b; border-radius: 12px; padding: 1.5rem 2rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 1rem; }
        .logo { width: 48px; height: 48px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
        .header h1 { color: white; font-size: 18px; font-weight: 600; }
        .header p { color: rgba(255,255,255,0.65); font-size: 13px; margin-top: 2px; }
        .progress-wrap { margin-bottom: 1.5rem; }
        .progress-bar { background: #dde8d8; border-radius: 99px; height: 4px; overflow: hidden; }
        .progress-fill { background: #4a8c2a; height: 100%; border-radius: 99px; transition: width 0.4s ease; }
        .progress-label { font-size: 12px; color: #666; margin-bottom: 6px; }
        .card { background: white; border-radius: 12px; padding: 2rem; border: 1px solid #e0ead8; }
        .step-title { font-size: 15px; font-weight: 600; color: #1a3d2b; margin-bottom: 4px; }
        .step-sub { font-size: 13px; color: #888; margin-bottom: 1.5rem; }
        label { display: block; font-size: 13px; font-weight: 500; color: #333; margin-bottom: 5px; }
        .sublabel { font-size: 12px; color: #888; margin-bottom: 8px; font-weight: 400; }
        input, select, textarea { width: 100%; border: 1px solid #d0d8cc; border-radius: 8px; padding: 10px 12px; font-size: 14px; font-family: 'Inter', sans-serif; color: #333; background: white; outline: none; transition: border-color 0.2s; }
        input:focus, select:focus, textarea:focus { border-color: #4a8c2a; box-shadow: 0 0 0 3px rgba(74,140,42,0.1); }
        input.err, select.err { border-color: #e24b4a; }
        .err-msg { font-size: 12px; color: #e24b4a; margin-top: 4px; }
        .field { margin-bottom: 1.1rem; }
        .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .hint { font-size: 12px; color: #888; margin-top: 4px; }
        .type-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .type-card { border: 1px solid #d0d8cc; border-radius: 10px; padding: 16px 12px; cursor: pointer; text-align: center; transition: all 0.15s; background: white; }
        .type-card:hover { border-color: #4a8c2a; background: #f0f7ec; }
        .type-card.sel { border: 2px solid #4a8c2a; background: #f0f7ec; }
        .type-card .icon { font-size: 28px; margin-bottom: 6px; }
        .type-card .name { font-size: 13px; font-weight: 600; color: #1a3d2b; }
        .type-card .desc { font-size: 11px; color: #888; margin-top: 2px; }
        .check-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .check-item { border: 1px solid #d0d8cc; border-radius: 8px; padding: 10px 12px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.15s; background: white; }
        .check-item:hover { border-color: #4a8c2a; }
        .check-item.sel { border-color: #4a8c2a; background: #f0f7ec; }
        .check-box { width: 16px; height: 16px; border: 1.5px solid #ccc; border-radius: 4px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
        .check-item.sel .check-box { background: #4a8c2a; border-color: #4a8c2a; color: white; font-size: 10px; }
        .check-item span { font-size: 13px; color: #333; }
        .radio-group { display: flex; flex-direction: column; gap: 8px; }
        .radio-item { border: 1px solid #d0d8cc; border-radius: 8px; padding: 11px 14px; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: all 0.15s; background: white; }
        .radio-item:hover { border-color: #4a8c2a; }
        .radio-item.sel { border-color: #4a8c2a; background: #f0f7ec; }
        .radio-dot { width: 16px; height: 16px; border: 1.5px solid #ccc; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
        .radio-item.sel .radio-dot { border-color: #4a8c2a; }
        .radio-inner { width: 8px; height: 8px; border-radius: 50%; background: #4a8c2a; display: none; }
        .radio-item.sel .radio-inner { display: block; }
        .radio-item span { font-size: 13px; color: #333; }
        .nav { display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; }
        .btn-back { padding: 10px 20px; border: 1px solid #d0d8cc; border-radius: 8px; background: transparent; color: #666; font-size: 14px; cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.15s; }
        .btn-back:hover { background: #f5f5f5; }
        .btn-next { padding: 10px 28px; border: none; border-radius: 8px; background: #1a3d2b; color: white; font-size: 14px; font-weight: 500; cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.15s; margin-left: auto; }
        .btn-next:hover { background: #4a8c2a; }
        .btn-next:disabled { opacity: 0.5; cursor: not-allowed; }
        .success { text-align: center; padding: 1rem 0; }
        .success-icon { font-size: 52px; margin-bottom: 1rem; }
        .success h2 { font-size: 20px; color: #1a3d2b; margin-bottom: 8px; }
        .success p { font-size: 14px; color: #666; }
        .summary { background: #f4f7f4; border-radius: 8px; padding: 1rem 1.25rem; margin-top: 1.5rem; text-align: left; }
        .sum-row { display: flex; justify-content: space-between; padding: 7px 0; border-bottom: 1px solid #e0e8d8; gap: 12px; font-size: 13px; }
        .sum-row:last-child { border-bottom: none; }
        .sum-k { color: #888; flex-shrink: 0; }
        .sum-v { color: #1a3d2b; font-weight: 500; text-align: right; }
      `}</style>

      <div className="wrap">
        <div className="header">
          <div className="logo">🌱</div>
          <div>
            <h1>Roots of Carbon</h1>
            <p>Αρχική καταγραφή ενδιαφέροντος</p>
          </div>
        </div>

        <div className="progress-wrap">
          <div className="progress-label">Βήμα {step} από {TOTAL_STEPS}</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: progress + '%' }} />
          </div>
        </div>

        <div className="card">
          {submitted ? (
            <div className="success">
              <div className="success-icon">✅</div>
              <h2>Ευχαριστούμε!</h2>
              <p>Λάβαμε τα στοιχεία σας. Θα επικοινωνήσουμε μαζί σας σύντομα.</p>
              <div className="summary">
                {[
                  ['Τύπος', form.type],
                  ['Όνομα', displayName],
                  ['Email', form.email],
                  ['Περιοχή', form.region],
                  ['Έκταση', form.hectares ? `${form.hectares} ha · ${form.plots} τεμάχια` : '—'],
                  ['Καλλιέργειες', form.crops.join(', ') || '—'],
                  ['Εξοπλισμός', form.equipment.join(', ') || '—'],
                ].map(([k, v]) => (
                  <div className="sum-row" key={k}>
                    <span className="sum-k">{k}</span>
                    <span className="sum-v">{v || '—'}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1 */}
              {step === 1 && (
                <>
                  <div className="step-title">Ποιος είστε;</div>
                  <div className="step-sub">Επιλέξτε τον τύπο που σας εκπροσωπεί</div>
                  <div className="type-grid">
                    {[
                      { val: 'Μεμονωμένος αγρότης', icon: '🧑‍🌾', name: 'Αγρότης', desc: 'Μεμονωμένος παραγωγός' },
                      { val: 'Αγροτικός συνεταιρισμός', icon: '🤝', name: 'Συνεταιρισμός', desc: 'Αγροτική ένωση' },
                      { val: 'Εταιρεία', icon: '🏢', name: 'Εταιρεία', desc: 'Νομικό πρόσωπο' },
                    ].map(t => (
                      <div key={t.val} className={`type-card ${form.type === t.val ? 'sel' : ''}`} onClick={() => set('type', t.val)}>
                        <div className="icon">{t.icon}</div>
                        <div className="name">{t.name}</div>
                        <div className="desc">{t.desc}</div>
                      </div>
                    ))}
                  </div>
                  {errors.type && <div className="err-msg" style={{marginTop: '8px'}}>Παρακαλώ επιλέξτε τύπο</div>}
                </>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <>
                  <div className="step-title">Στοιχεία επικοινωνίας</div>
                  <div className="step-sub">Πώς να σας βρούμε;</div>
                  <div className="row2">
                    <div className="field">
                      <label>Όνομα *</label>
                      <input className={errors.firstName ? 'err' : ''} value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="π.χ. Γιώργης" />
                    </div>
                    <div className="field">
                      <label>Επώνυμο *</label>
                      <input className={errors.lastName ? 'err' : ''} value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="π.χ. Παπαδόπουλος" />
                    </div>
                  </div>
                  <div className="field">
                    <label>Email *</label>
                    <input className={errors.email ? 'err' : ''} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
                    {errors.email && <div className="err-msg">Εισάγετε έγκυρο email</div>}
                  </div>
                  <div className="field">
                    <label>Τηλέφωνο</label>
                    <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="π.χ. 6901234567" />
                  </div>
                  {form.type !== 'Μεμονωμένος αγρότης' && (
                    <div className="field">
                      <label>Όνομα {form.type === 'Εταιρεία' ? 'εταιρείας' : 'συνεταιρισμού'}</label>
                      <input value={form.orgName} onChange={e => set('orgName', e.target.value)} placeholder="π.χ. ΑΣ Οροπεδίου Φολόης" />
                    </div>
                  )}
                </>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <>
                  <div className="step-title">Τοποθεσία & μέγεθος</div>
                  <div className="step-sub">Πού βρίσκονται τα αγροτεμάχιά σας;</div>
                  <div className="field">
                    <label>Νομός / Περιφέρεια *</label>
                    <select className={errors.region ? 'err' : ''} value={form.region} onChange={e => set('region', e.target.value)}>
                      <option value="">Επιλέξτε...</option>
                      {REGIONS.map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="row2">
                    <div className="field">
                      <label>Συνολική έκταση (ha) *</label>
                      <input className={errors.hectares ? 'err' : ''} type="number" min="0" step="0.1" value={form.hectares} onChange={e => set('hectares', e.target.value)} placeholder="π.χ. 15" />
                      <div className="hint">1 ha = 10 στρέμματα</div>
                    </div>
                    <div className="field">
                      <label>Αριθμός τεμαχίων *</label>
                      <input className={errors.plots ? 'err' : ''} type="number" min="1" step="1" value={form.plots} onChange={e => set('plots', e.target.value)} placeholder="π.χ. 3" />
                    </div>
                  </div>
                  {errors.region && <div className="err-msg">Συμπληρώστε όλα τα υποχρεωτικά πεδία</div>}
                </>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <>
                  <div className="step-title">Κύριες καλλιέργειες</div>
                  <div className="step-sub">Επιλέξτε όσες ισχύουν</div>
                  <div className="check-grid">
                    {CROPS.map(c => (
                      <div key={c} className={`check-item ${form.crops.includes(c) ? 'sel' : ''}`} onClick={() => toggleArray('crops', c)}>
                        <div className="check-box">{form.crops.includes(c) ? '✓' : ''}</div>
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                  {errors.crops && <div className="err-msg" style={{marginTop:'8px'}}>Επιλέξτε τουλάχιστον μία καλλιέργεια</div>}
                </>
              )}

              {/* STEP 5 */}
              {step === 5 && (
                <>
                  <div className="step-title">Διαθέσιμος εξοπλισμός</div>
                  <div className="step-sub">Επιλέξτε όλα όσα διαθέτετε — θα λάβετε τις αντίστοιχες φόρμες</div>
                  <div className="check-grid">
                    {EQUIPMENT.map(e => (
                      <div key={e} className={`check-item ${form.equipment.includes(e) ? 'sel' : ''}`} onClick={() => toggleArray('equipment', e)}>
                        <div className="check-box">{form.equipment.includes(e) ? '✓' : ''}</div>
                        <span>{e}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* STEP 6 */}
              {step === 6 && (
                <>
                  <div className="step-title">Συνεργάτες & πηγή</div>
                  <div className="step-sub">Λίγες ακόμα ερωτήσεις</div>
                  <div className="field">
                    <label>Συνεργάζεστε με γεωπόνο ή σύμβουλο;</label>
                    <div className="radio-group" style={{marginTop:'6px'}}>
                      {['Ναι, τακτικά', 'Ναι, περιστασιακά', 'Όχι'].map(o => (
                        <div key={o} className={`radio-item ${form.agronomist === o ? 'sel' : ''}`} onClick={() => set('agronomist', o)}>
                          <div className="radio-dot"><div className="radio-inner" /></div>
                          <span>{o}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="field" style={{marginTop:'1.25rem'}}>
                    <label>Πώς ακούσατε για την Roots of Carbon;</label>
                    <div className="radio-group" style={{marginTop:'6px'}}>
                      {['Σύσταση από γνωστό / συνεργάτη', 'Social media', 'Event / συνέδριο', 'Αναζήτηση στο διαδίκτυο', 'Άλλο'].map(o => (
                        <div key={o} className={`radio-item ${form.source === o ? 'sel' : ''}`} onClick={() => set('source', o)}>
                          <div className="radio-dot"><div className="radio-inner" /></div>
                          <span>{o}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* STEP 7 */}
              {step === 7 && (
                <>
                  <div className="step-title">Σχόλια</div>
                  <div className="step-sub">Προαιρετικό — οποιαδήποτε πληροφορία βοηθάει</div>
                  <div className="field">
                    <textarea rows={5} value={form.comments} onChange={e => set('comments', e.target.value)} placeholder="π.χ. Έχω ήδη εδαφολογικές αναλύσεις, ενδιαφέρομαι κυρίως για..." />
                  </div>
                </>
              )}

              <div className="nav">
                {step > 1 && <button className="btn-back" onClick={prev}>← Πίσω</button>}
                {step < TOTAL_STEPS ? (
                  <button className="btn-next" onClick={next}>Συνέχεια →</button>
                ) : (
                  <button className="btn-next" onClick={submit} disabled={loading}>
                    {loading ? 'Αποστολή...' : 'Υποβολή ✓'}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
