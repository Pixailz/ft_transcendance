# ft_transcendence
Recreate pong, on a website, with a looooooot of features

# How To Commit
## Commits
When creating a new commit, try to break it into as many pieces you can. For example, if you modified both front-end and back-end files for your new feature, add files one by one instead of doing `git add .` and choose a concise but factual commit message. This makes it easier to revert a bad commit and keep good ones if something goes wrong. Repeat for all modified files until you added them all.
If you can, try to follow [this spec](https://gitmoji.dev/specification), which makes it easier *in therory* to know what the commit does to the project.
### Example:
You implemented a password recovery tool and needed to implement the logic in the back-end and the components in the front-end. You also added the components to the login page. You can do as follow :
```bash
git add src/backend/controllers/passwordrecovery
git commit -m "✨ [backend] Implemented Backend password recovery logic"

git add src/frontend/components/passwordrecovery
git commit -m "✨ [frontend:components] Created password recovery components for frontend"

git add src/frontend/pages/login/
git commit -m "💄 [frontend:pages] Added 'reset password' component to login page"

git status #this is to check you added all your modifications
git push -u origin nestjs-passrecovery
```
## Feature Branch Workflow
Explained [here](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow) in details, but here's the basic workflow
### Step 1: New Feature
If you think of a new feature to implement, first check if there isn't already a branch trying to implement it. If there isn't, pull from origin then create a new branch named by the feature :
```bash
git checkout main
git fetch origin
git reset --hard origin/main
git checkout -b new-feature
```
### Step 2: Code It
***\~Do your thing!\~***
### Step 3: Commit It
Please refer to above instructions.
### Step 4: Push It
Everytime you go away of your PC, and preferably after each commits, push your modifications ! Do not wait until your feature works, as you push it on a dedicated branch that will be merged into main when finished. This also permits multiple people to work on the same feature remotely!
### Step 5: Repeat It
Repeat steps 2 to 4 until your feature is perfect!
### Step 6: Pull Request It
Create a pull request to merge your branch with `main`. ***It needs to be reviewed by someone before you merge it!***
# Project Infos
## Things To Set

- ADMIN_PASS -> [.env](./.env)
- API42_USERID -> [.env](./src/nestjs/pix/.env)
- API42_SECRET -> [.env](./src/nestjs/pix/.env)

## Directory Structure
```bash
ft_transcendence/
├─rsc/
│ ├─postman/       #lib to make requests
│ └─en.subject.pdf #current subject PDF
├─build/           #dockerfiles directories
│ ├─nodejs/
│ └─postgresql/
└─src/             #sources
  ├─angular/       #frontend
  └─nestjs/        #backend
```

## Versioning

|Service Name|Latest version*                                                  |
|:-----------|:---------------------------------------------------------------:|
|NodeJS      |[18.16.1](https://nodejs.dev/en/about/releases/)                 |
|Npm         |[9.7.2](https://www.npmjs.com/package/npm)                       |
|PostgreSQL  |[15.3](https://www.postgresql.org/support/versioning/)           |

> \*Contains a link for a proof,
> by latest we mean latest LTS version if there's one, else the latest stable version maintained by the devs

## Useful Things

- how to setup oauth with [42 Api](https://api.intra.42.fr/apidoc/guides/web_application_flow)
- generate strong password (JWT token)
> `pwgen 32 10 -s -n -v -B -1`

# TODO
|Feature|Branch|Feature Description|
|:------|:-----|:------------------|
|User Management|nestjs-users|Get a working user management (profile info, nickname, ...)
