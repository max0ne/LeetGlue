import * as React from 'react';
import * as _ from 'lodash';
import * as PropTypes from 'prop-types'

import GithubAPI from '../util/github_api';
import * as types from '../util/types';

import { Button, Form, Image, Message } from 'semantic-ui-react';

const initialState = {
  githubTokenInput: '',
  githubRepoInput: '',
  githubUser: undefined as types.GithubUserResponse,
  githubUserError: '',
  githubRepoValid: false,
  githubRepoError: '',
};

interface Props {
  completion: (token: string, repoIdentifier: string) => void;
};

export default class SetupGithub extends React.Component {
  state: Readonly<typeof initialState> = initialState;
  props: Readonly<Props>

  constructor(props) {
    super(props);
    this._validateRepo = _.debounce(this._validateRepo, 100);
    this._validateTokenUser = _.debounce(this._validateTokenUser, 100);
  }

  _handleTokenChanged = (e) => {
    this.setState({
      githubTokenInput: e.target.value,
    });
    this._validateTokenUser();
    this._validateRepo();
  }

  _handleRepoNameChanged = (e) => {
    this.setState({
      githubRepoInput: e.target.value,
    });
    this._validateRepo();
  }

  _validateTokenUser = async () => {
    try {
      if (!this.state.githubTokenInput) {
        this.setState({
          githubUser: undefined,
          githubUserError: '',
        });
        return;
      }
      const user = await (new GithubAPI(this.state.githubTokenInput)).getUser();
      this.setState({
        githubUser: user,
        githubUserError: '',
      });
    } catch (err) {
      debugger
      this.setState({
        githubUser: undefined,
        githubUserError: err.toString(),
      });
    }
  }

  _validateRepo = async () => {
    try {
      if (_.isEmpty(this.state.githubTokenInput)) {
        return;
      }
      if (_.isEmpty(this.state.githubRepoInput)) {
        this.setState({
          githubRepoValid: false,
          githubRepoError: '',
        });
        return;
      }
      const repoIdentifier = this._repoIdentifier();
      const repo = await (new GithubAPI(this.state.githubTokenInput).getRepo(repoIdentifier));
      if (repo.permissions.push) {
        this.setState({
          githubRepoValid: true,
          githubRepoError: '',
        });
      } else {
        this.setState({
          githubRepoValid: false,
          githubRepoError: `You don't have push permission to repo '${repoIdentifier}'`
        });
      }
    } catch (err) {
      this.setState({
        githubRepoValid: false,
        githubRepoError: err.toString(),
      });
    }
  }

  _repoIdentifier = () => {
    return _.includes(this.state.githubRepoInput, '/') ?
      this.state.githubRepoInput :
      `${this.state.githubUser.login}/${this.state.githubRepoInput}`;
  }

  _handleComplete = (e) => {
    e.preventDefault();
    this.props.completion(this.state.githubTokenInput, this._repoIdentifier());
  }

  renderUser() {
    if (!this.state.githubUser) {
      return null;
    }
    return (
      <div>
        ✅ You are {this.state.githubUser.login} <Image src={this.state.githubUser.avatar_url} avatar />
      </div>
    );
  }

  renderUserError() {
    if (!this.state.githubTokenInput || !this.state.githubUserError) {
      return null;
    }
    return (
      <Message
        visible
        error
        header='Invalid token'
        content={this.state.githubUserError}
      />
    );
  }

  renderRepo() {
    if (!this.state.githubRepoInput) {
      return null;
    }
    if (this.state.githubRepoError) {
      return (
        <Message
          visible
          error
          header='Invalid repo'
          content={this.state.githubRepoError}
        />
      );
    } else if (this.state.githubRepoValid) {
      return (
        <Message
          visible
          success
          header='👌'
          content='this is a repo i can push to'
        />
      )
    }
  }

  render() {
    return (
      <Form>
        <Form.Field>
          <label>
            Please provide a Github api token, I'm too lazy to do OAuth so please just generate a personal access token
          </label>
          <label>
            Please make sure you select `repo` field because I need push permission to your repo.
          </label>
          <label>
            generate your Github token <a target="_blank" href="https://github.com/settings/tokens/new">here</a>.
          </label>
          <input placeholder='Your Github Personal Token' onChange={this._handleTokenChanged} value={this.state.githubTokenInput}/>
          {this.renderUser()}
          {this.renderUserError()}

          <label>
            Name of a repo you want to push your submission to. If you don't have one, <a target="_blank" href="https://github.com/new">go create one</a>
          </label>
          <input placeholder='MyAwesomeRepo or AwesomeUser/AwesomeRepo' onChange={this._handleRepoNameChanged} value={this.state.githubRepoInput} />
          {this.renderRepo()}
        </Form.Field>

        <Button type='submit' disabled={!this.state.githubRepoValid} onClick={this._handleComplete}>Submit</Button>
      </Form>
    );
  }
}

(SetupGithub as any).propTypes = {
  completion: PropTypes.func.isRequired,
};
