import React, {Component} from 'react';
import {
  View,
  ScrollView,
  Text,
} from 'react-native';

var DeviceMotion = require('./DeviceMotion.ios');

class Calibrate extends Component {

  constructor(props: Object): void {
       super(props);
       this.state = {
         motionData: '',
       };
   }

  componentWillMount () {
    DeviceMotion.startDeviceMotionUpdates(1000/60, (data) => {
      console.log(data.attitude);
      this.setState({
        motionData: data.attitude,
      });
    });
  }

  render(){
    return(
      <ScrollView>
        <Text>Pitch: {this.state.motionData.pitch}</Text>
        <Text>Yaw: {this.state.motionData.yaw}</Text>
      </ScrollView>
    );
  }
}

module.exports = Calibrate
