require 'test_helper'

class ZoonModulesControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @module = ZoonModule.create! name: 'zooner'
    @user_a = User.create!(email: 'a@a.a', password: 'password')
    @user_b = User.create!(email: 'b@a.a', password: 'password')
  end

  test "give feedback" do
    comment = "Holla humano!"

    assert_difference('Feedback.count') do
      sign_in(@user_a)

      post feedback_api_module_path(@module), params: {
        rating: 2,
        comment: comment
      }
      @first_comment = @module.feedbacks.order('updated_at DESC').first

      assert_response :success, @response.body
    end

    assert_difference('Feedback.count') do
      sign_in(@user_b)

      post feedback_api_module_path(@module), params: {
        rating: 4,
      }
      @second_comment = @module.feedbacks.order('updated_at DESC').first

      assert_response :success, @response.body
    end

    # Get latest_import
    @module.reload

    assert_equal(
      {
        "state" => "ok",
        "entities" => [
          rejson(ZoonModulesSerializer.new(user: @user_b, zoon_module: @module).serialize),
        ],
        "shownEntityId" => @module.id,
      },
      JSON.parse(@response.body),
    )
  end

  private
  def rejson a
    JSON.parse(JSON.dump(a.as_json))
  end
end
