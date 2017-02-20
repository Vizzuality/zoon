Rails.application.routes.draw do
  get 'home', to: 'home#index'

  namespace :api do
    resources :modules, only: [:index, :show]
    resources :screenshots, only: [:create]
  end

  # DEVISE
  # overridden so React picks these 2 up
  get '/users/sign_in', to: 'home#index'
  get '/users/sign_up', to: 'home#index'
  devise_for :users

  resources :zoon_modules, only: [:index, :show] do
    resources :comments, only: [:create]
  end

  get '/modules(/*path)', to: 'home#index'
  get '/workflows(/*path)', to: 'home#index'
  root to: 'home#index'
end
