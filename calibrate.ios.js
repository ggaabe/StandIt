import React, {Component} from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  NativeAppEventEmitter,
} from 'react-native';
import Button from 'apsl-react-native-button';

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
var floorMode = true;
var cachedFloorCalibrationOffset;
//var cachedTableCalibration;

class Calibrate extends Component {

  constructor(props: Object): void {
       super(props);
       this.state = {
         motionData: '3',
         buttonLoading: false,
         buttonDisabled: false,
         instructions: "Place your phone on the floor, and then push the Calibrate button.",
         buttonText: "Calibrate Phone",
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

    DeviceMotion.startDeviceMotionUpdates(1000/100, (data) => {
      //console.log(data.attitude);
      this.setState({
        motionData: data.attitude,
      });
      if(txFound){
        //var writeData = Buffer("Good lord").toString('base64');
        var rollAdjusted = this.state.motionData.roll - cachedFloorCalibrationOffset.roll;
        var pitchAdjusted = this.state.motionData.pitch - cachedFloorCalibrationOffset.pitch;
        var rollAdjusted = this.round(rollAdjusted, 4);
        var pitchAdjusted = this.round(pitchAdjusted, 4);
        var writeString = "R" + rollAdjusted.toString() + "P" + pitchAdjusted.toString();
        var writeData = Buffer(writeString).toString('base64');
        //can probably run this until difference between state.pitch/roll and adjusted pitch/roll is less than 0.01
        //at which point we set the calibrate button's isLoading to false.
        BleManager.write(peripheralId, uartServiceUUID, txCharacteristicUUID, writeData).then(() => {
          console.log("write successful.");
        });
        //IMPLEMENT CONTROL LOGIC HERE TO READ FROM RXCHARACTERISTIC TO RECEIVE THE DONE MESSAGE.
      }
    });
  }

  round(value, precision) {
      var multiplier = Math.pow(10, precision || 0);
      return Math.round(value * multiplier) / multiplier;
  }

  render(){
    //BleManager.connect(peripheralId);
    return(
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.textStyle}>{this.state.instructions} {this.state.motionData.pitch}</Text>
          <Button style={styles.buttonStyle5} textStyle={{fontSize: 18}}
            isLoading={this.state.buttonLoading} isDisabled={this.state.buttonDisabled}
            onPress={function(){
            if(floorMode){
              this.setState({
                buttonLoading: true,
                buttonDisabled: true,
              });
              setTimeout(function(){
                cachedFloorCalibrationOffset = this.state.motionData;
                this.setState({
                  buttonDisabled: false,
                  buttonLoading: false,
                  instructions: "Now, place your phone on the table, and push the Calibrate button. Do not touch the phone until the table has stopped moving.",
                  buttonText: "Calibrate Table"
                });
                floorMode = false;
              }.bind(this), 3000)
            }else{
              this.setState({
                buttonLoading: true,
                buttonDisabled: true,
              });
              setTimeout(function(){
                this.setState({
                  // buttonDisabled: false,
                  // buttonLoading: false,
                  instructions: "Do not touch the phone until the table has stopped moving.",
                  buttonText: "Done!"
                });
                txFound = true;
              }.bind(this), 3000)
             }
            }.bind(this)

          }
            >
            {this.state.buttonText}
          </Button>

      </ScrollView>
    );
  }
}

module.exports = Calibrate

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    backgroundColor: 'rgb(24,24,26)',
    alignItems: 'center',

  },
  textStyle: {
    marginTop: 5,
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
  textStyle6: {
    color: '#8e44ad',
    fontFamily: 'Avenir',
    fontWeight: 'bold'
  },
  buttonStylePressing: {
    borderColor: 'red',
    backgroundColor: 'red'
  },
  buttonStyle: {
    borderColor: '#f39c12',
    backgroundColor: '#f1c40f'
  },
  buttonStyle1: {
    borderColor: '#d35400',
    backgroundColor: '#e98b39'
  },
  buttonStyle2: {
    borderColor: '#c0392b',
    backgroundColor: '#e74c3c'
  },
  buttonStyle3: {
    borderColor: '#16a085',
    backgroundColor: '#1abc9c'
  },
  buttonStyle4: {
    borderColor: '#27ae60',
    backgroundColor: '#2ecc71'
  },
  buttonStyle5: {
    borderColor: '#2980b9',
    backgroundColor: '#3498db',
    marginTop: 50,
    marginLeft: 50,
    marginRight: 50,
    borderRadius: 0,
  },
  buttonStyle6: {
    borderColor: '#8e44ad',
    backgroundColor: '#9b59b6'
  },
  buttonStyle7: {
    borderColor: '#8e44ad',
    backgroundColor: 'white',
    borderRadius: 0,
    borderWidth: 3,
  },
  buttonStyle8: {
    backgroundColor: 'white',
    borderColor: '#333',
    borderWidth: 2,
    borderRadius: 22,
  },
  textStyle8: {
    fontFamily: 'Avenir Next',
    fontWeight: '500',
    color: '#333',
  }
})

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
