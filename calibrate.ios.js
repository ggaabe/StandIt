import React, {Component} from 'react';
import {
  View,
  ScrollView,
  Text,
  NativeAppEventEmitter,
} from 'react-native';

'use-strict';

var DeviceMotion = require('./DeviceMotion.ios');
var BleManager = require('./BleManager')
var noble = require('react-native-ble');
var Buffer = require('buffer/').Buffer;
console.log(Buffer);

const peripheralId = "85329480-7A7F-32BF-91A2-FFAF31510A96";
const uartServiceUUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
const txCharacteristicUUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
const rxCharacteristicUUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

var peripheralsArray = [];
var servicesArray = [];
var characteristicsArray = [];

var txCharacteristic;
var txFound = false;

class Calibrate extends Component {

  constructor(props: Object): void {
       super(props);
       this.state = {
         motionData: '',
       };
   }

  componentWillMount () {
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

  //   try{
  //     noble.startScanning([uartServiceUUID], true);
  // }catch(error){
  //   console.log("bluetooth not on");
  // }
  //   noble.on('stateChange', function(state) {
  // if (state === 'poweredOn') {
  //   console.log("Scanning");
  //   noble.startScanning([uartServiceUUID], true);
  // } else {
  //   console.log("NOT SCANNING");
  //   noble.stopScanning();
  // }
//});

// noble.on('discover', function(peripheral) {
//   if (peripheral.id === "1675F086-42C0-BDB1-8022-C25E451446AC" || peripheral.advertisement.localName === "Adafruit Bluefruit LE") {
//     noble.stopScanning();
//     console.log('peripheral with ID ' + peripheral.id + ' found');
//     var advertisement = peripheral.advertisement;
//
//     var localName = advertisement.localName;
//     var txPowerLevel = advertisement.txPowerLevel;
//     var manufacturerData = advertisement.manufacturerData;
//     var serviceData = advertisement.serviceData;
//     var serviceUuids = advertisement.serviceUuids;
//
//     if (localName) {
//       console.log('  Local Name        = ' + localName);
//     }
//
//     if (txPowerLevel) {
//       console.log('  TX Power Level    = ' + txPowerLevel);
//     }
//
//     if (manufacturerData) {
//       console.log('  Manufacturer Data = ');
//     }
//
//     if (serviceData) {
//       console.log('  Service Data      = ' + serviceData);
//     }
//
//     if (serviceUuids) {
//       console.log('  Service UUIDs     = ' + serviceUuids);
//     }
//
//     peripheral.connect(function(error) {
//         console.log("connected to peripheral!")
//         peripheral.discoverServices([uartServiceUUID], function(error, services) {
//           var serviceIndex = 0;
//           console.log("found service! " + services[0]);
//           services[0].discoverCharacteristics([txCharacteristicUUID], function(error, characteristics) {
//               var characteristicIndex = 0;
//               console.log("found characteristic");
//               txCharacteristic = characteristics[0];
//               txFound = true;
//             });
//
//           services[0].once('characteristicsDiscover', function(characteristics){
//             //console.log(characteristics[0]);
//           });
//         });
//       });
//
//       peripheral.discoverAllServicesAndCharacteristics(function(error, services, characteristics){
//         console.log("CHARACTERISTICS!");
//         //console.log(characteristics[0]);
//       });
// }
// //explore(peripheral);
// //}
// });
    DeviceMotion.startDeviceMotionUpdates(1000/100, (data) => {
      //console.log(data.attitude);
      this.setState({
        motionData: data.attitude,
      });
      if(txFound){
        console.log('write');
        var temperature = new Buffer(2);
        temperature.writeUInt16BE(450, 0);
        txCharacteristic.write(temperature, false,function(error){
          console.log(error);
        });
      }
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
