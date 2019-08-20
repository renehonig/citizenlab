module Notifications
  class ProjectModerationRightsReceived < Notification
    
    belongs_to :initiating_user, class_name: 'User', optional: true
    belongs_to :project

    validates :project presence: true

    ACTIVITY_TRIGGERS = {'User' => {'project_moderation_rights_given' => true}}
    EVENT_NAME = 'Project moderation rights received'


    def self.make_notifications_on activity
      recipient = activity.item
      initiator_id = activity.user_id
      project_id = activity.payload['project_id']
      
      if project_id && recipient
        [self.new(
           recipient: recipient,
           initiating_user_id: initiator_id,
           project_id: project_id
         )]
      else
        []
      end
    end

  end
end