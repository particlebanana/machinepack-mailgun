module.exports = {


  friendlyName: 'Send plaintext email',


  description: 'Send a simple plaintext email.',


  inputs: {

    apiKey: require('../constants/apiKey.input'),

    domain: require('../constants/domain.input'),

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
    },

    testMode: {
      friendlyName: 'Test mode?',
      description: 'Whether test mode is enabled.',
      extendedDescription: 'If left unspecified, the proper value for this flag is assumed automatically based on the NODE_ENV environment variable.',
      type: 'boolean'
    }

  },


  fn: function(inputs, exits) {

    // Import `util`.
    var util = require('util');

    // Import `mailgun`
    var Mailgun = require('mailgun-js');

    // Import our private, process-wide cache
    var cache = require('./private/cache');

    if (!inputs.apiKey && !cache.apiKey) {
      throw new Error('Cannot determine an appropriate Mailgun API key to use.  Please pass one in here, or use `.setGlobalDefaults()`.');
    }//•

    if (!inputs.domain && !cache.domain) {
      throw new Error('Cannot determine an appropriate Mailgun sending domain to use.  Please pass one in here, or use `.setGlobalDefaults()`.');
    }//•

    // Initialize the underlying mailgun API wrapper lib.
    var mailgun = Mailgun({
      apiKey: inputs.apiKey||cache.apiKey,
      domain: inputs.domain||cache.domain
    });

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
      // attachment: FUTURE: support attachments.
    };

    // Set testmode if indicated.
    var inTestMode;
    if (inputs.testMode !== undefined) { inTestMode = inputs.testMode; }
    else if (process.env.NODE_ENV === 'production') { inTestMode = false; }
    else { inTestMode = true; }//ﬁ
    if (inTestMode) {
      dataToSend['o:testmode'] = 'yes';
    }//ﬁ

    // Send the mail via Mailgun.
    mailgun.messages().send(dataToSend, function (err) {
      // Forward any errors to the `error` exit.
      if (err) { return exits.error(err); }
      // Otherwise return through `success`.
      return exits.success();
    });

  },

};
