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
  isodate: '2020-07-12',
  massCount: 'Fifth Sunday after Trinity',
  massCommon: '',
  time: '11 AM',
  priest: 'Fr. Nathan Davis',
  psalm: parsePsalm(
    'Psalm 65: ​Te decet hymnus',
    `
    9 Thou visitest the earth, and ​blessest it; ​| thou makest it very ​plenteous.
    10 The river of God is full of ​water:​ | thou preparest their corn, for so thou providest for the ​earth.

    11 Thou waterest her furrows; thou sendest rain into the little valleys there- ​of;​ | thou makest it soft with the drops of rain, and blessest the ​increase of it.
    12 Thou crownest the year with thy ​goodness; ​| and thy clouds drop ​fatness.

    13 They shall drop upon the dwellings of the ​wilderness; ​| and the little hills shall rejoice on every ​side.
    14 The folds shall be full of ​sheep; |​ the valleys also shall stand so thick with corn, that they shall laugh and ​sing.
    `
  ),
  worship_aid_url: 'https://stalbanscatholic.com/documents/2020/7/5th%20Sunday%20After%20Trinity%20Worship%20Aid.pdf',
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
