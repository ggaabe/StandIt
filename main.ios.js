import React, {Component} from 'react';
import {
  AsyncStorage,
  Picker,
  StyleSheet,
View,
Text,
  Image,
  Dimensions,
  TouchableHighlight,
  NativeAppEventEmitter,
} from 'react-native';
'use strict';

var BleManager = require('./BleManager');
var Buffer = require('buffer/').Buffer;

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

 const peripheralId = "85329480-7A7F-32BF-91A2-FFAF31510A96";
 const uartServiceUUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
 const txCharacteristicUUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
 const rxCharacteristicUUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";
 //TruConnect
// #define SERVICE_TRUCONNECT_UUID                        @"175f8f23-a570-49bd-9627-815a6a27de2a"
// #define CHARACTERISTIC_TRUCONNECT_PERIPHERAL_RX_UUID   @"1cce1ea8-bd34-4813-a00a-c76e028fadcb"
// #define CHARACTERISTIC_TRUCONNECT_PERIPHERAL_TX_UUID   @"cacc07ff-ffff-4c48-8fae-a9ef71b75e26"
// #define CHARACTERISTIC_TRUCONNECT_MODE_UUID            @"20b9794f-da1a-4d14-8014-a0fb9cefb2f7"

const STANDING_HEIGHT_KEY = "standingHeightKey";
const SITTING_HEIGHT_KEY = "sittingHeightKey";

class Main extends Component {

  constructor(props: Object): void {
       super(props);
       this.state = {
         standingHeight: '',
         sittingHeight: '',
       };
   }

  componentWillMount() {
        // AsyncStorage.getItem("height").then((value) => {
        //     this.setState({"height": value});
        // }).done();
        this._loadInitialState().done();
        BleManager.scan([uartServiceUUID], 5)
      .then(() => {
        // Success code
        console.log('Scan started');
      });
        NativeAppEventEmitter.addListener(
            'BleManagerDiscoverPeripheral',
            (args) => {
                // The id: args.id
                // The name: args.name
                BleManager.connect(peripheralId).then(() => {
                // Success code
                console.log('Connected');
                var data = Buffer("Good lord").toString('base64');
                //ask SO question: Why doesn't react-native support WindowBase64 .btoa methods?
                BleManager.write(peripheralId, uartServiceUUID, txCharacteristicUUID, data).then(() => {
                  console.log("holy fuck.");
                });

              }).catch((error) => {
                // Failure code
                console.log('Didn\'t Connect');
                console.log(error);
              });
            }
        );
    }

  async _loadInitialState() {
    try {
      AsyncStorage.getItem(STANDING_HEIGHT_KEY).then((value) => {
        if (value !== null){
          var splitStanding = value.split(".");
          this.setState({
            standingHeight: value,
            pickerValue: splitStanding[0],
            pickerValueDecimal: splitStanding[1],
          });

      }else{
        var defaultStandingHeight = "30.0".split(".");
        this.setState({
          standingHeight: "30.0",
          pickerValue: defaultStandingHeight[0],
          pickerValueDecimal: defaultStandingHeight[1]
        });

        AsyncStorage.setItem(STANDING_HEIGHT_KEY, "30.0");
      }
      });
      AsyncStorage.getItem(SITTING_HEIGHT_KEY).then((value) => {
        if (value !== null){
          this.setState({sittingHeight: value});
      }else{
        this.setState({sittingHeight: "30.0"})
        AsyncStorage.setItem(SITTING_HEIGHT_KEY, "30.0");
      }
      });
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  }

  async setStorage(key, settings) {
    try {
      await AsyncStorage.setItem(key, settings);
     }
     catch (error) {
      this._appendMessage('AsyncStorage error: ' + error.message);
    }
  }

  convertToCentimeters(inches){
    return inches * 2.54;
  }

  round(value, precision) {
      var multiplier = Math.pow(10, precision || 0);
      return Math.round(value * multiplier) / multiplier;
  }

    render() {
	return (

	  <View style={styles.container}>
      <TouchableHighlight underlayColor="white" onPress={function() {
          console.log("hoo");
          try{
            var settings = "H" + (this.round(this.convertToCentimeters([this.state.pickerValue, this.state.pickerValueDecimal].join(".")), 2).toString());
            var data = Buffer(settings).toString('base64');
          BleManager.write(peripheralId, uartServiceUUID, txCharacteristicUUID, data).then(() => {
            console.log("holy fuck.");
          })} catch(error){
            console.log(error)
          }

        }.bind(this)}
        delayLongPress={2500}
        onLongPress={function() {
          console.log("hiiii");
          var settings = [this.state.pickerValue, this.state.pickerValueDecimal].join(".");
          this.setStorage(STANDING_HEIGHT_KEY, settings);
        }.bind(this)}>
        <Image
        resizeMode='cover'
        style={[styles.standitButton, standingButton()]}
        source={require('./standing.png')}
      />
    </TouchableHighlight>
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
        <TouchableHighlight underlayColor="white" onPress={function() {
            console.log("hoo");
            var settings = "H" + (this.round(this.convertToCentimeters([this.state.pickerValue, this.state.pickerValueDecimal].join(".")), 2).toString());
            var data = Buffer(settings).toString('base64');
            try{
            BleManager.write(peripheralId, uartServiceUUID, txCharacteristicUUID, data).then(() => {
              console.log("holy fuck.");
            });} catch(error){
              console.log(error)
            }
          }.bind(this)}
          delayLongPress={2500}
          onLongPress={function() {
            console.log("hiiii");
            var settings = [this.state.pickerValue, this.state.pickerValueDecimal].join(".");
            this.setStorage(SITTING_HEIGHT_KEY, settings);
          }.bind(this)}>
        <Image
        resizeMode='cover'
        style={[styles.standitButton, sittingButton()]}
        source={require('./sitting.png')}
      />
    </TouchableHighlight>
      </View>
		);
    }
}

module.exports = Main;
