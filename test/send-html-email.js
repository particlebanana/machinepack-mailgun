var Mailgun = require('../');

describe('machinepack-mailgun :: send-html-email', function() {

  it('should run successfully', function(done) {

    Mailgun.sendHtmlEmail({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
      toEmail: 'joeblow@denvull.net',
      toName: 'Joe Blow',
      subject: 'Hey there Joe!',
      textMessage: 'What\'s shakin?',
      htmlMessage: 'What&rsquo;s shakin?',
      fromEmail: 'sueblue@nowhere.com',
      fromName: 'Sue Blue',
    })
    .exec(done);

  });

});
