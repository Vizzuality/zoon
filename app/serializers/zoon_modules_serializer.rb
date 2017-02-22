class ZoonModulesSerializer < ApplicationSerializer
  def initialize user:, zoon_module:
    @user = user
    @zoon_module = zoon_module
  end

  def serialize
    json = @zoon_module.as_json(
      include: {
        comments: FeedbacksSerializer::DEFAULT_OPTIONS,
      },
      methods: [
        :average_rating,
        :rating_count,
        :comment_count,
      ],
    )

    if @user
      json['current_feedback'] = FeedbacksSerializer.new(
        @zoon_module.feedbacks.find_by(user_id: @user.id),
      ).serialize

      json["create_screenshot_path"] = routes.create_screenshot_api_module_path(
        @zoon_module,
      )

      json["create_tag_path"] = routes.create_tag_api_module_path(
        @zoon_module,
      )
    else
      json['current_feedback'] = {}
    end

    json["screenshots"] = @zoon_module.screenshots.map do |screenshot|
      ScreenshotSerializer.new(user: @user, screenshot: screenshot).serialize
    end

    json["tags"] = @zoon_module.tags.map do |tag|
      { id: tag.id, name: tag.name }.merge(tag_options(tag))
    end

    json
  end

  def tag_options tag
    if @user && @zoon_module.author_emails.include?(@user.email)
      { delete_path: routes.delete_tag_api_module_path(@zoon_module, tag) }
    else
      {}
    end
  end
end
