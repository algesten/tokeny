import WatchKit
import WatchConnectivity
import OneTimePassword

class InterfaceController: WKInterfaceController, WCSessionDelegate {
  
  var session:WCSession? {
    if WCSession.isSupported() {
      let session = WCSession.default()
      session.delegate = self // before activate
      session.activate()
      return session
    }
    return nil
  }
  
  public func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {

    // get all the tokens
    requestAll()
    
  }

  func sessionReachabilityDidChange(_ session: WCSession) {

    print("reachable", session.isReachable)
    
  }
  
  public func session(_ session: WCSession, didReceiveMessage message: [String : Any]) {
    
    let req = message["request"] as? NSString
    
    if req == "allTokens" {
      // the tokens come as a message with
      // [{
      //    url: <otpauth url>
      //    ordinal: 0
      // ]]
      let newTokens = message["tokens"] as! [[String:Any]]
      
      receiveAllTokens(newTokens)
      
    }
    
  }
  
  override func awake(withContext context: Any?) {
    super.awake(withContext: context)

    // just grab whatever is in the keychain
    let keychainTokens:[Token] = Keychain.instance.readAll().map() {
      let url = URL(string: $0[kKeyURL] as! String)!
      return Token(url: url)!
    }
    
    // draw whatever we have in the local keychain.
    drawTokens(keychainTokens)
    
    // but also request to load new ones from the iphone
    requestAll()
    
  }

  override func didAppear() {
    requestAll()
  }
  
  override func willActivate() {
    requestAll()
  }
  
  private func requestAll() {
    if let session = session {
      if session.isReachable {
        // when there isn't something to draw, we might as well let the 
        // user know what's going on.
        if tokens.isEmpty {
          drawMessage("Requesting tokens")
        }
        session.sendMessage(["request":"loadAllTokens"], replyHandler: nil, errorHandler: nil)
      }
    }
  }
  
  // the currently drawn tokens, updated by drawTokens
  private var tokens:[Token] = []
  
  // the token table
  @IBOutlet weak var tokenTable: WKInterfaceTable!
  @IBOutlet weak var messageLabel: WKInterfaceLabel!
  

  // when we get new tokens from the phone
  private func receiveAllTokens(_ tokens:[[String:Any]]) {
    
    // map them to something we can save in the local keychain
    let toSave:[[String:Any]] = tokens.map() {
      let url = URL(string: $0[kKeyURL] as! String)!
      let token = Token(url: url)!
      return [
        kKeyURL: url.absoluteString,
        kKeyIssuer: token.issuer,
        kKeyAccount: token.name,
        kKeyOrdinal: $0[kKeyOrdinal]!
      ]
    }
    
    // save all the things to the watch keychain. this way we can
    // operate without the iphone
    if !Keychain.instance.addAll(tokens:toSave) {
      // failed to save, ouch.
      drawMessage("Keychain save failed")
      return
    }
    
    // and update the local state
    let newTokens:[Token] = tokens.map() {
      let url = URL(string: $0[kKeyURL] as! String)!
      return Token(url: url)!
    }
    
    drawTokens(newTokens)
    
  }
  
  private func drawTokens(_ newTokens:[Token]) {

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
    
    tokenTable.setHidden(true)
    messageLabel.setHidden(false)
    
  }
  
  // provide the token to the view
  override func contextForSegue(withIdentifier segueIdentifier: String, in table: WKInterfaceTable, rowIndex: Int) -> Any? {
    return tokens[rowIndex]
  }
  
  
}

class TokenRowController : NSObject {
  @IBOutlet weak var issuerLabel: WKInterfaceLabel!
  @IBOutlet weak var accountLabel: WKInterfaceLabel!
}
