import WatchKit

class ExtensionDelegate: NSObject, WKExtensionDelegate {

    func applicationDidFinishLaunching() {
      print("did finish launching")
    }

    func applicationDidBecomeActive() {
      print("did become active")
    }

    func applicationWillResignActive() {
      print("will resign active")
    }

}
