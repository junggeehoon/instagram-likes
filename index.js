const puppeteer = require('puppeteer');
const config = require('./config');
let likes = 0;
let userNames = [];

const INSTAGRAM = 'https://www.instagram.com';

const pressLike = async () => {
  try {
    const browser = await puppeteer.launch({
      // userDataDir: "./user_data",
      headless: false
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

    await page.waitFor(1500);
    const didLogin = await page.evaluate(() => {
      return document.querySelectorAll(`input[name=username]`).length;
    })

    if (didLogin == 1) {
      await page.type('input[name=username]', config.email);
      await page.type('input[name=password]', config.password);
      await page.click('#react-root > section > main > article > div:nth-of-type(2) > div:nth-of-type(1) > div > form > div:nth-of-type(4) > button');

      // await page.waitFor(1500);
      await page.waitForSelector('#react-root > section > main > div > div > div > section > div > button');
      await page.click('#react-root > section > main > div > div > div > section > div > button');

      await page.waitForSelector('button.aOOlW.HoLwm');
      await page.click('button.aOOlW.HoLwm');
    } 

    await page.waitFor(1000);
    console.log("🤪  Loginned to your account!");

    for (let j = 0; j < 10; j++) {
      
      const postNumber = await page.evaluate(() => {
        return document.querySelectorAll(`div.cGcGK > div:nth-of-type(2) > div > article`).length;
      })
      
      for (let i = 1; i <= postNumber; i++) {
        await page.waitForSelector(`div.cGcGK > div:nth-of-type(2) > div > article:nth-of-type(${i}) > div.eo2As > section.ltpMr.Slqrh > span.fr66n > button > svg`);
        const doesLike = await page.evaluate(i => {
          return document.querySelector(`div.cGcGK > div:nth-of-type(2) > div > article:nth-of-type(${i}) > div.eo2As > section.ltpMr.Slqrh > span.fr66n > button > svg`).getAttribute('aria-label');
        }, i)
  
        const tag = await page.evaluate(i => {
          return document.querySelector(`div.cGcGK > div:nth-of-type(2) > div > article:nth-of-type(${i}) > header > div:nth-of-type(2) > div > div`).firstChild.innerHTML;
        }, i)

        let userName = tag;

        if (userName.includes("href=")) {
          const regExp = /\/([^)]+)\/"/;
          const matches = regExp.exec(tag);
          userName = matches[1];
        }
        if (!userNames.includes(userName)) {
          userNames.push(userName);
          console.log(userName)
        }
  
        if (doesLike === 'Like') {
          console.log(`liked ${userName}'s post 💖`);
          likes++;
          // await page.click(`div.cGcGK > div:nth-child(2) > div > article:nth-of-type(${i}) > div.eo2As > section.ltpMr.Slqrh > span.fr66n > button`);
        }
      }
  
      const scroll = await page.evaluate(() => {
        return Math.round(document.body.scrollHeight * 0.8);
      })
      await page.evaluate(`window.scrollTo(0, ${scroll})`);
      await page.waitFor(2000);
      
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
    // return browser.close();
  } catch (err) {
    console.log(err);
  }
}

// setInterval(pressLike, 3600000); // 1시간에 한번씩 
pressLike();