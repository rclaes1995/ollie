import path from 'path';

// dialogs
import BoilerplateDialog from '../dialogs/boilerplate_dialog';
import LocalCloneDialog from '../dialogs/local_clone_dialog';
import RemoteRepositoryDialog from '../dialogs/remote-repository-dialog';
import ReplaceVariablesDialog from '../dialogs/replace_variables_dialog';

// utils
import Git from '../utils/git.js';

export default class WebSurvey {
  constructor() {
    this.answers = {};
  }

  async start() {
    const boilerplateDialog = new BoilerplateDialog('web');
    const boilerplateAnswers = await boilerplateDialog.start();
    this.answers.projectName = boilerplateAnswers.projectName;
    this.answers.boilerplateRepository = boilerplateAnswers.boilerplate.repository;

    const cloneDialog = new LocalCloneDialog(this.answers.boilerplateRepository, this.answers.projectName);
    const cloneAnswers = await cloneDialog.start();
    this.answers.localPath = cloneAnswers.localPath;

    // git
    const git = new Git(this.answers, this.answers.localPath);
    await git.setup();

    // // remote git repository (Bitbucket / Github)
    // const remoteRepoDialog = new RemoteRepositoryDialog(this.answers.projectName);
    // const remoteRepoAnswers = await remoteRepoDialog.start();

    const replaceVariablesDialog = new ReplaceVariablesDialog(this.answers.projectName, this.answers.localPath);
    await replaceVariablesDialog.start();

    return Promise.resolve(this.answers);
  }
}

