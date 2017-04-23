import {
  StyleSheet,
} from 'react-native';

const THEME = {

  dark: {
    background: "#000000",
    foreground: "#ffffff",
    gray:       "#414141",
    watchgray:  "#222223",
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
      color: '#aaaaaa',
      fontSize: 18,
    },
    label: {
      color: t.foreground,
      fontSize: 18,
    },
    value: {
      color: t.yellow,
      fontSize: 18,
    },
    listText: {
      color: t.foreground,
      fontSize: 18,
      fontWeight: '400',
    },
    codeText: {
      color: t.foreground,
      fontSize: 60,
      fontWeight: '200',
    },
    textInput: {
      height: 60,
      borderRadius: 5,
      fontSize: 20,
      backgroundColor: t.watchgray,
      paddingLeft: 10,
      paddingRight: 10,
    },
  })

  // expose this
  style.theme = t

  return style

})()
