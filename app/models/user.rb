class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable,
         :validatable

  def avatar_url
    "https://github.com/#{github_username}.png?size=460"
  end

  def serializable_hash(options = nil)
    super({ methods: [:avatar_url] }.merge(options || {}))
  end
end
