#!/usr/bin/env node

import { spawn, spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const sourceMode = existsSync(join(packageRoot, 'web', 'package.json'))
const command = process.argv[2] || 'start'

function usage() {
  console.log([
    'Portal One',
    '',
    '用法:',
    '  portal-one          初始化并启动',
    '  portal-one start    初始化并启动',
    '  portal-one seed     重置演示数据和管理员',
    '  portal-one help     显示帮助',
    '',
    '环境变量:',
    '  PORT                 服务端口，默认 3000',
    '  PORTAL_DATA_DIR      SQLite 与上传文件目录',
    '  ADMIN_USER           首次初始化管理员账号',
    '  ADMIN_PASSWORD       首次初始化管理员密码',
  ].join('\n'))
}

function justDefault(name) {
  const justfile = readFileSync(join(packageRoot, 'justfile'), 'utf8')
  const pattern = new RegExp('export ' + name + ' := env_var_or_default\\("' + name + '", "([^"]+)"\\)')
  const value = justfile.match(pattern)?.[1]
  if (!value) {
    throw new Error('无法从 justfile 读取 ' + name + ' 默认值，请通过环境变量提供')
  }
  return value
}

function runtimeEnv() {
  const defaultDataDir = sourceMode
    ? join(packageRoot, 'server', 'data')
    : join(process.cwd(), 'portal-one-data')
  const dataDir = resolve(process.env.PORTAL_DATA_DIR || defaultDataDir)
  const adminUser = process.env.ADMIN_USER || justDefault('ADMIN_USER')
  const adminPassword = process.env.ADMIN_PASSWORD || justDefault('ADMIN_PASSWORD')
  if (!adminUser.trim() || !adminPassword) {
    throw new Error('ADMIN_USER 和 ADMIN_PASSWORD 不能为空')
  }
  return {
    ...process.env,
    PORTAL_DATA_DIR: dataDir,
    ADMIN_USER: adminUser,
    ADMIN_PASSWORD: adminPassword,
  }
}

function runNode(script, env) {
  const result = spawnSync(process.execPath, [script], {
    cwd: packageRoot,
    env,
    stdio: 'inherit',
  })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}

function buildSource() {
  if (!sourceMode) return
  console.log('-> 构建门户与管理端')
  runNode(join(packageRoot, 'scripts', 'build.js'), process.env)
}

function seed(env) {
  console.log('-> 初始化数据: ' + env.PORTAL_DATA_DIR)
  runNode(join(packageRoot, 'server', 'src', 'seed.js'), env)
}

async function start() {
  const env = runtimeEnv()
  buildSource()

  const database = join(env.PORTAL_DATA_DIR, 'portal.db')
  const firstRun = !existsSync(database)
  if (firstRun) seed(env)

  const port = env.PORT || '3000'
  console.log('-> 门户:   http://localhost:' + port + '/')
  console.log('-> 管理端: http://localhost:' + port + '/admin/')
  console.log('-> 数据:   ' + env.PORTAL_DATA_DIR)
  if (firstRun) console.log('-> 初始管理员: ' + env.ADMIN_USER + '（密码来自 justfile 或环境变量）')

  const child = spawn(process.execPath, [join(packageRoot, 'server', 'src', 'index.js')], {
    cwd: packageRoot,
    env,
    stdio: 'inherit',
  })
  child.on('error', (error) => {
    console.error(error.message)
    process.exitCode = 1
  })
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () => child.kill(signal))
  }
  await new Promise((resolveExit) => {
    child.on('exit', (code, signal) => {
      process.exitCode = code ?? (signal ? 1 : 0)
      resolveExit()
    })
  })
}

try {
  if (command === 'help' || command === '--help' || command === '-h') {
    usage()
  } else if (command === 'seed') {
    seed(runtimeEnv())
  } else if (command === 'start') {
    await start()
  } else {
    usage()
    process.exitCode = 2
  }
} catch (error) {
  console.error('[portal-one] ' + error.message)
  process.exitCode = 1
}
