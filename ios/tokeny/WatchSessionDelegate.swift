import Foundation
import WatchConnectivity

class WatchSessionDelegate : NSObject, WCSessionDelegate {
  
  public func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
  }
  
  public func sessionDidBecomeInactive(_ session: WCSession) {
  }
  
  public func sessionDidDeactivate(_ session: WCSession) {
  }
  
  static let instance = WatchSessionDelegate()
  
  
  var session:WCSession? {
    
    guard WCSession.isSupported() else { return nil }
    
    let session = WCSession.default()
    session.activate()
    return session
    
  }
  
  
  func session(_ session: WCSession, didReceiveMessage message: [String : Any]) {
    
    let req = message["request"] as? NSString
    
    if req == "loadAllTokens" {
      // request from the watch to load all the tokens
      sendAllTokens()
    }
    
  }

  
  var lastTokens:[[String:Any]]? = nil
  
  func sendAllTokens() {
    
    // if we can read the dummy, the phone is unlocked
    if !Keychain.instance.isLocked() {
      
      // in which case we dare to query for the tokens
      lastTokens = Keychain.instance.readAll()
      
    }
    
    // and then either send the cached value or the newly read one
    if let tokens = lastTokens {
      session?.sendMessage(["request":"allTokens", "tokens":tokens], replyHandler: nil, errorHandler: nil)
    } else {
      // fallback if we really have nothing...
      session?.sendMessage(["request":"allTokens", "notokens":true], replyHandler: nil, errorHandler: nil)
    }
  }
  
}
