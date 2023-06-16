import dateFormat  from 'dateformat'

// https://github.com/baryon/tracer#customize-output-format
// https://stackoverflow.com/a/47061161
// https://stackoverflow.com/questions/9559725/extending-console-tracer.info-without-affecting-tracer.info-line
// https://dev.to/maxbvrn/extend-console-s-methods-without-losing-line-information-2d68

// export const logger = tracerSetup({
//   format: '{{timestamp}} {{message}}  [{{file}}:{{line}}]',
//   dateformat: 'HH:MM:ss',

//   transport: function (data: ITransport) {
//     if (data.title === 'warn') {
//       queueMicrotask(console.warn.bind(console, data.output))
//     } else if (data.level > 4) {
//       queueMicrotask(console.error.bind(console, data.output))
//     } else {
//       queueMicrotask(console.tracer.info.bind(console, data.output))
//     }
//   }
// })

// export const logger = {
//   info:  (msg, args) => {
//     queueMicrotask(console.tracer.info.bind(console, msg, args))
//   }
// }

// tracer.info = function() {
//   var context = "My Descriptive Logger Prefix:";
//   return Function.prototype.bind.call(console.tracer.info, console, context);
// }();

// export const Xlogger = {

//   info: ((): ((message: string) => void) => {
//     const context = 'My Descriptive Logger Prefix:'

//     return (message: string): void => {
//       console.tracer.info(context, message)
//     }
//   })()
// }

// const _log = console.tracer.info
// const _warn = console.warn
// const _error = console.error

const timestamp = () => {
  return dateFormat(new Date(), 'HH:MM:ss')
}

// This works !
// https://dev.to/maxbvrn/extend-console-s-methods-without-losing-line-information-2d68

// console.tracer.info = function () {
//   const fn = Function.prototype.bind.call(_log, console, "%s", 'TEST')
//   return fn
// }()

// if (Function.prototype.bind) {
//   window.tracer.info = Function.prototype.bind.call(console.tracer.info, console);
// }
// else {
//   window.tracer.info = function() {
//       Function.prototype.apply.call(console.tracer.info, console, arguments);
//   };
// }


class LoggerClass {
  debugMode = true;
  constructor( name ) { this.name = name; }
  get info() {
      if ( this.debugMode ) {
          return window.console.info.bind( window.console, timestamp() );
      } else {
          return () => {};
      }
  }
}

const tracer = new LoggerClass( 'foo' );


export const setLogLevel = (level: number) => {
  tracer.info('setLogLevel', level, 1)
  tracer.info('setLogLevel(%d) %d', level, 2 )
  tracer.info('setLogLevel(%d) %d', level, 3)
  tracer.info('setLogLevel(%d) %d', level, 4)
  tracer.info('setLogLevel(%d) %d', level, 5)
  tracer.info('setLogLevel(%d) %d', level, 6)
}
