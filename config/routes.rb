Rails.application.routes.draw do
  get 'home', to: 'home#index'
  post '/rate' => 'rater#create', :as => 'rate'
  devise_for :users

  resources :zoon_modules, only: [:index, :show] do
    resources :comments, only: [:create]
  end

  root 'hello_world#index'
end
