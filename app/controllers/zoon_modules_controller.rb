class ZoonModulesController < ApplicationController
  before_action :set_zoon_module, only: [:show]

  def index
    @zoon_modules = ZoonModule.order(:name).search(params[:query])
    if params[:family]
      @zoon_modules = @zoon_modules.filter_by_family(params[:family])
    end
    @families = ZoonModule.select("distinct family").order(:family).
      where.not(family: nil)
  end

  def show
    @comment = @zoon_module.comments.build
  end

  private

  def set_zoon_module
    @zoon_module = ZoonModule.find(params[:id])
  end
end
