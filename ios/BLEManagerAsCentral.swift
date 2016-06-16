////
////  BLEManagerAsCentral.swift
////  Bluetooth Joint Position
////
////  Created by Gabe Garrett on 4/19/16.
////  Copyright © 2016 Gabe. All rights reserved.
////
////
//
//import Foundation
//import CoreBluetooth
//
//@objc(BLEManagerCentral)
//class BLEManagerCentral {
//  var centralManager : CBCentralManager
//  var bleHandlerCentral : BLEHandlerCentral
//  init(){
//    self.bleHandlerCentral = BLEHandlerCentral()
//    self.centralManager = CBCentralManager(delegate: self.bleHandlerCentral, queue: nil)
//  }
//}
//
//enum ConnectionMode:Int {
//  case None
//  case PinIO
//  case UART
//  case Info
//  case Controller
//  case DFU
//}
//
//
//@objc(BLEHandlerCentral)
//class BLEHandlerCentral : NSObject, CBCentralManagerDelegate, CBPeripheralDelegate{
//  var subscribed : Bool
//  @objc override init(){
//    subscribed = false
//    super.init()
//  }
//  let serviceUUid = CBUUID(string: "A8BBDEFF-DE0B-4998-AE60-8CFC5A9E7C7B")//CBUUID(NSUUID: uuid)
//  let advertisementUUID = CBUUID(string: "5BCDBFD2-9053-4E2E-8A3E-8A01D213D9AA")
//  let characteristicUUID = CBUUID(string: "B4148580-E8E9-48F5-BDAD-691839C7DDFB")
//  let bluefruitPrimaryUUID = CBUUID(string: "6E400001-B5A3-F393-E0A9-E50E24DCCA9E")
//  
//  var currentPeripheral:CBPeripheral!
//  var delegate:BLEPeripheralDelegate!
//  var uartService:CBService?
//  var rxCharacteristic:CBCharacteristic?
//  var txCharacteristic:CBCharacteristic?
//  var knownServices:[CBService] = []
//  
//  @objc func centralManagerDidUpdateState(central: CBCentralManager) {
//    switch(central.state){
//    case .Unsupported:
//      print("BLE is Unsupported")
//    case .Unauthorized:
//      print("BLE is Unauthorized")
//    case .Unknown:
//      print("BLE is unknown")
//    case .Resetting:
//      print("BLE is resetting")
//    case .PoweredOff:
//      print("BLE is powered off")
//    case .PoweredOn:
//      print("BLE is powered on")
//      print("Start scanning")
//      central.scanForPeripheralsWithServices(nil, options: nil)
//    }
//  }
//  
//  var peripherals = [CBPeripheral]()
//  var characteristics = [CBCharacteristic]()
//  var centrals = [CBCentralManager]()
//  @objc func centralManager(central: CBCentralManager, didDiscoverPeripheral peripheral: CBPeripheral, advertisementData: [String : AnyObject], RSSI: NSNumber) {
//    print("peripheral found! " + String(peripheral))
//    if((peripheral.name) == "Adafruit Bluefruit LE"){ //change to NSUUID
//      print("FOUND BLUEFRUIT!")
//      //peripheral.delegate = self
//      self.peripherals.append(peripheral)
//      self.centrals.append(central)
//      self.currentPeripheral = peripherals[0]
//      
//      central.connectPeripheral(peripherals[0], options: nil)
//      //            centrals[0].stopScan()
//    }
//    print("Advertisement data: " + String(advertisementData))
//    print("Services: " + String(peripheral.services))
//    
//  }
//  
//  @objc func centralManager(central: CBCentralManager, didFailToConnectPeripheral peripheral: CBPeripheral, error: NSError?) {
//    print("Failed to connect \(peripheral) cause of \(error)")
//  }
//  @objc func centralManager(central: CBCentralManager, didConnectPeripheral peripheral: CBPeripheral) {
//    print("CONNECTED to \(peripheral)")
//    //central.stopScan()
//    //NOTE TO SELF: RUN THIS. THEN THE LAPTOP FINDS THE CHARACTERISTSICS FOR SOME REASON. THEN COMMENT OUT AND IT FINDS IT AGAIN. INCONSISTENT BEHAVIOR. EXHAUSTIVE SCANNING FORCES LAPTOP TO MEMORIZE THE CHARACTERISTIC THOUGH.
//    
//    peripherals[0].delegate = self
//    
//    peripherals[0].discoverServices(nil)        //previously passed [bluefruitPrimaryUUID] as parameter instead of nil
//    print("CONNECTED SERVICES: " + String(peripherals[0].services))
//    
//  }
//  
//  
//  
//  @objc func peripheral(peripheral: CBPeripheral, didDiscoverServices error: NSError?) {
//    //        print("S E R V I C E S: \(peripherals[0].services) and error \(error)")
//    //        print(peripherals[0].services?.count)
//    //        if let services = peripherals[0].services {
//    //            for service in services {
//    //                print("discovering characteristics")
//    //                peripheral.discoverCharacteristics(nil, forService: service)
//    //            }
//    //        }
//    
//    //Respond to finding a new service on peripheral
//    
//    if error != nil {
//      
//      //            handleError("\(self.classForCoder.description()) didDiscoverServices : Error discovering services")
//      printLog(self, funcName: "didDiscoverServices", logString: "\(error.debugDescription)")
//      
//      return
//    }
//    
//    //        println("\(self.classForCoder.description()) didDiscoverServices")
//    
//    
//    let services = peripheral.services as [CBService]!
//    
//    for s in services {
//      
//      // Service characteristics already discovered
//      if (s.characteristics != nil){
//        self.peripheral(peripheral, didDiscoverCharacteristicsForService: s, error: nil)    // If characteristics have already been discovered, do not check again
//      }
//      
//      //UART, Pin I/O, or Controller mode
//      //            else if delegate.connectionMode == ConnectionMode.UART ||
//      //                delegate.connectionMode == ConnectionMode.PinIO ||
//      //                delegate.connectionMode == ConnectionMode.Controller ||
//      //                delegate.connectionMode == ConnectionMode.DFU {
//      if UUIDsAreEqual(s.UUID, secondID: uartServiceUUID()) {
//        uartService = s
//        peripheral.discoverCharacteristics([txCharacteristicUUID(), rxCharacteristicUUID()], forService: uartService!)
//      }
//      //}
//      
//      // Info mode
//      //            else if delegate.connectionMode == ConnectionMode.Info {
//      //                knownServices.append(s)
//      //                peripheral.discoverCharacteristics(nil, forService: s)
//      //            }
//      
//      //DFU / Firmware Updater mode
//      //            else if delegate.connectionMode == ConnectionMode.DFU {
//      //                knownServices.append(s)
//      //                peripheral.discoverCharacteristics(nil, forService: s)
//      //            }
//      
//    }
//    
//    printLog(self, funcName: "didDiscoverServices", logString: "all top-level services discovered")
//  }
//  
//  @objc func peripheral(peripheral: CBPeripheral, didDiscoverCharacteristicsForService service: CBService, error: NSError?)
//  {
//    //        print("peripheral:\(peripheral) and service:\(service)") /* this is the previous dDCFS function.*/
//    //        for characteristic in service.characteristics!
//    //        {
//    //            print("Found characteristic!")
//    //            peripheral.setNotifyValue(true, forCharacteristic: characteristic)
//    //            centrals[0].stopScan()
//    //            print("Subscribed!")
//    //            print(characteristic)
//    //            self.characteristics.append(characteristic)
//    //            subscribed = true
//    //        }
//    //Respond to finding a new characteristic on service
//    
//    if error != nil {
//      //            handleError("Error discovering characteristics")
//      printLog(self, funcName: "didDiscoverCharacteristicsForService", logString: "\(error.debugDescription)")
//      
//      return
//    }
//    
//    printLog(self, funcName: "didDiscoverCharacteristicsForService", logString: "\(service.description) with \(service.characteristics!.count) characteristics")
//    
//    // UART mode
//    
//    //        if  delegate.connectionMode == ConnectionMode.UART ||
//    //            delegate.connectionMode == ConnectionMode.PinIO ||
//    //            delegate.connectionMode == ConnectionMode.Controller ||
//    //            delegate.connectionMode == ConnectionMode.DFU {
//    
//    for c in (service.characteristics as [CBCharacteristic]!) {
//      
//      switch c.UUID {
//      case rxCharacteristicUUID():         //"6e400003-b5a3-f393-e0a9-e50e24dcca9e"
//        printLog(self, funcName: "didDiscoverCharacteristicsForService", logString: "\(service.description) : RX")
//        rxCharacteristic = c
//        currentPeripheral.setNotifyValue(true, forCharacteristic: rxCharacteristic!)
//        break
//      case txCharacteristicUUID():         //"6e400002-b5a3-f393-e0a9-e50e24dcca9e"
//        printLog(self, funcName: "didDiscoverCharacteristicsForService", logString: "\(service.description) : TX")
//        txCharacteristic = c
//        print("FOUND TXCHARACTERISTIC")
//        subscribed = true //technically the iphone never needs to subscribe to a write-only characteristic, so we set it true here anyway.
//        break
//      default:
//        //                    printLog(self, "didDiscoverCharacteristicsForService", "Found Characteristic: Unknown")
//        break
//      }
//      
//    }
//    
//    if rxCharacteristic != nil && txCharacteristic != nil {
//      dispatch_async(dispatch_get_main_queue(), { () -> Void in
//        //                    self.delegate.connectionFinalized()
//      })
//    }
//      
//      
//      // Info mode
//    else if delegate.connectionMode == ConnectionMode.Info {
//      
//      for c in (service.characteristics as [CBCharacteristic]!) {
//        
//        //Read readable characteristic values
//        if (c.properties.rawValue & CBCharacteristicProperties.Read.rawValue) != 0 {
//          peripheral.readValueForCharacteristic(c)
//        }
//        
//        peripheral.discoverDescriptorsForCharacteristic(c)
//        
//      }
//      
//    }
//    
//  }
//  @objc func peripheral(peripheral: CBPeripheral, didUpdateValueForCharacteristic characteristic: CBCharacteristic, error: NSError?)
//  {
//    let dataString = NSString(data: characteristic.value!, encoding:NSUTF8StringEncoding)
//    let dataWithoutOptional = String(dataString)
//    //var unpacked = self.NSDataToDouble(characteristic.value!)
//    print(dataWithoutOptional)
//  }
//  @objc func NSDataToDouble(value: NSData)-> [Double]{
//    var unpacked: [Double] = [0.0,0.0,0.0]
//    value.getBytes(&unpacked, length: sizeof(Double)*3)
//    return unpacked
//  }
//  
//  @objc func didConnect(withMode:ConnectionMode) {
//    
//    //Respond to peripheral connection
//    
//    //Already discovered services
//    if currentPeripheral.services != nil{
//      //            printLog(self, funcName: "didConnect", logString: "Skipping service discovery")
//      peripheral(currentPeripheral, didDiscoverServices: nil)  //already discovered services, DO NOT re-discover. Just pass along the peripheral.
//      return
//    }
//    
//    //        printLog(self, funcName: "didConnect", logString: "Starting service discovery")
//    
//    switch withMode.rawValue {
//    case ConnectionMode.UART.rawValue,
//         ConnectionMode.PinIO.rawValue,
//         ConnectionMode.Controller.rawValue,
//         ConnectionMode.DFU.rawValue:
//      currentPeripheral.discoverServices([uartServiceUUID(), dfuServiceUUID(), deviceInformationServiceUUID()])       // Discover dfu and dis (needed to check if update is available)
//    case ConnectionMode.Info.rawValue:
//      currentPeripheral.discoverServices(nil)
//      break
//    default:
//      //            printLog(self, funcName: "didConnect", logString: "non-matching mode")
//      break
//    }
//    
//    //        currentPeripheral.discoverServices([BLEPeripheral.uartServiceUUID(), BLEPeripheral.deviceInformationServiceUUID()])
//    //        currentPeripheral.discoverServices(nil)
//    
//  }
//  
//  @objc func peripheral(peripheral: CBPeripheral, didDiscoverDescriptorsForCharacteristic characteristic: CBCharacteristic, error: NSError?) {
//    
//    if error != nil {
//      //            handleError("Error discovering descriptors \(error.debugDescription)")
//      //            printLog(self, funcName: "didDiscoverDescriptorsForCharacteristic", logString: "\(error.debugDescription)")
//      //            return
//    }
//      
//    else {
//      if characteristic.descriptors?.count != 0 {
//        for d in characteristic.descriptors! {
//          let desc = d as CBDescriptor!
//          //                    printLog(self, funcName: "didDiscoverDescriptorsForCharacteristic", logString: "\(desc.description)")
//          print("Descriptors:")
//          print(currentPeripheral.readValueForDescriptor(desc))
//        }
//      }
//    }
//    
//    
//    //Check if all characteristics were discovered
//    var allCharacteristics:[CBCharacteristic] = []
//    for s in knownServices {
//      for c in s.characteristics! {
//        allCharacteristics.append(c as CBCharacteristic!)
//      }
//    }
//    for idx in 0...(allCharacteristics.count-1) {
//      if allCharacteristics[idx] === characteristic {
//        //                println("found characteristic index \(idx)")
//        if (idx + 1) == allCharacteristics.count {
//          //                    println("found last characteristic")
//          if delegate.connectionMode == ConnectionMode.Info {
//            delegate.connectionFinalized()
//          }
//        }
//      }
//    }
//    
//  }
//  
// @objc func writeString(string:NSString){
//    
//    //Send string to peripheral
//    
//    let data = NSData(bytes: string.UTF8String, length: string.length)
//    
//    writeRawData(data)
//  }
//  
//  
// @objc func writeRawData(data:NSData) {
//    
//    //Send data to peripheral
//    
//    if (txCharacteristic == nil){
//      //            printLog(self, funcName: "writeRawData", logString: "Unable to write data without txcharacteristic")
//      return
//    }
//    
//    var writeType:CBCharacteristicWriteType
//    
//    if (txCharacteristic!.properties.rawValue & CBCharacteristicProperties.WriteWithoutResponse.rawValue) != 0 {
//      
//      writeType = CBCharacteristicWriteType.WithoutResponse
//      
//    }
//      
//    else if ((txCharacteristic!.properties.rawValue & CBCharacteristicProperties.Write.rawValue) != 0){
//      
//      writeType = CBCharacteristicWriteType.WithResponse
//    }
//      
//    else{
//      //            printLog(self, funcName: "writeRawData", logString: "Unable to write data without characteristic write property")
//      return
//    }
//    
//    //TODO: Test packetization
//    
//    //send data in lengths of <= 20 bytes
//    let dataLength = data.length
//    let limit = 20
//    
//    //Below limit, send as-is
//    if dataLength <= limit {
//      currentPeripheral.writeValue(data, forCharacteristic: txCharacteristic!, type: writeType)
//    }
//      
//      //Above limit, send in lengths <= 20 bytes
//    else {
//      
//      var len = limit
//      var loc = 0
//      var idx = 0 //for debug
//      
//      while loc < dataLength {
//        
//        let rmdr = dataLength - loc
//        if rmdr <= len {
//          len = rmdr
//        }
//        
//        let range = NSMakeRange(loc, len)
//        var newBytes = [UInt8](count: len, repeatedValue: 0)
//        data.getBytes(&newBytes, range: range)
//        let newData = NSData(bytes: newBytes, length: len)
//        //                    println("\(self.classForCoder.description()) writeRawData : packet_\(idx) : \(newData.hexRepresentationWithSpaces(true))")
//        self.currentPeripheral.writeValue(newData, forCharacteristic: self.txCharacteristic!, type: writeType)
//        
//        loc += len
//        idx += 1
//      }
//    }
//    
//  }
//  
// @objc func printLog(obj:AnyObject, funcName:String, logString:String?) {
//    
//    if LOGGING != true {
//      return
//    }
//    
//    if logString != nil {
//      print("\(obj.classForCoder!.description()) \(funcName) : \(logString!)")
//    }
//    else {
//      print("\(obj.classForCoder!.description()) \(funcName)")
//    }
//  }
//  
//  
// @objc func didReceiveData(newData: NSData) {
//    
//    //Data incoming from UART peripheral, forward to current view controller
//    
//    printLog(self, funcName: "didReceiveData", logString: "Received data without connection")
//    
//  }
//  
// @objc func uartDidEncounterError(error: NSString) {
//    //Display error alert
//    print("UART error")
//  }
//  
//  
//}