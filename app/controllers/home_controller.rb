class HomeController < ApplicationController
  include ActionView::Helpers::AssetUrlHelper

  def index
    @state = {
      name: params[:name] || "requester",
      authenticated: current_user || User.new,
      families: families,
      modules: {
        selectedFamilyName: params[:familyName] || '',
        searchQuery: params[:searchQuery] || '',
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
