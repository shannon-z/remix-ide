'use strict'
var init = require('../helpers/init')
var sauce = require('./sauce')

module.exports = {
  before: function (browser, done) {
    init(browser, done)
  },
  '@sources': function () {
    return []
  },
  'Publish on IPFS': function (browser) {
    browser
    .waitForElementVisible('#icon-panel', 10000)
    .clickLaunchIcon('fileExplorers')
    .switchFile('browser/3_Ballot.sol')
    .verifyContracts(['Ballot'])
    .click('#publishOnIpfs')
    .getModalBody((value, done) => {
      if (value.indexOf('Metadata of "ballot" was published successfully.') === -1) browser.assert.fail('ipfs deploy failed', '', '')
      if (value.indexOf('dweb:/ipfs') === -1) browser.assert.fail('ipfs deploy failed', '', '')
      done()
    })
    .modalFooterOKClick()
  },
  'Publish on Swarm': '' + function (browser) {
    browser
    .click('#publishOnSwarm')
    .getModalBody((value, done) => {
      if (value.indexOf('Metadata of "ballot" was successfully.') === -1) browser.assert.fail('swarm deploy failed', '', '')
      if (value.indexOf('bzz') === -1) browser.assert.fail('swarm deploy failed', '', '')
      done()
    })
    .modalFooterOKClick()
  },
  'Should publish contract metadata to ipfs on deploy': function (browser) {
    browser
    .waitForElementVisible('#icon-panel')
    .clickLaunchIcon('fileExplorers')
    .switchFile('browser/1_Storage.sol')
    .clickLaunchIcon('udapp')
    .waitForElementVisible('*[data-id="contractDropdownIpfsCheckbox"]')
    .click('*[data-id="contractDropdownIpfsCheckbox"]')
    .click('*[data-id="Deploy - transact (not payable)"]')
    .pause(5000)
    .assert.containsText('*[data-id="modalDialogModalBody"]', 'Metadata of "storage" was published successfully.')
    .modalFooterOKClick()
  },
  'Should remember choice after page refresh': function (browser) {
    browser
    .refresh()
    .switchFile('browser/1_Storage.sol')
    .clickLaunchIcon('udapp')
    .waitForElementVisible('*[data-id="contractDropdownIpfsCheckbox"]')
    .verify.elementPresent('*[data-id="contractDropdownIpfsCheckbox"]:checked')
    .end()
  },
  tearDown: sauce
}
