#!/bin/sh
# husky v9.0.11

# 출처: https://github.com/typicode/husky/blob/main/sh/husky.sh

# 실험적인 기능
# set -e

# node와 pnpm이 필요합니다
command -v node >/dev/null 2>&1 || {
  echo >&2 "Info: node is not in PATH. Skipping husky."
  exit 0
}

# pnpm이 PATH에 있는지 확인합니다
command -v pnpm >/dev/null 2>&1 || {
  echo >&2 "Info: pnpm is not in PATH. Skipping husky."
  exit 0
}

# HUSKY_GIT_PARAMS를 설정합니다
if [ -z "${HUSKY_GIT_PARAMS+x}" ]; then
  HUSKY_GIT_PARAMS="$*"
fi
export HUSKY_GIT_PARAMS

# HUSKY_GIT_STDIN을 설정합니다
if [ -z "${HUSKY_GIT_STDIN+x}" ] && [ ! -t 0 ]; then
  HUSKY_GIT_STDIN="$(cat)"
fi

# HUSKY_HOOK_NAME을 설정합니다
if [ -z "${HUSKY_HOOK_NAME+x}" ]; then
  HUSKY_HOOK_NAME="$(basename "$0")"
fi
export HUSKY_HOOK_NAME

# Husky는 직접 source해서 사용하도록 설계되지 않았습니다.
# 아래는 사용자가 잘못 사용하고 있음을 알려주기 위한 것입니다.
if [ "$HUSKY_HOOK_NAME" = "husky.sh" ]; then
  echo >&2 "Warning: husky.sh should not be sourced directly.
  It's used by Husky's hooks.
  If you're trying to run a hook, use: 

  husky run <hook_name> [...args]"
fi

# 'prepare-commit-msg'를 위한 특별 처리
# 이 훅은 Git이 stdin 없이 실행할 수 있는 유일한 훅입니다.
if [ "$HUSKY_HOOK_NAME" = "prepare-commit-msg" ] && [ -z "$HUSKY_GIT_STDIN" ]; then
  if [ -t 0 ]; then
    exec < /dev/tty
  else
    # /dev/null에서 읽어오는 것으로 대체합니다
    exec < /dev/null
  fi
fi

# HUSKY_GIT_STDIN을 내보냅니다
export HUSKY_GIT_STDIN

# 훅 실행
node -e "
  const { spawn } = require('child_process');
  const hook = require('path').join(__dirname, '..', process.env.HUSKY_HOOK_NAME);

  const child = spawn(hook, process.argv.slice(1), {
    stdio: 'inherit'
  });

  child.on('error', (err) => {
    console.error(err);
    process.exit(1);
  });
" "$@"