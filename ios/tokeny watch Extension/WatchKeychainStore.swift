import Foundation

typealias StoreCallback = ([String:Any]) -> Void

class WatchKeychainStore {

  static let sharedInstance = WatchKeychainStore()
  
  func readAll(callback:StoreCallback) {

    // first just fire off whatever is in the keychain right this moment.
    callback(Keychain.instance.readAll())
    
  }
  
}
