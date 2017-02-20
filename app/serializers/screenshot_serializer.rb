class ScreenshotSerializer < ApplicationSerializer
  def initialize user:, screenshot:
    @user = user
    @screenshot = screenshot
  end

  def serialize
    json = @screenshot.as_json

    if @user && @screenshot.user == @user
      json["delete_path"] = routes.delete_screenshot_api_module_path(
        @screenshot.screenshootable,
        @screenshot,
      )
    end

    json
  end
end
