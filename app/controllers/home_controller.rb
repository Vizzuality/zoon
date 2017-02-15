class HomeController < ApplicationController
  def index
    @state = {
      name: params[:name] || "requester",
      authenticated: current_user || User.new
    }
  end
end
