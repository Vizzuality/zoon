class Api::ModulesController < ApplicationController
  def index
    modules = ZoonModule.order(:name).search params[:searchQuery], params[:searchTags].split(',')

    if searchFamily = params[:searchFamily].presence
      modules = modules.filter_by_family searchFamily
    end

    render json: {
      state: :ok,
      entities: modules.map(&:as_json),
    }
  end

  def show
    id = params[:id].to_i
    begin
      zoon_module = ZoonModule.find id
    rescue ActiveRecord::RecordNotFound
      return render json: {
        state: :error,
        errorMessage: "Can't find the module with id #{id}."
      }
    end

    render json: {
      state: :ok,
      entities: [zoon_module.as_json],
      shownEntityId: id,
    }
  end
end
