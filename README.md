<p align="center">
  <a href="https://github.com/vtex/action-toolbelt-login/actions"><img alt="action-toolbelt-login status" src="https://github.com/vtex/action-toolbelt-login/workflows/build-test/badge.svg"></a>
</p>

# Action Toolbelt Login

GitHub Action to perform login using VTEX Toolbelt with supplied credentials. 
This action is handy for authenticating within a workflow, using App Key/Token, 
and use the [VTEX Toolbelt].

## How to use

First of all, you must create an App Key and Token to use for a specific 
account. You can follow this guide for [generating App Keys in your account], 
and set them up as secrets for your repository. Then we can proceed.

1. Create a folder, if it doesn't already exists, called `.github/workflows` in 
   the root of your repo.

2. Create a workflow file inside that folder, as an example we will use 
   `link-app.yml`

3. Fill the workflow file using the following content:

```yaml
name: "Link IO App"
on:
  push:
    branches:
    - main
    - master

jobs:
  link:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: 16
    - name: Install toolbelt
      run: |
        yarn global add vtex
        echo "$(yarn global bin)" >> $GITHUB_PATH
    - uses: vtex/action-toolbelt-login@v1
      with:
        account: MY_ACCOUNT
        app-key: ${{ secrets.APP_KEY }}
        app-token: ${{ secrets.APP_TOKEN }}
    - run: |
        echo "yes" | vtex use my-workspace
        vtex link --no-watch
```

The toolbelt commands on the last step of the `link` job will automatically use 
the login token created by the `vtex/action-toolbelt-login` action.

[VTEX Toolbelt]: https://github.com/vtex/toolbelt
[generating App Keys in your account]: https://help.vtex.com/tutorial/application-keys--2iffYzlvvz4BDMr6WGUtet#generating-app-keys-in-your-account
