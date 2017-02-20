class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable,
         :validatable

  def avatar_url
    "http://avatar.com/my_cool_avatar"
  end

  def serializable_hash(options = nil)
    super({ methods: [:avatar_url] }.merge(options || {}))
  end
end
