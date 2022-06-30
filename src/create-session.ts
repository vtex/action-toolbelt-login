import {existsSync} from 'fs'
import * as fs from 'fs/promises'
import {homedir} from 'os'
import * as path from 'path'

import * as io from '@actions/io'
import fetch from 'node-fetch'

const getAuthToken = async ({
  appkey,
  apptoken,
  account
}: {
  appkey: string
  apptoken: string
  account: string
}): Promise<string> => {
  const payload = {
    appkey,
    apptoken
  }

  const res = await fetch(
    `http://api.vtexcommercestable.com.br/api/vtexid/apptoken/login?an=${encodeURIComponent(
      account
    )}`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {'Content-Type': 'application/json'}
    }
  )

  const result = (await res.json()) as {token: string}

  return result.token
}

export const createSession = async ({
  appkey,
  apptoken,
  account
}: {
  appkey: string
  apptoken: string
  account: string
}): Promise<string> => {
  const token = await getAuthToken({
    appkey,
    apptoken,
    account
  })

  const tokens = {
    [account]: token
  }

  const session = {
    account,
    login: 'login-bot@vtex.com.br',
    token
  }

  const workspace = {
    currentWorkspace: 'master',
    lastWorkspace: null
  }

  const sessionDirectory = path.join(homedir(), '.vtex', 'session')

  if (!existsSync(sessionDirectory)) {
    await io.mkdirP(sessionDirectory)
  }

  await Promise.all([
    fs.writeFile(
      path.join(sessionDirectory, 'tokens.json'),
      JSON.stringify(tokens)
    ),
    fs.writeFile(
      path.join(sessionDirectory, 'session.json'),
      JSON.stringify(session)
    ),
    fs.writeFile(
      path.join(sessionDirectory, 'workspace.json'),
      JSON.stringify(workspace)
    )
  ])

  return token
}
