class HomeController < ApplicationController
  include ActionView::Helpers::AssetUrlHelper

  def index
    @state = {
      auth: (current_user || User.new).as_json.merge(
          reset_password_token: params[:reset_password_token],
      ),
    }
  end
end
