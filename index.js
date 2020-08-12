#!/usr/bin/env node

const nunjucks = require('nunjucks');
const moment = require('moment')

const fs = require('fs').promises;

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

// Get massCount, massCommon from http://prayer.covert.org/tomorrow/ or the worship aid
const context = {
  isodate: '2020-08-09',
  massCount: 'Ninth Sunday after Trinity',
  massCommon: '',
  time: '11 AM',
  priest: 'Fr. Nathan Davis',
  psalm: parsePsalm(
    'Psalm 85',
    `
    8 I will hearken what the LORD God will say; | for he shall speak peace unto his people, and to his saints, that they turn not again unto foolishness.
    9 For his salvation is nigh them that fear him; | that glory may dwell in our land.

    10 Mercy and truth are met to- gether: | righteousness and peace have kissed each other.
    11 Truth shall flourish out of the earth, | and righteousness hath looked down from heaven.

    12 Yea, the LORD shall show loving-kindness; | and our land shall give her increase.
    13 Righteousness shall go be- fore him, | and shall direct his going in the way.
    `
  ),
  worship_aid_url: 'https://stalbanscatholic.com/documents/2020/8/9th%20Sunday%20after%20Trinity%20Sunday%20August%209th.pdf',
}
context.mass = context.massCommon || context.massCount;
context.date = moment(context.isodate).format('MMMM D, YYYY');
context.year = moment(context.isodate).year();


const logResult = filename => {
  const result = nunjucks.render(filename, context);
  console.log(result);
  return result;
};

const main = async () => {
  console.log(context)
  await fs.writeFile(`context-${context.isodate}.json`, JSON.stringify(context));
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
