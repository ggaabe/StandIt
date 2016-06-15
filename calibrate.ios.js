import React, {Component} from 'react';
import {
  View,
  ScrollView,
  Text,
} from 'react-native';

var DeviceMotion = require('./DeviceMotion.ios');

class Calibrate extends Component {

  componentDidMount () {
    DeviceMotion.startDeviceMotionUpdates(1000/60, (data) => {
      this.setState({
        motionData: data,
      });
    });
  }

  render(){
    return(
      <ScrollView>
        <Text>Place your phone on the floor.</Text>
      </ScrollView>
    );
  }
}

module.exports = Calibrate
