import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

import { IFsVerificationMethod } from '@firestitch/2fa';
import { FsAutoFocusDirective } from '@firestitch/common';
import { FsFormDirective } from '@firestitch/form';

import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { signinRequiresVerification } from '../../helpers';
import { SigninService } from '../../services';


@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordComponent implements AfterContentInit {

  @ViewChild(FsAutoFocusDirective, { static: true })
  public autofocus: FsAutoFocusDirective;

  @ViewChild(FsFormDirective, { static: true })
  public form: FsFormDirective;

  @Input() public email;
  @Input() public password;
  @Input() public emailExists = false;

  @Output() public signedIn = new EventEmitter<any>();
  @Output() public verificationRequired = new EventEmitter<IFsVerificationMethod>();
  @Output() public emailChange = new EventEmitter<any>();
  @Output() public passwordReset = new EventEmitter<any>();

  constructor(
    private _signService: SigninService,
  ) { }

  public ngAfterContentInit(): void {
    if(this.email && this.password) {
      setTimeout(() => {
        this.form.triggerSubmit(); 
      });
    }
  }

  public validatePassword = (): Observable<any> => {
    return this._signService
      .signin(this.email, this.password)
      .pipe(
        tap((response) => this.signedIn.emit(response)),
        catchError((response) => {
          if (signinRequiresVerification(response.status)) {
            this.verificationRequired.emit(response?.error?.data?.verificationMethod);

            return of(true);
          }

          this.autofocus.focus();

          return throwError(() => new Error(response.error.message));
        }),
      );
  };

  public submit = (): Observable<any> => {
    return of(true);
  };

  public changeEmail(): void {
    this.emailChange.emit();
  }

}
