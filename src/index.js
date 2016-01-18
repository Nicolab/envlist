/**
 * This file is part of envlist.
 *
 * (c) Nicolas Tallefourtane <dev@nicolab.net>
 *
 * For the full copyright and license information, please view the LICENSE file
 * distributed with this source code
 * or visit https://github.com/Nicolab/envlist.
 */

'use strict';

class EnvList {
  constructor() {
    this.env = null;

    this.envs = {
      dev: {
        APP_ENV: 'dev',
        NODE_ENV: 'development'
      },
      local: {
        APP_ENV: 'local',
        NODE_ENV: 'development'
      },
      prod: {
        APP_ENV: 'prod',
        NODE_ENV: 'production'
      },
      stage: {
        APP_ENV: 'stage',
        NODE_ENV: 'production'
      },
      test: {
        APP_ENV: 'test',
        NODE_ENV: 'test'
      },
      testProd: {
        APP_ENV: 'testProd',
        NODE_ENV: 'production'
      },
      testDev: {
        APP_ENV: 'testDev',
        NODE_ENV: 'development'
      }
    };
  }

  /**
   * Check and returns the `APP_ENV`.
   *
   * @type {string}
   * @throws Error see EnvList.get().
   * @throws ReferenceError see EnvList.get().
   */
  get APP_ENV() {
    return this.get(this.env).APP_ENV;
  }

  set APP_ENV(v) {
    throw new Error('EnvList.APP_ENV is read-only.');
  }

  /**
   * Check and returns the `NODE_ENV`.
   *
   * @type {string}
   * @throws Error see EnvList.get().
   * @throws ReferenceError see EnvList.get().
   */
  get NODE_ENV() {
    return this.get(this.env).NODE_ENV;
  }

  set NODE_ENV(v) {
    throw new Error('EnvList.NODE_ENV is read-only.');
  }

  /**
   * Resolve the `APP_ENV` environment, then assign it in `EnvList.env`).
   *
   * @return {EnvList}
   * @throws ReferenceError if the current environment is not defined.
   */
  resolveAppEnv() {
    this.env = process.env.APP_ENV || process.env.NODE_ENV;

    if(this.env && this.has(this.env)) {
      return this;
    }

    throw new ReferenceError('Environment not found.');
  }

  /**
   * Consolidate the environment from `APP_ENV` to `NODE_ENV`.
   *
   * @return {EnvList}
   */
  consolidate () {
    if(!this.env) {
      this.resolveAppEnv();
    }

    if(process && process.env) {
      process.env.APP_ENV = this.envs[this.env].APP_ENV;
      process.env.NODE_ENV = this.envs[this.env].NODE_ENV;
    }

    return this;
  }

  /**
   * Check if the current environment is `envName`.
   *
   * @param  {string} envName Environment name to check.
   * @return {bool}
   */
  is(envName) {
    return (this.env === envName);
  }

  /**
   * Check if the map has a given environment defined.
   *
   * @param  {string}  appEnvName Environment name (APP_ENV)
   * @return {bool}
   */
  has(appEnvName) {
    return this.envs[appEnvName] ? true : false;
  }

  /**
   * Get a given environment map.
   *
   * @param  {string} appEnvName (e.g: prod, dev, local, ...).
   * @return {object} The map.
   * @throws Error if the first argument is not provided.
   * @throws ReferenceError if the environment is not found.
   */
  get(appEnvName) {
    if(!appEnvName) {
      throw new Error(
        'The first argument is required in EnvList.get(appEnvName).'
      );
    }

    if(this.has(appEnvName)) {
      return this.envs[appEnvName];
    }

    throw new ReferenceError('Environment not found.');
  }

  /**
   * Get the current environment map.
   *
   * @return {object} The map of the current environment.
   * @throws Error if the `EnvList.env` is not defined (see EnvList.consolidate()).
   * @throws ReferenceError if the current environment is not found in the map.
   */
  getCurrent() {
    return this.get(this.env);
  }
}

module.exports = EnvList;
