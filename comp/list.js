import React, {Component} from 'react';
import {
  SwipeableListView,
  ListView,
  AlertIOS,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import {connect} from 'refnux'
import style from './style'
import ListRow from './list-row'
import ProgressBar from './progress-bar'
import deleteToken from '../action/delete-token'

const later = (fn) => setTimeout(fn,0)

var dataSource = SwipeableListView.getNewDataSource()

const updateDataSource = (state) => {
  // we pass state in as datasource, and specify the tokens is
  // the key to our tokens. sectionID will then be 'tokens'
  dataSource = dataSource.cloneWithRowsAndSections(state, ['tokens'])
}

// hack to be able to force a redraw
var listref

export default connect((state, dispatch, props) => {
  const {tokens} = state

  // always update on top-down redraw
  updateDataSource(state)

  // we need to navigator to be available as a state prop
  // since we use it from the app.js.
  if (state.navigator != props.navigator) {
    later(() => {
      dispatch(() => {return {navigator:props.navigator}})
    })
  }

  return (
    <View style={{flex:1}}>
      <SwipeableListView
        maxSwipeDistance={100}
        style={[{flex:1, backgroundColor:'#000'}]}
        dataSource={dataSource}
        renderRow={(token) => {
          return (
            <ListRow token={token}/>
          )
        }}
       ref={(_listref)=>{listref=_listref}}
        renderQuickActions={(token) => {
          return (
            <View style={{flex:1,
                          flexDirection:'row',
                  justifyContent:'flex-end'}}>
              <TouchableOpacity
                onPress={() => {
                  dataSource.setOpenRowID(null) // close the open row
                  const redraw = () => {
                    // hack to force reload the listview
                    later(() => dispatch((state) => {
                      updateDataSource(state)
                      listref.setState({dataSource})
                      return {}
                    }))
                  }
                  AlertIOS.alert(
                    'Are you sure?!',
                    'This will NOT turn off two-factor authentication with you provider.',
                    [
                      {text: 'Cancel', onPress: redraw, style: 'cancel'},
                      {text: 'Delete', onPress: () => {
                        dispatch(deleteToken(token))
                        redraw()
                      }},
                    ]
                  )
                }}
                style={{
                  width:100, alignItems:'center',
                  justifyContent:'center', backgroundColor:'#dd3500'
                }}>
                <Text style={[style.text]}>Delete</Text>
              </TouchableOpacity>
            </View>
          )
        }}
        renderSeparator={
          (sectionID, rowID) => (
            <View key={"sep" + rowID} style={[{height:1, backgroundColor:'#222'}]}/>
          )
        }
        enableEmptySections={true}
      />
      <ProgressBar/>
    </View>
  )
})
