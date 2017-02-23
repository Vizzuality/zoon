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

  def create_tag entity, tagname
    tag = Tag.where(name: tagname).first_or_create!
    if entity.tags.include?(tag)
      render status: :unprocessable_entity, json: { error: ['Tag already exists'] }
    else
      entity.tags << tag

      yield
    end
  end

  def delete_tag entity, tag_id
    tag = Tag.find params[:tag_id].to_i

    entity.tags.delete(tag)

    yield
  end
end
