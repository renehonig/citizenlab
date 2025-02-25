import React, { useState } from 'react';
import styled from 'styled-components';
import getSubmitState from 'utils/getSubmitState';
import { isCLErrorJSON } from 'utils/errorUtils';
import { CLError, Multiloc } from 'typings';
import { isNilOrError } from 'utils/helperUtils';

// hooks
import useAppConfiguration from 'hooks/useAppConfiguration';

import {
  IUpdatedAppConfigurationProperties,
  updateAppConfiguration,
} from 'services/appConfiguration';

// components
import messages from 'containers/Admin/settings/messages';

import {
  SectionTitle,
  SubSectionTitleWithDescription,
  SectionField,
  SectionDescription,
} from 'components/admin/Section';
import InputMultilocWithLocaleSwitcher from 'components/UI/InputMultilocWithLocaleSwitcher';
import { IconTooltip } from 'cl2-component-library';
import SubmitWrapper from 'components/admin/SubmitWrapper';

// i18n
import { FormattedMessage } from 'utils/cl-intl';
import Outlet from 'components/Outlet';

export const LabelTooltip = styled.div`
  display: flex;
`;

const SignUpFieldsSection = styled.div`
  margin-bottom: 60px;
`;

interface Props {}

const SettingsRegistrationTab = (_props: Props) => {
  const appConfig = useAppConfiguration();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [isFormSaved, setIsFormSaved] = useState(false);
  const [errors, setErrors] = useState<{ [fieldName: string]: CLError[] }>({});
  const [attributesDiff, setAttributesDiff] = useState<
    IUpdatedAppConfigurationProperties
  >({});

  const handlePageOnChange = (propertyName: string) => (multiloc: Multiloc) => {
    setAttributesDiff({
      ...attributesDiff,
      settings: {
        ...(attributesDiff.settings || {}),
        core: {
          ...(attributesDiff.settings?.core || {}),
          [propertyName]: multiloc,
        },
      },
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsFormSubmitting(true);
    setIsFormSaved(false);

    try {
      await updateAppConfiguration(
        attributesDiff as IUpdatedAppConfigurationProperties
      );

      setIsFormSubmitting(false);
      setIsFormSaved(true);
      setAttributesDiff({});
    } catch (error) {
      setIsFormSubmitting(false);
      setErrors(isCLErrorJSON(error) ? error.json.errors : error);
    }
  };

  if (!isNilOrError(appConfig)) {
    const latestAppConfigCoreSettings = {
      ...appConfig.data.attributes,
      ...attributesDiff,
    }.settings.core;

    return (
      <>
        <SectionTitle>
          <FormattedMessage {...messages.registrationTitle} />
        </SectionTitle>
        <SectionDescription>
          <FormattedMessage {...messages.registrationTabDescription} />
        </SectionDescription>
        <SignUpFieldsSection key={'signup_fields'}>
          <SubSectionTitleWithDescription>
            <FormattedMessage {...messages.signupFormText} />
          </SubSectionTitleWithDescription>
          <SectionDescription>
            <FormattedMessage {...messages.signupFormTooltip} />
          </SectionDescription>
          <form onSubmit={handleSubmit}>
            <SectionField>
              <InputMultilocWithLocaleSwitcher
                type="text"
                valueMultiloc={
                  latestAppConfigCoreSettings?.signup_helper_text || null
                }
                onChange={handlePageOnChange('signup_helper_text')}
                label={
                  <LabelTooltip>
                    <FormattedMessage {...messages.step1} />
                    <IconTooltip
                      content={<FormattedMessage {...messages.step1Tooltip} />}
                    />
                  </LabelTooltip>
                }
              />
            </SectionField>
            <Outlet
              id="app.containers.Admin.settings.registrationHelperText"
              onChange={handlePageOnChange}
              latestAppConfigCoreSettings={latestAppConfigCoreSettings}
            />
            <SubmitWrapper
              loading={isFormSubmitting}
              status={getSubmitState({
                errors,
                saved: isFormSaved,
                diff: attributesDiff,
              })}
              messages={{
                buttonSave: messages.save,
                buttonSuccess: messages.saveSuccess,
                messageError: messages.saveErrorMessage,
                messageSuccess: messages.saveSuccessMessage,
              }}
            />
          </form>
        </SignUpFieldsSection>
        <Outlet id="app.containers.Admin.settings.registration" />
      </>
    );
  }

  return null;
};

export default SettingsRegistrationTab;
