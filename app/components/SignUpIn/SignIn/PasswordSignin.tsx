import React, { PureComponent } from 'react';
import { adopt } from 'react-adopt';
import { withRouter, WithRouterProps } from 'react-router';

// libraries
import Link from 'utils/cl-router/Link';

// components
import Input from 'components/UI/Input';
import Button from 'components/UI/Button';
import Error from 'components/UI/Error';
import { FormLabel } from 'components/UI/FormComponents';

// resources
import GetTenant, { GetTenantChildProps } from 'resources/GetTenant';

// services
import { signIn } from 'services/auth';

// i18n
import { InjectedIntlProps } from 'react-intl';
import { injectIntl, FormattedMessage } from 'utils/cl-intl';
import messages from './messages';

// utils
import { isValidEmail } from 'utils/validate';
import { isNilOrError } from 'utils/helperUtils';

// style
import styled from 'styled-components';
import { colors, fontSizes } from 'utils/styleUtils';

const Container = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
`;

const Form = styled.form`
  width: 100%;
`;

const FormElement = styled.div`
  width: 100%;
  margin-bottom: 15px;
  position: relative;
`;

const PasswordLabelContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledInput = styled(Input)``;

const PasswordInput = styled(StyledInput)``;

const ForgotPassword = styled(Link)`
  color: ${colors.label};
  font-size: ${fontSizes.small}px;
  line-height: 18px;
  font-weight: 300;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: #000;
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
`;

export interface InputProps {
  onSignInCompleted: (userId: string) => void;
  className?: string;
}

interface DataProps {
  tenant: GetTenantChildProps;
}

interface Props extends InputProps, DataProps {}

type State = {
  email: string | null;
  password: string | null;
  processing: boolean;
  emailError: string | null;
  passwordError: string | null;
  signInError: string | null;
};

class PasswordSignin extends PureComponent<Props & InjectedIntlProps & WithRouterProps, State> {
  emailInputElement: HTMLInputElement | null;
  passwordInputElement: HTMLInputElement | null;

  constructor(props) {
    super(props);
    this.state = {
      email: null,
      password: null,
      processing: false,
      emailError: null,
      passwordError: null,
      signInError: null
    };
    this.emailInputElement = null;
    this.passwordInputElement = null;
  }

  handleEmailOnChange = (email: string) => {
    this.setState({
      email,
      emailError: null,
      signInError: null
    });
  }

  handlePasswordOnChange = (password: string) => {
    this.setState({
      password,
      passwordError: null,
      signInError: null
    });
  }

  validate(email: string | null, password: string | null) {
    const { intl: { formatMessage }, tenant } = this.props;
    const phone = !isNilOrError(tenant) && tenant.attributes.settings.password_login?.phone;
    const hasEmailError = !phone && (!email || !isValidEmail(email));
    const emailError = (hasEmailError ? (!email ? formatMessage(messages.noEmailError) : formatMessage(messages.noValidEmailError)) : null);
    const passwordError = (!password ? formatMessage(messages.noPasswordError) : null);

    this.setState({ emailError, passwordError });

    if (emailError && this.emailInputElement) {
      this.emailInputElement.focus();
    }

    if (passwordError && this.passwordInputElement) {
      this.passwordInputElement.focus();
    }

    return (!emailError && !passwordError);
  }

  handleOnSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const { onSignInCompleted } = this.props;
    const { formatMessage } = this.props.intl;
    const { email, password } = this.state;

    if (this.validate(email, password) && email && password) {
      try {
        this.setState({ processing: true });
        const user = await signIn(email, password);
        this.setState({ processing: false });
        onSignInCompleted(user.data.id);
      } catch (error) {
        const signInError = formatMessage(messages.signInError);
        this.setState({ signInError, processing: false });
      }
    }
  }

  handleEmailInputSetRef = (element: HTMLInputElement) => {
    if (element) {
      this.emailInputElement = element;
    }
  }

  handlePasswordInputSetRef = (element: HTMLInputElement) => {
    this.passwordInputElement = element;
  }

  render() {
    const { email, password, processing, emailError, passwordError, signInError } = this.state;
    const { className, tenant } = this.props;
    const { formatMessage } = this.props.intl;
    const phone = !isNilOrError(tenant) && tenant.attributes.settings.password_login?.phone;

    return (
      <Container className={`e2e-sign-in-container ${className}`}>
        <Form id="signin" onSubmit={this.handleOnSubmit} noValidate={true}>
          <FormElement>
            <FormLabel
              htmlFor="email"
              labelMessage={phone ? messages.emailOrPhoneLabel : messages.emailLabel}
              thin
            />
            <StyledInput
              type="email"
              id="email"
              value={email}
              error={emailError}
              onChange={this.handleEmailOnChange}
              setRef={this.handleEmailInputSetRef}
              autocomplete="email"
            />
          </FormElement>

          <FormElement>
            <PasswordLabelContainer>
              <FormLabel
                htmlFor="password"
                labelMessage={messages.passwordLabel}
                thin
              />
              <ForgotPassword to="/password-recovery" className="e2e-password-recovery-link">
                <FormattedMessage {...messages.forgotPassword} />
              </ForgotPassword>
            </PasswordLabelContainer>
            <PasswordInput
              type="password"
              id="password"
              value={password}
              error={passwordError}
              onChange={this.handlePasswordOnChange}
              setRef={this.handlePasswordInputSetRef}
              autocomplete="current-password"
            />
          </FormElement>

          <FormElement>
            <ButtonWrapper>
              <Button
                onClick={this.handleOnSubmit}
                processing={processing}
                text={formatMessage(messages.submit)}
                className="e2e-submit-signin"
              />
            </ButtonWrapper>
            <Error marginTop="10px" text={signInError} />
          </FormElement>
        </Form>
      </Container>
    );
  }
}

const PasswordSigninWithHoC = withRouter<Props>(injectIntl(PasswordSignin));

const Data = adopt<DataProps, {}>({
  tenant: <GetTenant />
});

export default (inputProps: InputProps) => (
  <Data>
    {dataProps => <PasswordSigninWithHoC {...inputProps} {...dataProps} />}
  </Data>
);
