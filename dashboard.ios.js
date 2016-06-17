import React, {Component} from 'react';
import { SegmentedControlIOS,
  StyleSheet,
View,
Text,
  Image, } from 'react-native'
import Chart from 'react-native-chart';
//import RNChart from 'react-native-chart';
'use strict';

var styles = StyleSheet.create({
	description: {
	    fontSize: 20,
	    textAlign: 'center',
	    color: '#FFFFFF'
	},
	container: {
	    flex: 1,
        alignItems: 'center',
	    backgroundColor: 'rgb(20,25,30)',
	},
   header: {
      marginTop: 25,
      fontSize: 32,
      textAlign: 'center',
      color: 'rgb(191, 187, 187)',
    },
  percentage: {
      marginTop: 5,
      textAlign: 'right',
      color: 'rgb(191, 187, 187)',
  },
    goalChartContainer: {
      marginTop: 40,
      flexDirection: 'row',
    },
    personPercentageContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    piePerson: {
      width: 55,
      height: 55,
    },
  chart: {
      height: 100,
      width: 100,
    },
  bottomChart: {
    marginTop: 50,
    height: 200,
    width: 300,

  },
  chartContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#f5f5f5',
	},
    });

const colors = {
	primary: '#374e5c',
	primaryDark: '#24333c',
	primaryLight: '#4a697c',
	secondary: '#df8165',
	tertiary: '#4dc4e6',
	grey: '#999999',
	white: '#f5f5f5',
	yellow: 'rgba(255, 205, 0, 0.9)',
	positive: '#90c456',
	positiveLight: '#20c406',
	positiveDark: '#77ab3c',
	gradientBottom: '#63759B',
	gradientTop: '#374e5c',
	navbar: '#425563',
	sidebar: '#313f49',
	lightGrey: '#cccccc',
	headingBackground: 'rgba(255,255,255,0.15)',
	headingBackgroundLight: 'rgba(255,255,255,0.35)',
	opaqueHeading: 'rgba(180, 180, 180, 1)',
  pieSitting: 'rgb(41,116,231)',
  pieStanding: 'rgb(0,163,46)',
};

const data = [
    [0, 1],
    [1, 3],
    [3, 7],
    [4, 9],
];

const chartRange = [4];
const exampleArray = [1,2];
const exampleArrayBar = [1,2,3,4,5,6]
const chartColors = {
	bar: colors.primary,
	line: colors.tertiary,
	pie: colors.yellow,
};
const sliceColors = [
  colors.pieSitting,
  colors.pieStanding,
	colors.tertiary,
	colors.positive,
	colors.yellow,
	colors.secondary,
	colors.gradientBottom,
	colors.primaryLight,
	colors.yellow,
	colors.secondary,
	colors.gradientBottom,
	colors.primaryLight,
];

const generateXLabels = () => {
	return exampleArray.map(_ => (Math.floor(Math.random() * 100) + 1).toString());

};

const generateXLabelsBar = () => {
	return exampleArrayBar.map(_ => (Math.floor(Math.random() * 100) + 1).toString());

};

const generateChartData = (type) => {
	const charts = [
		{
			type,
			color: chartColors[type],
			widthPercent: 0.1,
			data: exampleArray.map(_ => Math.floor(Math.random() * 100) + 1),
			sliceColors,
		},
	];
  //  console.log(charts[0]);
	return charts;
};

const generateChartDataBar = (type) => {
	const charts = [
		{
			type,
			color: chartColors[type],
			widthPercent: 0.1,
			data: exampleArrayBar.map(_ => Math.floor(Math.random() * 100) + 1),
			sliceColors,
		},
	];
	return charts;
};

// <Chart style={styles.chart} chartData={this.state.pieChart} xLabels={this.state.xLabels} />
// <Chart style={styles.bottomChart} chartData={this.state.lineChart} fillColor={colors.yellow} xLabels={this.state.xLabels} />

var pieData;
class Dashboard extends Component {
  constructor(props) {
		super(props);
		this.state = {
			lineChart: generateChartDataBar('line'),
			barChart: generateChartDataBar('bar'),
			pieChart: generateChartData('pie'),
			xLabels: generateXLabelsBar(),
		};
    const pieTotal = this.state.pieChart[0].data[0] + this.state.pieChart[0].data[1];
    this.state.pieChart[0].data[0] = Math.round((this.state.pieChart[0].data[0] / pieTotal) * 100);
    this.state.pieChart[0].data[1] = Math.round((this.state.pieChart[0].data[1] / pieTotal) * 100);
    pieData = [
      [0, this.state.pieChart[0].data[0]],
      [1, this.state.pieChart[0].data[1]]
    ];
	}
    render() {
	return (
		<View style={styles.container}>
        <Text style={styles.header}>
          Dashboard
        </Text>
        <SegmentedControlIOS
          values={['Day', 'Week', 'Month', 'Year']}
          momentary={ false }
          tintColor={ 'rgb(41,116,231)' }
          style={{
            width: 370,
          }}
          selectedIndex={(this.state && this.state.scIndex) || 0}
          onValueChange={(value) => {}}
          onChange={(event) => {
            this.setState({
              scIndex: event.nativeEvent.selectedSegmentIndex
            })
          }}
        />
		<View style={styles.goalChartContainer}>
          <View style={styles.personPercentageContainer}>
            <Image
              resizeMode='contain'
              style={styles.piePerson}
              source={require('./sitting-symbol.png')}
            />
            <Text style={styles.percentage}>
              {this.state.pieChart[0].data[0]}%
           </Text>
          </View>

          <Chart style={styles.chart} data={pieData} showAxis={false} type="pie" sliceColors={['rgb(41,116,231)', 'rgb(0,163,46)']}/>

            <View style={styles.personPercentageContainer}>
              <Image
                resizeMode='contain'
                style={styles.piePerson}
                source={require('./standing-symbol.png')}
              />
               <Text style={styles.percentage}>
                  {this.state.pieChart[0].data[1]}%
               </Text>
            </View>

    </View>
    <Chart
           style={styles.bottomChart}
           data={data}
           verticalGridStep={5}
           type="line"
        />

      </View>
		);
    }
}

module.exports = Dashboard;
