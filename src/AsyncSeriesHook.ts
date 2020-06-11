import { Hook } from './Hook';
import { HookFactoryOption, HookFactory } from './HookFactory';

class AsyncSeriesHookFactory extends HookFactory {
  execute = async (...arg: unknown[]) => {
    const { args, callback } = this.getArgsAndCallback(arg);
    const tapFns = this.getTapFunctions();

    let results: unknown[] = [];
    let error: Error | undefined;
    for (let i = 0; i < tapFns.length; i++) {
      try {
        results.push(await tapFns[i](...args));
      } catch (e) {
        error = e;
        break;
      }
    }

    if (typeof callback === 'function') {
      if (error) {
        callback(error);
        return;
      }
      callback(null, results);
    }
  };
}

export class AsyncSeriesHook<T = any, R = any> extends Hook<T, R> {
  constructor(name?: string) {
    super(name);

    // @ts-ignore
    this.call = undefined;
  }
  compile(options: HookFactoryOption) {
    return new AsyncSeriesHookFactory(options).execute;
  }
}
