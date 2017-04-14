
// One entry in the store is like this:
// tokeny000: {
//    account:   <display name>
//    issuer:    <issuer>
//    key:       <key>
//    type:      totp/hotp
//    algorithm: SHA1/SHA256/SHA512
//    digits:    6
// }

// :: str -> int
const orderNoOf = (() => {
  const re = /^.*(\\d{3})$/;
  return (s) => {
    const [_, noStr] = re.exec(s) || []
    if (noStr) {
      return parseInt(noStr, 10)
    } else {
      return 999
    }
  }
})()

export default (dict) => {

  console.log('receiveAllTokens ', dict)

  return (state) => {

    // keys sorted in order, we expect keys to be on the form
    // 'tokeny000', 'tokeny001' etc
    const keys = Object.keys(dict).sort((k1, k2) => {
      return orderNoOf(k1) - orderNoOf(k2)
    })

    // return  sorted tokens
    return {
      tokens: keys.map((k) => dict[k])
    }

  }
}
