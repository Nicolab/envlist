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

let em;
let test = require('unit.js');
let EnvList = require('../');

let ORIGIN_APP_ENV = process.env.APP_ENV;
let ORIGIN_NODE_ENV = process.env.NODE_ENV;

function initTestEnv(i) {
  em.envs['_testApp' + i] = {
    APP_ENV: '_testApp' + i,
    NODE_ENV: '_testNode' + i
  };
}

describe('EnvList', function() {
  beforeEach(function() {
    process.env.APP_ENV = ORIGIN_APP_ENV;
    process.env.NODE_ENV = ORIGIN_NODE_ENV;
    em = new EnvList();
  });

  afterEach(function() {
    em = null;
    process.env.APP_ENV = ORIGIN_APP_ENV;
    process.env.NODE_ENV = ORIGIN_NODE_ENV;
  });

  it('`envs` should be preconfigured', function() {
    test
      .object(em.envs)
        .is({
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
        })
    ;
  });

  it('envList.resolveAppEnv() should resolve from `APP_ENV`', function() {
    initTestEnv(1);
    process.env.APP_ENV = '_testApp1';
    process.env.NODE_ENV = '';

    test
      .object(em.resolveAppEnv())
        .isInstanceOf(EnvList)

      .string(em.env)
        .isIdenticalTo('_testApp1')
    ;
  });

  it('envList.resolveAppEnv() should resolve from `NODE_ENV`', function() {
    initTestEnv(2);
    process.env.APP_ENV = '';
    process.env.NODE_ENV = '_testApp2';

    test
      .object(em.resolveAppEnv())
        .isInstanceOf(EnvList)

        .string(em.env)
          .isIdenticalTo('_testApp2')
    ;
  });

  it('Should consolidate the `NODE_ENV` from `APP_ENV`', function() {
    initTestEnv(3);
    process.env.APP_ENV = '_testApp3';

    test
      .object(em.consolidate())
        .isInstanceOf(EnvList)

      .string(process.env.APP_ENV)
        .isIdenticalTo(em.envs._testApp3.APP_ENV)
        .isIdenticalTo('_testApp3')

      .string(process.env.NODE_ENV)
        .isIdenticalTo(em.envs._testApp3.NODE_ENV)
        .isIdenticalTo('_testNode3')
    ;
  });

  it('Should consolidate the `APP_ENV` from `NODE_ENV`', function() {
    initTestEnv(4);
    process.env.APP_ENV = '_testApp4';

    test
      .object(em.consolidate())
        .isInstanceOf(EnvList)

      .string(process.env.APP_ENV)
        .isIdenticalTo(em.envs._testApp4.APP_ENV)
        .isIdenticalTo('_testApp4')

      .string(process.env.NODE_ENV)
        .isIdenticalTo(em.envs._testApp4.NODE_ENV)
        .isIdenticalTo('_testNode4')
    ;
  });

  it('`envList.is()` should compare the current environment', function() {
    initTestEnv(5);
    process.env.APP_ENV = '_testApp5';
    em.consolidate();

    test
      .bool(em.is('_testApp4'))
        .isFalse()

      .bool(em.is('_testApp5'))
        .isTrue()
    ;
  });

  it('`envList.has()` should check if the map has a given environment', function() {
    initTestEnv(6);

    test
      .bool(em.has('_testApp5'))
        .isFalse()

      .bool(em.has('_testApp6'))
        .isTrue()
    ;
  });

  it('`envList.get()` should get the map of a given environment', function() {
    initTestEnv(7);
    process.env.APP_ENV = '_testApp7';
    em.consolidate();

    test
      .object(em.get('_testApp7'))
        .is({
          APP_ENV: '_testApp7',
          NODE_ENV: '_testNode7'
        })

      .object(em.get('dev'))
        .is({
          APP_ENV: 'dev',
          NODE_ENV: 'development'
        })

      .object(em.get('local'))
        .is({
          APP_ENV: 'local',
          NODE_ENV: 'development'
        })

      .object(em.get('prod'))
        .is({
          APP_ENV: 'prod',
          NODE_ENV: 'production'
        })

      .object(em.get('stage'))
        .is({
          APP_ENV: 'stage',
          NODE_ENV: 'production'
        })
    ;
  });

  it('`envList.getCurrent()` should get the map of the current environment', function() {
    initTestEnv(8);
    process.env.APP_ENV = '_testApp8';
    em.consolidate();

    test
      .object(em.getCurrent())
        .is({
          APP_ENV: '_testApp8',
          NODE_ENV: '_testNode8'
        })
    ;
  });

  it('should get `APP_ENV` with `envList.APP_ENV`', function() {
    initTestEnv(9);
    process.env.APP_ENV = '_testApp9';
    em.consolidate();

    test.string(em.APP_ENV).isIdenticalTo('_testApp9');
  });

  it('should get `NODE_ENV` with `envList.NODE_ENV`', function() {
    initTestEnv(10);
    process.env.APP_ENV = '_testApp10';
    em.consolidate();

    test.string(em.NODE_ENV).isIdenticalTo('_testNode10');
  });

  it('`env` should be `null`', function() {
    test.value(em.env).isNull();
  });

  it('`env` should be equal to `APP_ENV`', function() {
    initTestEnv(11);
    process.env.APP_ENV = '_testApp11';
    em.consolidate();

    test
      .string(em.env)
        .isIdenticalTo(em.APP_ENV)
        .isIdenticalTo(process.env.APP_ENV)
        .isIdenticalTo(em.getCurrent().APP_ENV)
        .isIdenticalTo(em.envs._testApp11.APP_ENV)
        .isIdenticalTo('_testApp11')
    ;
  });
});