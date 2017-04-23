import saveAllTokens from './save-all-tokens'
import toUrl from '../lib/to-url'

const later = (fn) => setTimeout(fn, 0)

export default (token) => {

  console.log('save token')

  return (state, dispatch) => {
    const {tokens} = state

    // index of the token to be replaced.
    const idx = token.ordinal

    // no ordinal?!
    if (typeof idx != 'number') {
      return {}
    }

    // the save may be because we altered som compoent of the
    // token such as the issuer or the account name. this must
    // be reflected in the url (since the deserialization from
    // the keychain only looks at the url).
    const url = toUrl(token)
    const newToken = Object.assign({}, token, {url})

    // replace the one at idx
    const ntokens = [].concat(tokens.slice(0,idx), newToken, tokens.slice(idx+1))

    // and update the keychain
    later(() => dispatch(saveAllTokens))

    return {tokens:ntokens}
  }
}
