import React from 'react';
import {connect} from 'react-redux';
import counterpart from 'counterpart';

import {register} from './auth';
import WithLabel from '../util/WithLabel.component';
import WithErrors from '../util/WithErrors.component';
import Locales from '../i18n/Locales.component';
import {validateEmail} from '../util/misc';

class Register extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.register = this.register.bind(this);
    this.handleLoginChange = this.handleLoginChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleRetypePasswordChange = this.handleRetypePasswordChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleLocaleChange = this.handleLocaleChange.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.validatePassword1 = this.validatePassword.bind(this, false);
    this.validatePassword2 = this.validatePassword.bind(this, true);
    this.state = {
      user: {
        login: '',
        password: '',
        retypePassword: '',
        email: '',
        firstName: '',
        lastName: '',
        langKey: counterpart.getLocale()
      },
      errors: {
        email: [],
        password: []
      }
    };
  }
  shouldComponentUpdate(newProps, newState) {
    return !(this.state === newState && this.props.value === newProps.value);
  }
  handleLoginChange(event) {
    const user = Object.assign(this.state.user, {login: event.target.value});
    this.setState({user});
  }
  handlePasswordChange(event) {
    const user = Object.assign(this.state.user, {password: event.target.value});
    this.setState({user});
  }
  handleRetypePasswordChange(event) {
    const user = Object.assign(
      this.state.user, {retypePassword: event.target.value
    });
    this.setState({user});
  }
  handleEmailChange(event) {
    const user = Object.assign(this.state.user, {email: event.target.value});
    this.setState({user});
  }
  handleLocaleChange(event) {
    const user = Object.assign(this.state.user, {langKey: event.target.value});
    this.setState({user});
  }
  validateEmail() {
    const email = [];
    if (!validateEmail(this.state.user.email)) {
      email.push(counterpart.translate('account.errors.email.invalid'));
    }
    const errors = Object.assign(
      this.state.errors, {email}
    );
    this.setState({errors});
  }
  validatePassword(compare) {
    const password = [];
    if (this.state.user.password.length < 5) {
      password.push(counterpart.translate('account.errors.password.invalidLength'));
    }
    if (compare && this.state.user.retypePassword !== this.state.user.password) {
      password.push(counterpart.translate('account.errors.password.dontMatch'));
    }
    const errors = Object.assign(
      this.state.errors, {password}
    );
    this.setState({errors});
  }
  register() {
    this.props.register(this.state.user);
  }
  render() {
    return (
      <div className="form-vertical-group">
        <WithLabel
            item={
              <input
                  onChange={this.handleLoginChange}
                  placeholder={counterpart.translate('account.login')}
                  type="text"
                  value={this.state.user.login}
              />
            }
            label={counterpart.translate('account.login')}
        />
        <WithErrors
            errors={this.state.errors.email}
            item={
              <WithLabel
                  item={
                    <input
                        onBlur={this.validateEmail}
                        onChange={this.handleEmailChange}
                        placeholder={counterpart.translate('account.email')}
                        type="email"
                        value={this.state.user.email}
                    />
                  }
                  label={counterpart.translate('account.email')}
              />
            }
            title={counterpart.translate('account.email')}
        />
        <WithErrors
            errors={this.state.errors.password}
            item={
              <div>
                <WithLabel
                    item={
                      <input
                          onBlur={this.validatePassword1}
                          onChange={this.handlePasswordChange}
                          placeholder={
                            counterpart.translate('account.password')}
                          type="password"
                          value={this.state.user.password}
                      />
                    }
                    label={counterpart.translate('account.password')}
                />
                <WithLabel
                    item={
                      <input
                          onBlur={this.validatePassword2}
                          onChange={this.handleRetypePasswordChange}
                          placeholder={
                            counterpart.translate('account.retypePassword')
                          }
                          type="password"
                          value={this.state.user.retypePassword}
                      />
                    }
                    label={counterpart.translate('account.retypePassword')}
                />
              </div>
            }
            title={counterpart.translate('account.password')}
        />
        <WithLabel
            item={
              <Locales
                  onChange={this.handleLocaleChange}
                  value={this.state.user.langKey}
              />
            }
            label={counterpart.translate('account.selectDefaultLanguage')}
        />
        <button
            className="right"
            onClick={this.register}
            type="submit"
        >
          {counterpart.translate('account.register.register')}
        </button>
      </div>
    );
  }
}

export default connect(
  null,
  {register}
)(Register);
