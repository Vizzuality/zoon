class Api::TagsController < ApplicationController
  def index
    render json: {
      tags: Tag.where("name ILIKE ?", "#{params[:search]}%").distinct.pluck(:name)
    }
  end
end
