# envlist

Micro-module (without dependency) for resolving the type of runtime environment between your application convention and another convention (like `NODE_ENV`).


## Why?

### The problem

Like the debug of _Express_ and some _Express_ middlewares, few modules of _Node.js_ require to put `NODE_ENV` to `production` or `development` for changing the behavior of execution.

In the real world, it is common to use several environment names like `local`, `staging`, `testing`.
Also it is common to use shortcuts and several environment names like `prod`, `dev`, `stage`, `test`, `local`.

The problem is that in defining `NODE_ENV` to `local` (or another alias of a `development` env), we do not get the full functionality of debugging of some modules.

Also in defining `NODE_ENV` to `prod`, we do not get the optimizations made to the `production` environment.

### The solution

A simple and useful solution is to map your application environment to a conventional `NODE_ENV` environment.
Then consolidate all :bulb:

## Install

```sh
npm install --save envlist
```

or

```sh
yarn add envlist
```


## Usage

By default `envlist` has preconfigured environments (of course you can replace it).

```js
let EnvList = require('envlist');
let envList = new EnvList();
```

### List all types of environments

```js
console.log(envList.envs);
```

Output:

```js
  local: {
    APP_ENV: 'local',
    NODE_ENV: 'development'
  },
  dev: {
    APP_ENV: 'dev',
    NODE_ENV: 'development'
  },
  stage: {
    APP_ENV: 'stage',
    NODE_ENV: 'production'
  },
  test: {
    APP_ENV: 'test',
    NODE_ENV: 'development'
  },
  prod: {
    APP_ENV: 'prod',
    NODE_ENV: 'production'
  }
}
```


### Customize a specific environment

You can customize each environment. Example by default the value of
`envList.envs.test.NODE_ENV` is `development`. If you want to change this value:

```js
envList.envs.test.NODE_ENV = 'production';
```

`envList.envs` it's just an object (see above).


### Use your own set of environments

```js
envList.envs = {
  development: {
    APP_ENV: 'development',
    NODE_ENV: 'development'
  },
  production: {
    APP_ENV: 'production',
    NODE_ENV: 'production'
  },
  staging: {
    APP_ENV: 'staging',
    NODE_ENV: 'production'
  },
  test: {
    APP_ENV: 'test',
    NODE_ENV: 'production'
  },
  demoProd: {
    APP_ENV: 'demoProd',
    NODE_ENV: 'production'
  },
  demoDev: {
    APP_ENV: 'demoDev',
    NODE_ENV: 'development'
  }
};
```


### Get a specific environment name

```js
// dev
console.log(envList.envs.dev.APP_ENV);
console.log(envList.get('dev').APP_ENV);

// development
console.log(envList.envs.dev.NODE_ENV);
console.log(envList.get('dev').NODE_ENV);

// prod
console.log(envList.envs.prod.APP_ENV);
console.log(envList.get('prod').APP_ENV);

// production
console.log(envList.envs.prod.NODE_ENV);
console.log(envList.get('prod').NODE_ENV);
```

### Get the current environment

Considers that the process was launched with the command: `node APP_ENV=dev app.js`

```js
// dev
envList.env;

// dev
envList.APP_ENV;

// development
envList.NODE_ENV;

/*
  {
    APP_ENV: 'dev',
    NODE_ENV: 'development'
  }
*/
envList.getCurrent();
```

### Ensure the current environment

It may be useful to ensure that the current environment is good
and change it if it's not the desired one.

Example, ensure the `dev` environment:

```js
envList.ensure('dev');
```

In this example, if the current environment is not equal to `dev`,
this method change and consolidate the current environment.

Does nothing if the current environment is equal to `dev`.


### Use your own resolver

Considers that you have installed Gulp and `gulp-util` and you want to support `env.type`:

```js
let gutil = require('gulp-util');

envList.resolveAppEnv = function() {
  envList.env = process.env.APP_ENV || process.env.NODE_ENV || gutil.env.type;

  if(envList.env && envList.has(envList.env)) {
    return this;
  }

  throw new ReferenceError('Environment not found.');
}
```

### Use your own consolidator

Considers that you have installed Gulp and `gulp-util` and you want consolidate also `env.type`:

```js
let gutil = require('gulp-util');

envList.consolidate = function() {
  let current;

  if(!envList.env) {
    envList.resolveAppEnv();
  }

  if(process && process.env) {
    current = envList.getCurrent();

    process.env.APP_ENV = current.APP_ENV;
    process.env.NODE_ENV = current.NODE_ENV;
    gutil.env.type = current.NODE_ENV;
  }

  return envList;
}
```

If you use a framework that handle the environment based on `NODE_ENV` value (like _Express.js_),
consolidate the environment before loading _Express.js_.


## Unit tests

`envlist` is unit tested with [Mocha](https://mochajs.org) and [Unit.js](https://unitjs.com).

Run the tests
```shell
cd node_modules/envlist && npm install && npm test
```


## LICENSE

[MIT](https://github.com/Nicolab/envlist/blob/master/LICENSE) (c) 2016, Nicolas Tallefourtane.


## Author

| [![Nicolas Tallefourtane - Nicolab.net](https://www.gravatar.com/avatar/d7dd0f4769f3aa48a3ecb308f0b457fc?s=64)](http://nicolab.net) |
|---|
| [Nicolas Talle](https://nicolab.net) |
| [![Make a donation via Paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=PGRH4ZXP36GUC) |
