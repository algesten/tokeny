import {
  StyleSheet,
} from 'react-native';

const THEME = {

  dark: {
    background: "#000000",
    foreground: "#ffffff",
    gray:       "#414141",
    yellow:     "#ffd600",
    orange:     "#ff5900",
  }

}

// ffd500 bright yellow
// ff5700 orange

export default (() => {

  const t = THEME.dark

  var style = StyleSheet.create({
    view: {
      backgroundColor: t.background,
    },
    text: {
      color: t.foreground,
      fontSize: 18,
    },
    listText: {
      color: t.foreground,
      fontSize: 18,
      fontWeight: '400',
    },
  })

  // expose this
  style.theme = t

  return style

})()
