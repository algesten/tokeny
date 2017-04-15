
import {
  NativeModules,
} from 'react-native';
import receiveAllTokens from '../action/receive-all-tokens'

const {KeychainStore} = NativeModules

export default (dispatch) => {
  KeychainStore.readAll().then((tokens) => {
    dispatch(receiveAllTokens(tokens))
  })
}
