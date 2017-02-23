class Api::ZoonModulesController < ApplicationController
  before_action :authenticate_user!, only: [
    :create_screenshot,
    :delete_screenshot,
    :create_tag,
    :delete_tag,
  ]

  rescue_from ActiveRecord::RecordNotFound do
    render json: {
      state: :error,
      errorMessage: "Can't find module.",
      error: "Can't find module.",
    }
  end

  rescue_from Exception do |e|
    render(
      status: 500,
      json: {
        state: :error,
        errorMessage: e.to_s,
        backtrace: e.backtrace,
      },
    )
  end

  def index
    zoon_modules = ZoonModule.order(:name).search params[:searchQuery], params[:searchTags].split(',')

    if searchFamily = params[:searchFamily].presence
      zoon_modules = zoon_modules.filter_by_family searchFamily
    end

    render json: {
      state: :ok,
      entities: zoon_modules.map do |zoon_module|
        ZoonModulesSerializer.new(
          user: current_user,
          zoon_module: zoon_module,
        ).serialize
      end
    }
  end

  def show
    zoon_module = ZoonModule.find params[:id].to_i

    render_zoon_module zoon_module
  end

  def create_screenshot
    zoon_module = ZoonModule.find params[:id].to_i

    screenshot = Screenshot.create screenshot_params.merge(
      screenshootable: zoon_module,
      user: current_user,
    )

    if screenshot.persisted?
      render_zoon_module zoon_module
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

      render_zoon_module zoon_module
    end
  end

  def create_tag
    zoon_module = ZoonModule.find params[:id].to_i
    tag = params[:name]

    super zoon_module, tag do
      render_zoon_module zoon_module
    end
  end

  def delete_tag
    zoon_module = ZoonModule.find params[:id].to_i
    tag_id = params[:tag_id]

    if !zoon_module.author_emails.include?(current_user.email)
      render status: :unauthorized, json: { error: ['Unauthorized']}
    end

    super zoon_module, tag_id do
      render_zoon_module zoon_module
    end
  end

  def feedback
    z = ZoonModule.find params[:id]
    z.feedbacks.upsert(
      current_user.id,
      params[:rating],
      params[:comment],
    )

    render_zoon_module z
  end

  private

  def render_zoon_module zoon_module
    render json: {
      state: :ok,
      entities: [
        ZoonModulesSerializer.new(
          user: current_user,
          zoon_module: zoon_module
        ).serialize,
      ],
      shownEntityId: zoon_module.id,
    }
  end

  def screenshot_params
    params.
      require(:screenshot).
      permit(:image)
  end
end
