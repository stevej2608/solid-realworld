/**
 * Queue promises so they are executed serially, see links bellow
*
* Converted to typescript by Anthropic/Claude LLM
*
* https://console.anthropic.com/chat/ee6e5f8f-e2db-4ad3-bf7a-f1c67db5d5c9
* https://medium.com/@karenmarkosyan/how-to-manage-promises-into-dynamic-queue-with-vanilla-javascript-9d0d1f8d4df5
* https://gist.github.com/ogostos/a04869d68313ee51f496b2996026d8ed#file-five-js
*
* ```
* Usage:
*
* const promise1 = Queue.enqueue(() => doSomething());
* const promise2 = Queue.enqueue(() => doAnotherThing());
*
* // Wait for promises to complete
*
* const result1 = await promise1;
* const result2 = await promise2;
* ```

*/

/* eslint-disable @typescript-eslint/no-explicit-any */

export class PromiseQueue {

  private workingOnPromise = false;

  private queue: {
    promise: () => Promise<any>,
    resolve: (value: any) => void,
    reject: (err: any) => void
  }[] = [];

  public enqueue<T>(promise: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        promise,
        resolve,
        reject,
      });
      this.dequeue();
    });
  }

  public dequeue() {
    if (this.workingOnPromise) {
      return false;
    }
    const item = this.queue.shift();
    if (!item) {
      return false;
    }
    try {
      this.workingOnPromise = true;
      item.promise()
        .then(value => {
          this.workingOnPromise = false;
          item.resolve(value);
          this.dequeue();
        })
        .catch(err => {
          this.workingOnPromise = false;
          item.reject(err);
          this.dequeue();
        });
    } catch (err) {
      this.workingOnPromise = false;
      item.reject(err);
      this.dequeue();
    }
    return true;
  }

}