import * as path from 'path'
import * as os from 'os'
import * as fs from 'fs/promises'

import { expect, beforeEach, afterEach, test } from '@jest/globals'
import mockFs from 'mock-fs'

import { createSession } from '../src/create-session'

const homeDir = os.homedir()

beforeEach(() => {
  mockFs({
    [path.join(homeDir, '.vtex')]: {},
  })
})

afterEach(() => {
  mockFs.restore()
})

test('creates tokens, session and workspace files', async () => {
  await createSession('my-token', 'myaccount')

  const [tokens, sessions, workspace] = await Promise.all([
    fs.readFile(path.join(homeDir, '.vtex', 'session', 'tokens.json')),
    fs.readFile(path.join(homeDir, '.vtex', 'session', 'session.json')),
    fs.readFile(path.join(homeDir, '.vtex', 'session', 'workspace.json')),
  ]).then((buffers) => buffers.map((buf: Buffer) => JSON.parse(buf.toString())))

  expect(tokens).toStrictEqual(
    expect.objectContaining({
      myaccount: 'my-token',
    })
  )

  expect(sessions).toStrictEqual(
    expect.objectContaining({
      account: 'myaccount',
      token: 'my-token',
    })
  )

  expect(workspace).toStrictEqual(
    expect.objectContaining({
      currentWorkspace: 'master',
    })
  )
})
