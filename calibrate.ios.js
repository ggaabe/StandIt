import React, {Component} from 'react';
import {
  View,
  ScrollView,
  Text,
} from 'react-native';

'use-strict';

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
    noble.startScanning();
    noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    console.log("Scanning");
    noble.startScanning();
  } else {
    console.log("NOT SCANNING");
    noble.stopScanning();
  }
});

noble.on('discover', function(peripheral) {
if (peripheral.id === "1675F086-42C0-BDB1-8022-C25E451446AC" || peripheral.advertisement.localName === "Adafruit Bluefruit LE") {
noble.stopScanning();

console.log('peripheral with ID ' + peripheral.id + ' found');
var advertisement = peripheral.advertisement;

var localName = advertisement.localName;
var txPowerLevel = advertisement.txPowerLevel;
var manufacturerData = advertisement.manufacturerData;
var serviceData = advertisement.serviceData;
var serviceUuids = advertisement.serviceUuids;

if (localName) {
  console.log('  Local Name        = ' + localName);
}

if (txPowerLevel) {
  console.log('  TX Power Level    = ' + txPowerLevel);
}

if (manufacturerData) {
  console.log('  Manufacturer Data = ' + manufacturerData.toString('hex'));
}

if (serviceData) {
  console.log('  Service Data      = ' + serviceData);
}

if (serviceUuids) {
  console.log('  Service UUIDs     = ' + serviceUuids);
}

console.log();

peripheral.connect(function(error) {
    peripheral.discoverServices([], function(error, services) {
      var serviceIndex = 0;

      // async.whilst(
      //   function () {
      //     return (serviceIndex < services.length);
      //   },
      //   function(callback) {
      //     var service = services[serviceIndex];
      //     var serviceInfo = service.uuid;
      //
      //     if (service.name) {
      //       serviceInfo += ' (' + service.name + ')';
      //     }
      //     console.log(serviceInfo);
      //
      //     service.discoverCharacteristics([], function(error, characteristics) {
      //       var characteristicIndex = 0;
      //
      //     });
      //   },
      //   function (err) {
      //     peripheral.disconnect();
      //   }
      // );
    });
  });
}
//explore(peripheral);
//}
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
