/**
 * How to use it:
 * Enable by url:
 *     Pass the query string params enableTracing=(true | false) and tracingLevel=('debug' | 'info' | 'warn' | 'error')
 *     and grouped=(true | false) if want to disabled the browser's group log capability
 *     http://localhost:4200/?enableTracing=true&tracingLevel=error&grouped=false
 *     https://url.com/?enableTracing=false
 *
 * Enable Manually:
 *     Run the following in the browser's console
 *     `
 *         sessionStorage.setItem('trace-config', 'enabled');
 *         sessionStorage.setItem('trace-level-config', 'info');
 *         sessionStorage.setItem('trace-grouped-config', 'false');
 *     `
 */

import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import dayjs from 'dayjs';
import { timer } from 'rxjs';
import { ENVIRONMENT, IEnvironmentSettings } from './environment-ref.service';
import { CONSOLE, WINDOW } from './injection-token.service';
import { ErrorLevelEnum, GroupedEnum } from './logger.model';
import { UtilsService } from './utils.service';

@Injectable({
    providedIn: 'root'
})
export class LoggerService {
    enabled?: boolean;
    grouped?: boolean;
    level?: ErrorLevelEnum;
    logToScreen?: boolean;
    logCount = 0;
    displayLoggedErrorsTime = 16000; // 16 sec
    private _traceEnabledCacheKey = 'trace-config';
    private _traceLevelCacheKey = 'trace-level-config';
    private _traceGroupedCacheKey = 'trace-grouped-config';
    private _logToScreenCacheKey = 'trace-log-to-screen-config';

    constructor(
        @Inject(WINDOW) windowRef: Window,
        @Inject(DOCUMENT) private readonly _document: Document,
        @Inject(CONSOLE) private readonly _consoleRef: Console,
        @Inject(ENVIRONMENT) private readonly _env: IEnvironmentSettings,
        private readonly _utils: UtilsService
    ) {
        // Registering global logger
        windowRef.logger = this;
    }

    /**
     * Enable: QueryParam enableTracing=(true | false)
     * Levels: QueryParam tracingLevel = ('debug' | 'info' | 'warn' | 'error')
     *         'info" by default if `enableTracingLevel` is not provided
     * Enable log group feature: QueryParam grouped=(true | false)
     *         true by default if `grouped` is not provided
     *
     *    E.g: http://localhost:4200/?enableTracing=true&tracingLevel=error&&grouped=false
     */
    initEnableTracing(): void {
        this._init();

        const enableTracing = this._utils.getUrlParameter('enableTracing');

        if (!enableTracing && this.enabled) {
            this._lg('*'.repeat(50));
            this._lg('*' + this._utils.centerText(
                48, 'Trace enabled (' + ErrorLevelEnum[this.level ?? ErrorLevelEnum.error] + ')') + '*');
            this._lg('*'.repeat(50));
            return;
        }

        if (enableTracing === 'true') {
            this._enableTrace(
                this._utils.getUrlParameter('tracingLevel') as 'debug' | 'info' | 'warn' | 'error',
                this._utils.getUrlParameter('grouped') as 'true' | 'false',
                this._utils.getUrlParameter('logToScreen') as 'true' | 'false');
            return;
        }

        if (enableTracing === 'false') {
            this._disableTrace();
            return;
        }
    }

    sayHi(): void {
        this._lg('*'.repeat(55));
        this._lg('*' + this._utils.centerText(53, 'COMPANY') + '*');
        this._lg('*' + ' Greetings human. You\'re an curious one' + ' '.repeat(14) + '*');
        this._lg('*' + '   Please check us out at https://www.company.com ' + ' '.repeat(2) + '*');
        this._lg('*' + '   For careers check https://jobs.company.com ' + ' '.repeat(6) + '*');
        this._lg('*' + '   See you around :)' + ' '.repeat(33) + '*');
        this._lg('*'.repeat(55));
    }

    trace(...args: any): void {
        this._incrementCount('debug');
        this._lg(...args);
    }

    log(
        level: 'debug' | 'info' | 'warn' | 'error',
        message?: any,
        force: boolean = false
    ): void {
        if (!this._logEnabled(level, force) || !this._consoleRef.log) {
            return;
        }

        this._incrementCount(level);
        this._lg(this._getLogDetails(level), message);
    }

    logInfo(
        level: 'debug' | 'info' | 'warn' | 'error',
        message?: any,
        force: boolean = false
    ): void {
        if (!this._logEnabled(level, force)) { return; }

        this._incrementCount(level);

        if (this._consoleRef.info) {
            this._consoleRef.info(this._getLogDetails(level), message);
        } else {
            this.log(level, message, force);
        }
    }

    logError(
        level: 'debug' | 'info' | 'warn' | 'error',
        error?: any,
        force: boolean = false
    ): void {
        if (!this._logEnabled(level, force)) { return; }

        this._incrementCount(level);

        if (this._consoleRef && this._consoleRef.error) {
            this._consoleRef.error(this._getLogDetails(level), error);
        } else {
            this.log(level, error, force);
        }
    }

    logGroup(
        level: 'debug' | 'info' | 'warn' | 'error',
        type: 'log' | 'error' | 'info',
        groupTitle: string,
        groupCollapsed: boolean,
        force: boolean,
        ...items: any[]
    ): void {
        if (!this._logEnabled(level, force)) { return; }

        if (groupCollapsed) {
            this.initGroupCollapsed(level, groupTitle, force);
        } else {
            this.initGroup(level, groupTitle, force);
        }

        for (let i = 0, length = items.length; i < length; i++) {
            switch (type) {
                case 'log':
                    this.log(level, items[i], force);
                    break;
                case 'error':
                    this.logError(level, items[i], force);
                    break;
                case 'info':
                    this.logInfo(level, items[i], force);
                    break;
            }
        }

        this.groupClose(level, force);
    }

    logHttpErrorResponse(
        level: 'debug' | 'info' | 'warn' | 'error',
        error: HttpErrorResponse | any,
        force: boolean = false,
        group: boolean = true
    ): void {
        if (!error) { return; }

        if (group) {
            this.initGroupCollapsed(level, `Http Error logged for: ${error.url || error.message || error}`, force);
        }

        this.logError(
            level,
            `
  Error Request Info:
    Url: ${error.url}
    Status: (${error.status}) ${error.statusText}
    Ok: ${error.ok}
    ErrorMsg: ${error.message}
    Error:
`,
            force
        );
        this.logError(level, error.error, force);

        if (group) { this.groupClose(level, force); }
    }

    initGroup(
        level: 'debug' | 'info' | 'warn' | 'error',
        groupTitle: string,
        force: boolean = false
    ): void {
        if (!this._logEnabled(level, force)) { return; }

        if (this.grouped && this._consoleRef.group) {
            this._consoleRef.group(this._getLogDetails(level), groupTitle);
        } else {
            this.log(
                'debug',
                `Group ${groupTitle}` +
                '-'.repeat(
                    groupTitle.length < 50
                        ? 50 - groupTitle.length - (groupTitle.length ? 1 : 0)
                        : 0
                ),
                force
            );
        }
    }

    initGroupCollapsed(
        level: 'debug' | 'info' | 'warn' | 'error',
        groupTitle: string,
        force: boolean = false
    ): void {
        if (!this._logEnabled(level, force)) { return; }

        if (this.grouped && this._consoleRef && this._consoleRef.groupCollapsed) {
            this._consoleRef.groupCollapsed(this._getLogDetails(level), groupTitle);
        } else {
            this.log(
                'debug',
                `Group ${groupTitle}` +
                '-'.repeat(groupTitle.length < 50 ? 50 - groupTitle.length - (groupTitle.length ? 1 : 0) : 0),
                force
            );
        }
    }

    groupClose(
        level: 'debug' | 'info' | 'warn' | 'error',
        force: boolean = false
    ): void {
        if (!this._logEnabled(level, force)) { return; }

        if (this.grouped && this._consoleRef.groupEnd) {
            this._consoleRef.groupEnd();
        } else {
            this.log('debug', 'End Group ' + '-'.repeat(50), force);
        }
    }

    displayLoggedItems(
        counter: number | undefined | null,
        type: 'error' | 'info' | 'warn' | 'debug' = 'debug'
    ): void {
        let elm = this._document.getElementById('static-log-counter');
        const animationElm = this._document.getElementById('heartbeat-animation');
        if (!animationElm) {
            const style = this._document.createElement('style');
            style.id = 'heartbeat-animation';
            style.innerText = `@keyframes heartbeat {
    0% { transform: scale(.8); }
    25% { transform: scale(1.1); }
    50% { transform: scale(.8); }
    75% { transform: scale(1.1); }
    100% { transform: scale(.8); }
}`;
            this._document.head.appendChild(style);
        }
        if (!elm) {
            elm = this._document.createElement('div');
            elm.id = 'static-log-counter';
            elm.style.position = 'fixed';
            elm.style.bottom = '10px';
            elm.style.right = '10px';
            elm.style.borderRadius = '50%';
            elm.style.width = '50px';
            elm.style.height = '50px';
            elm.style.display = 'flex';
            elm.style.alignItems = 'center';
            elm.style.justifyContent = 'center';
            elm.style.backgroundColor = 'rgba(0, 0, 0, .3)';
            elm.style.fontSize = '1.1rem';
            elm.style.fontWeight = '600';
            elm.style.zIndex = '99999';
            elm.style.animation = 'heartbeat 2s infinite linear';
            this._document.body.append(elm);
            timer(this.displayLoggedErrorsTime).subscribe(() => {
                this._document.body.removeChild(elm!);
            });
        }

        switch (type) {
            case 'error':
                elm.style.backgroundColor = 'rgba(244, 67, 54, .3)';
                elm.style.color = 'rgb(244, 67, 54)';
                break;
            case 'info':
                elm.style.backgroundColor = 'rgba(33, 150, 243, .3)';
                elm.style.color = 'rgb(33, 150, 243)';
                break;
            case 'warn':
                elm.style.backgroundColor = 'rgba(173, 115, 19, .3)';
                elm.style.color = 'rgb(33, 150, 243)';
                break;
            default:
                elm.style.backgroundColor = 'rgba(0, 0, 0, .3)';
                elm.style.color = 'white';
        }
        elm.className = type;
        elm.innerText = (counter ?? this.logCount).toString();
    }

    private _lg(...args: any): void {
        this._consoleRef.log(...args);
    }

    private _incrementCount(level: 'debug' | 'info' | 'warn' | 'error'): void {
        ++this.logCount;
        if (!this._env.production || this._logEnabled(level, false)) {
            this.displayLoggedItems(this.logCount, level as 'error' | 'info');
        }
    }

    private _init(): void {
        this.enabled = sessionStorage.getItem(this._traceEnabledCacheKey) === 'enabled';
        this.grouped = sessionStorage.getItem(this._traceGroupedCacheKey) === 'false' ? false : true;
        this.logToScreen = sessionStorage.getItem(this._logToScreenCacheKey) === 'true';
        this.level = ErrorLevelEnum[sessionStorage.getItem(this._traceLevelCacheKey) as 'debug' | 'info' | 'warn' | 'error'];
    }

    private _enableTrace(
        level: 'debug' | 'info' | 'warn' | 'error',
        grouped: 'true' | 'false',
        logToScreen: 'true' | 'false'
    ): void {
        sessionStorage.setItem(this._traceEnabledCacheKey, 'enabled');

        const lev = ErrorLevelEnum[ErrorLevelEnum[level]] ?? 'info';
        sessionStorage.setItem(this._traceLevelCacheKey, lev);

        const groupedValue = GroupedEnum[GroupedEnum[grouped]] ?? 'true';
        sessionStorage.setItem(
            this._traceGroupedCacheKey,
            groupedValue.toString()
        );

        sessionStorage.setItem(
            this._logToScreenCacheKey,
            logToScreen.toString()
        );

        this._lg('*'.repeat(50));
        this._lg('*' + this._utils.centerText(48, `Trace enabled for (${lev})`) + '*');
        this._lg('*'.repeat(50));

        this._init();
    }

    private _disableTrace(): void {
        sessionStorage.removeItem(this._traceEnabledCacheKey);
        sessionStorage.removeItem(this._traceLevelCacheKey);
        sessionStorage.removeItem(this._traceGroupedCacheKey);

        this._lg('*'.repeat(50));
        this._lg('*' + this._utils.centerText(48, 'Trace disabled') + '*');
        this._lg('*'.repeat(50));

        this._init();
    }

    private _getLogDetails(level: 'debug' | 'info' | 'warn' | 'error'): string {
        return this._utils.padText(21, 'right', dayjs().format('YYYY-MM-DD HH:mm:ss')) +
            this._utils.padText(6, 'right', level);
    }

    private _logEnabled(level: 'debug' | 'info' | 'warn' | 'error', force: boolean): boolean {
        return force || (this.enabled ?? false) && ErrorLevelEnum[level] >= (this.level ?? ErrorLevelEnum.error);
    }
}

declare global {
    interface Window { logger: LoggerService }
    const logger: LoggerService;
}
