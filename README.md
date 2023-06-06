# ![RealWorld Example App](logo.png)

This project is a clone of [solid-realworld].

The following changes have be made:

- [X] Builds & runs with yarn/vite
- [X] Converted source to typescript
- [X] Rationalised code and added extensive comments
- [X] Add Follow & Favorite to Article
- [ ] Select an article page directly via URL/slug

## Progress

* Finally got rid of all the typescript type errors.
* The Home page, lists articles and pagination works
* Favourites set/unset works on home page
* Can select article on home page and view complete article
* Favourites set/unset works on article page

Selecting an article page directly via URL **fails**. This is because
the page tries to display before the article has loaded.

Investigating article load problem, I can see that homebrew router and server API client are
complex and seriously crappy. I need to:

* Replace server API client with one based directly on openAPI
* Replace home router with @solidjs/router

This is not straightforward, I need to do some reading

## Links

The canonical [realworld] project links.

* The reference demo for the project [demo.realworld.io]
* The demo source [angularjs-realworld-example-app]

[angularjs-realworld-example-app]: https://github.com/gothinkster/angularjs-realworld-example-app
[demo.realworld.io]: https://demo.realworld.io/#/
[realworld]:https://github.com/gothinkster/realworld
[solid-realworld]: https://github.com/solidjs/solid-realworld

