const { mustBeSignedIn } = require('./auth.js');

let aboutMessage = 'ACNH Trading\n\n' +
                   'Developer: Shengfu Zhang, Ziqi Tang\n' +
                   'Data Source: https://discord.gg/8jNFHxG\n' +
                   'Github Repo: \n' +
                   '\thttps://github.ccs.neu.edu/NEU-CS5610-SU20/GroupProject_ppttptsfzzsf_UI\n' +
                   '\thttps://github.ccs.neu.edu/NEU-CS5610-SU20/GroupProject_ppttptsfzzsf_API\n';

function setMessage(_, { message }) {
  aboutMessage = message;
  return aboutMessage;
}

function getMessage() {
  return aboutMessage;
}

module.exports = { getMessage, setMessage: mustBeSignedIn(setMessage) };
