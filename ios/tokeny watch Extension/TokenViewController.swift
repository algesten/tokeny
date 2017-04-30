import WatchKit
import OneTimePassword
import CoreGraphics

class TokenViewController: WKInterfaceController {
  
  @IBOutlet weak var progressGroup: WKInterfaceGroup!
  @IBOutlet weak var issuerLabel: WKInterfaceLabel!
  @IBOutlet weak var accountLabel: WKInterfaceLabel!
  @IBOutlet weak var passwordLabel: WKInterfaceLabel!

  @IBOutlet weak var passwordSegmentGroup: WKInterfaceGroup!
  @IBOutlet weak var passwordSegment1Label: WKInterfaceLabel!
  @IBOutlet weak var passwordSegment2Label: WKInterfaceLabel!
  
  // timer to update the view
  var timer: Timer?

  // helper to start the timer, set by awake
  var startTimer = {}

  func stopTimer() {
    timer?.invalidate()
    timer = nil
  }
  
  
  override func awake(withContext context: Any?) {
    
    // the context is the token passed from the table
    if let token = context as? Token {

      issuerLabel.setText(token.issuer)
      accountLabel.setText(token.name)

      // if we have exactly 6 digits in this password,
      // we use the 2 x 3 segments instead of all in one row
      let isSix = token.currentPassword?.characters.count == 6
      passwordSegmentGroup.setHidden(!isSix)
      passwordLabel.setHidden(isSix)

      func update(_ cur:String) {
        passwordLabel.setText(cur)
        passwordSegment1Label.setText(cur.substring(from: 0, length: 3))
        passwordSegment2Label.setText(cur.substring(from: 3))
      }
      
      // run once to set current values
      let cur = token.currentPassword!
      update(cur)
      
      let totpPeriod = 30.0
      
      // helper to start a timer
      startTimer = { [weak self] in
        
        // if there is one running
        self?.stopTimer()
        
        // start a timer that repeatedly will update the progress
        self?.timer = Timer.scheduledTimer(withTimeInterval: 0.05, repeats: true) { _ in
          
          // current time in millis
          let now = NSDate().timeIntervalSince1970
          
          // attempt to force generate a password since accessing token.currentPassword
          // seems to stop doing anything on stuff uploaded to the app store
          do {
            let txt = try token.generator.password(at:Date())
            update(txt)
          } catch {
            print(error)
          }
          
          let progress = 1.0 - (ceil(now / totpPeriod) * totpPeriod - now) / totpPeriod
          self?.drawProgress(progress:progress)
        }
      }
      
      // and start it
      startTimer()

    }
    
  }
  
  override func willDisappear() {
    stopTimer()
  }
  
  override func willActivate() {
    // if the lock screen comes on/off we get a deactivate/activate
    startTimer()
  }
  
  override func didDeactivate() {
    stopTimer()
  }
  
}

// MARK: - Progress line

private let lineWidth: CGFloat = 3

extension TokenViewController {
  
  func drawProgress(progress: Double) {
    
    let width = self.contentFrame.size.width
    let size = CGSize(width:width, height:width)
    let rect = CGRect(origin: CGPoint.zero, size: size)
    
    UIGraphicsBeginImageContext(size)
    guard let context = UIGraphicsGetCurrentContext() else {
      return
    }
    
    let halfLineWidth = lineWidth / 2
    let ringRect = rect.insetBy(dx: halfLineWidth, dy: halfLineWidth)
    
    context.setLineWidth(lineWidth)
    
    context.setStrokeColor(UIColor.tocanGray.cgColor)
    context.strokeEllipse(in: ringRect)
    
    context.setStrokeColor(UIColor.tocanYellow.cgColor)
    context.addArc(center:CGPoint(x: ringRect.midX, y: ringRect.midY), radius: ringRect.width/2, startAngle: CGFloat(-Double.pi / 2), endAngle: CGFloat(2 * Double.pi * progress - Double.pi / 2), clockwise: true)
    
    context.strokePath()
    
    // Convert to UIImage
    let cgimage = context.makeImage()!
    let uiimage = UIImage(cgImage: cgimage)
    
    // and slot into our holder group
    progressGroup.setBackgroundImage(uiimage)
    
    // End the graphics context
    UIGraphicsEndImageContext()
  }
  
}
