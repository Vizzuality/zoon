class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  after_action do
    headers["X-CSRF-Token"] = form_authenticity_token
  end
end
