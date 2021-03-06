import WatchKit

class ExtensionDelegate: NSObject, WKExtensionDelegate {

    func applicationDidFinishLaunching() {
      print("did finish launching")
      
      // watch doesnt use a synchronizable keychain
      Keychain.instance.synchronizable = kCFBooleanFalse
      
    }

    func applicationDidBecomeActive() {
      print("did become active")
    }

    func applicationWillResignActive() {
      print("will resign active")
    }

}
