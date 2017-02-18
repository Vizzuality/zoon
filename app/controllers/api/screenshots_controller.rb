class Api::ScreenshotsController < ApplicationController
  before_action :authenticate_user!, only: :create

  def create
    s = Screenshot.new screenshot_params

    if s.save
      render json: s
    else
      render json: {errors: s.errors}
    end
  end

  private

  def screenshot_params
    params.
      require(:screenshot).
      permit(:image)
  end
end
