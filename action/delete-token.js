import saveAllTokens from './save-all-tokens'

const later = (fn) => setTimeout(fn, 0)

export default (token) => {

  console.log('deleteToken')

  return (state, dispatch) => {
    const {tokens} = state

    // index of the token to be replaced.
    const idx = token.ordinal

    // no ordinal?!
    if (typeof idx != 'number') {
      return {}
    }

    // keep all but the one at idx
    const ntokens = [].concat(tokens.slice(0,idx), tokens.slice(idx+1))

    // and update the keychain
    later(() => dispatch(saveAllTokens))

    return {tokens:ntokens}
  }
}
