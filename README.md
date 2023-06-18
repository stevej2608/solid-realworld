# ![RealWorld Example App](logo.png)

This project is a clone of [solid-realworld].

The following changes have be made:

- [X] Builds & runs with yarn/vite
- [X] Converted source to typescript
- [X] Rationalised code and added extensive comments
- [X] Add Follow & Favorite to Article
- [X] Select an article page directly via URL/slug
- [X] Article comments now load
- [ ] Replace server API client with one based directly on openAPI
- [ ] Replace home router with @solidjs/router

## Log Messages

The application has an embedded logger that outputs to the console and
to the vscode debugger. The logger resolves log message file and line
numbers using [stacktracey] which uses [get-source]

The logger is primarily used as a coding/debugging aid. The following

Server *Vite dev*

- [x] Firefox
- [x] Chrome

Server *Vite preview*

- [x] Chrome
- [ ] Firefox

Server *VSCODE Go Live*

- [x] Chrome
- [ ] Firefox

enqueue@http://127.0.0.1:4000/assets/index-e80f7c45.js:258:12
at http://127.0.0.1:4000/assets/index-e80f7c45.js:264:12\n

## Links

The canonical [realworld] project links.

* The reference demo for the project [demo.realworld.io]
* The demo source [angularjs-realworld-example-app]

[How to manage Promises into dynamic queue with vanilla JavaScript]: https://medium.com/@karenmarkosyan/how-to-manage-promises-into-dynamic-queue-with-vanilla-javascript-9d0d1f8d4df5
[get-source]: https://www.npmjs.com/package/get-source
[stacktracey]: https://www.npmjs.com/package/stacktracey/v/1.0.68
[angularjs-realworld-example-app]: https://github.com/gothinkster/angularjs-realworld-example-app
[demo.realworld.io]: https://demo.realworld.io/#/
[realworld]:https://github.com/gothinkster/realworld
[solid-realworld]: https://github.com/solidjs/solid-realworld

