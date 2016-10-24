# gitlog-emitter

[![Current Version](https://img.shields.io/npm/v/gitlog-emitter.svg)](https://www.npmjs.org/package/gitlog-emitter)
[![Build Status via Travis CI](https://travis-ci.org/continuationlabs/gitlog-emitter.svg?branch=master)](https://travis-ci.org/continuationlabs/gitlog-emitter)
![Dependencies](http://img.shields.io/david/continuationlabs/gitlog-emitter.svg)

[![belly-button-style](https://cdn.rawgit.com/continuationlabs/belly-button/master/badge.svg)](https://github.com/continuationlabs/belly-button)

Emit individual commits in a git log as events. This module exposes a single constructor that inherits from `EventEmitter`. The emitter executes `git --no-pager log` in the directory passed to the constructor. Each commit in the log is then emitted as a `'commit'` event. Once the entire log has been processed, a `'finish'` event is emitted.

## Example

```javascript
const GitLogEmitter = require('gitlog-emitter');
const ee = new GitLogEmitter({ repo: 'path_local_git_repository' });

ee.on('commit', (commit) => {
  // Emitted for each commit in the git log.
  // The commit object has a hash, author, date, and message.
  console.log(commit);
});

ee.on('finish', () => {
  // Emitted after the last commit event.
});
```

## API

This module exports a single constructor function:

- `GitLogEmitter(options)` (function) - Inherits from `EventEmitter`. `options` is a configuration object with the following schema:
  - `repo` (string) - The path to a local git repository. `git --no-pager log` must be able to run in this directory.

Once constructed, the emitter emits the following events:

- `'commit'` - Includes details about individual commits. Event handlers are passed an object with the following schema:
  - `hash` (string) - The commit hash.
  - `author` (string) - The `Author` metadata for the commit.
  - `date` (string) - The `Date` metadata for the commit.
  - `message` (string) - Text describing the commit.
- `'finish'` - Emitted after the final commit event. No additional parameters are passed to the event handler.
