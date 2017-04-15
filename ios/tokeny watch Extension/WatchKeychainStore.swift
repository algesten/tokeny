import Foundation

typealias StoreCallback = ([String:Any]) -> Void

let USER_ACCOUNT = "tokeny-wk"

class WatchKeychainStore {

  static let sharedInstance = WatchKeychainStore()
  
  func readAll(callback:StoreCallback) {
    
  }
  
}
