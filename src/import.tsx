import * as React from 'react';
import * as ReactDOM from 'react-dom';

import 'semantic-ui-css/semantic.min.css';
import 'react-toastify/dist/ReactToastify.min.css';

import { StepGroup, Header } from 'semantic-ui-react';

import GithubAPI from './util/github_api';
import './css/import.css';

console.log(new GithubAPI(''));

import SetupGithub from './component/SetupGithub';
import ImportHistory from './component/ImportHistory';

const initialState = {
  step: 'github',
  githubToken: '',
  githubRepoIdentifier: '',
};

class Import extends React.Component {
  state: Readonly<typeof initialState> = initialState;

  _handleGithubSetupComplete = (token: string, repoIdentifier: string) => {
    this.setState({
      githubToken: token,
      githubRepoIdentifier: repoIdentifier,
      step: 'import',
    });
    chrome.storage.sync.set({
      'github_repo_identifier': repoIdentifier,
      'github_token': token,
    });
  }

  _handleImportComplete = () => {
    this.setState({
      step: 'done',
    });
  }

  _steps = () => {
    return [
      {
        key: 'github',
        title: 'Setup Repo',
        description: 'Setup Github repo to push to',
      },
      {
        key: 'import',
        title: 'Import Previous Submissions',
        description: 'Import Previous Submissions',
      },
      {
        key: 'done',
        title: 'Done',
      },
    ].map((step) => ({
      ...step,
      active: this.state.step === step.key,
      onClick: this.state.githubRepoIdentifier && (() => {
        this.setState({
          step: step.key,
        });
      }),
    }));
  }

  renderFinish = () => {
    const gotoLeetcode = () => {
      chrome.tabs.getCurrent((tab) => {
        chrome.tabs.remove(tab.id);
        chrome.tabs.create({
          url: 'https://leetcode.com/',
        });
      });
    };
    return (
      <div>
        <Header>Yeah you are ready to use LeetGlue</Header>
        Your leetcode.com submission will automatically be pushed to your github repo
        <a onClick={gotoLeetcode}>Goto leetcode.com</a>
      </div>
    );
  }

  render() {
    return (
      <div>
        <StepGroup items={this._steps()}/>
        {
          this.state.step === 'github' ? 
            <SetupGithub completion={this._handleGithubSetupComplete} /> :
            this.state.step === 'import' ? 
            <ImportHistory 
              githubToken={this.state.githubToken}
              githubRepoIdentifier={this.state.githubRepoIdentifier}
              completion={this._handleImportComplete}
            /> :
            this.renderFinish()
        }
      </div>
    )
  }
}

ReactDOM.render(<Import />, document.getElementById('root'));
