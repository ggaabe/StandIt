import React, {Component} from 'react';
import {
  AppRegistry,
  AsyncStorage,
  StyleSheet,
  ScrollView,
  Text,
  View,
  Switch,
  TextInput,
} from 'react-native';

import {
  Cell,
  CustomCell,
  Section,
  TableView
} from 'react-native-tableview-simple';

const styles = StyleSheet.create({
  container: {
    flex: 1,
      backgroundColor: 'rgb(24,24,26)',
    },
  firstSection: {
    borderTopColor: 'red',
    borderTopWidth: 30,
    borderStyle: 'solid',
  },
  settingInput: {
    marginTop: 5,
    marginLeft: 20,
    flexDirection: 'row',
  },
  inputRow: {
    marginTop: 5,
    color: 'white',
    fontSize: 20
  },
  inputRowRight: {
    marginTop: 5,
    color: 'white',
    fontSize: 20,
    marginLeft: 10,
  }
  }
);

  const STORAGE_KEY = "settingsKey";
  const HEIGHT_KEY = "heightKey";
  const WEIGHT_KEY = "weightKey";
  const AGE_KEY = "ageKey";
  const METRIC_KEY = "metricKey";
  const GOAL_KEY = "goalKey";
  var defaultSettings = JSON.stringify({height: 1.75, weight: 170, age: 25, metric: true});
  console.warn(AsyncStorage);

var settingsContext;

class Settings extends Component {

  constructor(props: Object): void {
       super(props);
       this.state = {
         height: '',
         weight: '',
         age: '',
         metric: false,
       };
       settingsContext = this;
   }

   componentDidMount() {
         // AsyncStorage.getItem("height").then((value) => {
         //     this.setState({"height": value});
         // }).done();
         this._loadInitialState().done();
     }

   async _loadInitialState() {
     try {
       AsyncStorage.getItem(HEIGHT_KEY).then((value) => {
         if (value !== null){
           this.setState({height: value});
       }else{
         this.setState({height: 1.75})
         AsyncStorage.setItem(HEIGHT_KEY, "1.75");
       }
       });
       AsyncStorage.getItem(WEIGHT_KEY).then((value) => {
         if (value !== null){
           this.setState({weight: value});
       }else{
         this.setState({weight: 170})
         AsyncStorage.setItem(WEIGHT_KEY, "170");
       }
       });
       AsyncStorage.getItem(AGE_KEY).then((value) => {
         if (value !== null){
           this.setState({age: value});
       }else{
         this.setState({age: 25})
         AsyncStorage.setItem(AGE_KEY, "25");
       }
       });
       AsyncStorage.getItem(METRIC_KEY).then((value) => {
         if (value !== null){
           this.setState({metric: JSON.parse(value)});
       }else{
         this.setState({metric: false})
         AsyncStorage.setItem(METRIC_KEY, JSON.stringify(false));
       }
       });
      //  AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      //  if (value !== null){
      //    //this.setState({selectedValue: value});
      //    value = JSON.parse(value);
      //    for (var property in value){
      //      console.warn(property);
      //    }
      //    console.warn(value);
      //    // this._appendMessage('Recovered selection from disk: ' + value);
      //    // console.warn("HEIGHT: " + value.height);
      //    var heightState = value.height + " m";
      //    this.setState({weight: value.weight,
      //      age: value.age,
      //      metric: value.metric,
      //    });
      //
      //  } else {
      //    var defaultHeight = "175";
      //    //AsyncStorage.setItem(HEIGHT_KEY, defaultHeight);
      //    AsyncStorage.setItem(STORAGE_KEY, defaultSettings);
      //    this.setState({height: 1.75, weight: 170, age: 25, metric: true});
      //    this._appendMessage('Initialized with no selection on disk.');
      //  }
      // }
      // );
     } catch (error) {
       this._appendMessage('AsyncStorage error: ' + error.message);
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


   round(value, precision) {
       var multiplier = Math.pow(10, precision || 0);
       return Math.round(value * multiplier) / multiplier;
   }

  navHeight(){
    this.props.navigator.push({
        title: 'Height',
        component: Height,

        rightButtonTitle: 'Save',
        passProps: {
          height: this.state.height,
          metric: this.state.metric,
        },
        onRightButtonPress: () => {
          for (var property in this.state){
            console.warn(property);
          }
          this.setState({height: cachedHeight});
          this.setStorage(HEIGHT_KEY, cachedHeight);
          this.props.navigator.pop()}
    })
  }

  navWeight(){
    this.props.navigator.push({
        title: 'Weight',
        component: Weight,
        rightButtonTitle: 'Save',
        onRightButtonPress: () => {
          this.setState({height: cachedWeight});
          this.setStorage(WEIGHT_KEY, cachedWeight);
          this.props.navigator.pop()}
    })
  }

  navAge(){
    this.props.navigator.push({
        title: 'Age',
        component: Age,
        rightButtonTitle: 'Save',
        onRightButtonPress: () => {
          console.warn("hey whats up hello");
          this.props.navigator.pop()}
    })
  }

  updateUnits(value, context){
    console.warn("HEYYYYY")
    context.setState({metric: value});
    context.setStorage(METRIC_KEY, JSON.stringify(value));
  }

  navUnits(){
    this.props.navigator.push({
        title: 'Units',
        component: Units,
        rightButtonTitle: 'Save',
        onRightButtonPress: () => {
          this.setState({metric: cachedUnit});
          this.setStorage(METRIC_KEY, JSON.stringify(cachedUnit));
          this.props.navigator.pop()},
        passProps: {
          updateUnits: this.updateUnits,
          context: settingsContext,
          metric: this.state.metric,
        }
    })
  }

  navSetting(title, storageKey, cachedVariable){
    this.props.navigator.push({
        title: title,
        component: Height,

        rightButtonTitle: 'Save',
        passProps: {
          height: this.state.height,
          weight: this.state.weight,
          metric: this.state.metric,
        },
        onRightButtonPress: () => {
          for (var property in this.state){
            console.warn(property);
          }
          this.setState({title: cachedHeight});
          this.setStorage(HEIGHT_KEY, cachedHeight);
          this.props.navigator.pop()}
    })
  }

  _appendMessage(message) {
    console.warn(message);
  }

  render() {
    var unitType;
    var unitTypeDistance;
    var unitTypeWeight;
    if(this.state.metric){
      unitType = "Metric";
      unitTypeDistance = " m";
      unitTypeWeight = " kg";
    }else{
      unitType = "Imperial";
      unitTypeDistance = " ft";
      unitTypeWeight = "lbs";
    }
    return (
<ScrollView style={styles.container}>
    <TableView>

      <Section sectionTintColor="rgb(22,24,31)" separatorTintColor="rgb(29,28,29)" style={styles.firstSection}>
        <Cell cellstyle="RightDetail" accessory="DisclosureIndicator" title="Height" detail={`${this.state.height} ${unitTypeDistance}`} onPress={this.navHeight.bind(this)} titleTextColor="white" cellTextColor="rgb(20,19,19)"/>
        <Cell cellstyle="RightDetail" accessory="DisclosureIndicator" title="Weight" detail={this.state.weight} onPress={this.navWeight.bind(this)} titleTextColor="white" cellTextColor="rgb(20,19,19)"/>
        <Cell cellstyle="RightDetail" accessory="DisclosureIndicator" title="Age" detail={this.state.age} onPress={this.navAge.bind(this)} titleTextColor="white" cellTextColor="rgb(20,19,19)"/>
        <Cell cellstyle="RightDetail" accessory="DisclosureIndicator" title="Units" detail={`${unitType}`} onPress={this.navUnits.bind(this)} titleTextColor="white" cellTextColor="rgb(20,19,19)"/>
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

var cachedHeight;
var cachedInches;
var cachedFeet;
class Height extends Component{

  //insert logic here to render a view based on whether the metric setting is metric or imperial.
  render(){
    cachedHeight = this.props.height;
    if(this.props.metric){
    return(
      <ScrollView style={styles.container}>
        <View style={styles.settingInput}>
        <Text style={styles.inputRow}>Height: </Text>
          <TextInput ref="heightInput" autoFocus={true} placeholder={`${this.props.height}`} placeholderTextColor='white' keyboardType='decimal-pad' keyboardAppearance='dark' maxLength={4}
            style={{height: 40, width: 200, color: 'white', borderColor: 'gray', borderWidth: 1, textAlign: 'right',}}
         onChangeText={function(text){
           cachedHeight = text;
         }
         }/>
  <Text style={styles.inputRowRight}> m</Text>
      </View>
</ScrollView>
    );
  }
  else{
    return(
      <ScrollView style={styles.container}>
        <View style={styles.settingInput}>
        <Text style={styles.inputRow}>Height: </Text>
        <TextInput keyboardType='decimal-pad' autoFocus={true} keyboardAppearance='dark' placeholder={`${this.props.height}`} placeholderTextColor='white' maxLength='4' style={{height: 40, width: 40, color: 'white', borderColor: 'gray', borderWidth: 1}}
    onChangeText={function(text){
      //create two inputs.
      cachedHeight = text;
    }
  }/>
    <Text style={styles.inputRow}>lbs</Text>
    </View>
    </ScrollView>
    );
  }
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

var cachedUnit;
class Units extends Component{

  constructor(props: Object): void {
       super(props);
       this.state = {
         metric: this.props.metric,
       };
       cachedUnit = this.props.metric;
    }

  render(){
    //this.props.updateUnits(false, this.props.context);
    console.warn(this.props.metric);
    return(
      <ScrollView style={styles.container}>
        <Text>Distance Units</Text>
          <Switch
            style={{marginBottom: 10}}
            onValueChange={
              function(value){
                cachedUnit = value;
                console.warn(value);
                this.setState({metric: value});
              }.bind(this)
            }
            value={this.state.metric} />
        </ScrollView>
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
