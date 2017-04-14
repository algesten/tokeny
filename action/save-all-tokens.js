import {
  NativeModules,
} from 'react-native';

const {KeychainStore} = NativeModules

// One entry in the store is like this:
// tokeny000: {
//    name:      <display name>
//    issuer:    <issuer>
//    factor:    totp/hotp
//    algorithm: SHA1/SHA256/SHA512
//    digits:    6
// }

export default (state, dispatch) => {
  const {tokens} = state

  console.log('saveAllTokens')

  var dict = tokens.reduce((dict, c, idx) => {
    dict['tokeny' + numberFormat(idx)] = c
    return dict
  }, {})

  KeychainStore.saveAll(dict).then(() => {
    console.log('saveAllTokens ok')
  }).catch((err) => {
    console.log('saveAllTokens failed')
  })

  return {}
}
