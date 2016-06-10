import React, {Component} from 'react';
import {
  AppRegistry,
  AsyncStorage,
  StyleSheet,
  ScrollView,
  Text,
  View,
} from 'react-native';

import {
  Cell,
  CustomCell,
  Section,
  TableView
} from 'react-native-tableview-simple';

const styles = StyleSheet.create({
  container: {
      backgroundColor: 'rgb(24,24,26)',
    },
  firstSection: {
    borderTopColor: 'red',
    borderTopWidth: 30,
    borderStyle: 'solid',
  },

  }
);

  const STORAGE_KEY = "settingsKey";
  const HEIGHT_KEY = "heightKey";
  var defaultSettings = JSON.stringify({"height": 1.75, "weight": 170, "age": 25, units: ["meters", "pounds"], "goal": 50});

  console.warn(AsyncStorage);

class Settings extends Component {

  constructor(props: Object): void {
       super(props);
       this.state = {
         height: '',
         weight: '',
         age: '',
       };
   }

  navHeight(){
    this.props.navigator.push({
        title: 'Height',
        component: Height,
        rightButtonTitle: 'Done',
        onRightButtonPress: () => {
          console.warn("hey whats up hello");
          this.props.navigator.pop()}
    })
  }

  navWeight(){
    this.props.navigator.push({
        title: 'Weight',
        component: Weight,
        rightButtonTitle: 'Done',
        onRightButtonPress: () => {
          console.warn("hey whats up hello");
          this.props.navigator.pop()}
    })
  }

  navAge(){
    this.props.navigator.push({
        title: 'Age',
        component: Age,
        rightButtonTitle: 'Done',
        onRightButtonPress: () => {
          console.warn("hey whats up hello");
          this.props.navigator.pop()}
    })
  }

  navUnits(){
    this.props.navigator.push({
        title: 'Units',
        component: Units,
        rightButtonTitle: 'Done',
        onRightButtonPress: () => {
          console.warn("hey whats up hello");
          this.props.navigator.pop()}
    })
  }

  componentDidMount() {
        // AsyncStorage.getItem("height").then((value) => {
        //     this.setState({"height": value});
        // }).done();
        this._loadInitialState().done();
    }

  saveData(value) {
        AsyncStorage.setItem("myKey", value);
        this.setState({"myKey": value});
  }

  async _loadInitialState() {
    try {
      AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (value !== null){
        //this.setState({selectedValue: value});
        value = JSON.parse(value);
        this._appendMessage('Recovered selection from disk: ' + value);
        console.warn("HEIGHT: " + value.height);

        this.setState({height: value.height});
        // for (var property in this.state){
        //   console.warn(this.state.height);
        // }
      } else {
        var defaultHeight = "175";
        AsyncStorage.setItem(HEIGHT_KEY, defaultHeight);
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSettings));
        this._appendMessage('Initialized with no selection on disk.');
      }
     }
     );
    } catch (error) {
      this._appendMessage('AsyncStorage error: ' + error.message);
    }
  }

  _appendMessage(message) {
    console.warn(message);
  }

  render() {
    return (
<ScrollView style={styles.container}>
    <TableView>
      <Section sectionTintColor="rgb(22,24,31)" separatorTintColor="rgb(29,28,29)" style={styles.firstSection}>
        <Cell cellstyle="RightDetail" accessory="DisclosureIndicator" title="Height" detail={this.state.height} onPress={this.navHeight.bind(this)} titleTextColor="white" cellTextColor="rgb(20,19,19)"/>
        <Cell cellstyle="RightDetail" accessory="DisclosureIndicator" title="Weight" detail="170 lbs" onPress={this.navWeight.bind(this)} titleTextColor="white" cellTextColor="rgb(20,19,19)"/>
        <Cell cellstyle="RightDetail" accessory="DisclosureIndicator" title="Age" detail="25 yrs" onPress={this.navAge.bind(this)} titleTextColor="white" cellTextColor="rgb(20,19,19)"/>
        <Cell cellstyle="RightDetail" accessory="DisclosureIndicator" title="Units" detail="Meters, Pounds" onPress={this.navUnits.bind(this)} titleTextColor="white" cellTextColor="rgb(20,19,19)"/>
    </Section>
      <Section sectionTintColor="rgb(22,24,31)" separatorTintColor="rgb(29,28,29)">
        <Cell title="Suggested standup height:" accessoryColor="white" cellstyle="RightDetail" titleTextColor="#007AFF" detail="120 cm" onPress={() => console.log('open Help/FAQ')} titleTextColor="white" cellTextColor="rgb(20,19,19)"/>
        <Cell title="Suggested sitting height:" cellstyle="RightDetail" titleTextColor="#007AFF" detail="69 cm" onPress={() => console.log('open Contact Us')} titleTextColor="white" cellTextColor="rgb(20,19,19)"/>
      </Section>
    </TableView>
</ScrollView>
    );
  }
}

class Height extends Component{
  render(){
    return(
      <View>
        <Text>Height</Text>
      </View>
    );
  }
}

class Weight extends Component{
  render(){
    return(
      <View>
        <Text>Weight</Text>
      </View>
    );
  }
}

class Age extends Component{
  render(){
    return(
      <View>
        <Text>Age</Text>
      </View>
    );
  }
}

class Units extends Component{
  render(){
    return(
      <View>
        <Text>Distance Units</Text>
        <Text>Weight Units</Text>
      </View>
    );
  }
}


module.exports = {
  Settings: Settings,
  Height: Height,
  Weight: Weight,
  Age: Age,
  Units: Units,
}
