#This is a react-native app for StandiT

##This will control the majority of the StandiT desk's functions.

This app is built in react-native. Technically, we should be able to port roughly 80% of the code from the iOS version to Android.

Built in react-native 0.27.2

###To run:

To run in a simulator, uncomment the following line inside the Xcode project's `appdelegate.m`:

`jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios&dev=true"];`

To run on a physical device, comment out the previous line and uncomment the following line:

`jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];`

Then hit `Run` in Xcode after having commented out the appropriate lines.