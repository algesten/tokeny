import WatchKit
import WatchConnectivity
import OneTimePassword

/**
 Run on main.
 */
func onmain(_ closure:@escaping ()->()) {
  if Thread.isMainThread {
    closure()
  } else {
    DispatchQueue.main.async(execute: closure)
  }
}


class InterfaceController: WKInterfaceController, WCSessionDelegate {
  
  private func session(doActivate:Bool) -> WCSession? {
    if WCSession.isSupported() {
      let session = WCSession.default()
      if doActivate {
        session.delegate = self // before activate
        session.activate()
      }
      return session
    }
    return nil
  }
  
  public func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {

    // get all the tokens
    requestAll()
    
  }

  func sessionReachabilityDidChange(_ session: WCSession) {

    xprint("reachable \(session.isReachable)")
    
  }
  
  public func session(_ session: WCSession, didReceiveMessage message: [String : Any]) {
    
    let req = message["request"] as? NSString

    if req == "allTokens" {
      
      if (message["notokens"] as? Bool) == true {

        // notokens means iphone is locked and there were no tokens cached
        // for the response. we can't do anything with that.
        xprint("did receive notokens :(")
        
      } else {
        // the tokens come as a message with
        // [{
        //    url: <otpauth url>
        //    ordinal: 0
        // ]]
        let newTokens = message["tokens"] as! [[String:Any]]
        
        xprint("did receive tokens: \(newTokens.count)")
        
        onmain() { [weak self] in
          self?.receiveAllTokens(newTokens)
        }
        
      }
      
    }
    
  }
  
  override func awake(withContext context: Any?) {
    super.awake(withContext: context)

    xprint("awake")
    
    _ = session(doActivate: true)
    
    drawMessage("Hello!")
    
    // just grab whatever is in the keychain
    let keychainTokens:[Token] = Keychain.instance.readAll().map() {
      let url = URL(string: $0[kKeyURL] as! String)!
      return Token(url: url)!
    }
    
    xprint("keychain tokens \(keychainTokens.count)")
    
    // draw whatever we have in the local keychain.
    drawTokens(keychainTokens)
    
    // but also request to load new ones from the iphone
    requestAll()
    
  }

  override func didAppear() {
    xprint("did appear")
  }
  
  override func willDisappear() {
    xprint("will disappear")
  }
  
  override func willActivate() {
    xprint("will activate")
    requestAll()
  }
  
  override func didDeactivate() {
    xprint("did deactivate")
  }
  
  private func requestAll() {
    onmain() { [weak self] in
        self?._requestAll()
    }
  }
  
  private func _requestAll() {

    if let session = session(doActivate: false) {
      if session.isReachable {
        // when there isn't something to draw, we might as well let the 
        // user know what's going on. however we want to only access
        // self.tokens on the main thread
        if tokens.isEmpty {
          drawMessage("Requesting tokens")
        }
        xprint("requesting tokens")
        session.sendMessage(["request":"loadAllTokens"], replyHandler: nil, errorHandler: nil)
      }
    }
  }
  
  // the currently drawn tokens, updated by drawTokens
  // only access this on the main thread
  private var tokens:[Token] = []
  
  // the token table
  @IBOutlet weak var tokenTable: WKInterfaceTable!
  @IBOutlet weak var messageLabel: WKInterfaceLabel!
  
  //@IBOutlet weak var debugLabel: WKInterfaceLabel!
    
  // when we get new tokens from the phone
  // we run this in the main thread to be able to terminate quickly when
  // we have the same tokens as alreadt saved
  private func receiveAllTokens(_ newTokens:[[String:Any]]) {

    // these are what we will draw eventually, but we
    // also use them for comparison with the stuff we already have
    let toDraw:[Token] = newTokens.map() {
      let url = URL(string: $0[kKeyURL] as! String)!
      return Token(url: url)!
    }
    
    // already got them?
    if self.tokens == toDraw {
      return
    }
    
    // map them to something we can save in the local keychain
    let toSave:[[String:Any]] = newTokens.map() {
      let url = URL(string: $0[kKeyURL] as! String)!
      let token = Token(url: url)!
      return [
        kKeyURL: url.absoluteString,
        kKeyIssuer: token.issuer,
        kKeyAccount: token.name,
        kKeyOrdinal: $0[kKeyOrdinal]!
      ]
    }
    
    xprint("to save: \(toSave.count)")
    
    // save all the things to the watch keychain. this way we can
    // operate without the iphone
    if !Keychain.instance.addAll(tokens:toSave) {
      // failed to save, ouch.
      drawMessage("Keychain save failed")
      xprint("keychain save failed")
      return
    }
    
    // well draw them then
    drawTokens(toDraw)
    
  }
 
  private func drawTokens(_ newTokens:[Token]) {
    onmain() { [weak self] in
        self?._drawTokens(newTokens)
    }
  }
  
  private func _drawTokens(_ newTokens:[Token]) {

    xprint("draw tokens \(newTokens.count), is same as before: \(newTokens == tokens)")
    
    // first just check we dont have exactly this drawn already
    if newTokens == tokens {
      return
    }
    
    // then proceed to draw them
    // this ought to be the only point we write to self.tokens
    self.tokens = newTokens
    
    // Configure the table to have enough rows of the type we want
    tokenTable.setNumberOfRows(tokens.count, withRowType: "TokenRowController")

    for (index, token) in tokens.enumerated() {
      let row = tokenTable.rowController(at:index) as! TokenRowController
    
      row.issuerLabel.setText(token.issuer)
      row.accountLabel.setText(token.name)
      
    }

    if !tokens.isEmpty {
      tokenTable.setHidden(false)
      messageLabel.setHidden(true)
    }
    
  }
  
  private func drawMessage(_ message:String) {
    onmain() { [weak self] in
      self?._drawMessage(message)
    }
  }
  
  private func _drawMessage(_ message:String) {
    tokenTable.setHidden(true)
    messageLabel.setHidden(false)
    messageLabel.setText(message)
  }
  
  // provide the token to the view
  override func contextForSegue(withIdentifier segueIdentifier: String, in table: WKInterfaceTable, rowIndex: Int) -> Any? {
    return tokens[rowIndex]
  }
  
//  private var rows:[String] = []
  
  private func xprint(_ log:String) {
    print(log)
//    rows.append(log)
//    while rows.count > 10 {
//      rows.remove(at: 0)
//    }
//    let output = rows.joined(separator: "\n")
//    onmain { [weak self] in
//      self?.debugLabel.setText(output)
//    }
  }
  
}

class TokenRowController : NSObject {
  @IBOutlet weak var issuerLabel: WKInterfaceLabel!
  @IBOutlet weak var accountLabel: WKInterfaceLabel!
}
