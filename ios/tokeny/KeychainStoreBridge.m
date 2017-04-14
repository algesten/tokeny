//
//  KeychainStoreBridge.m
//  tokeny
//
//  Created by martin on 2017-04-14.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <React/RCTBridgeModule.h>
//#import "tokeny-Swift.h"

@interface RCT_EXTERN_MODULE(KeychainStore, NSObject)

RCT_EXTERN_METHOD(readAll:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(saveAll:(NSDictionary<NSString *, id> * _Nonnull)dict (RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

@end
