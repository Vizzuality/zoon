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

    assert_equal(
      {
        "state" => "ok",
        "entity" => {
          "id" => @module.id,
          "title" => nil,
          "description" => nil,
          "author" => nil,
          "name" => @module.name,
          "version" => nil,
          "date_submitted" => nil,
          "family" => nil,
          "path_to_module" => nil,
          "latest_import" => nil,
          "created_at" => @module.created_at.iso8601(3),
          "updated_at" => @module.updated_at.iso8601(3),
          "average_rating" =>  3.0 ,
          "rating_count" => 2,
          "comment_count" => 1,
          "screenshots" => [],
          "comments" => [
            {
              "id" => @first_comment.id,
              "user_id" => @user_a.id,
              "rating" => 2,
              "comment" => comment,
              "created_at" => @first_comment.created_at.iso8601(3),
              "updated_at" => @first_comment.updated_at.iso8601(3),
            },
          ],
          "current_feedback" => {
            "id" => @second_comment.id,
            "user_id" => @user_b.id,
            "rating" => 4,
            "comment" => nil,
            "created_at" => @second_comment.created_at.iso8601(3),
            "updated_at" => @second_comment.updated_at.iso8601(3),
          },
          "create_screenshot_path" => "/api/modules/1056801272/create_screenshot",
        },
      },
      JSON.parse(@response.body),
    )
  end
end
