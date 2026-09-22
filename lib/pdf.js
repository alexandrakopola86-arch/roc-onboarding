// Renders an HTML string to a PDF buffer.
// On Vercel, uses puppeteer-core + @sparticuz/chromium (serverless-sized Chromium binary).
// Locally (next dev), falls back to full puppeteer, which bundles a Chromium for your OS.
export async function renderHtmlToPdf(html) {
  let browser;

  if (process.env.VERCEL) {
    const chromium = (await import('@sparticuz/chromium')).default;
    const puppeteer = await import('puppeteer-core');
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  } else {
    const puppeteer = await import('puppeteer');
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    return await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' },
    });
  } finally {
    await browser.close();
  }
}
