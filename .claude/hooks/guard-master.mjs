#!/usr/bin/env node
// PreToolUse hook (Bash): keep Claude off `master`.
// Every merge to master is an npm release, so work lands only via branch + PR
// (CLAUDE.md → "Branches & pull requests"). Blocks:
//   - `git commit` / `git merge` / `git rebase` / `git cherry-pick` / `git revert` while on master
//   - any `git push` whose refspec targets master (`origin master`, `HEAD:master`, …)
//   - a bare `git push` / `git push origin` from master
// Exit 2 = block; stderr is shown to Claude as the reason.
import { execSync } from 'node:child_process';

let input = '';
for await (const chunk of process.stdin) input += chunk;

let command = '';
try {
  command = JSON.parse(input).tool_input?.command ?? '';
} catch {
  process.exit(0);
}
if (!/\bgit\b/.test(command)) process.exit(0);

let branch = '';
try {
  branch = execSync('git branch --show-current', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
} catch {
  // not a git checkout — nothing to guard
}

const block = (why) => {
  process.stderr.write(
    `Blocked: ${why}\nWork in this repo goes on its own branch with a PR into master ` +
      '(CLAUDE.md → "Branches & pull requests"). Create one with ' +
      '`git checkout --no-track -b <type>/<topic> origin/master`.\n',
  );
  process.exit(2);
};

// Split chained commands so `cd x && git push origin master` is still seen.
for (const part of command.split(/&&|\|\||;|\n/)) {
  const seg = part.trim();
  const git = seg.match(/(?:^|\s)git\s+(?:-C\s+\S+\s+)?(\S+)(.*)$/);
  if (!git) continue;
  const [, sub, rest] = git;

  if (sub === 'push') {
    const args = rest.split(/\s+/).filter((a) => a && !a.startsWith('-'));
    // args[0] = remote, args[1..] = refspecs
    const refspecs = args.slice(1);
    const dest = (r) => r.replace(/^\+/, '').split(':').pop();
    if (refspecs.some((r) => ['master', 'refs/heads/master'].includes(dest(r)))) {
      block('pushing to master.');
    }
    if (refspecs.length === 0 && branch === 'master') {
      block('bare `git push` from master.');
    }
  }

  if (branch === 'master' && ['commit', 'merge', 'rebase', 'cherry-pick', 'revert', 'am'].includes(sub)) {
    block(`\`git ${sub}\` on master.`);
  }
}
process.exit(0);
