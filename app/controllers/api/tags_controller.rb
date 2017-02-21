class Api::TagsController < ApplicationController
  def index
    render json: {
      tags: Tag.where("name ILIKE ?", "#{params[:search]}%").pluck(:name),
    }
  end
end
