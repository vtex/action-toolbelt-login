import * as core from '@actions/core'

import { createSession, getAuthToken } from './create-session.js'

async function run(): Promise<void> {
  try {
    const account: string = core.getInput('account')
    const appKey = core.getInput('app-key')
    const appToken = core.getInput('app-token')

    const token = await getAuthToken({
      appkey: appKey,
      apptoken: appToken,
      account,
    })

    await createSession(token, account)

    core.setOutput('token', token)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
