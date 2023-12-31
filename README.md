# ![RealWorld Example App](logo.png)

![](./docs/img/real-world.png)

This project is a reworking of [solid-realworld].

The following updates have be made:

- [X] Builds & runs with Vite
- [X] Source is now fully typed typescript
- [X] Rationalised code and added extensive comments
- [X] Added Follow & Favorite to Article
- [X] Select an article page directly via URL/slug
- [X] Article comments now load
- [X] Replace server API client with one based directly on openAPI
- [X] Added diagnostic/debug logging
- [X] Added comprehensive Vitest mock testing
- [X] Updated workflow to build the project for GitHub Pages

## Running the project

The project is hosted on GitHub Pages, visit [solid-realworld](https://stevej2608.github.io/solid-realworld/)

To download, build and run the project locally, run the following commands (pnpm is used here but npm and yarn are both ok)

    git clone https://github.com/stevej2608/solid-realworld.git

    cd solid-realworld

    pnpm install

    pnpm dev

Visit [http://localhost:3000/](http://localhost:3000/)

## Testing

[vitest] is used for testing the application

    pnpm test

#### VSCODE debugging

In the vscode terminal window run the following command:

    pnpm dev

Then press F5 in VSCODE, a Chrome browser window will open.

Set breakpoints and modify the code as required. Hot module
replacement (HMR) is enabled.

A debug template for Firefox is included.

## LOC

| language | files | code | comment | blank | total |
| :--- | ---: | ---: | ---: | ---: | ---: |
| TypeScript JSX | 21 | 1,055 | 104 | 175 | 1,334 |
| TypeScript | 13 | 913 | 388 | 267 | 1,568 |
| CSS | 1 | 16 | 1 | 3 | 20 |

## Links

The canonical [realworld] project links.

* The reference demo for the project [demo.realworld.io]
* The demo source [angularjs-realworld-example-app]

[vitest]: https://vitest.dev/
[angularjs-realworld-example-app]: https://github.com/gothinkster/angularjs-realworld-example-app
[demo.realworld.io]: https://demo.realworld.io/#/
[realworld]:https://github.com/gothinkster/realworld
[solid-realworld]: https://github.com/solidjs/solid-realworld

