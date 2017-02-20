class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :configure_permitted_parameters, if: :devise_controller?

  after_action do
    headers["X-CSRF-Token"] = form_authenticity_token
  end

  protected

  def configure_permitted_parameters
    [:sign_up, :account_update].each do |action|
      devise_parameter_sanitizer.permit(
        action,
        keys: [:github_username, :organization, :name],
      )
    end
  end
end
