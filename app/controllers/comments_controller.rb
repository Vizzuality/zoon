class CommentsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_zoon_module

  def create
    @comment = @zoon_module.comments.new(comment_params)
    @comment.user_id = current_user.id
    if @comment.save
      redirect_to @zoon_module
    end
  end

  private

  def set_zoon_module
    @zoon_module = ZoonModule.find(params[:zoon_module_id])
  end

  def comment_params
    params.require(:comment).permit(:body)
  end
end
