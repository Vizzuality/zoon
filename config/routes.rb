Rails.application.routes.draw do
  get 'home', to: 'home#index'

  namespace :api do
    resources :modules, controller: 'zoon_modules', only: [:index, :show] do
      member do
        post 'create_screenshot'
        delete 'delete_screenshot/:screenshot_id', as: :delete_screenshot, to: 'zoon_modules#delete_screenshot'
        post 'create_tag'
        delete 'delete_tag/:tag_id', as: :delete_tag, to: 'zoon_modules#delete_tag'
        post :feedback
      end
    end

    resources :tags, only: [:index]
    resources :workflows, only: [:create, :index, :show] do
      member do
        post 'create_tag'
        delete 'delete_tag/:tag_id', as: :delete_tag, to: 'workflows#delete_tag'
        post :feedback
      end
    end
  end

  # DEVISE
  # overridden so React picks these 2 up
  get '/users/sign_in', to: 'home#index'
  get '/users/sign_up', to: 'home#index'
  get '/account', to: 'home#index'
  get '/recover_password', to: 'home#index'
  get '/users/password/edit', to: 'home#index'
  devise_for :users

  resources :zoon_modules, only: [:index, :show] do
    resources :comments, only: [:create]
  end

  get '/modules(/*path)', to: 'home#index'
  get '/workflows(/*path)', to: 'home#index'
  root to: 'home#index'

  match(
    '*path',
    via: [:get, :post, :put, :delete],
    constraints: {format: :json},
    to: lambda do |env|
      [404, {'Content-Type'=>'application/json'}, ['{"error": "not_found"}']]
    end,
  )
end
