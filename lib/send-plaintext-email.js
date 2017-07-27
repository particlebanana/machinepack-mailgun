module.exports = {


  friendlyName: 'Send plaintext email',


  description: 'Send a simple plaintext email.',


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
      friendlyName: 'To (email)',
      example: 'jane@example.com',
      description: 'Email address of the primary recipient.',
      required: true
    },

    toName: {
      friendlyName: 'To (name)',
      example: 'Jane Doe',
      description: 'Full name of the primary recipient.',
      extendedDescription: 'If left blank, defaults to the recipient\'s email address.'
    },

    subject: {
      description: 'Subject line for the email.',
      example: 'Welcome, Jane!'
    },
    message: {
      description: 'The plaintext body of the email.',
      example: 'Jane,\nThanks for joining our community.  If you have any questions, please don\'t hesitate to send them our way.  Feel free to reply to this email directly.\n\nSincerely,\nThe Management'
    },

    fromEmail: {
      friendlyName: 'From (email)',
      description: 'Email address of the sender.',
      example: 'harold@example.enterprise'
    },

    fromName: {
      friendlyName: 'From (name)',
      description: 'Full name of the sender.',
      example: 'Harold Greaseworthy'
    }

  },


  fn: function(inputs, exits, env) {

    // Import `util`.
    var util = require('util');

    // Import `mailgun`
    var Mailgun = require('mailgun-js');

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

    // Set the data for Mailgun's `send` API call.
    var dataToSend = {
      from: from,
      to: recipients,
      subject: inputs.subject||'Hello world!',
      text: inputs.message||' ',
      // attachment: attch
    };

    // Set testmode if indicated.
    if (env.testMode) {
      dataToSend['o:testmode'] = 'yes';
    }

    // Send the mail via Mailgun.
    mailgun.messages().send(dataToSend, function (err) {
      // Forward any errors to the `error` exit.
      if (err) { return exits.error(err); }
      // Otherwise return through `success`.
      return exits.success();
    });

  },

};
