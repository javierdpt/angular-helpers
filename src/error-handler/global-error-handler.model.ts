import { HttpErrorResponse } from '@angular/common/http';
import { NgZone } from '@angular/core';

export interface IAppError {
    message: string;
    promise: Promise<Error | HttpErrorResponse>;
    rejection: Error | HttpErrorResponse;
    stack: string;
    task: any;
    zone: NgZone;
}
