module EmailCampaigns
  class Campaigns::IdeaAssignedToYou < Campaign
    include Consentable
    include ActivityTriggerable
    include Disableable
    include Trackable
    include LifecycleStageRestrictable
    allow_lifecycle_stages only: ['active']

    recipient_filter :filter_notification_recipient

    def self.consentable_roles
      ['admin', 'project_moderator']
    end

    def activity_triggers
      {'Notifications::IdeaAssignedToYou' => {'created' => true}}
    end

    def filter_notification_recipient users_scope, activity:, time: nil
      users_scope.where(id: activity.item.recipient.id)
    end

    def generate_commands recipient:, activity:, time: nil
      notification = activity.item
      [{
        event_payload: {
          post_title_multiloc: notification.post.title_multiloc,
          post_body_multiloc: notification.post.body_multiloc,
          post_author_name: notification.post.author_name,
          post_published_at: notification.post.published_at.iso8601,
          post_url: Frontend::UrlService.new.model_to_url(notification.post, locale: recipient.locale)
        }
      }]
    end
  end
end