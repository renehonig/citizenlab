class WebApi::V1::ModerationController < ApplicationController

  def index
    ids = Idea.published.ids + Initiative.published.ids + Comment.published.ids
    @moderations = policy_scope(Moderation)
      .where(ids: ids.uniq)
      .order(created_at: :desc)

    @moderations = @moderations
      .page(params.dig(:page, :number))
      .per(params.dig(:page, :size))
    render json: linked_json(@moderations, WebApi::V1::ModerationSerializer, params: fastjson_params)
  end
end