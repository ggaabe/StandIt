import React, {Component} from 'react';
import {
  Picker,
  StyleSheet,
View,
Text,
  Image,
  Dimensions,
} from 'react-native'
'use strict';

//var React = require('react-native');

var styles = StyleSheet.create({
	description: {
	    fontSize: 20,
	    textAlign: 'center',
	    color: '#DDDDDD'
	},
  inches: {
	    fontSize: 20,
	    textAlign: 'right',
	    color: '#DDDDDD',
        flex: 1,
	},
    header: {
      fontSize: 20,
      textAlign: 'center',
      color: 'rgb(191, 187, 187)',
    },
	container: {
	    flex: 1,
	    justifyContent: 'center',
	    alignItems: 'center',
	    backgroundColor: 'rgb(20,25,30)',
	},
    decimalPicker: {
      flexDirection: 'row',
       alignItems:'center',
    },
    standitButton: {
      width: 80,
      height: 80,
    },
    standingButton: {
      marginBottom: 20,
    },
    sittingButton: {
      marginTop: 20,
    },
    });

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
console.warn('HEIGHT: ' + deviceHeight);
var standingButton = function() {
  if(deviceHeight < 481){
   return {
     marginTop: 20,

   }
  }
  else{
    return{
      marginBottom: 20,
    }
  }
 }

var sittingButton = function() {
  if(deviceHeight < 481){
   return {
     marginBottom: 20,
   }
  }
  else{
    return{
      marginTop: 20,
    }
  }
 }


class Main extends Component {
    render() {
	return (

	  <View style={styles.container}>
        <Image
        resizeMode='cover'
        style={[styles.standitButton, standingButton()]}
        source={require('./standing.png')}
      />
        <View style={styles.decimalPicker}>
        <Picker
          style={{
            width: 70,
            flex: 1,
            marginLeft: 60,
          }}
          selectedValue={(this.state && this.state.pickerValue) || '30'}
          onValueChange={(value) => {
               this.setState({pickerValue: value});
          }} itemStyle={{color: 'white'}}>
          <Picker.Item label={'27'} value={'27'} />
          <Picker.Item label={'28'} value={'28'} />
          <Picker.Item label={'29'} value={'29'} />
          <Picker.Item label={'30'} value={'30'} />
          <Picker.Item label={'31'} value={'31'} />
          <Picker.Item label={'32'} value={'32'} />
          <Picker.Item label={'33'} value={'33'} />
          <Picker.Item label={'34'} value={'34'} />
          <Picker.Item label={'35'} value={'35'} />
          <Picker.Item label={'36'} value={'36'} />
          <Picker.Item label={'37'} value={'37'} />
          <Picker.Item label={'38'} value={'38'} />
          <Picker.Item label={'39'} value={'39'} />
          <Picker.Item label={'40'} value={'40'} />
          <Picker.Item label={'41'} value={'41'} />
        </Picker>
          <Text style={styles.description}>
        .
        </Text>
        <Picker
          style={{
            width: 70,
            flex: 1,
          }}
          selectedValue={(this.state && this.state.pickerValueDecimal) || '0'}
          onValueChange={(value) => {
             this.setState({pickerValueDecimal: value});
          }} itemStyle={{color: 'white'}}>
          <Picker.Item label={'5'} value={'5'} />
          <Picker.Item label={'4'} value={'4'} />
          <Picker.Item label={'3'} value={'3'} />
          <Picker.Item label={'2'} value={'2'} />
          <Picker.Item label={'1'} value={'1'} />
          <Picker.Item label={'0'} value={'0'} />
          <Picker.Item label={'9'} value={'9'} />
          <Picker.Item label={'8'} value={'8'} />
          <Picker.Item label={'7'} value={'7'} />
          <Picker.Item label={'6'} value={'6'} />
        </Picker>
        <Text style={styles.inches}>
        Inches
        </Text>
        </View>
        <Image
        resizeMode='cover'
        style={[styles.standitButton, sittingButton()]}
        source={require('./sitting.png')}
      />
      </View>
		);
    }
}

module.exports = Main;
