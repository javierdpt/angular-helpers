/*
 * <app-widgets-truncate [text]="textToTruncate" [keepLast]="true" [limit]="20"></app-widgets-truncate>
 */

import { Component, Input, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'uct-widgets-truncate',
  template: `
    <span>
      <span [innerHtml]="val"></span><small><a *ngIf="truncated" style="cursor: pointer" (click)="toggle()">{{ toggler }}</a></small>
    </span>
  `
})
export class TruncateTextComponent implements OnInit {
  val: string;
  @Input() text: string;
  @Input() limit: number;
  @Input() keepLast: boolean;
  @Input() separator: string;
  @Input() animated: boolean;
  @Input() animationInterval: 10;
  @Input() textchange: EventEmitter<any>;
  truncated: boolean;
  toggler: string;
  private _truncatedPos: number;
  private _textWords: string[];
  private _truncatedAmountOfWords: number;

  constructor() {
    this.limit = 20;
    this.keepLast = false;
    this.separator = '...';
    this.animated = true;
  }

  ngOnInit() {
    this.toggler = this.separator;
    this._setUp();

    if (this.textchange) {
      this.textchange.subscribe(() => {
        this._setUp();
      });
    }
  }

  private _setUp() {
    this._truncatedPos = this._truncatePos();
    this.truncated = this._truncatedPos !== this.text.length;
    this._textWords = this.text.split(' ');
    this.val = this.text.substr(0, this._truncatedPos);
    this._truncatedAmountOfWords = this.val.split(' ').length;
  }

  toggle() {
    if (!this.animated) {
      if (this.val.length === this._truncatedPos) {
        this.val = this.text;
        this.toggler = ' (less)';
      } else {
        this.val = this.text.substr(0, this._truncatedPos);
        this.toggler = this.separator;
      }
    } else if (this.val.length === this._truncatedPos) {
      let words = this._truncatedAmountOfWords;
      let currPos = this._truncatedPos;
      while (this.text[currPos] !== ' ') {
        this.val += this.text[currPos];
        ++currPos;
      }
      let interval = setInterval(() => {
        this.val += ' ' + this._textWords[words++];
        if (words === this._textWords.length) {
          clearInterval(interval);
          this.toggler = ' (less)';
        }
      }, this.animationInterval);
    } else {
      let interval = setInterval(() => {
        let lastIndexOf = this.val.lastIndexOf(' ');
        this.val = this.val.substring(0, lastIndexOf);
        if (lastIndexOf <= this._truncatedPos) {
          clearInterval(interval);
          this.val = this.text.substring(0, this._truncatedPos);
          this.toggler = this.separator;
        }
      }, this.animationInterval);
    }
  }

  private _truncatePos() {
    if (this.text.length > this.limit && this.keepLast) {
      let resp = this.limit;
      while (this.text.charAt(resp) !== ' ') {
        resp++;
        if (resp > this.text.length) {
          return this.text.length;
        }
      }
      return resp;
    } else if (this.text.length > this.limit) {
      return this.limit;
    }
    this.truncated = false;
    return this.text.length;
  }
}
