require 'test_helper'

class ZoonModuleTest < ActiveSupport::TestCase
  setup do
    @user = User.create! email: 'a@a.a', password: 'password'
    @another_user = User.create! email: 'b@a.a', password: 'password'

    ZoonModule.destroy_all
    @zoon_module = ZoonModule.create! name: 'name'
  end

  test "default scope is visibles only" do
    # We've already create a visible one in setup
    ZoonModule.create! name: 'hidden', visible: false

    assert_equal 1, ZoonModule.count
    assert_equal 2, ZoonModule.unscoped.count
  end

  test "one feedback per user" do
    new_rating = 4
    new_comment = 'new comment'

    @zoon_module.feedbacks.upsert @user.id, 3, 'A comment'
    @zoon_module.feedbacks.upsert @user.id, new_rating, new_comment

    f = @zoon_module.feedbacks.where('user_id = ?', @user.id).first
    assert_equal new_rating, f.rating
    assert_equal new_comment, f.comment
  end

  test "calculated are ok" do
    @zoon_module.feedbacks.upsert @user.id, 3, 'A comment'
    @zoon_module.feedbacks.upsert @another_user.id, 4

    assert_equal 3.5, @zoon_module.average_rating
    assert_equal 2, @zoon_module.rating_count
    assert_equal 1, @zoon_module.comment_count
  end
end
