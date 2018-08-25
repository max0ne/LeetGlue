import * as React from 'react';
import * as ReactDOM from 'react-dom';

import 'semantic-ui-css/semantic.min.css';
import 'react-toastify/dist/ReactToastify.min.css';

import { Button, Step, StepGroup } from 'semantic-ui-react';

import GithubAPI from './util/github_api';
import './css/import.css';

console.log(new GithubAPI(''));

import SetupGithub from './component/SetupGithub';

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
  }

  _steps = () => {
    return [
      {
        key: 'github',
        icon: 'github',
        title: 'Setup Repo',
        description: 'Setup Github repo to push to',
      },
      {
        key: 'import',
        icon: 'payment',
        title: 'Import Previous Submissions',
        description: 'Import Previous Submissions',
      },
    ].map((step) => ({
      ...step,
      active: this.state.step === step.key,
    }));
  }

  render() {
    return (
      <div>
        <StepGroup items={this._steps()}/>
        <SetupGithub completion={this._handleGithubSetupComplete}/>
      </div>
    )
  }
}

ReactDOM.render(<Import />, document.getElementById('root'));
