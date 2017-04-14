import React, { Component } from 'react';
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

const later = (fn) => setTimeout(fn,0)

var dataSource = new ListView.DataSource({
  rowHasChanged: (r1, r2) => {
    return r1 != r2
  },
  sectionHeaderHasChanged: (s1, s2) => s1 != s2,
  getRowData: (state, sectionID, rowID) => {
    //const {read} = state
    //const hit = state[sectionID][rowID]
    return Object.assign({}) //, hit, {__read:read.lookup[hit.uri]})
  },
  getSectionHeaderData: (dataBlob, sectionID) => {}
})

export default connect((state, dispatch, props) => {

  // we pass state in as datasource, and specify the articles is
  // the key to our articles. sectionID will then be 'articles'
  dataSource = dataSource.cloneWithRowsAndSections(state, ['tokens'])

  // hackety hacks
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
        renderRow={(data) => {
          return (
            <TouchableHighlight onPress={() => {}}>
              {renderRow(data)}
            </TouchableHighlight>
          )
        }}
        renderSeparator={
          (sectionID, rowID) => (
            <View key={"sep" + rowID} style={[{height:1}]}/>
          )
        }
        enableEmptySections={true}
        renderHeader={() => {
          return (
            <View style={[{marginTop:22, flex:1, alignItems:'center'}]}>
              <Text style={[style.text]}>header</Text>
            </View>
          )
        }}
      />
    </View>
  )
})

const renderRow = (data) => {
  if (!data && !data.datetime) {
    return <View/>
  }
  return (
    <View>
      <Text>
        row
      </Text>
    </View>
  )
}
