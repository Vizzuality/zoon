class ZoonModulesController < ApplicationController
  before_action :set_zoon_module, only: [:show]

  def index
    @zoon_modules = ZoonModule.order(:name)
    @families = ZoonModule.select("distinct family").order(:family).
      where.not(family: nil)
  end

  def show
  end

  private

  def set_zoon_module
    @zoon_module = ZoonModule.find(params[:id])
  end
end
