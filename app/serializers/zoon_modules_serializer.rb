class ZoonModulesSerializer
  def initialize zoon_module
    @zoon_module = zoon_module
  end

  def serialize
    @zoon_module.as_json(include: [:screenshots])
  end
end
