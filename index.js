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
  isodate: '2020-09-13',
  massCount: 'Fourteenth Sunday after Trinity',
  massCommon: '',
  time: '11 AM',
  priest: 'Fr. Nathan Davis',
  psalm: parsePsalm(
    'Psalm 85',
    `
    1 God be merciful unto us, and bless us, | and show us the light of his countenance, and be merciful un- to us;
    2 That thy way may be known upon earth, | thy saving health among all nations.
    4 O let the nations rejoice and be glad; | for thou shalt judge the folk righteously, and govern the nations upon earth.

    5 Let the peoples praise thee O God; | yea, let all the peoples praise thee.
    7 God shall bless us; | and all the ends of the world shall fear him.
    `
  ),
  worship_aid_url: 'https://stalbanscatholic.com/documents/2020/9/14th%20Sunday%20after%20Trinity%20Sunday%20September%2013th.pdf',
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
  await fs.writeFile(`context-${context.isodate}.json`, JSON.stringify(context, null, 2));
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
