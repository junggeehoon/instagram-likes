const path = require('path');
const puppeteer = require('puppeteer');
const config = require('./config');
let count = 0;

const INSTAGRAM = 'https://www.instagram.com'; // Instagram account url

const scrapeImgUrls = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false
    });

    const page = await browser.newPage();
    page.setViewport({
      width: 1080,
      height: 720
    });

    // console.log('🌎  Visiting web page...');
    await page.goto(INSTAGRAM);

    await page.waitFor(1000);
    await page.click('#react-root > section > main > article > div.rgFsT > div:nth-child(2) > p > a');
    await page.waitFor(1000);

    await page.type('#react-root > section > main > div > article > div > div:nth-child(1) > div > form > div:nth-child(2) > div > div > input', config.email);
    await page.type('#react-root > section > main > div > article > div > div:nth-child(1) > div > form > div:nth-child(3) > div > div > input', config.password);

    await page.click('#react-root > section > main > div > article > div > div:nth-child(1) > div > form > div:nth-child(4) > button');
    await page.waitFor(1000);
    await page.waitForSelector('button.aOOlW.HoLwm');
    await page.click('button.aOOlW.HoLwm');
    await page.waitFor(1000);

    for (let j = 0; j < 5; j++) {
      const postNumber = await page.evaluate(() => {
        return document.querySelectorAll(`#react-root > section > main > section > div.cGcGK > div:nth-child(1) > div > article`).length;
      })
      for (let i = 1; i <= postNumber; i++) {
        const like = await page.evaluate(i => {
          const inner = document.querySelector(`#react-root > section > main > section > div.cGcGK > div:nth-child(1) > div > article:nth-child(${i}) > div.eo2As > section.ltpMr.Slqrh > span.fr66n > button`).innerHTML;
          return inner.split('=')[2].split('>')[0];
        }, i)
        if (like === '"Like"') {
          await page.click(`#react-root > section > main > section > div > div:nth-child(1) > div > article:nth-child(${i}) > div.eo2As > section.ltpMr.Slqrh > span.fr66n > button > span`);
        }
      }
      const scroll = await page.evaluate(() => {
        return Math.round(document.body.scrollHeight/2);
      })
      await page.evaluate(`window.scrollTo(0, ${scroll})`);
      await page.waitFor(1000);
    }

    // return browser.close();
  } catch (err) {
    console.log(err);
  }
}

scrapeImgUrls();