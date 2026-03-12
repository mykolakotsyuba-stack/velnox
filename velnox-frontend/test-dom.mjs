import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/uk/products/bearings/buq-207-104-2x3h');
    
    // Wait for the table rows to appear
    await page.waitForSelector('th');
    
    // Find the row for A1
    const rows = await page.$$('tr');
    let a1Row = null;
    for (const row of rows) {
        const text = await page.evaluate(el => el.innerText, row);
        if (text.includes('A1')) {
            a1Row = row;
            break;
        }
    }
    
    if (a1Row) {
        await a1Row.hover();
        await page.waitForTimeout(500); // Wait for state update
        
        // Inspect the SVG
        const svgContent = await page.evaluate(() => {
            const svg = document.querySelector('svg[class*="svgOverlay"]');
            return svg ? svg.innerHTML : 'No SVG found';
        });
        console.log('SVG HTML while hovering A1:', svgContent);
        
        // Take a screenshot
        await page.screenshot({ path: 'local-puppeteer-test.png' });
    } else {
        console.log('Could not find A1 row.');
    }
    
    await browser.close();
})();
