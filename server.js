const express = require('express');
const path = require('path');
const cors = require('cors');
const { AxePuppeteer } = require('axe-puppeteer');
const puppeteer = require('puppeteer-extra');
const NodeCache = require( "node-cache" );

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

// Add adblocker plugin, which will transparently block ads in all pages
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
puppeteer.use(AdblockerPlugin({blockTrackers: true}));

const cache = new NodeCache({
    stdTTL: 60 * 60 * 24, // cache values for 24 hour
    checkperiod: 60, // check every minute for expired values
});

const port = process.env.PORT || 8087;

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'client','dist')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client','dist', 'index.html'));
});

app.get('/report', async (req, res) => {
    const executablePath = process.platform === 'darwin' ?
        '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome' :
        'google-chrome-unstable';
    if (req.query.host) {
        const host = req.query.host && req.query.host.indexOf('http') === 0 ? req.query.host : `https://${req.query.host}`;

        const value = cache.get(host);
        if (value) {
            res.send(value);
        } else {
            const options = {
                headless: true,
                fullPage: true,
                executablePath,
                args: ['--no-sandbox'],
            };
            const axeRules = ['wcag2a', 'wcag2aa', 'wcag21aa', 'section508', 'cat'];
            let browser;
            try {
                const browser = await puppeteer.launch(options);
                const page = await browser.newPage();
                await page.setBypassCSP(true);

                //disable 30s timeout
                await page.setDefaultNavigationTimeout(0);

                /*
                    This block will skip loading images, but can't work in conjunction with add block plugin
                 */
                // //turns request interceptor on
                // await page.setRequestInterception(true);
                //
                // //if the page makes a  request to a resource type of image then abort that request
                // page.on('request', request => {
                //     if (request.resourceType() === 'image')
                //         request.abort();
                //     else
                //         request.continue();
                // });

                await page.goto(host);

                let results = await new AxePuppeteer(page).withTags(axeRules).analyze();

                cache.set(host, results);
                res.send(results);
            } catch (error) {
                console.log(error);
                res.status(500).send(error);
            } finally {
                browser && await browser.close();
            }
        }
    } else {
        res.status(400).send("the host query parameter is required");
    }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
