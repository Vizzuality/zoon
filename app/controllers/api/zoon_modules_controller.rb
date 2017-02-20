class Api::ZoonModulesController < ApplicationController
  before_action :authenticate_user!, only: [:create_screenshot, :delete_screenshot]

  rescue_from ActiveRecord::RecordNotFound do
    render json: {
      state: :error,
      errorMessage: "Can't find module.",
      error: "Can't find module.",
    }
  end

  def index
    modules = ZoonModule.order(:name).search params[:searchQuery], params[:searchTags].split(',')

    if searchFamily = params[:searchFamily].presence
      modules = modules.filter_by_family searchFamily
    end

    render json: {
      state: :ok,
      entities: modules,
    }
  end

  def show
    zoon_module = ZoonModule.find params[:id].to_i

    render json: {
      state: :ok,
      entities: [ZoonModulesSerializer.new(zoon_module).serialize],
      shownEntityId: zoon_module.id,
    }
  end

  def create_screenshot
    zoon_module = ZoonModule.find params[:id].to_i

    screenshot = Screenshot.create screenshot_params.merge(
      screenshootable: zoon_module,
      user: current_user,
    )

    if screenshot.persisted?
      render json: {
        state: :ok,
        entities: [ZoonModulesSerializer.new(zoon_module).serialize],
        shownEntityId: zoon_module.id,
      }
    else
      render json: {errors: screenshot.errors}
    end
  end

  def delete_screenshot
    zoon_module = ZoonModule.find params[:id].to_i

    screenshot = zoon_module.screenshots.find params[:screenshot_id]

    if screenshot.user != current_user
      render status: :unauthorized, json: { error: ['Unauthorized']}
    else
      screenshot.destroy

      render json: {
        state: :ok,
        entities: [ZoonModulesSerializer.new(zoon_module).serialize],
        shownEntityId: zoon_module.id,
      }
    end
  end

  private

  def screenshot_params
    params.
      require(:screenshot).
      permit(:image)
  end
end
