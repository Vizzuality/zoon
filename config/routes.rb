Rails.application.routes.draw do
  get 'hello_world', to: 'hello_world#index'
  post '/rate' => 'rater#create', :as => 'rate'
  devise_for :users

  resources :zoon_modules, only: [:index, :show] do
    resources :comments, only: [:create]
  end

  root 'home#index'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
