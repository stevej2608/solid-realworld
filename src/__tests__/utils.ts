
export const flushPromises = (): Promise<Function> => {
  return new Promise(resolve => setImmediate(resolve));
}

