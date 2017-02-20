class ZoonModulesSerializer < ApplicationSerializer
  def initialize user:, zoon_module:
    @user = user
    @zoon_module = zoon_module
  end

  def serialize
    json = @zoon_module.as_json

    if @user
      json["create_screenshot_path"] = routes.create_screenshot_api_module_path(
        @zoon_module,
      )
    end

    json["screenshots"] = @zoon_module.screenshots.map do |screenshot|
      ScreenshotSerializer.new(user: @user, screenshot: screenshot).serialize
    end

    json
  end
end
