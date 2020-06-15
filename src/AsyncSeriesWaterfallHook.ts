import { IHookOpts } from './types';

export const executeAsyncSeriesWaterfallHook = async (
  tapFns: IHookOpts['fn'][],
  ...args: any[]
) => {
  for (let i = 0; i < tapFns.length; i++) {
    let promiseResult = await tapFns[i](...args);
    if (
      typeof args[0] !== 'undefined' &&
      typeof promiseResult !== 'undefined'
    ) {
      args[0] = promiseResult;
    }
  }

  return args[0];
};
