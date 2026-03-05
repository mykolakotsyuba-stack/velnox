const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setViewport({ width: 1440, height: 900 });

    // Go to the product page
    await page.goto('http://localhost:3000/uk/products/bearings/buq-206-104-2x3h', {
        waitUntil: 'networkidle0',
        timeout: 30000
    });

    // Wait a moment for any initial animations
    await new Promise(r => setTimeout(r, 2000));

    // Apply our print-friendly classes manually since we're using Puppeteer to just print the page
    await page.evaluate(() => {
        document.body.classList.add('pdf-generation-active');

        // Find the container and add the class
        const container = document.querySelector('article > div');
        if (container) {
            container.classList.add('pdf-capture-mode');
        }

        // Hide specific elements that shouldn't be in the PDF
        const style = document.createElement('style');
        style.innerHTML = `
      .print-hide, nav, footer, .breadcrumbs, #distributorsBlock, .ctaBlock {
        display: none !important;
      }
      body {
        background: white !important;
        color: black !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      * {
        animation: none !important;
        transition: none !important;
        opacity: 1 !important;
        transform: none !important;
      }
      div[class*="ProductTemplate_container"] {
        padding: 0 !important;
        max-width: 100% !important;
      }
      div[class*="ProductTemplate_header"] {
        margin: 0 0 20px 0 !important;
        border-bottom: 2px solid #000;
        padding-bottom: 10px;
      }
      h1[class*="ProductTemplate_title"] {
        color: #000 !important;
        font-size: 28pt !important;
        font-weight: bold !important;
      }
      canvas {
        filter: invert(1) hue-rotate(180deg) !important;
      }
    `;
        document.head.appendChild(style);
    });

    // Wait for styles to apply
    await new Promise(r => setTimeout(r, 1000));

    // Generate PDF
    const outputPath = '/Users/mak/.gemini/antigravity/brain/b49fb3ef-a4b5-48bd-8d54-833feee9c546/VELNOX_Catalog_BUQ_206-104-2X3H.pdf';

    await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: true,
        margin: {
            top: '15mm',
            right: '15mm',
            bottom: '15mm',
            left: '15mm'
        }
    });

    console.log(`PDF saved to ${outputPath}`);

    await browser.close();
})();
