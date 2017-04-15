#import <React/RCTBridgeModule.h>
//#import "tokeny-Swift.h"

@interface RCT_EXTERN_MODULE(KeychainStore, NSObject)

RCT_EXTERN_METHOD(readAll:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(saveAll:(NSArray*)tokens resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

@end
