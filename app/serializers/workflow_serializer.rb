class WorkflowSerializer < ApplicationSerializer
  def initialize user:, workflow:
    @user = user
    @workflow = workflow
  end

  def serialize
    json = @workflow.as_json(
      only: [:id, :title, :description],
      methods: [:composition_types],
    )

    json["modules"] = @workflow.zoon_modules.map do |zm|
      ZoonModulesSerializer.new(user: @user, zoon_module: zm).serialize
    end

    json
  end
end
