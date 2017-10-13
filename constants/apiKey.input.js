module.exports = {
  friendlyName: 'API Key',
  description: 'The API key of the Mailgun developer account to use.',
  extendedDescription: 'This can be omitted if you\'ve used .setGlobalDefaults().',
  example: 'key-3432afa32e9401482aba183c13f3',
  protect: true,
  whereToGet: {
    url: 'https://mailgun.com/cp',
    description: 'Copy the "API Key" in your Mailgun dashboard.',
    extendedDescription: 'To retrieve your API key, you will first need to log in to your Mailgun account, or sign up for one if you have not already done so.'
  }
};
