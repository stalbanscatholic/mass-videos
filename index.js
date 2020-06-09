#!/usr/bin/env node

const nunjucks = require('nunjucks');
const moment = require('moment')

nunjucks.configure();

const parsePsalm = (title, text) => [[title], ...text.trim().split('\n\n').map(verse => verse.split(/ \| |\n/).map(line => line.trim()))]

// Get massCount, massCommon from http://prayer.covert.org/tomorrow/
const context = {
  isodate: '2020-06-07',
  massCount: 'Trinity Sunday',
  massCommon: '',
  time: '11 AM',
  priest: 'Fr. Evan Simington',
  psalm: parsePsalm(
    'Dan 3:52-56: Benedictus es, Domine',
    `
    Blessed art thou, O Lord God of our fathers: | praised and exalted above all for ever.
    Blessed art thou for the Name of thy majesty: | praised and exalted above all for ever.

    Blessed art thou in the temple of thy holiness: | praised and exalted above all for ever.
    Blessed art thou that beholdest the depths, and dwellest between the Cherubim: | praised and exalted above all for ever.

    Blessed art thou on the glorious throne of thy kingdom: | praised and exalted above all for ever.
    Blessed art thou in the firmament of heaven: | praised and exalted above all for ever.

    Blessed art thou, O Father, Son, and Holy Spirit: | praised and exalted above all for ever.
    `
  ),
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
