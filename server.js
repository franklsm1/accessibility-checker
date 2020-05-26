const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const { AxePuppeteer } = require('axe-puppeteer');
const puppeteer = require('puppeteer');

const port = process.env.PORT || 8080;

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'client','dist')));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client','dist', 'index.html'));
});

app.get('/report', async (req, res) => {
    const executablePath = process.platform === 'darwin' ?
        '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome' :
        'google-chrome-unstable';
    const host = req.query.host;
    const options = {
        headless: true,
        fullPage: true,
        executablePath,
    };
    const axeRules = ['wcag2a', 'wcag2aa', 'wcag21aa', 'section508', 'cat'];
    try {
        const browser = await puppeteer.launch(options);
        const page = await browser.newPage();
        await page.setBypassCSP(true);

        await page.goto(host);

        let results = await new AxePuppeteer(page).withTags(axeRules).analyze();

        await page.close();
        await browser.close();

        res.send(results);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
