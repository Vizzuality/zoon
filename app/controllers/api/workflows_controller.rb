class Api::WorkflowsController < ApplicationController
  def index
    render json: {
      entities: Workflow.all.map do |workflow|
        WorkflowSerializer.new(
          user: current_user,
          workflow: workflow,
        ).serialize
      end,
    }
  end

  def create
    workflow = Workflow.create(workflow_params)

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
