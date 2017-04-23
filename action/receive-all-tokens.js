import {parse, ErrorType} from 'url-otpauth'

// tokens come from the storage with the following attributes
//    {
//      url: 'otpauth://totp/Example:alice@google.com?secret=JBSWY3DPEHPK3PXP&issuer=Example'
//      ordinal: 2
//    }
//
// this must be parsed to get the token format used in the model

const I = (v) => v

export default (rawtokens) => {

  console.log('receiveAllTokens ')

  return (state) => {

    const tokens = rawtokens.map((raw, idx) => {
      try {
        //    {
        //      url: 'otpauth://totp/Example:al...ret=JBSWY3DPEHPK3PXP&issuer=Example'
        //      ordinal: 2
        //    }
        return Object.assign({}, parse(raw.url), {url:raw.url, ordinal:(raw.ordinal || idx)})
      } catch (err) {
        console.log('failed to parse token', raw.url, err.message)
        return null
      }
    }).filter(I).sort((t1, t2) => t1.ordinal - t2.ordinal)

    return {tokens}

  }

}
