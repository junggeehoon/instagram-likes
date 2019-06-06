const puppeteer = require('puppeteer');
const config = require('./config');
let likes = 0;

const INSTAGRAM = 'https://www.instagram.com';

const pressLike = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true
    });

    const page = await browser.newPage();
    page.setViewport({
      width: 1080,
      height: 720
    });

    console.log('🌎  Visiting web page...');
    const time1 = Date.now();
    await page.goto(INSTAGRAM);
    console.log('🚀  Launching...');

    await page.waitFor(1000);
    await page.click('#react-root > section > main > article > div.rgFsT > div:nth-child(2) > p > a'); // click login
    await page.waitFor(1500);
    await page.type('input[name=username]', config.email);
    await page.type('input[name=password]', config.password);
    await page.click('button._0mzm-.sqdOP.L3NKy'); // click login button

    await page.waitFor(1000);

    // // Uncomment the following line before running the sample.
    // await page.waitForSelector('button.aOOlW.HoLwm');
    // await page.click('button.aOOlW.HoLwm');
    // await page.waitFor(1000);

    console.log("🤪  Loginned to your account!");

    for (let j = 0; j < 8; j++) {
      const postNumber = await page.evaluate(() => {
        return document.querySelectorAll(`div.cGcGK > div:nth-child(1) > div > article`).length;
      })
      for (let i = 1; i < postNumber + 1; i++) {
        const like = await page.evaluate(i => {
          const inner = document.querySelector(`div.cGcGK > div:nth-child(1) > div > article:nth-of-type(${i}) > div.eo2As > section.ltpMr.Slqrh > span.fr66n > button`).innerHTML;
          return inner.split('=')[2].split('>')[0];
        }, i)

        const following = await page.evaluate(i => {
          return document.querySelector(`div.cGcGK > div:nth-child(1) > div > article:nth-of-type(${i}) > header > div.o-MQd.z8cbW > div.RqtMr > div > h2 > a`).innerHTML;
        }, i)

        if (!config.exceptions.includes(following) && like === '"Like"') {
          likes++;
          await page.click(`div.cGcGK > div:nth-child(1) > div > article:nth-of-type(${i}) > div.eo2As > section.ltpMr.Slqrh > span.fr66n > button > span`);
        }
      }
      const scroll = await page.evaluate(() => {
        return Math.round(document.body.scrollHeight * 0.6);
      })
      await page.evaluate(`window.scrollTo(0, ${scroll})`);
      await page.waitFor(1500);
    }
    const time2 = Date.now();
    console.log(`👌  Done -- liked ${likes}posts!`);
    let timeTake = time2 - time1;
    let unit = 'milliseconds';

    if (timeTake >= 60000) {
      timeTake = Math.round(timeTake / 60000);
      unit = 'minutes';
    }
    
    if (timeTake >= 1000) {
      timeTake = Math.round(timeTake / 1000);
      unit = 'seconds';
    }

    console.log(`✨  Done in ${timeTake} ${unit}.`);
    return browser.close();
  } catch (err) {
    console.log(err);
  }
}

setInterval(visitHomepage, 3600000); // 1시간에 한번씩 
// pressLike();