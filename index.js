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
  isodate: '2020-06-10',
  massCount: 'Wednesday, 10 June',
  massCommon: '',
  time: '7 PM',
  priest: 'Fr. Evan Simington',
  psalm: parsePsalm(
    'Psalm 16: Conserva me, Domine',
    `
    Preserve me, O God; | for in thee have I put my trust.
    O my soul, thou hast said unto the LORD, | Thou art my God.
    
    But they that run after another god | shall have great trouble.
    Their drink-offerings of blood I will not offer, | neither make mention of their names within my lips.
    
    The LORD himself is the portion of mine inheritance, and of my cup; | thou shalt maintain my lot.
    I have set the LORD alway be- fore me; | for he is on my right hand, therefore I shall not fall.
    
    Thou shalt show me the path of life: in thy presence is the fullness of joy, | and at thy right hand there is pleasure for ever- more.
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
