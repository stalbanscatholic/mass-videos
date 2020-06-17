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
      ))]

// Get massCount, massCommon from http://prayer.covert.org/tomorrow/
const context = {
  isodate: '2020-06-14',
  massCount: 'Solemnity of the Most Holy Body and Blood of Christ',
  massCommon: 'Corpus Christi',
  time: '11 AM',
  priest: 'Fr. Evan Simington',
  psalm: parsePsalm(
    'Psalm 147',
    `
    Praise the LORD, O Je- rusalem; | praise thy God, O Sion.
    For he hath made fast the bars of thy gates, | and hath blessed thy children with- in thee.
    
    He maketh peace in thy borders, | and filleth thee with the flour of wheat.
    He sendeth forth his commandment upon earth, | and his word runneth very swiftly.
    
    He showeth his word unto Jacob, | his statutes and ordinances unto Israel.
    He hath not dealt so with any nation; | neither have the heathen knowledge of his laws.
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
