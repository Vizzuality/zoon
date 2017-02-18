class Api::ModulesController < ApplicationController
  def index
    modules = ZoonModule.order(:name).search params[:searchQuery], params[:searchTags].split(',')

    if familyName = params[:familyName].presence
      modules = modules.filter_by_family familyName 
    end

    render json: {
      state: :ok,
      entities: modules.map(&:as_json),
    }
  end
end
