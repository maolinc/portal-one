import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..')

if (!existsSync(join(projectRoot, 'web', 'package.json'))) {
  console.log('npm 安装包已包含预构建的门户与管理端，无需再次构建')
  process.exit(0)
}

function runNpm(args, cwd) {
  const npmCli = process.env.npm_execpath
  const command = npmCli ? process.execPath : (process.platform === 'win32' ? 'npm.cmd' : 'npm')
  const commandArgs = npmCli ? [npmCli, ...args] : args
  const result = spawnSync(command, commandArgs, {
    cwd,
    stdio: 'inherit',
    shell: !npmCli && process.platform === 'win32',
  })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}

runNpm(['run', 'build'], join(projectRoot, 'web'))
runNpm(['run', 'build'], join(projectRoot, 'admin'))
