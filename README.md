# Backend
* Truffle
* Ganache
* Ethereum Blockchain
* Metamask

### Setup

Complete all steps below, skipping those that are already installed. This is a one-time event. All setup is for Windows and steps may be different for other operating systems.

1. Clone Repo.
2. Install [node](https://nodejs.org).
3. Install testrpc: `npm install -g ethereumjs-testrpc`
4. Install truffle: `npm install -g truffle`
5. **Install local dependencies inside client folder: `npm install`

**You will have to run `npm install` after a pull if any new dependencies have been added to package.json. You will know pretty quickly if this is the case because you will get a "Cannot find module" error when you run the tests.

### Usage

Make sure Ganache and Metamask is up and running for this truffle project.

* Create ganache workspace for this project truffle config.
* Install Metamask extension in chrome.
* Cppy seed phrase from ganache and create metamask account at port : 7545

Run each of the following commands in separate shells and keep them running for development:

```
Inside transparent-fund folder

$ truffle develop
$ compile
$ migrate --reset

Inside client folder
$ npm install
$ npm start
```

### Truffle

The project follows truffle's workflow as much as possible. As such you
have the typical truffle commands:

```
$ truffle build
$ truffle console
$ truffle deploy
$ truffle serve
$ truffle test
$ truffle watch
```


# Frontend (React)

## Available Scripts

Inside the project directory transparent-fund/client, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

