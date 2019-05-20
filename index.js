const path = require('path');
const puppeteer = require('puppeteer');
// const download = require('image-downloader');
const config = require('./config');
let count = 0;

const IMAGE_DIRECTORY = './img'; // Relative path to directory to download images
const INSTAGRAM = 'https://www.instagram.com'; // Instagram account url
const NUMBER_OF_POSTS = 10; // Number of post that you want to save

const downloadImg = async (options = {}) => {
  try {
    const {
      filename,
      image
    } = await download.image(options);
    console.log('⬇️  ', path.basename(filename));
  } catch (err) {
    console.log(err);
  }
}

const scrape = async page => {
  try {
    await page.click('div._2z6nI > article > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1) > a > div.eLAPa > div._9AhH0');
    await page.waitFor(600);
    for (let i = 0; i < NUMBER_OF_POSTS; i++) {
      await page.waitFor(400);
      let nextBtn = await page.evaluate("document.querySelector('.coreSpriteRightChevron')");
      let imageNumber = 1;

      if (nextBtn !== undefined) {
        // Case of single image post
        const imgs = await page.evaluate(() => {
          const elements = document.querySelectorAll('div._97aPb IMG');
          return [...elements].map(el => el.src);
        });

        await Promise.all(imgs.map(async file => {
          await downloadImg({
            url: file,
            dest: `${IMAGE_DIRECTORY}/${Date.now()}.jpg`
          });
        }));
      } else {
        // Case of multiple image post
        while (nextBtn === undefined) {
          // Save images from post while next button exist
          const imgs = await page.evaluate(imageNumber => {
            const elements = document.querySelectorAll(`div.MreMs > div > ul > li:nth-child(${imageNumber}) IMG`);
            return [...elements].map(el => el.src);
          }, imageNumber);

          await Promise.all(imgs.map(async file => {
            await downloadImg({
              url: file,
              dest: `${IMAGE_DIRECTORY}/${Date.now()}.jpg`
            });
          }));

          imageNumber++;
          await page.click('.coreSpriteRightChevron');
          nextBtn = await page.evaluate("document.querySelector('.coreSpriteRightChevron')");
        }
        // Save last image from post
        const imgs = await page.evaluate(imageNumber => {
          const elements = document.querySelectorAll(`div.MreMs > div > ul > li:nth-child(${imageNumber}) IMG`);
          return [...elements].map(el => el.src);
        }, imageNumber);

        await Promise.all(imgs.map(async file => {
          await downloadImg({
            url: file,
            dest: `${IMAGE_DIRECTORY}/${Date.now()}.jpg`
          });
        }));
      }

      count += imageNumber;
      if (i !== NUMBER_OF_POSTS - 1) {
        await page.click('.coreSpriteRightPaginationArrow');
        await page.waitFor(400);
      }
    }
  } catch (err) {
    console.log(err);
  }
  return;
}

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