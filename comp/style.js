import {
  StyleSheet,
} from 'react-native';

const THEME = {

  dark: {
    background: "#000000",
    foreground: "#cccccc",
  }

}

export default (() => {

  const t = THEME.dark

  var style = StyleSheet.create({
    view: {
      backgroundColor: t.background,
    },
    text: {
      color: t.foreground,
      fontSize: 15,
    },
    listText: {
      color: t.foreground,
      fontSize: 15,
      fontWeight: '400',
    },
  })

  // expose this
  style.theme = t

  return style

})()
