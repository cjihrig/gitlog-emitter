'use strict';

const Assert = require('assert');
const Cp = require('child_process');
const EventEmitter = require('events');
const Readline = require('readline');

const commitSymbol = Symbol('commit');
const produceSymbol = Symbol('produce');


class GitLogEmitter extends EventEmitter {
  constructor (options) {
    super();
    Assert.strictEqual(typeof options.repo, 'string');

    const child = Cp.spawn('git', ['--no-pager', 'log'],
                           { shell: true, cwd: options.repo });
    const reader = Readline.createInterface({ input: child.stdout });

    this[commitSymbol] = null;

    reader.once('close', () => {
      this[produceSymbol](); // Get the last commit.
      this.emit('finish');
    });

    reader.on('line', (line) => {
      const commit = this[commitSymbol];

      if (line.length === 47 && line.startsWith('commit')) {
        this[produceSymbol]();
        this[commitSymbol] = {
          hash: line.substring(6),
          author: null,
          date: null,
          message: ''
        };
      } else if (commit) {
        if (line.startsWith('Author:')) {
          commit.author = line.substring(8);
        } else if (line.startsWith('Date:')) {
          commit.date = line.substring(8);
        } else {
          commit.message += `${line}\n`;
        }
      }
    });
  }
  [produceSymbol] () {
    if (this[commitSymbol]) {
      this.emit('commit', this[commitSymbol]);
    }
  }
}

module.exports = GitLogEmitter;
