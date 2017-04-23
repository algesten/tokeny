
const enc = encodeURIComponent

module.exports = (token) => {

  // otpauth://totp/Example:amy@google.com?secret=JBSWY3DKEHPK3PXP&issuer=Example'

  const type = token.type || 'totp'
  const issuer = token.issuer || ''
  const account = token.account || ''
  const label = enc(issuer) + ":" + enc(account)
  const secret = "?secret=" + enc(token.key)
  const algorithm = (() => { // "SHA1", "SHA256", "SHA512", "MD5"
    if (token.algorithm  && token.algorithm != 'SHA1') {
      return "&algorithm=" + enc(token.algorithm)
    } else {
      return""
    }
  })()
  const factor = (() => {
    if (type == 'totp') {
      return token.period && token.period != 30 ? "&period=" + enc(token.period) : ""
    } else {
      return "&counter=" + enc(token.counter)
    }
  })()

  return "otpauth://" + type + "/" + label + secret + algorithm + factor

}
