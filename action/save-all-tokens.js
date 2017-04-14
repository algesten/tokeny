import {
  NativeModules,
} from 'react-native';

const {KeychainStore} = NativeModules

// One entry in the store is like this:
// tokeny000: {
//    account:   <display name>
//    issuer:    <issuer>
//    key:       <key>
//    type:      totp/hotp
//    algorithm: SHA1/SHA256/SHA512
//    digits:    6
// }

const numberFormat = (n) => {
  const s = String(n)
  if (s.length == 1 ) {
    return '00' + s
  } else if (s.length == 2) {
    return '0' + s
  } else {
    return s
  }
}

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
