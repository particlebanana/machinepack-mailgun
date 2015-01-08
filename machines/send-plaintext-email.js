module.exports = {
  friendlyName: 'Send plaintext email',
  description: 'Send a simple plaintext email.',
  extendedDescription: '',
  inputs: {
    apiKey: {
      description: 'The API key of the Mailgun account to use.',
      example: 'key-3432afa32e9401482aba183c13f3',
      required: true,
      whereToGet: {
        url: 'https://mailgun.com/app/domains/sandboxd5f6a672259e4988aa80d8d840649b31.mailgun.org',
        description: 'Copy the "API Key" listed under "Domain Information" in your Mailgun dashboard.',
        extendedDescription: 'To retrieve your API key, you will first need to log in to your Mailgun account, or sign up for one if you have not already done so.'
      }
    },
    toEmail: {
      description: 'Email address of the primary recipient.',
      example: 'jane@example.com',
      required: true
    }
  },
  defaultExit: 'success',
  exits: {
    error: {
      description: 'Unexpected error occurred.'
    },
    success: {
      description: 'Done.'
    }
  },
  fn: function(inputs, exits) {

    var mg = new Mailgun('api-key');

    mg.sendText('foo@bar.com', [inputs.toEmail], 'subject', 'the text', '', {}, function (err){
      if (err) return exits.error(err);
      return exits.success();
    });
  },

};
