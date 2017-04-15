import {
  NativeModules,
} from 'react-native';

import loadAll from '../lib/load-all'

const {KeychainStore} = NativeModules

// tokens look like this. the required attributes for storage
// are url, issuer, account, ordinal.
//    {
//      type: 'totp',
//      account: 'alice@google.com',
//      key: 'JBSWY3DPEHPK3PXP',
//      issuer: 'Example',
//      digits: 6
//      url: 'otpauth://totp/Example:alice@google.com?secret=JBSWY3DPEHPK3PXP&issuer=Example'
//      ordinal: 2
//    }

export default (state, dispatch) => {
  const {tokens} = state

  console.log('saveAllTokens')

  // redo all the ordinals
  const tosave = tokens.map((t, idx) => Object.assign({}, t, {ordinal:idx}))

  KeychainStore.saveAll(tosave).then(() => {
    console.log('saveAllTokens ok')
  }).catch((err) => {

    console.log('saveAllTokens failed')

    // reload from keychain
    loadAll(dispatch)

    return {addresult:'Save tokens failed'}
  })

  return {}
}
