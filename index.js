const nunjucks = require('nunjucks');
const moment = require('moment')

nunjucks.configure();
// Get massCount, massCommon from http://prayer.covert.org/tomorrow/
const context = {
  isodate: '2020-05-30',
  massCount: 'Pentecost Sunday',
  massCommon: '',
  time: '11 AM',
  priest: 'Fr. Evan Simington',
  psalm: [
    [
      'Psalm 104: Benedic, anima mea.',
    ],
    [
      'PRAISE the LORD, O my soul:',
      'O LORD my God, thou art become exceeding glorious;',
      'thou art clothed with majesty and honour.',
      'Thou deckest thyself with light as it were with a garment,',
    ],
    [
      'O LORD, how manifold are thy works!',
      'in wisdom hast thou made them all;',
      'the earth is full of thy riches.',
      'Praise thou the LORD, O my soul. Praise the LORD.',
    ],
    [
      'These wait all upon thee,',
      'that thou mayest give them meat in due season.',
      'When thou givest it them, they gather it;',
      'and when thou openest thy hand, they are filled with good.',
    ],
    [
      'When thou takest away their breath, they die,',
      'and are turned again to their dust.',
      'When thou lettest thy breath go forth, they shall be made;',
      'and thou shalt renew the face of the earth.',
    ],
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

logResult('video-captions.njk');
logResult('post-body.njk');
