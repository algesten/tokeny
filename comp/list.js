import React, {Component} from 'react';
import {
  TouchableOpacity,
  SwipeableListView,
  ListView,
  AlertIOS,
  Text,
  View,
} from 'react-native';
import {connect} from 'refnux'
import style from './style'
import ListRow from './list-row'
import ProgressBar from './progress-bar'
import Edit from './edit'

const later = (fn) => setTimeout(fn,0)
const muchlater = (() => {
  var t
  return (fn) => {
    clearTimeout(t)
    t = setTimeout(fn,500)
  }
})()

var dataSource = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
  sectionHeaderHasChanged: () => false,
})

const updateDataSource = (state) => {
  // we pass state in as datasource, and specify the tokens is
  // the key to our tokens. sectionID will then be 'tokens'
  dataSource = dataSource.cloneWithRowsAndSections(state, ['tokens'])
}

export default connect((state, dispatch, props) => {
  const {tokens, addresult, dummy} = state

  // always update on top-down redraw
  updateDataSource(state)

  // we need to navigator to be available as a state prop
  // since we use it from the app.js.
  if (state.navigator != props.navigator) {
    later(() => dispatch(() => {return {navigator:props.navigator}}))
  }

  // local ref
  var navigator = props.navigator || state.navigator

  // do we have a message from the latest addition?
  if (addresult) {
    // clear the message
    muchlater(() => {
      dispatch(() => {
        AlertIOS.alert('Add failed', addresult)
        return {addresult:''}
      })
    })
  }

  return (
    <View style={{flex:1}}>
      <ListView
        maxSwipeDistance={100}
        style={[{marginTop: 2, flex:1, backgroundColor:'#000'}]}
        dataSource={dataSource}
        renderRow={(token) => {
          return (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => navigator.push({
                component: Edit,
                title: 'Edit',
                passProps: {token},
                barTintColor: '#000',
                tintColor: style.theme.orange,
                titleTextColor: style.theme.orange,
                translucent: true,
                })
              }>
              <ListRow token={token}/>
            </TouchableOpacity>
          )
        }}
        // renderQuickActions={(token) => {
        //   return (
        //     <View style={{flex:1,
        //                   flexDirection:'row',
        //           justifyContent:'flex-end'}}>
        //       <TouchableOpacity
        //         onPress={() => {
        //           dataSource.setOpenRowID(null) // close the open row
        //         }}
        //         style={{
        //           width:100, alignItems:'center',
        //           justifyContent:'center', backgroundColor:'#dd3500'
        //         }}>
        //         <Text style={[style.text]}>Delete</Text>
        //       </TouchableOpacity>
        //     </View>
        //   )
        // }}
        renderSeparator={
          (sectionID, rowID) => (
            <View key={"sep" + rowID} style={[{height:2, backgroundColor:'#333'}]}/>
          )
        }
        enableEmptySections={true}
      />
      <ProgressBar/>
    </View>
  )
})
