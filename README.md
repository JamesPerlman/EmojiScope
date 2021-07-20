# How to run the app

1. Clone the repository
  ```bash
  git clone git@github.com:JamesPerlman/EmojiScope
  ```

2. `cd` into the project folder
  ```bash
  cd EmojiScope
  ```

2. Install dependencies with yarn
  ```bash
  yarn
  ```

3. Start the react packager
  ```bash
  yarn start
  ```

4. View the EmojiScope web app in a browser!
  Go to http://localhost:3000

# Technologies Used
* ReactJS: This is a [ReactJS](https://reactjs.org/) web app.  ReactJS is a beautiful framework for making declarative, component-based user interfaces.
* TypeScript: This app is built entirely in [TypeScript](https://www.typescriptlang.org/), so we have type-checking and IntelliSense code-completion if you're using VS Code.
* API
  * For the actual data we are leveraging to https://emoji-api.com/ - Many thanks to the developers there for providing a free service.
  * In code, we are using [Axios](https://github.com/axios/axios) 
  * For data deserialization, we are using [io-ts](https://github.com/gcanti/io-ts) which is a beautiful library for JSON decoding, among many other things.
* Navigation: we are using [React Router](https://reactrouter.com/) which is an industry-standard library for routing in ReactJS for web
* Misc UI:
  * We are using [TailWind CSS](https://tailwindcss.com/) to make styling a lot easier.
  * We are leveraging [React Measure](https://github.com/souporserious/react-measure) for reactive styling in certain components
* State Management
  * We are using [Redux](https://redux.js.org/) and [react-redux](https://github.com/reduxjs/react-redux) as the basis of our app data management
  * We are using [Redux-Saga](https://github.com/redux-saga/redux-saga) for management of side effects

And that's it for our basic stack!  All the UI components like the reactive grid were hand-coded by me, James Perlman!

I hope you enjoy what I've created!


# Inspiration

The magnification effect was inspired by the Mac OSX "Genie" effect on the dock and also the way the apps are displayed on the Apple Watch.  There are some files in the research/ folder and there is an interactive demo of the mathematical functions used here: https://www.desmos.com/calculator/er0h1nyfil
