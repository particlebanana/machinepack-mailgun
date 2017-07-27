module.exports = {


  friendlyName: 'Send html email',


  description: 'Send an html email.',


  inputs: {

    apiKey: {
      description: 'The API key of the Mailgun account to use.',
      example: 'key-3432afa32e9401482aba183c13f3',
      required: true,
      whereToGet: {
        url: 'https://mailgun.com/cp',
        description: 'Copy the "API Key" in your Mailgun dashboard.',
        extendedDescription: 'To retrieve your API key, you will first need to log in to your Mailgun account, or sign up for one if you have not already done so.'
      }
    },

    domain: {
      description: 'The Mailgun domain to use.',
      example: 'sandbox5f89931913a9ab31130131350101.mailgun.og',
      required: true,
      whereToGet: {
        url: 'https://mailgun.com/cp',
        description: 'Copy a domain from either "Mailgun Subdomains" or "Custom Domains" in your Mailgun dashboard.',
        extendedDescription: 'You will first need to log in to your Mailgun account, or sign up for one if you have not already done so.'
      }
    },

    toEmail: {
      example: 'jane@example.com',
      description: 'Email address of the primary recipient.',
      required: true
    },

    toName: {
      example: 'Jane Doe',
      description: 'Full name of the primary recipient.',
      extendedDescription: 'If left blank, defaults to the recipient\'s email address.'
    },

    subject: {
      description: 'Subject line for the email.',
      example: 'Welcome, Jane!'
    },

    textMessage: {
      description: 'The plaintext body of the email.',
      example: 'Jane,\nThanks for joining our community.  If you have any questions, please don\'t hesitate to send them our way.  Feel free to reply to this email directly.\n\nSincerely,\nThe Management'
    },

    htmlMessage: {
      description: 'The html body of the email.',
      example: 'Jane,\nThanks for joining our community.  If you have any questions, please don\'t hesitate to send them our way.  Feel free to reply to this email directly.\n\nSincerely,\nThe Management'
    },

    fromEmail: {
      description: 'Email address of the sender.',
      example: 'harold@example.enterprise'
    },

    fromName: {
      description: 'Full name of the sender.',
      example: 'Harold Greaseworthy'
    }
  },


  fn: function(inputs, exits, env) {

    // Import `util`.
    var util = require('util');

    // Import `mailgun` and `mailcomposer`
    var Mailgun = require('mailgun-js');
    var mailcomposer = require('mailcomposer');

    // Initialize the mailgun API.
    var mailgun = Mailgun({apiKey: inputs.apiKey, domain: inputs.domain});

    // Format recipients e.g. ['John Doe <john@example.com>'].
    var recipients = [
      (function(){
        if (!inputs.toName) {
          return inputs.toEmail;
        }
        return util.format('%s <%s>',inputs.toName, inputs.toEmail);
      })()
    ];

    // Format 'from' e.g. 'John Doe <john@example.com>'.
    var from = (function(){
      if (!inputs.fromEmail){
        return 'noreply@example.com';
      }
      if (!inputs.fromName) {
        return inputs.fromEmail;
      }
      return util.format('%s <%s>',inputs.fromName, inputs.fromEmail);
    })();

    // Add recipients (to: ).
    var to = '';
    recipients.forEach(function(recipient) {
      to += recipient + ',';
    });

    // Strip off last comma of the recipients.
    to = to.slice(0, - 1);

    // Prepare the email payload.
    var mail = mailcomposer({
      from: from,
      to: to,
      subject: inputs.subject || 'Hello',
      body: inputs.textMessage || '',
      html: inputs.htmlMessage || ''
    });

    // Create the email payload.
    mail.build(function(mailBuildError, message) {

      // Set the data for Mailgun's `sendMime` API call.
      var dataToSend = {
        to: to,
        message: message.toString('ascii')
      };

      // Set testmode if indicated.
      if (env.testMode) {
        dataToSend['o:testmode'] = 'yes';
      }

      // Send the mail via Mailgun.
      mailgun.messages().sendMime(dataToSend, function (err, body) {
        // Forward any errors to the `error` exit.
        if (err) return exits.error(err);
        // Otherwise return through `success`.
        return exits.success();
      });
    });
  }

};
