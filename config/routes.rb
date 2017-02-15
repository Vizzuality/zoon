Rails.application.routes.draw do
  get 'home', to: 'home#index'
  post '/rate' => 'rater#create', :as => 'rate'

  # DEVISE
  # overridden so React picks these 2 up
  get '/users/sign_in', to: 'home#index'
  get '/users/sign_up', to: 'home#index'
  devise_for :users

  resources :zoon_modules, only: [:index, :show] do
    resources :comments, only: [:create]
  end

  get '*path', to: 'home#index'
  root to: 'home#index'
end
