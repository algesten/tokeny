//
//  KeychainStore.swift
//  tokeny
//
//  Created by martin on 2017-04-14.
//  Copyright © 2017 Facebook. All rights reserved.
//

import Foundation
import Locksmith

let USER_ACCOUNT = "tokeny"

// One entry in the store is like this:
// tokeny000: {
//    name:      <display name>
//    issuer:    <issuer>
//    factor:    totp/hotp
//    algorithm: SHA1/SHA256/SHA512
//    digits:    6
// }

@objc(KeychainStore)
class KeychainStore: NSObject {

  @objc(readAll:reject:)
  func readAll(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {

    // read all values and send that back to js for further processing
    if let dict = Locksmith.loadDataForUserAccount(userAccount:USER_ACCOUNT) {
      resolve(dict)
    } else {
      resolve([:])
    }

  }
  
  @objc(saveAll:resolve:reject:)
  func saveAll(dict: [String:AnyObject], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
    
    // delete all data already there before saving the new stuff
    do {
      try Locksmith.deleteDataForUserAccount(userAccount: USER_ACCOUNT)
    } catch {
      print(error)
      reject("", "saveAll delete failed", error)
      return
    }
 
    do {
      try Locksmith.saveData(data: dict, forUserAccount: USER_ACCOUNT)
    } catch {
      print(error)
      reject("", "saveAll failed", error)
      return
    }

    // all good then
    resolve(nil)
    
  }
  
}
