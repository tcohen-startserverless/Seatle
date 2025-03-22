/* This file is auto-generated by SST. Do not edit. */
/* tslint:disable */
/* eslint-disable */
/* deno-fmt-ignore-file */

declare module "sst" {
  export interface Resource {
    "Auth": {
      "type": "sst.aws.Auth"
      "url": string
    }
    "MyBucket": {
      "name": string
      "type": "sst.aws.Bucket"
    }
    "Table": {
      "name": string
      "type": "sst.aws.Dynamo"
    }
    "api": {
      "name": string
      "type": "sst.aws.Function"
      "url": string
    }
    "email": {
      "configSet": string
      "sender": string
      "type": "sst.aws.Email"
    }
  }
}
/// <reference path="sst-env.d.ts" />

import "sst"
export {}