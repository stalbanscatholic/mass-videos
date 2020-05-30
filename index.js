const nunjucks = require('nunjucks');
const moment = require('moment')

nunjucks.configure();
// Get massCount, massCommon from http://prayer.covert.org/tomorrow/
const context = {
  isodate: '2020-05-24',
  massCount: 'Seventh Sunday of Easter',
  massCommon: '',
  time: '11 AM',
  priest: 'Fr. Evan Simington',
  psalm: [
    'Psalm 27: Dominus illuminatio.',
    'THE LORD is my light and my salvation; whom then shall I fear? * the LORD is the strength of my life; of whom then shall I be afraid?',
    'One thing have I desired of the LORD, which I will require; * even that I may dwell in the house of the LORD all the days of my life, to behold the fair beauty of the LORD, and to visit his temple.',
    'Therefore will I offer in his dwelling an oblation, with great gladness: * I will sing and speak praises unto the LORD. Hearken unto my voice, O LORD, when I cry unto thee; * have mercy upon me, and hear me.',
    'My heart hath talked of thee, Seek ye my face: * Thy face, LORD, will I seek.'
  ]
}
context.mass = context.massCommon || context.massCount;
context.date = moment(context.isodate).format('MMM D, YYYY');
context.year = moment(context.isodate).year();

console.log(context)

const logResult = filename => {
  const result = nunjucks.render(filename, context);
  console.log(result);
  return result;
};

// logResult('video-captions.njk');
logResult('post-body.njk');
