import Foundation

@objc(KeychainStore)
class KeychainStore: NSObject {

  @objc(readAll:reject:)
  func readAll(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {

    resolve(Keychain.instance.readAll())

  }
  
  @objc(saveAll:resolve:reject:)
  func saveAll(tokens: [[String:AnyObject]], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {

    if Keychain.instance.addAll(tokens: tokens) {
      // now tell the watch. if it's there
      WatchSessionDelegate.instance.sendAllTokens()
      // all good then
      resolve(nil)
    } else {
      reject(nil, nil, nil)
    }
    
  }
  
}
