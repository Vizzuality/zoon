class HelloWorldController < ApplicationController
  def index
    @state = {
      name: params[:name] || "requester",
    }
  end
end
