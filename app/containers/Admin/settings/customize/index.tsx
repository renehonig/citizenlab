// Libraries
import * as React from 'react';
import { fromJS } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import * as Rx from 'rxjs/Rx';
import { API } from 'typings.d';
import * as _ from 'lodash';

// Components
import { connect } from 'react-redux';
import { Checkbox } from 'semantic-ui-react';
import Label from 'components/UI/Label';
import Button from 'components/UI/Button';
import Upload from 'components/UI/Upload';
import ColorPickerInput from 'components/UI/ColorPickerInput';
import Select from 'components/UI/Select';
import FieldWrapper from 'components/admin/FieldWrapper';
import SubmitWrapper from 'components/admin/SubmitWrapper';

// i18n
import { injectTFunc } from 'containers/T/utils';
import { FormattedMessage, injectIntl, intlShape, InjectedIntl } from 'react-intl';
import messages from '../messages';

// Store
import { createStructuredSelector } from 'reselect';
import { makeSelectCurrentTenantImm } from 'utils/tenant/selectors';
import { saveSettings } from '../actions';

// Services
import {
  currentTenantStream,
  updateTenant,
  IUpdatedTenantProperties,
  ITenantData
} from 'services/tenant';

// Typing
interface Props {
  intl: InjectedIntl;
  lang: string;
  tFunc: Function;
}

interface State {
  attributesDiff: IUpdatedTenantProperties;
  tenant: ITenantData | null;
  loading: boolean;
  errors: {
    [fieldName: string]: API.Error[]
  };
  saved: boolean;
}

class SettingsCustomizeTab extends React.Component<Props, State> {
  uploadPlaceholder: string;
  subscription: Rx.Subscription;

  constructor() {
    super();
    this.state = {
      attributesDiff: {},
      tenant: null,
      loading: false,
      errors: {},
      saved: false,
    };
  }

  componentWillMount() {
    this.uploadPlaceholder = this.props.intl.formatMessage(messages.uploadPlaceholder);
  }

  componentDidMount() {
    this.subscription = currentTenantStream().observable.subscribe((response) => {
      this.setState({ tenant: response.data });
    });
  }

  getSubmitState = (): 'disabled' | 'enabled' | 'error' | 'success' => {
    if (!_.isEmpty(this.state.errors)) {
      return 'error';
    }
    if (this.state.saved && _.isEmpty(this.state.attributesDiff)) {
      return 'success';
    }
    return _.isEmpty(this.state.attributesDiff) ? 'disabled' : 'enabled';
  }

  changeImage(name, value) {
    const reader = new FileReader();
    let newDiff = _.cloneDeep(this.state.attributesDiff);
    reader.readAsDataURL(value);
    reader.onload = () => {
      newDiff = _.set(newDiff, name, reader.result);
      this.setState({ attributesDiff: newDiff });
    };
  }

  createToggleChangeHandler = (fieldPath) => {
    return (event, data?): void => {
      let newDiff = _.cloneDeep(this.state.attributesDiff);
      if (data && data.checked !== undefined) {
        newDiff = _.set(newDiff, fieldPath, data.checked);
      } else if (event && typeof(event) === 'string') {
        newDiff = _.set(newDiff, fieldPath, event);
      } else if (event && event.value) {
        newDiff = _.set(newDiff, fieldPath, event.value);
      } else {
        console.log(arguments);
      }
      this.setState({ attributesDiff: newDiff });
    };
  }

  removeImage(name) {
    this.setState({
      // changedAttributes: this.state.changedAttributes.set(name, null),
      // [`temp_${name}`]: [],
    });
  }

  save = (e) => {
    e.preventDefault();

    const { tenant, attributesDiff } = this.state;

    if (!tenant) {
      return null;
    }

    updateTenant(tenant.id, attributesDiff)
    .then(() => {

    })
    .catch(() => {

    });
  }

  menuStyleOptions = () => ([
    {
      value: 'light',
      label: this.props.intl.formatMessage(messages.menuStyleLight),
    },
    {
      value: 'dark',
      label: this.props.intl.formatMessage(messages.menuStyleDark),
    },
  ])

  render() {
    const tenantAttrs = this.state.tenant
    ? _.merge({}, this.state.tenant.attributes, this.state.attributesDiff)
    : _.merge({}, this.state.attributesDiff);

    return (
      <form onSubmit={this.save}>


        <h1><FormattedMessage {...messages.titleBranding} /></h1>
        <p><FormattedMessage {...messages.subTitleBranding} /></p>

        <div>
          <Label><FormattedMessage {...messages.menuStyle} /></Label>
          <Select
            value={_.get(tenantAttrs, 'settings.core.menu_style', '')}
            options={this.menuStyleOptions()}
            onChange={this.createToggleChangeHandler('settings.core.menu_style')}
          />
        </div>

        <div>
          <Label><FormattedMessage {...messages.mainColor} /></Label>
          <ColorPickerInput
            type="text"
            value={_.get(tenantAttrs, 'settings.core.color_main')}
            onChange={this.createToggleChangeHandler('settings.core.color_main')}
          />
        </div>


        <div>
          <Label><FormattedMessage {...messages.logo} /></Label>
          <Upload
            accept="image/*"
            maxItems={1}
            items={[]}
            apiImages={[_.get(tenantAttrs, 'logo')]}
            onAdd={console.log}
            onRemove={console.log}
            placeholder={this.uploadPlaceholder}
            intl={this.props.intl}
          />
        </div>

        <div>
          <Label><FormattedMessage {...messages.headerBg} /></Label>
          <Upload
            accept="image/*"
            maxItems={1}
            items={[]}
            apiImages={[_.get(tenantAttrs, 'header_bg')]}
            onAdd={console.log}
            onRemove={console.log}
            placeholder={this.uploadPlaceholder}
            intl={this.props.intl}
          />
        </div>

        <h1><FormattedMessage {...messages.titleSignupFields} /></h1>
        <p><FormattedMessage {...messages.subTitleSignupFields} /></p>


        {['gender', 'domicile', 'birthyear', 'education'].map((fieldName, index) => {
          const fieldPath = `settings.demographic_fields.${fieldName}`;
          return (
            <FieldWrapper key={fieldName}>
              <Label><FormattedMessage {...messages[fieldName]} /></Label>
              <Checkbox
                slider={true}
                checked={_.get(tenantAttrs, fieldPath)}
                onChange={this.createToggleChangeHandler(fieldPath)}
              />
            </FieldWrapper>
          );
        })}

        <Button onClick={this.save}>
          <FormattedMessage {...messages.save} />
        </Button>

      </form>
    );
  }
}

export default injectIntl(injectTFunc(SettingsCustomizeTab));
