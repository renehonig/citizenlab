import React, { PureComponent } from 'react';
import { isNilOrError } from 'utils/helperUtils';
import { adopt } from 'react-adopt';
import { get } from 'lodash-es';

// components
import Title from 'components/PostShowComponents/Title';
import Body from 'components/PostShowComponents/Body';
import DropdownMap from 'components/PostShowComponents/DropdownMap';
import OfficialFeedback from 'components/PostShowComponents/OfficialFeedback';
import Comments from 'components/PostShowComponents/Comments';
import FileAttachments from 'components/UI/FileAttachments';
import FeedbackSettings from './FeedbackSettings';
import VotePreview from './VotePreview';
import { IconTooltip } from 'cl2-component-library';
import Button from 'components/UI/Button';
import Link from 'utils/cl-router/Link';
import T from 'components/T';
import { Top, Content, Container } from '../PostPreview';

// services
import { deleteIdea } from 'services/ideas';

// resources
import GetResourceFiles, {
  GetResourceFilesChildProps,
} from 'resources/GetResourceFiles';
import GetIdea, { GetIdeaChildProps } from 'resources/GetIdea';
import GetIdeaImages, {
  GetIdeaImagesChildProps,
} from 'resources/GetIdeaImages';
import GetTenant, { GetTenantChildProps } from 'resources/GetTenant';
import GetProject, { GetProjectChildProps } from 'resources/GetProject';
import GetPermission, {
  GetPermissionChildProps,
} from 'resources/GetPermission';

// i18n
import injectLocalize, { InjectedLocalized } from 'utils/localize';
import { injectIntl, FormattedMessage } from 'utils/cl-intl';
import { InjectedIntlProps, FormattedNumber } from 'react-intl';
import messages from '../messages';

// style
import styled from 'styled-components';
import { colors, fontSizes } from 'utils/styleUtils';
import { darken } from 'polished';

const StyledTitle = styled(Title)`
  margin-bottom: 30px;
`;

const Row = styled.div`
  display: flex;
  width: 100%;
`;

const Left = styled.div`
  flex: 5;
  margin-right: 50px;
  height: 100%;
`;

const BelongsToProject = styled.p`
  width: 100%;
  color: ${colors.label};
  font-weight: 300;
  font-size: ${fontSizes.base}px;
  line-height: normal;
  margin-bottom: 10px;
`;

const ProjectLink = styled(Link)`
  color: inherit;
  font-weight: 400;
  font-size: inherit;
  line-height: inherit;
  text-decoration: underline;
  transition: all 100ms ease-out;
  margin-left: 4px;

  &:hover {
    color: ${darken(0.2, colors.label)};
    text-decoration: underline;
  }
`;

const IdeaImage = styled.img`
  width: 100%;
  margin: 0 0 2rem;
  padding: 0;
  border-radius: 8px;
  border: 1px solid ${colors.separation};
`;

const StyledBody = styled(Body)`
  margin-bottom: 20px;
`;

const StyledMap = styled(DropdownMap)`
  margin-bottom: 40px;
`;

const StyledOfficialFeedback = styled(OfficialFeedback)`
  margin-top: 70px;
`;

const StyledComments = styled(Comments)`
  margin-top: 30px;
`;

const Right = styled.div`
  flex: 2;
  position: sticky;
  top: 80px;
  align-self: flex-start;
  color: ${colors.adminTextColor};
  font-size: ${fontSizes.base}px;
  line-height: 19px;
`;

const BudgetBox = styled.div`
  margin-top: 25px;
  width: 100%;
  height: 95px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
  position: relative;
  border-radius: 5px;
  background: ${colors.background};
  border: solid 1px ${colors.adminTextColor};
  font-size: ${fontSizes.large}px;
  font-weight: 500;
`;

const Picks = styled.div`
  margin-top: 15px;
  display: flex;
  font-size: ${fontSizes.base}px;
  align-items: center;
`;

interface State {}

export interface InputProps {
  ideaId: string | null;
  closePreview: () => void;
  handleClickEdit: () => void;
}

interface DataProps {
  idea: GetIdeaChildProps;
  ideaImages: GetIdeaImagesChildProps;
  ideaFiles: GetResourceFilesChildProps;
  tenant: GetTenantChildProps;
  project: GetProjectChildProps;
  postOfficialFeedbackPermission: GetPermissionChildProps;
}

interface Props extends InputProps, DataProps {}

export class IdeaContent extends PureComponent<
  Props & InjectedLocalized & InjectedIntlProps,
  State
> {
  handleClickDelete = () => {
    const { idea, closePreview } = this.props;
    const message = this.props.intl.formatMessage(
      messages.deleteIdeaConfirmation
    );

    if (!isNilOrError(idea)) {
      if (window.confirm(message)) {
        deleteIdea(idea.id);
        closePreview();
      }
    }
  };

  render() {
    const {
      idea,
      project,
      localize,
      ideaImages,
      ideaFiles,
      tenant,
      handleClickEdit,
    } = this.props;

    if (!isNilOrError(idea)) {
      const ideaId = idea.id;
      const ideaTitle = localize(idea.attributes.title_multiloc);
      const ideaImageLarge =
        !isNilOrError(ideaImages) && ideaImages.length > 0
          ? get(ideaImages[0], 'attributes.versions.large', null)
          : null;
      const ideaGeoPosition = idea.attributes.location_point_geojson || null;
      const ideaAddress = idea.attributes.location_description || null;

      return (
        <Container>
          <Top>
            <Button icon="edit" buttonStyle="text" onClick={handleClickEdit}>
              <FormattedMessage {...messages.edit} />
            </Button>
            <Button
              icon="delete"
              buttonStyle="text"
              onClick={this.handleClickDelete}
            >
              <FormattedMessage {...messages.delete} />
            </Button>
          </Top>
          <Content>
            {!isNilOrError(project) && (
              <BelongsToProject>
                <FormattedMessage
                  {...messages.postedIn}
                  values={{
                    projectLink: (
                      <ProjectLink
                        className="e2e-project-link"
                        to={`/projects/${project.attributes.slug}`}
                      >
                        <T value={project.attributes.title_multiloc} />
                      </ProjectLink>
                    ),
                  }}
                />
              </BelongsToProject>
            )}

            <StyledTitle postId={ideaId} postType="idea" title={ideaTitle} />
            <Row>
              <Left>
                {ideaImageLarge && (
                  <IdeaImage
                    src={ideaImageLarge}
                    alt=""
                    className="e2e-ideaImage"
                  />
                )}

                <StyledBody
                  postId={ideaId}
                  postType="idea"
                  body={localize(idea.attributes.body_multiloc)}
                />

                {!isNilOrError(project) && ideaGeoPosition && ideaAddress && (
                  <StyledMap
                    address={ideaAddress}
                    position={ideaGeoPosition}
                    projectId={project.id}
                  />
                )}

                {ideaFiles && !isNilOrError(ideaFiles) && (
                  <FileAttachments files={ideaFiles} />
                )}

                <StyledOfficialFeedback
                  postId={ideaId}
                  postType="idea"
                  permissionToPost
                />

                <StyledComments postId={ideaId} postType="idea" />
              </Left>
              <Right>
                <VotePreview ideaId={ideaId} />

                {idea.attributes.budget && !isNilOrError(tenant) && (
                  <>
                    <BudgetBox>
                      <FormattedNumber
                        value={idea.attributes.budget}
                        style="currency"
                        currency={tenant.attributes.settings.core.currency}
                        minimumFractionDigits={0}
                        maximumFractionDigits={0}
                      />
                      <Picks>
                        <FormattedMessage
                          {...messages.picks}
                          values={{
                            picksNumber: idea.attributes.baskets_count,
                          }}
                        />
                        &nbsp;
                        <IconTooltip
                          content={
                            <FormattedMessage
                              {...messages.basketsCountTooltip}
                            />
                          }
                        />
                      </Picks>
                    </BudgetBox>
                  </>
                )}

                <FeedbackSettings ideaId={ideaId} />
              </Right>
            </Row>
          </Content>
        </Container>
      );
    }
    return null;
  }
}

const Data = adopt<DataProps, InputProps>({
  tenant: <GetTenant />,
  idea: ({ ideaId, render }) => <GetIdea ideaId={ideaId}>{render}</GetIdea>,
  project: ({ idea, render }) => (
    <GetProject projectId={get(idea, 'relationships.project.data.id')}>
      {render}
    </GetProject>
  ),
  ideaFiles: ({ ideaId, render }) => (
    <GetResourceFiles resourceId={ideaId} resourceType="idea">
      {render}
    </GetResourceFiles>
  ),
  ideaImages: ({ ideaId, render }) => (
    <GetIdeaImages ideaId={ideaId}>{render}</GetIdeaImages>
  ),
  postOfficialFeedbackPermission: ({ project, render }) => (
    <GetPermission
      item={!isNilOrError(project) ? project : null}
      action="moderate"
    >
      {render}
    </GetPermission>
  ),
});

const IdeaContentWithHOCs = injectIntl(injectLocalize(IdeaContent));

const WrappedIdeaContent = (inputProps: InputProps) => (
  <Data {...inputProps}>
    {(dataProps) => <IdeaContentWithHOCs {...inputProps} {...dataProps} />}
  </Data>
);

export default WrappedIdeaContent;
