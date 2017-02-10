class HomeController < ApplicationController
  def index
    @state = {
      name: params[:name] || "requester",
      authenticated: false,
    }
  end
end
