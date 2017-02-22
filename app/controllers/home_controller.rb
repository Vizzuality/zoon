class HomeController < ApplicationController
  include ActionView::Helpers::AssetUrlHelper

  def index
    @state = {
      auth: (current_user || User.new).as_json.merge(
          csrf: form_authenticity_token,
          reset_password_token: params[:reset_password_token],
      ),
      families: families,
      modules: {
        searchFamily: params[:searchFamily] || '',
        searchQuery: params[:searchQuery] || '',
        searchTags: (params[:searchTags] || '').split(',').reject(&:empty?),
        granularity: params[:granularity].presence || 'continents',
      },
    }
  end

  private
  def families
    {
      entities: [
        'occurrence',
        'covariate',
        'process',
        'model',
        'output',
      ].map do |f|
        # TODO Why won't `image_url("module_#{f}.png")` work here?
        {name: f, image_url: image_url("/assets/module_#{f}.png")}
      end
    }
  end
end
