import React from 'react';
import {
  ListView,
  Text,
  View,
  ProgressViewIOS,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import {connect} from 'refnux'
import style from './style'
import ListRow from './list-row'

const later = (fn) => setTimeout(fn,0)

var dataSource = new ListView.DataSource({
  rowHasChanged: (r1, r2) => {
    return r1 != r2
  },
  sectionHeaderHasChanged: (s1, s2) => s1 != s2,
  getRowData: (state, sectionID, rowID) => {
    return state[sectionID][rowID]
  },
  getSectionHeaderData: (dataBlob, sectionID) => {}
})

export default connect((state, dispatch, props) => {

  // we pass state in as datasource, and specify the articles is
  // the key to our articles. sectionID will then be 'articles'
  dataSource = dataSource.cloneWithRowsAndSections(state, ['tokens'])

  // we need to navigator to be available as a state prop
  // since we use it from the app.js.
  if (state.navigator != props.navigator) {
    later(() => {
      dispatch(() => {return {navigator:props.navigator}})
    })
  }

  return (
    <View style={{flex:1}}>
      <ListView
        key="list"
        style={[{flex:1, backgroundColor:'#000'}]}
        dataSource={dataSource}
        renderRow={(token) => {
          return (
            <ListRow token={token}/>
          )
        }}
        renderSeparator={
          (sectionID, rowID) => (
            <View key={"sep" + rowID} style={[{height:1, backgroundColor:'#222'}]}/>
          )
        }
        enableEmptySections={true}
      />
    </View>
  )
})
