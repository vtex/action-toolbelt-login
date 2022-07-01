import * as path from 'path'
import * as os from 'os'
import * as fs from 'fs/promises'
import {expect, beforeEach, afterEach, test} from '@jest/globals'
import mockFs from 'mock-fs'

import {createSession} from '../src/create-session'

const homeDir = os.homedir()

beforeEach(() => {
  mockFs({
    [path.join(homeDir, '.vtex')]: {}
  })
})

afterEach(() => {
  mockFs.restore()
})

test('creates tokens, session and workspace files', async () => {
  await createSession('my-token', 'myaccount')

  const tokens = JSON.parse(
    (
      await fs.readFile(path.join(homeDir, '.vtex', 'session', 'tokens.json'))
    ).toString()
  )

  expect(tokens).toStrictEqual(
    expect.objectContaining({
      myaccount: 'my-token'
    })
  )
})
