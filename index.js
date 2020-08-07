#!/usr/bin/env node

const nunjucks = require('nunjucks');
const moment = require('moment')

nunjucks.configure();

const parsePsalm = (title, text) => [
  [title],
  ...text.trim().split('\n\n').map(
    verse => verse
      .replace(/\u200b/, '')
      .split(/ \| |\n/)
      .map(line => line
        .trim()
        .replace(/(\w+-) (\w)/, '$1$2')
        .replace(/^\d+ +/, '')
      ))]

// Get massCount, massCommon from http://prayer.covert.org/tomorrow/
const context = {
  isodate: '2020-07-26',
  massCount: 'Seventh Sunday after Trinity',
  massCommon: '',
  time: '11 AM',
  priest: 'Fr. Nathan Davis',
  psalm: parsePsalm(
    'Psalm 119',
    `
    57 Thou art my portion, O LORD; | I have promised to keep thy law.
    72 The law of thy mouth is dearer unto me | than thousands of gold and silver.

    76 O let thy merciful kindness be my comfort, | according to thy word unto thy servant.
    77 O let thy loving mercies come unto me, that I may live; | for thy law is my de- light.

    127 For I love thy com- mandments | above gold and precious stones.
    128 Therefore hold I straight all thy com- mandments; | and all false ways I utterly ab- hor.
    
    129 Thy testimonies are wonderful; | therefore doth my soul keep them.
    130 When thy word goeth forth, | it giveth light and understanding unto the simple.
    `
  ),
  worship_aid_url: 'https://stalbanscatholic.com/documents/2020/7/7th%20Sunday%20after%20Trinity%20Sunday%20July%2026th.pdf',
}
context.mass = context.massCommon || context.massCount;
context.date = moment(context.isodate).format('MMMM D, YYYY');
context.year = moment(context.isodate).year();


const logResult = filename => {
  const result = nunjucks.render(filename, context);
  console.log(result);
  return result;
};

const main = () => {
  console.log(context)
  if (process.argv.length > 2) {
    process.argv.slice(2).forEach(arg => logResult(arg));
  } else {
    logResult('video-captions.njk');
    logResult('post-body.njk');
  }
}

if (!module.parent) {
  main();
}
