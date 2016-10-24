'use strict';

const Path = require('path');
const Code = require('code');
const Lab = require('lab');
const GitLogEmitter = require('../lib');

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const describe = lab.describe;
const it = lab.it;

describe('gitlog-emitter', () => {
  it('emits commit and finish events', (done) => {
    const ee = new GitLogEmitter({ repo: Path.resolve(__dirname, '..') });
    let count = 0;

    ee.on('finish', () => {
      expect(count).to.be.greaterThan(0);
      done();
    });

    ee.on('commit', (commit) => {
      expect(commit.hash).to.match(/[a-f0-9]{40}/);
      expect(commit.author).to.match(/\S+ <\S+>/);
      expect(commit.date).to.be.a.string();
      expect(commit.message).to.be.a.string();
      count++;
    });
  });
});
