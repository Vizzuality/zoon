class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable,
         :validatable

  def avatar_url
    "https://avatars2.githubusercontent.com/u/111554?v=3&s=460"
  end

  def serializable_hash(options = nil)
    super({ methods: [:avatar_url] }.merge(options || {}))
  end
end
