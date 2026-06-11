import nodemailer from 'nodemailer';

const ALL_YEARS = [2021, 2022, 2023, 2024, 2025];
const GREEN = '#1a3d2b';
const LIGHT = '#e8f4e0';
const BORDER = '#d0e8c8';

const TH = `padding:5px 8px;font-size:11px;color:#fff;background:#2d6b47;text-align:left;font-weight:600;white-space:nowrap;`;
const TD = `padding:5px 8px;font-size:11px;color:#333;border-bottom:1px solid #f0f4ee;`;
const TD_YR = `padding:5px 8px;font-size:11px;color:${GREEN};font-weight:700;border-bottom:1px solid #f0f4ee;`;
const CELL_K = `padding:6px 10px;font-size:12px;color:#666;width:200px;vertical-align:top;border-bottom:1px solid #f0f4ee;`;
const CELL_V = `padding:6px 10px;font-size:12px;color:${GREEN};font-weight:500;border-bottom:1px solid #f0f4ee;`;

function esc(v) {
  if (v == null || v === '') return '—';
  return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function kv(k, v) {
  const display = Array.isArray(v) ? v.join(', ') : v;
  if (!display) return '';
  return `<tr><td style="${CELL_K}">${esc(k)}</td><td style="${CELL_V}">${esc(display)}</td></tr>`;
}

function secHeader(n, title) {
  return `<tr><td colspan="2" style="background:${GREEN};color:white;padding:10px 16px;font-size:13px;font-weight:700;">${n}. ${title}</td></tr>`;
}

function subHeader(title) {
  return `<tr><td colspan="2" style="background:${LIGHT};color:${GREEN};padding:6px 12px;font-size:12px;font-weight:600;border-top:2px solid ${BORDER};">${esc(title)}</td></tr>`;
}

function yearTable(years, columns) {
  // columns: [{ key, label }]
  return `<tr><td colspan="2" style="padding:6px 10px 10px;">
    <table style="width:100%;border-collapse:collapse;font-size:11px;">
      <thead><tr>
        <th style="${TH}">Έτος</th>
        ${columns.map(c => `<th style="${TH}">${esc(c.label)}</th>`).join('')}
      </tr></thead>
      <tbody>
        ${years.map(([yr, row]) => `<tr>
          <td style="${TD_YR}">${yr}</td>
          ${columns.map(c => `<td style="${TD}">${esc(row?.[c.key])}</td>`).join('')}
        </tr>`).join('')}
      </tbody>
    </table>
  </td></tr>`;
}

function buildHtml(onb, eq, fields) {
  const name = onb.firstName
    ? `${onb.firstName} ${onb.lastName || ''}`.trim()
    : onb.orgName || '—';
  const now = new Date().toLocaleString('el-GR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
  const tbl = (rows) => `<table style="width:100%;border-collapse:collapse;">${rows}</table>`;

  // ── Section 1: Στοιχεία Εγγραφής ──
  const s1 = tbl(`
    ${secHeader(1, 'Στοιχεία Εγγραφής')}
    ${kv('Τύπος οντότητας', onb.type)}
    ${kv('Ονοματεπώνυμο', name)}
    ${onb.orgName ? kv('Επωνυμία οργανισμού', onb.orgName) : ''}
    ${kv('Email', onb.email)}
    ${kv('Τηλέφωνο', onb.phone)}
    ${kv('Νομός / Περιφέρεια', onb.region)}
    ${kv('Συνολική έκταση', onb.hectares ? `${onb.hectares} ha` : '')}
    ${kv('Αριθμός αγροτεμαχίων', onb.plots)}
    ${kv('Καλλιέργειες', onb.crops)}
    ${kv('Εξοπλισμός', onb.equipment)}
    ${kv('Μέγεθος εκμετάλλευσης', onb.farm_size)}
    ${kv('Κύριο κίνητρο', onb.motivation)}
    ${kv('Αποτύπωμα άνθρακα', onb.carbon_measured)}
    ${kv('Γεωπόνος / Σύμβουλος', onb.agronomist)}
    ${kv('Πηγή πληροφόρησης', onb.source)}
    ${onb.comments ? kv('Σχόλια', onb.comments) : ''}
  `);

  // ── Section 2: Εξοπλισμός ──
  const eqEntries = Object.entries(eq || {});
  let s2rows = secHeader(2, 'Εξοπλισμός');
  if (!eqEntries.length) {
    s2rows += `<tr><td colspan="2" style="${CELL_K}">—</td></tr>`;
  } else {
    eqEntries.forEach(([machine, data]) => {
      s2rows += subHeader(machine);
      [
        ['Τύπος', data.type],
        ['Χρονολογία κατασκευής', data.year_built || data.year],
        ['Ιπποδύναμη (HP)', data.hp],
        ['Τύπος καυσίμου', data.fuel],
        ['Πλάτος εργασίας (μ)', data.width],
        ['Χωρητικότητα', data.capacity],
        ['Πρόθεση ανανέωσης', data.renewal],
        ['Επίπεδο συντήρησης', data.maintenance],
      ].forEach(([k, v]) => { s2rows += kv(k, v); });

      const yearsData = data.years || {};
      const visYears = ALL_YEARS.map(yr => [yr, yearsData[yr]]).filter(([, row]) => row);
      if (visYears.length) {
        const cols = Object.keys(visYears[0][1]).map(k => ({ key: k, label: k }));
        s2rows += yearTable(visYears, cols);
      }
    });
  }
  const s2 = tbl(s2rows);

  // ── Section 3: Αγροτεμάχια ──
  const fieldEntries = Object.entries(fields || {});
  const s3num = eqEntries.length ? 3 : 2;
  const YEAR_SECS = [
    { key: 'tillage', label: 'Κατεργασία', cols: [{ key: 'type', label: 'Τύπος' }, { key: 'month', label: 'Μήνας' }, { key: 'depth', label: 'Βάθος (cm)' }] },
    { key: 'crops', label: 'Καλλιέργειες', cols: [{ key: 'main', label: 'Κύρια' }, { key: 'cover', label: 'Δευτερεύουσα' }, { key: 'herbicides', label: 'Ζιζανιοκτόνα' }] },
    { key: 'harvest_main', label: 'Συγκομιδή Κύρια', cols: [{ key: 'sow', label: 'Σπορά' }, { key: 'harvest', label: 'Συγκομιδή' }, { key: 'yield', label: 'Απόδοση (kg/ha)' }] },
    { key: 'harvest_cover', label: 'Συγκομιδή Επίσπορη', cols: [{ key: 'sow', label: 'Σπορά' }, { key: 'harvest', label: 'Συγκομιδή' }, { key: 'yield', label: 'Απόδοση (kg/ha)' }] },
    { key: 'fertilizer_n', label: 'Αζωτούχα Λιπάσματα', cols: [{ key: 'type', label: 'Τύπος' }, { key: 'month', label: 'Μήνας' }, { key: 'qty', label: 'Ποσότητα (kg/ha)' }] },
    { key: 'fertilizer_org', label: 'Οργανικά Λιπάσματα', cols: [{ key: 'type', label: 'Τύπος' }, { key: 'month', label: 'Μήνας' }, { key: 'qty', label: 'Ποσότητα (kg/ha)' }] },
  ];

  let s3rows = secHeader(s3num, 'Αγροτεμάχια');
  if (!fieldEntries.length) {
    s3rows += `<tr><td colspan="2" style="${CELL_K}">—</td></tr>`;
  } else {
    fieldEntries.forEach(([plotKey, plotData]) => {
      const pNum = plotKey.replace('p', '');
      s3rows += `<tr><td colspan="2" style="background:#f0f7ec;color:${GREEN};padding:8px 12px;font-size:12px;font-weight:700;border-top:2px solid ${BORDER};">
        Αγροτεμάχιο ${esc(pNum)}
      </td></tr>`;
      const info = plotData.info || {};
      [
        ['Περιοχή', info.region],
        ['Έκταση', info.area ? `${info.area} ha` : ''],
        ['GIS', info.gis],
        ['Τύπος εδάφους', info.soil_type],
        ['Αρδευόμενο', info.irrigated],
        ['Έξυπνη άρδευση', info.smart_irr],
        ['Βόσκηση', info.grazing],
        info.grazing === 'Ναι' ? ['Αριθμός ζώων', info.animals] : null,
        ['Διαχείριση υπολειμμάτων', info.residues],
        ['Εφαρμογή ασβέστη', info.lime],
        info.lime === 'Ναι' ? ['Ποσότητα ασβέστη', info.lime_qty ? `${info.lime_qty} kg/ha` : ''] : null,
        ['Cover crops', info.cover_crops],
        ['Εδαφολογική ανάλυση', info.soil_analysis],
        info.notes ? ['Σχόλια', info.notes] : null,
      ].filter(Boolean).forEach(([k, v]) => { s3rows += kv(k, v); });

      YEAR_SECS.forEach(sec => {
        const secData = plotData[sec.key] || {};
        const visYears = ALL_YEARS
          .map(yr => [yr, secData[yr]])
          .filter(([, row]) => row && sec.cols.some(c => row[c.key]));
        if (!visYears.length) return;
        s3rows += subHeader(sec.label);
        s3rows += yearTable(visYears, sec.cols);
      });
    });
  }
  const s3 = tbl(s3rows);

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<title>Νέα Εγγραφή - Roots of Carbon</title></head>
<body style="font-family:Arial,Helvetica,sans-serif;background:#f4f7f4;margin:0;padding:20px;">
<div style="max-width:700px;margin:0 auto;background:white;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.12);">

  <div style="background:${GREEN};padding:20px 24px;">
    <div style="color:white;font-size:18px;font-weight:700;">Νέα Εγγραφή — Roots of Carbon</div>
    <div style="color:rgba(255,255,255,0.7);font-size:12px;margin-top:4px;">Ημερομηνία υποβολής: ${now}</div>
  </div>

  <div style="padding:0;">
    ${s1}
    <div style="height:12px;"></div>
    ${s2}
    <div style="height:12px;"></div>
    ${s3}
  </div>

  <div style="background:#f4f7f4;padding:12px 16px;font-size:11px;color:#888;text-align:center;border-top:1px solid #e0ead8;">
    Αυτόματη ειδοποίηση από το σύστημα εγγραφής Roots of Carbon.
  </div>
</div>
</body></html>`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const body = req.body;
    const onb = body.onboarding || {};
    const eq = body.equipment || {};
    const fields = body.fields || {};
    const name = onb.firstName
      ? `${onb.firstName} ${onb.lastName || ''}`.trim()
      : onb.orgName || 'Αγνωστος';

    // ── Formspree (existing) ──
    let equipmentText = '';
    Object.entries(eq).forEach(([m, d]) => { equipmentText += `\n  ${m}: ${JSON.stringify(d)}`; });
    let fieldsText = '';
    Object.entries(fields).forEach(([p, d]) => { fieldsText += `\n  ${p}: ${JSON.stringify(d)}`; });

    const message = `
ΝΕΟΣ ΕΓΓΕΓΡΑΜΜΕΝΟΣ - RoC Onboarding
=====================================

ΤΥΠΟΣ: ${onb.type || '-'}
ΟΝΟΜΑ: ${name}
EMAIL: ${onb.email || '-'}
ΤΗΛΕΦΩΝΟ: ${onb.phone || '-'}
ΠΕΡΙΟΧΗ: ${onb.region || '-'}
ΜΕΓΕΘΟΣ: ${onb.farm_size || '-'}
ΕΚΤΑΣΗ: ${onb.hectares || '-'} ha
ΑΓΡΟΤΕΜΑΧΙΑ: ${onb.plots || '-'}
ΚΙΝΗΤΡΟ: ${onb.motivation || '-'}
ΕΞΟΠΛΙΣΜΟΣ: ${(onb.equipment || []).toString() || '-'}
ΠΗΓΗ: ${onb.source || '-'}

--- ΕΞΟΠΛΙΣΜΟΣ ΛΕΠΤΟΜΕΡΕΙΕΣ ---${equipmentText || ' -'}

--- ΑΓΡΟΤΕΜΑΧΙΑ ΛΕΠΤΟΜΕΡΕΙΕΣ ---${fieldsText || ' -'}
    `.trim();

    const fr = await fetch('https://formspree.io/f/xqeoddwd', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _subject: `Νεα εγγραφη RoC: ${name} (${onb.type || '-'})`,
        message,
        name,
        email: onb.email || 'no-reply@rootsofcarbon.gr',
      }),
    });
    await fr.json();

    // ── Zoho SMTP HTML email ──
    if (process.env.ZOHO_SMTP_USER && process.env.ZOHO_SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: 'smtp.zoho.eu',
        port: 465,
        secure: true,
        auth: {
          user: process.env.ZOHO_SMTP_USER,
          pass: process.env.ZOHO_SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Roots of Carbon" <${process.env.ZOHO_SMTP_USER}>`,
        to: 'info@rootsofcarbon.gr',
        subject: `Νέα Εγγραφή: ${name} — ${new Date().toLocaleDateString('el-GR')}`,
        html: buildHtml(onb, eq, fields),
      });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('submit-simple error:', err);
    return res.status(500).json({ error: err.message });
  }
}
