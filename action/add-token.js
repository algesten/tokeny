import {parse, ErrorType} from 'url-otpauth'

import saveAllTokens from './save-all-tokens'

const later = (fn) => setTimeout(fn, 0)

export default (url) => {

  console.log('addToken ', url)

  return (state, dispatch) => {
    const {tokens} = state

    // otpauth://totp/martin?secret=123&issuer=github
    // otpauth://hotp/martin?secret=123&issuer=github&counter=0
    // otpauth://totp/Example:alice@google.com?secret=JBSWY3DPEHPK3PXP&issuer=Example
    // otpauth://totp/ACME%20Co:john.doe@email.com?secret=HXDMVJECJJWSRB3HWIZR4IFUGFTMXBOZ&issuer=ACME%20Co&algorithm=SHA1&digits=6&period=30
    try {

      const p = parse(url)
      const ntokens = [].concat(tokens, p)

      // schedule a save to keychain
      later(() => dispatch(saveAllTokens))

      return {addresult:'', tokens:ntokens}

    } catch (err) {
      if (typeof err.errorType == 'number') {

        // the key is the reason string
        const reason = Object.keys(ErrorType).find((key) => ErrorType[key] == err.errorType)

        return {addresult:'Add code failed: ' + reason}
      } else {
        return {addresult:'Add code failed: ' + err.message}
      }
    }

  }
}
