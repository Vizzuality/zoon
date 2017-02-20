class ZoonModulesSerializer
  def initialize user:, zoon_module:
    @user = user
    @zoon_module = zoon_module
    @routes = Rails.application.routes.url_helpers
  end

  def serialize
    json = @zoon_module.as_json(include: [:screenshots])

    json["create_screenshot_path"] = @routes.create_screenshot_api_module_path(json["id"]) if @user

    json["screenshots"] = json["screenshots"].map do |screenshot|
      if @user && screenshot["user_id"] == @user&.id
        screenshot.merge(delete_path: @routes.delete_screenshot_api_module_path(json["id"], screenshot["id"]))
      else
        screenshot
      end
    end

    json
  end
end
