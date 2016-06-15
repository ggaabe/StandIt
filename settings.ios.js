import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  ScrollView,
  Text,
  View,
  NavigatorIOS,
} from 'react-native';

import {
  Cell,
  CustomCell,
  Section,
  TableView
} from 'react-native-tableview-simple';

'use strict';

var SettingViews = require('./settingViews.ios');
var Settings = SettingViews.Settings;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  }
});

class SettingsNavigator extends Component{
render(){
  return(
  <NavigatorIOS
      initialRoute={{
        component: Settings,
        title: 'Settings',
        passProps: { myProp: 'foo' },
      }}
      style={styles.container}
      barTintColor="black"
      titleTextColor="white"
    />
    );
  }
}
module.exports = SettingsNavigator
