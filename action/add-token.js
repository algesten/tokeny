import {parse, ErrorType} from 'url-otpauth'

import saveAllTokens from './save-all-tokens'

const later = (fn) => setTimeout(fn, 0)

export default (url) => {

  console.log('addToken')

  return (state, dispatch) => {
    const {tokens} = state

    // otpauth://totp/martin?secret=123&issuer=github
    // otpauth://hotp/martin?secret=123&issuer=github&counter=0
    // otpauth://totp/Example:alice@google.com?secret=JBSWY3DPEHPK3PXP&issuer=Example
    // otpauth://totp/ACME%20Co:john.doe@email.com?secret=HXDMVJECJJWSRB3HWIZR4IFUGFTMXBOZ&issuer=ACME%20Co&algorithm=SHA1&digits=6&period=30
    //
    // {
    //   type: 'totp',
    //   account: 'alice@google.com',
    //   key: 'JBSWY3DPEHPK3PXP',
    //   issuer: 'Example',
    //   digits: 6
    // }
    try {

      // parse out the token values and also add in the url itself and
      // an ordinal that is the position in the list
      const ordinal = tokens.length
      const newtok = Object.assign({}, parse(url), {url, ordinal})

      // ensure there is an issuer field, even if blank
      // this, account and url is required by the keychain persistence
      // see Keychain.swift
      if (!newtok.issuer) {
        newtok.issuer = ''
      }
      // must have an account
      if (!newtok.account) {
        return {addresult:'Missing account'}
      }

      // for now we only accept totp
      if (newtok.type  != 'totp') {
        return {addresult:'Can only handle time based tokens (TOTP), for now'}
      }

      // for now we use a hardcoded 30 sec period
      if (newtok.period && newtok.period != 30) {
        return {addresult:'Can only handle time based tokens with a period of 30, for now'}
      }

      // the new tokens
      const ntokens = [].concat(tokens, newtok)

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
