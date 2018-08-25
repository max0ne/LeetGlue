import * as React from 'react';
import * as _ from 'lodash';
import * as PropTypes from 'prop-types';
import LeetCodeAPI from '../util/leetcode_api';
import GithubAPI from '../util/github_api';

import aquireLeetCodeCredential from '../controller/aquireLeetCodeCredential';
import ImportSubmissionsController from '../controller/ImportSubmissions';
import * as types from '../util/types';

import { Button, Dropdown, List, Loader, Popup, Header } from 'semantic-ui-react';

interface ImportProgress {
  problem: types.StatStatusPair,
  status: 'pending' | 'success' | 'failure',
  err: types.ImportErr,
};

const initialState = {
  leetcodeLoggedIn: false,
  languageSelected: false,
  allProblemsImported: false,
  languageOptions: [],
  allProblemsResponse: undefined as types.AllProblemResponse,
  allAcceptedProblems: [] as types.StatStatusPair[],

  importProgress: [] as ImportProgress[],
};

interface Props {
  githubToken: string;
  githubRepoIdentifier: string;
  completion: () => void;
}

export default class ImportHistory extends React.Component {
  state: Readonly<typeof initialState> = initialState;
  props: Readonly<Props>;

  leetCodeAPI: LeetCodeAPI;

  _aquireLeetCodeCredentials = async () => {
    const [leetCodeAPI, allProblemsResponse] = await aquireLeetCodeCredential();
    this.leetCodeAPI = leetCodeAPI;
    const allAcceptedProblems = 
      allProblemsResponse.stat_status_pairs
      .filter((pair) => pair.status === 'ac')
      .sort((a, b) => a.stat.frontend_question_id - b.stat.frontend_question_id);
    this.setState({
      allProblemsResponse,
      allAcceptedProblems,
      leetcodeLoggedIn: true,
    });
  }

  renderLoginLeetCode = () => {
    return (
      <div className="render-login-leetcode">
        <Header>
          Importing all your previous submissions to your repo
        </Header>
        <Button content="Login to LeetCode" onClick={this._aquireLeetCodeCredentials}/>
        <a onClick={this.props.completion}>No thanks I don't need to import my submissions ></a>
      </div>
    );
  }

  handleRemoveLang = (lang) => {
    this.setState((state: any) => ({
      ...state,
      languageOptions: _.pull(state.languageOptions, lang),
    }));
  }

  handleStartImport = async () => {
    this.setState({
      languageSelected: true,
    });

    this.setState({
      importProgress: this.state.allAcceptedProblems.map((problem) => ({
        problem,
        status: 'pending',
        err: undefined,
      }))
    });

    await new ImportSubmissionsController().importProblems(
      this.leetCodeAPI,
      new GithubAPI(this.props.githubToken),
      this.props.githubRepoIdentifier,
      this.state.languageOptions,
      this.state.allAcceptedProblems,
      (err, problem, idx) => {
        this.setState((state: typeof initialState) => ({
          ...state,
          importProgress: state.importProgress.map((pro, proidx) => {
            if (proidx !== idx) {
              return pro;
            }
            return {
              problem,
              status: _.isNil(err) ? 'success' : 'failure',
              err: err,
            };
          }),
        }));
      },
    );

    // send a notification or something
    this.setState({
      allProblemsImported: true,
    });
  }

  renderSelectLanguage = () => {
    const languageOptions = _.keys(types.fileExtensions)
      .filter((lang) => !_.includes(this.state.languageOptions, lang))
      .map((lang) => ({ key: lang, value: lang, text: lang }));
    const handleChange = (e, { value }) => {
      this.setState({ languageOptions: value })
    };
    return (
      <div>
        Select all language you used to submit problems, in order of most commonly used to least commenly used:
        <Dropdown
          placeholder='language'
          fluid
          multiple
          options={languageOptions}
          onChange={handleChange}
          value={this.state.languageOptions}
        />
        <Button content='Thats all of it, start import!' onClick={this.handleStartImport}/>
      </div>
    );
  }

  renderProgress = (progress: ImportProgress, idx: number) => {
    let item = (
      <React.Fragment>
        {progress.problem.stat.frontend_question_id}
        {progress.problem.stat.question__title}
        {
          {
            'pending': <span className="import-history-spinning">✋</span>,
            'success': <span>✅</span>,
            'failure': <span>❌</span>
          }[progress.status]
        }
      </React.Fragment>
    );
    if (progress.err) {
      item = (
        <Popup trigger={item}>
          {progress.err.type}: {progress.err.desc}
        </Popup>
      );
    }
    return (
      <List.Item key={idx}>
        {item}
      </List.Item>
    );
  }

  renderDoingImport = () => {
    return (
      <div>
        <Header>
          Importing {this.state.importProgress.length} problems to your github repo {this.props.githubRepoIdentifier}
        </Header>
        <List>
          {this.state.importProgress.map(this.renderProgress)}
        </List>
        <Button disabled={!this.state.allProblemsImported}>
          Continue
        </Button>
      </div>
    )
  }

  render() {
    return (
      <div>
        {!this.state.leetcodeLoggedIn ?
          this.renderLoginLeetCode() :
          !this.state.languageSelected ?
            this.renderSelectLanguage() :
            this.renderDoingImport()}
      </div>
    )
  }
}
