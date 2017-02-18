class HomeController < ApplicationController
  include ActionView::Helpers::AssetUrlHelper

  def index
    @state = {
      auth: (current_user || User.new).as_json.merge(
          csrf: form_authenticity_token,
      ),
      families: families,
      modules: {
        selectedFamilyName: params[:familyName] || '',
        searchQuery: params[:searchQuery] || '',
        searchTags: params[:searchTags] || '',
      }
    }
  end

  private
  def families
    {
      entities: [
        'covariate',
        'model',
        'occurrence',
        'output',
        'process',
      ].map do |f|
        # TODO Why won't `image_url("module_#{f}.png")` work here?
        {name: f, image_url: image_url("/assets/module_#{f}.png")}
      end
    }
  end
end
