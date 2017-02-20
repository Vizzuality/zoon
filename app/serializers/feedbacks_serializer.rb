class FeedbacksSerializer
  DEFAULT_OPTIONS = {
    except: [
      :feedbackable_type,
      :feedbackable_id,
    ],
    include: {
      user: {}
    }
  }

  def initialize feedback
    @feedback = feedback
  end

  def serialize
    @feedback.as_json(DEFAULT_OPTIONS)
  end
end
