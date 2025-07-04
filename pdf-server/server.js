const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/pdf', async (req, res) => {
  const country = req.query.country || 'Italy';
  const url = `https://ltortladzemoesd.github.io/ckeditor-host/talking.html?country=${encodeURIComponent(country)}`;

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    await page.waitForSelector('.section-content');

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        bottom: '20mm',
        left: '20mm',
        right: '20mm'
      },
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: `<div style="font-size:10px; width:100%; padding-right:20px; text-align:right;">
        <span class="pageNumber"></span>
      </div>`
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Talking_Points_${country}.pdf"`
    });

    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).send('PDF generation failed: ' + error.message);
  }
});

app.get('/', (req, res) => {
  res.send('✅ Puppeteer PDF service is running. Use /pdf?country=YourCountry');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
