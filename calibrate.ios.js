import React, {Component} from 'react';
import {
  View,
  ScrollView,
  Text,
} from 'react-native';

var DeviceMotion = require('./DeviceMotion.ios');
//var BleManager = require('./BleManager')
var noble = require('react-native-ble');

const peripheralId = "85329480-7A7F-32BF-91A2-FFAF31510A96";
const uartServiceUUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const txCharacteristicUUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
const rxCharacteristicUUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

class Calibrate extends Component {

  constructor(props: Object): void {
       super(props);
       this.state = {
         motionData: '',
       };
   }

  componentWillMount () {
    noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    noble.startScanning();
  } else {
    noble.stopScanning();
  }
});
    DeviceMotion.startDeviceMotionUpdates(1000/100, (data) => {
      //console.log(data.attitude);
      this.setState({
        motionData: data.attitude,
      });
    });
  }

  render(){
    //BleManager.connect(peripheralId);
    return(
      <ScrollView>
        <Text>Pitch: {this.state.motionData.pitch}</Text>
        <Text>Yaw: {this.state.motionData.yaw}</Text>
      </ScrollView>
    );
  }
}

module.exports = Calibrate
