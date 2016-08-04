var Mailgun = require('../');

describe('machinepack-mailgun :: send-plaintext-email', function() {

  it('should run successfully', function(done) {

    Mailgun.sendPlaintextEmail({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
      toEmail: 'joeblow@denvull.net',
      toName: 'Joe Blow',
      subject: 'Hey there Joe!',
      message: 'What\'s shakin?',
      fromEmail: 'sueblue@nowhere.com',
      fromName: 'Sue Blue'
    })
    .setEnvironment({testMode: true})
    .exec(done);

  });

});
