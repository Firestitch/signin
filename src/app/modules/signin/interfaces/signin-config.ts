import { Component, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';

export interface SigninConfig {
  emailChanged?: () => Observable<any>;
  beforeProcessSignin?: (response) => Observable<any>;
  processSignin?: (response, redirect) => Observable<any>;
  afterProcessSignin?: (response) => Observable<any>;
  showSocialSignins?: boolean;
  trustedDeviceExpiryDays?: number;
  signinMeta?: () => any;
}