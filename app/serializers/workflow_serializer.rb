class WorkflowSerializer < ApplicationSerializer
  def initialize user:, workflow:
    @user = user
    @workflow = workflow
  end

  def serialize
    json = @workflow.as_json(
      only: [:id, :title, :description, :created_at],
      methods: [
        :composition_types,
        :average_rating,
        :rating_count,
        :comment_count,
      ],
      include: {
        user: {},
        comments: FeedbacksSerializer::DEFAULT_OPTIONS,
      }
    )

    json["modules"] = @workflow.zoon_modules.map do |zm|
      ZoonModulesSerializer.new(user: @user, zoon_module: zm).serialize
    end.group_by { |zm| zm["family"] }

    if @user
      json['current_feedback'] = FeedbacksSerializer.new(
        @workflow.feedbacks.find_by(user_id: @user.id),
      ).serialize

      json["create_tag_path"] = routes.create_tag_api_workflow_path(
        @workflow,
      )

      json["feedback_path"] = routes.feedback_api_workflow_path(
        @workflow,
      )
    else
      json['current_feedback'] = {}
    end

    json["tags"] = @workflow.tags.map do |tag|
      { id: tag.id, name: tag.name }.merge(tag_options(tag))
    end

    json
  end

  def tag_options tag
    if @user && @user == @workflow.user
      { delete_path: routes.delete_tag_api_workflow_path(@workflow, tag) }
    else
      {}
    end
  end
end
