#!/usr/bin/env node

const nunjucks = require('nunjucks');
const moment = require('moment')

nunjucks.configure();

const parsePsalm = (title, text) => [
  [title],
  ...text.trim().split('\n\n').map(
    verse => verse
      .split(/ \| |\n/)
      .map(line => line
        .trim()
        .replace(/(\w+-) (\w)/, '$1$2')
        .replace(/^\d+ +/, '')
      ))]

// Get massCount, massCommon from http://prayer.covert.org/tomorrow/
const context = {
  isodate: '2020-07-05',
  massCount: 'Fourth Sunday after Trinity',
  massCommon: '',
  time: '11 AM',
  priest: 'Fr. Nathan Davis',
  psalm: parsePsalm(
    'Psalm 145: Exaltabo te, Deus',
    `
    1 I will magnify thee, O God, my King; | and I will praise thy Name for ever and ever.
    2 Every day will I give thanks unto thee; | and praise thy Name for ever and ever.

    8 The LORD is gracious and merciful; | long-suffering, and of great goodness.
    9 The LORD is loving unto every man; | and his mercy is over all his works.

    10 All thy works praise thee, O LORD; | and thy saints give thanks unto thee.
    11 They show the glory of thy kingdom, | and talk of thy power;

    13 Thy kingdom is an everlasting kingdom, | and thy dominion endureth throughout all ages.
    14 The LORD upholdeth all such as fall, | and lifteth up all those that are down.
    `
  ),
  worship_aid_url: 'https://stalbanscatholic.com/documents/2020/7/4th%20Sunday%20After%20Trinity%20Worship%20Aid.pdf',
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
