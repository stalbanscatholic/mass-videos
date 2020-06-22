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
  isodate: '2020-06-20',
  massCount: 'Patronal Feast of St. Alban',
  massCommon: '',
  time: '11 AM',
  priest: 'Fr. Evan Simington',
  psalm: parsePsalm(
    'Psalm 31',
    `
    Be thou my strong rock, and house of de- fence, | that thou mayest save me.
    For thou art my strong rock, and my castle: | be thou also my guide, and lead me for thy Name's sake.
    
    Into thy hands I commend my spirit; | for thou hast redeemed me, O LORD, thou God of truth.
    I will be glad and rejoice in thy mercy; | for thou hast considered my trouble, and hast known my soul in ad- versities.
    
    My times are in thy hand; deliver me from the hand of mine enemies, | and from them that persecute me.
    Show thy servant the light of thy countenance, | and save me for thy mercy's sake.
    `
  ),
  worship_aid_url: 'https://stalbanscatholic.com/documents/2020/6/Patronal%20Feast%20of%20St.%20Alban%20Sunday%20June%2021st.pdf',
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
