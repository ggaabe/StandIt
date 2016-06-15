import React, {Component} from 'react';
import {
  AppRegistry,
  AsyncStorage,
  StyleSheet,
  ScrollView,
  Text,
  View,
  Switch,
  TouchableHighlight,
  Image,
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
  switchInput: {
    marginTop: 5,
    marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  calibrate: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  inputRow: {
    marginTop: 5,
    color: 'white',
    fontSize: 20
  },
  inputRowImperial: {
    marginTop: 5,
    color: 'rgb(41,116,231)',
    fontSize: 20
  },
  inputRowMetric: {
    marginTop: 5,
    color: 'rgb(0,163,46)',
    fontSize: 20
  },
  calibrateButton: {
    width: 80,
    height: 80,
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

var Calibrate = require('./calibrate.ios');

class Settings extends Component {

  constructor(props: Object): void {
       super(props);
       this.state = {
         height: '',
         weight: '',
         age: '',
         metric: false,
         suggestedStandingHeight: '',
         suggestedSittingHeight: '',
       };
   }

   componentWillMount() {
         // AsyncStorage.getItem("height").then((value) => {
         //     this.setState({"height": value});
         // }).done();
         this._loadInitialState().done();
     }

   async _loadInitialState() {
     try {
       AsyncStorage.getItem(HEIGHT_KEY).then((value) => {
         if (value !== null){
           this.setState({
             height: value,
             suggestedStandingHeight: this.suggestedStandingHeight(value),
             suggestedSittingHeight: this.suggestedSittingHeight(value)
           });

       }else{
         var defaultHeight = 1.75;
         this.setState({height: defaultHeight,
           suggestedStandingHeight: this.suggestedStandingHeight(defaultHeight),
           suggestedSittingHeight: this.suggestedSittingHeight(defaultHeight)})
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

   suggestedSittingHeight(userHeight){
       if(userHeight <= 1.7526){
           return 68.58;//27;
       }
       else {
           return Math.round(20.065 * userHeight - 47.13);
       }
   }

   suggestedStandingHeight(userHeight){
       if(userHeight >= 1.7526 /*5.75 feet*/){
           return 113.03;//41;
       }
       else {
           return Math.round(21.77 * userHeight - 16.76);
       }
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
          cachedHeight = this.round(cachedHeight, 2);
          this.setState({height: cachedHeight,
            suggestedStandingHeight: this.suggestedStandingHeight(cachedHeight),
            suggestedSittingHeight: this.suggestedSittingHeight(cachedHeight)
          });
          this.setStorage(HEIGHT_KEY, cachedHeight.toString());
          this.props.navigator.pop()}
    })
  }

  navWeight(){
    this.props.navigator.push({
        title: 'Weight',
        component: Weight,
        rightButtonTitle: 'Save',
        passProps: {
          weight: this.state.weight,
          metric: this.state.metric,
        },
        onRightButtonPress: () => {
          this.setState({weight: cachedWeight});
          this.setStorage(WEIGHT_KEY, cachedWeight.toString());
          this.props.navigator.pop()}
    })
  }

  navAge(){
    this.props.navigator.push({
        title: 'Age',
        component: Age,
        rightButtonTitle: 'Save',
        onRightButtonPress: () => {
          this.setState({age: cachedAge});
          this.setStorage(AGE_KEY, cachedAge.toString());
          this.props.navigator.pop()},
        passProps: {
          age: this.state.age,
        }
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
          this.setState({title: cachedHeight});
          this.setStorage(HEIGHT_KEY, cachedHeight);
          this.props.navigator.pop()}
    })
  }

  navCalibrate(){
    this.props.navigator.push({
        title: 'Calibrate',
        component: Calibrate,
        rightButtonTitle: '',
        passProps: {
        }
    })
  }

  _appendMessage(message) {
    console.warn(message);
  }

  render() {
    var unitType;
    var unitTypeDistance;
    var unitTypeWeight;
    var unitTypeSuggestion;
    if(this.state.metric){
      unitType = "Metric";
      unitTypeDistance = " m";
      unitTypeSuggestion = " cm"
      unitTypeWeight = " kg";
      cachedWeight = Math.round(this.state.weight);
      return (
  <ScrollView style={styles.container}>
      <TableView>

        <Section sectionTintColor="rgb(22,24,31)" separatorTintColor="rgb(29,28,29)" style={styles.firstSection}>
          <Cell cellstyle="RightDetail" accessory="DisclosureIndicator" title="Height" detail={`${this.state.height} ${unitTypeDistance}`} onPress={this.navHeight.bind(this)} titleTextColor="white" cellTextColor="rgb(20,19,19)"/>
          <Cell cellstyle="RightDetail" accessory="DisclosureIndicator" title="Weight" detail={`${cachedWeight} ${unitTypeWeight}`} onPress={this.navWeight.bind(this)} titleTextColor="white" cellTextColor="rgb(20,19,19)"/>
          <Cell cellstyle="RightDetail" accessory="DisclosureIndicator" title="Age" detail={this.state.age} onPress={this.navAge.bind(this)} titleTextColor="white" cellTextColor="rgb(20,19,19)"/>
          <Cell cellstyle="RightDetail" accessory="DisclosureIndicator" title="Units" detail={`${unitType}`} onPress={this.navUnits.bind(this)} titleTextColor="white" cellTextColor="rgb(20,19,19)"/>
      </Section>
        <Section sectionTintColor="rgb(22,24,31)" separatorTintColor="rgb(29,28,29)">
          <Cell title="Suggested standup height:" accessoryColor="white" cellstyle="RightDetail" titleTextColor="#007AFF" detail={`${this.state.suggestedStandingHeight} ${unitTypeSuggestion}`} onPress={() => console.log('open Help/FAQ')} titleTextColor="white" cellTextColor="rgb(20,19,19)"/>
          <Cell title="Suggested sitting height:" cellstyle="RightDetail" titleTextColor="#007AFF" detail={`${this.state.suggestedSittingHeight} ${unitTypeSuggestion}`}  onPress={() => console.log('open Contact Us')} titleTextColor="white" cellTextColor="rgb(20,19,19)"/>
        </Section>
      </TableView>
      <View style={styles.calibrate}>
      <TouchableHighlight underlayColor="white" onPress={this.navCalibrate.bind(this)}>
      <Image
        resizeMode='cover'
        style={[styles.calibrateButton]}
        source={require('./calibrate.png')}
      />
      </TouchableHighlight>
  <Text style={styles.inputRow}>Calibrate</Text>
    </View>
  </ScrollView>
      );
    }else{
      unitType = "Imperial";
      unitTypeDistance = " ft";
      unitTypeWeight = "lbs";
      unitTypeSuggestion = " inches"
      suggestedStandingImperial = Math.round(this.state.suggestedStandingHeight * 0.393701);
      suggestedSittingImperial = Math.round(this.state.suggestedSittingHeight * 0.393701);

      cachedFeet = Math.floor((this.state.height * 39.701) /  12);
      cachedInches = Math.round((this.state.height * 39.701) % 12)
      cachedWeight = Math.round(this.state.weight * 2.2);
      return (
  <ScrollView style={styles.container}>
      <TableView>

        <Section sectionTintColor="rgb(22,24,31)" separatorTintColor="rgb(29,28,29)" style={styles.firstSection}>
          <Cell cellstyle="RightDetail" accessory="DisclosureIndicator" title="Height" detail={`${cachedFeet}' ${cachedInches}"`} onPress={this.navHeight.bind(this)} titleTextColor="white" cellTextColor="rgb(20,19,19)"/>
          <Cell cellstyle="RightDetail" accessory="DisclosureIndicator" title="Weight" detail={`${cachedWeight} ${unitTypeWeight}`} onPress={this.navWeight.bind(this)} titleTextColor="white" cellTextColor="rgb(20,19,19)"/>
          <Cell cellstyle="RightDetail" accessory="DisclosureIndicator" title="Age" detail={`${this.state.age}`} onPress={this.navAge.bind(this)} titleTextColor="white" cellTextColor="rgb(20,19,19)"/>
          <Cell cellstyle="RightDetail" accessory="DisclosureIndicator" title="Units" detail={`${unitType}`} onPress={this.navUnits.bind(this)} titleTextColor="white" cellTextColor="rgb(20,19,19)"/>
      </Section>
        <Section sectionTintColor="rgb(22,24,31)" separatorTintColor="rgb(29,28,29)">
          <Cell title="Suggested standup height:" accessoryColor="white" cellstyle="RightDetail" titleTextColor="#007AFF" detail={`${suggestedStandingImperial} ${unitTypeSuggestion}`} onPress={() => console.log('open Help/FAQ')} titleTextColor="white" cellTextColor="rgb(20,19,19)"/>
          <Cell title="Suggested sitting height:" cellstyle="RightDetail" titleTextColor="#007AFF" detail={`${suggestedSittingImperial} ${unitTypeSuggestion}`} onPress={() => console.log('open Contact Us')} titleTextColor="white" cellTextColor="rgb(20,19,19)"/>
        </Section>

      </TableView>
      <View style={styles.calibrate}>
      <TouchableHighlight underlayColor="white" onPress={this.navCalibrate.bind(this)}>
      <Image
        resizeMode='cover'
        style={[styles.calibrateButton]}
        source={require('./calibrate.png')}
      />
      </TouchableHighlight>
  <Text style={styles.inputRow}>Calibrate</Text>
    </View>
  </ScrollView>
      );
    }
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

    cachedFeet = Math.floor((this.props.height * 39.701) /  12);
    cachedInches = Math.round((this.props.height * 39.701) % 12)
    return(
      <ScrollView style={styles.container}>
        <View style={styles.switchInput}>
        <Text style={styles.inputRow}>Height: </Text>
        <TextInput keyboardType='number-pad' autoFocus={true} keyboardAppearance='dark' placeholder={`${cachedFeet}`} placeholderTextColor='rgb(123,123,129)' maxLength={1} style={{height: 40, width: 40, color: 'white', borderColor: 'gray', borderWidth: 1, textAlign: 'center'}}
    onChangeText={function(text){
      //create two inputs.
      cachedFeet = text;
      console.warn(cachedFeet);
      cachedHeight = (((cachedFeet * 12) + cachedInches) / 39.701).toString();
      console.warn(cachedHeight);
    }
  }/>
<Text style={styles.inputRowRight}> ft </Text>
<TextInput keyboardType='number-pad' autoFocus={true} keyboardAppearance='dark' placeholder={`${cachedInches}`} placeholderTextColor='rgb(123,123,129)' maxLength={2} style={{height: 40, width: 40, color: 'white', borderColor: 'gray', borderWidth: 1, textAlign: 'center'}}
onChangeText={function(text){
//create two inputs.
cachedInches = Number.parseInt(text);
//console.warn(cachedInches);
cachedHeight = ( ((cachedFeet * 12) + cachedInches) / 39.701).toString();
//console.warn(cachedHeight);
//this.setState({value: "y"});
}.bind(this)
}/>
<Text style={styles.inputRowRight}>Inches </Text>
    </View>
    </ScrollView>
    );
  }
  }
}

var cachedWeight;
class Weight extends Component{

  render(){
    cachedWeight = this.props.weight;
    if(this.props.metric){
    return(
      <ScrollView style={styles.container}>
        <View style={styles.settingInput}>
        <Text style={styles.inputRow}>Weight: </Text>
          <TextInput ref="ageInput" autoFocus={true} placeholder={`${this.props.weight}`} placeholderTextColor='rgb(123,123,129)' keyboardType='decimal-pad' keyboardAppearance='dark' maxLength={5}
            style={{height: 40, width: 200, color: 'white', borderColor: 'gray', borderWidth: 1, textAlign: 'right',}}
         onChangeText={function(text){
           cachedWeight = text;
         }
         }/>
       <Text style={styles.inputRowRight}> kg</Text>
      </View>
</ScrollView>
    );}
    else{
      var conversionToPounds = Math.round(this.props.weight * 2.2);
      return(
        <ScrollView style={styles.container}>
          <View style={styles.settingInput}>
          <Text style={styles.inputRow}>Weight: </Text>
            <TextInput ref="ageInput" autoFocus={true} placeholder={`${conversionToPounds}`} placeholderTextColor='rgb(123,123,129)' keyboardType='decimal-pad' keyboardAppearance='dark' maxLength={5}
              style={{height: 40, width: 200, color: 'white', borderColor: 'gray', borderWidth: 1, textAlign: 'right',}}
           onChangeText={function(text){
             cachedWeight = (Number.parseFloat(text) / 2.2).toString();
           }
           }/>
         <Text style={styles.inputRowRight}> lbs</Text>
        </View>
      </ScrollView>
      );
    }
  }
}

var cachedAge;
class Age extends Component{
  render(){
    cachedAge = this.props.age;
    return(
      <ScrollView style={styles.container}>
        <View style={styles.settingInput}>
        <Text style={styles.inputRow}>Age: </Text>
          <TextInput ref="ageInput" autoFocus={true} placeholder={`${this.props.age}`} placeholderTextColor='rgb(123,123,129)' keyboardType='decimal-pad' keyboardAppearance='dark' maxLength={3}
            style={{height: 40, width: 200, color: 'white', borderColor: 'gray', borderWidth: 1, textAlign: 'right',}}
         onChangeText={function(text){
           cachedAge = text;
         }
         }/>
       <Text style={styles.inputRowRight}> yrs</Text>
      </View>
</ScrollView>
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
        <View style={styles.switchInput}>
        <Text style={styles.inputRowMetric}>Imperial</Text>
          <Switch
            style={{marginLeft: 20, marginRight: 20}}
            onValueChange={
              function(value){
                cachedUnit = value;
                console.warn(value);
                this.setState({metric: value});
              }.bind(this)
            }
            onTintColor='rgb(41,116,231)'
            tintColor='rgb(0,163,46)'
            value={this.state.metric} />
          <Text style={styles.inputRowImperial}>Metric</Text>
        </View>
        </ScrollView>
    );
  }
}


module.exports = {
  Settings: Settings,
  // Height: Height,
  // Weight: Weight,
  // Age: Age,
  // Units: Units,
}
