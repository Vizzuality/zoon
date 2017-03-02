class Api::WorkflowsController < ApplicationController
  def index
    workflows = Workflow.search(
      params.fetch(:searchQuery, ''),
      params.fetch(:selectedGeos, '').split(','),
    ).order(:title)

    render json: {
      entities: workflows.map do |workflow|
        WorkflowSerializer.new(
          user: current_user,
          workflow: workflow,
        ).serialize
      end,
    }
  end

  def create
    workflow = Workflow.create(workflow_params.merge(user: current_user))

    render_workflow workflow
  end

  def update
    w = nil
    ActiveRecord::Base.transaction do
      w = Workflow.find(params[:id].to_i)
      w.workflow_modules.clear
      w.update!(workflow_params.merge(user: current_user))
    end

    render_workflow w
  end

  def show
    workflow = Workflow.find params[:id].to_i

    render_workflow workflow
  end

  def create_tag
    workflow = Workflow.find params[:id].to_i
    tag = params[:name]

    super workflow, tag do
      render_workflow workflow
    end
  end

  def delete_tag
    workflow = Workflow.find params[:id].to_i
    tag_id = params[:tag_id]

    if workflow.user != current_user
      render status: :unauthorized, json: { error: ['Unauthorized']}
    else
      super workflow, tag_id do
        render_workflow workflow
      end
    end
  end

  def feedback
    workflow = Workflow.find params[:id].to_i

    workflow.feedbacks.upsert(
      current_user.id,
      params.require(:feedback)[:rating],
      params.require(:feedback)[:comment],
    )

    render_workflow workflow
  end

  private
  def render_workflow workflow
    if workflow.persisted?
      render json: {
        workflow: WorkflowSerializer.new(
          user: current_user,
          workflow: workflow,
        ).serialize,
      }
    else
      render status: 422, json: { errors: workflow.errors }
    end
  end

  def workflow_params
    p = params.require(:workflow).
      permit(:title, :description)

    params.
      require(:workflow).
      require(:compositionTypes).
      permit(*Workflow::FAMILIES).
      each do |k, v|
        p["#{k}_composition_type"] = v
      end

    p[:workflow_modules_attributes] = params.
      require(:workflow).
      permit(modules: [])[:modules].
      each_with_index.
      map do |module_id, position|
        { zoon_module_id: module_id, position: position }
      end

    p
  end
end
