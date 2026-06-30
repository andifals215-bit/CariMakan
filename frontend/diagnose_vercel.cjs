const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('pageerror', exception => {
    console.error('❌ VERCEL PAGE ERROR:', exception.message);
    console.error(exception.stack);
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('🛑 VERCEL CONSOLE ERROR:', msg.text());
    } else {
      console.log('💬 VERCEL CONSOLE:', msg.text());
    }
  });

  try {
    console.log('Navigating directly to live Vercel detail page 53322...');
    await page.goto('https://cari-makan-navy.vercel.app/detail/53322');
    await page.waitForTimeout(4000);
    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log('Rendered Body Text:\n', bodyText || '(EMPTY!)');
    console.log('Finished diagnostic run.');
  } catch (err) {
    console.error('Diagnostic run failed:', err);
  } finally {
    await browser.close();
  }
})();
