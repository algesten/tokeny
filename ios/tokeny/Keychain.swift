import Foundation

private let kOTPService = "se.objf.tokeny.token"

// these 4 things are needed to save a token to the keychain
let kKeyURL = "url"
let kKeyIssuer = "issuer"    // allowed to be empty string
let kKeyAccount = "account"
let kKeyOrdinal = "ordinal"

class Keychain : NSObject {

  static let instance = Keychain()

  // whether to save as iCloud synchronizable. the watch doesnt do this.
  var synchronizable = kCFBooleanTrue
  
//    {
//      type: 'totp',
//      account: 'alice@google.com',
//      key: 'JBSWY3DPEHPK3PXP',
//      issuer: 'Example',
//      digits: 6
//      url: 'otpauth://totp/Example:alice@google.com?secret=JBSWY3DPEHPK3PXP&issuer=Example'
//      ordinal: 2
//    }
  func addOne(dict:[String:Any]) -> Bool {

    let urlData = (dict[kKeyURL] as! String).data(using: String.Encoding.utf8)!
    let account = (dict[kKeyIssuer] as! String) + "/" + (dict[kKeyAccount] as! String)
    let ordinal = String(dict[kKeyOrdinal] as! NSInteger)
    
    let attrs:[String:Any] = [
      kSecClass as String             : kSecClassGenericPassword,

      // these three are what makes the keychain item unique
      kSecAttrService as String       : kOTPService as NSString,
      kSecAttrAccount as String       : account as NSString,
      kSecAttrSynchronizable as String: synchronizable,

      kSecValueData as String         : urlData,
      kSecAttrLabel as String         : ordinal as NSString,
    ]
    
    var result: AnyObject?
    let resultCode: OSStatus = withUnsafeMutablePointer(to: &result) {
      SecItemAdd(attrs as CFDictionary, $0)
    }
    
    // -25299 is already exists
    guard resultCode == errSecSuccess else {
      print("addOne failed " + String(resultCode))
      return false
    }
    return true
    
  }
  

  func deleteAll() -> Bool {

    let attrs:[String:Any] = [
      kSecClass as String             : kSecClassGenericPassword,
      kSecAttrService as String       : kOTPService as NSString,
      kSecAttrSynchronizable as String: synchronizable,
    ]
    
    let resultCode = SecItemDelete(attrs as CFDictionary)
    
    // no items is ok
    if resultCode == errSecItemNotFound {
      return true
    }

    guard resultCode == errSecSuccess else {
      print("deleteAll failed " + String(resultCode))
      return false
    }
    
    return true
  
  }


  func addAll(tokens:[[String:Any]]) -> Bool {
    
    // remove all previous entries from keychain
    if !deleteAll() {
      return false
    }
    
    // the dummy is used to check whether the iphone homescreen is locked/unlocked
    // when it is locked, the reading of data from keychain returns 0. by having
    // a dummy to query that is always saved, regardless of the other saved tokens,
    // we can implicitly know whether the iphone is locked.
    if !addOne(dict:[
        "account": "dummy",
        "issuer": "dummy",
        "url": "dummy",
        "ordinal": -1,
      ]) {
      print("saving dummy failed")
      return false
    }
    
    for tok in tokens {
      if !addOne(dict: tok) {
        return false
      }
    }
    
    return true
    
  }
  
  
  func _readAll() -> [[String:Any]] {
    
    let attrs:[String:Any] = [
      kSecClass as String             : kSecClassGenericPassword,
      kSecMatchLimit as String        : kSecMatchLimitAll,
      kSecAttrService as String       : kOTPService as NSString,
      kSecAttrSynchronizable as String: synchronizable,
      kSecReturnAttributes as String  : kCFBooleanTrue,
      kSecReturnData as String        : kCFBooleanTrue,
    ]
    
    var result: AnyObject?
    let resultCode = withUnsafeMutablePointer(to: &result) {
      SecItemCopyMatching(attrs as CFDictionary, $0)
    }
    
    // no items is ok, -25300
    if resultCode == errSecItemNotFound {
      return []
    }
    
    guard resultCode == errSecSuccess else {
      print("readAll failed " + String(resultCode))
      return []
    }
    
    guard let keychainItems = result as? [NSDictionary] else {
      print("readAll failed type")
      return []
    }
    
    return keychainItems.map() {
      var token:[String:Any] = [:]
      let urlData = $0[kSecValueData as String] as! Data
      token[kKeyURL] = String(data: urlData, encoding: String.Encoding.utf8)
      let ordinalString = $0[kSecAttrLabel as String] as! String
      let ordinal = NSInteger(ordinalString)
      token[kKeyOrdinal] = ordinal
      return token
    }
  }
  
  func readAll() -> [[String:Any]] {
    return _readAll().filter() {
      return ($0[kKeyURL] as! String) != "dummy"
    }
  }

  // the dummy is always in the _readAll, so if absolutely _nothing_ is
  // returned, we implicitly know the iphone is locked
  func isLocked() -> Bool {
      return _readAll().count == 0
  }

}
