require 'test_helper'

class WorkflowsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @user_a = User.create!(email: 'a@a.a', password: 'password')
    @user_b = User.create!(email: 'b@a.a', password: 'password')

    @workflow = Workflow.create! title: 'zooner', user: @user_a
  end

  test "delete" do
    sign_in(@user_a)

    assert_difference('Workflow.count', -1) do
      delete api_workflow_path(@workflow)

      assert_response :success, @response.body
    end
  end

  test "delete unauthorized" do
    sign_in(@user_b)

    assert_difference('Workflow.count', 0) do
      delete api_workflow_path(@workflow)

      assert_response :unauthorized, @response.body
    end
  end
end
