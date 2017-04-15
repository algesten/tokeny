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
  
  func sendAllTokens() {
    // send them back
    let tokens = Keychain.instance.readAll()
    session?.sendMessage(["request":"allTokens", "tokens":tokens], replyHandler: nil, errorHandler: nil)
  }
  
}
