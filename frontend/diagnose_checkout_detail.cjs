const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('pageerror', exception => {
    console.error('❌ CHECKOUT DETAIL PAGE ERROR:', exception.message);
    console.error(exception.stack);
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('🛑 CHECKOUT DETAIL CONSOLE ERROR:', msg.text());
    } else {
      console.log('💬 CONSOLE:', msg.text());
    }
  });

  try {
    console.log('Navigating directly to detail page 53322...');
    await page.goto('https://cari-makan-navy.vercel.app/detail/53322', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // 1. Click "Masuk / Daftar" button in header
    console.log('Clicking login...');
    await page.click('button:has-text("Masuk")');
    await page.waitForTimeout(1000);

    // 2. Fill credentials
    console.log('Logging in...');
    await page.fill('input[type="email"]', 'user@carimakan.com');
    await page.fill('input[type="password"]', 'user123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    // 3. Add to cart
    console.log('Clicking Masukkan ke Keranjang...');
    await page.click('button:has-text("Masukkan ke Keranjang")');
    await page.waitForTimeout(1000);

    // 4. Open cart drawer
    console.log('Opening cart...');
    // Find the cart button in the header (has the cart icon or count)
    const cartBtns = await page.$$('button');
    for (const btn of cartBtns) {
      const label = await btn.getAttribute('aria-label').catch(() => '');
      if (label && label.includes('Keranjang')) {
        await btn.click();
        console.log('Opened cart drawer');
        break;
      }
    }
    await page.waitForTimeout(1000);

    // 5. Click checkout
    console.log('Clicking checkout...');
    const checkoutBtns = await page.$$('button');
    for (const btn of checkoutBtns) {
      const text = await btn.innerText().catch(() => '');
      if (text.includes('Checkout')) {
        await btn.click();
        console.log('Clicked checkout button');
        break;
      }
    }
    await page.waitForTimeout(2000);

    // Get body text and check if checkout modal is visible
    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log('Body Text after checkout click (Length):', bodyText.length);
    if (bodyText.includes('Detail Pengiriman') || bodyText.includes('WhatsApp')) {
      console.log('✅ Checkout modal rendered successfully!');
    } else {
      console.log('❌ Checkout modal NOT found or crashed!');
    }

  } catch (err) {
    console.error('Checkout script failed:', err);
  } finally {
    await browser.close();
  }
})();
