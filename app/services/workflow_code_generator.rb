class WorkflowCodeGenerator
  def initialize workflow:
    @workflow = workflow
  end

  def generate
    [
      "workflow(",
      pieces.map { |piece| "  #{piece}," },
      "  forceReproducible = FALSE",
      ")",
    ].flatten.join("\n")
  end

  private
  def pieces
    Workflow::FAMILIES.map do |family|
      "#{family} = #{module_list(
        @workflow.composition_types[family],
        @workflow.zoon_modules.select { |zm| zm.family == family },
      )}"
    end
  end

  def module_list composition_type, modules
    if modules.size == 1
      modules.first.code
    else
      "#{composition_type}(#{modules.map(&:code).join(', ')})"
    end
  end
end
