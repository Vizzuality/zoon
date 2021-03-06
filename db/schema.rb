# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170620175638) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "feedbacks", force: :cascade do |t|
    t.string   "feedbackable_type"
    t.integer  "feedbackable_id"
    t.integer  "user_id"
    t.integer  "rating"
    t.text     "comment"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
    t.index ["feedbackable_id", "feedbackable_type", "user_id"], name: "feeback_by_user", unique: true, using: :btree
    t.index ["feedbackable_type", "feedbackable_id"], name: "index_feedbacks_on_feedbackable_type_and_feedbackable_id", using: :btree
    t.index ["user_id"], name: "index_feedbacks_on_user_id", using: :btree
  end

  create_table "screenshots", force: :cascade do |t|
    t.integer  "screenshootable_id"
    t.string   "screenshootable_type"
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
    t.string   "image"
    t.integer  "user_id"
    t.index ["screenshootable_id"], name: "index_screenshots_on_screenshootable_id", using: :btree
    t.index ["user_id"], name: "index_screenshots_on_user_id", using: :btree
  end

  create_table "taggings", force: :cascade do |t|
    t.integer  "tag_id"
    t.integer  "taggable_id"
    t.string   "taggable_type"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.index ["tag_id"], name: "index_taggings_on_tag_id", using: :btree
    t.index ["taggable_id"], name: "index_taggings_on_taggable_id", using: :btree
  end

  create_table "tags", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.string   "organization"
    t.string   "github_username"
    t.string   "name"
    t.index ["email"], name: "index_users_on_email", unique: true, using: :btree
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
  end

  create_table "workflow_modules", force: :cascade do |t|
    t.integer "zoon_module_id"
    t.integer "workflow_id"
    t.integer "position",       null: false
    t.index ["workflow_id"], name: "index_workflow_modules_on_workflow_id", using: :btree
    t.index ["zoon_module_id"], name: "index_workflow_modules_on_zoon_module_id", using: :btree
  end

  create_table "workflows", force: :cascade do |t|
    t.string   "title"
    t.text     "description"
    t.datetime "created_at",                              null: false
    t.datetime "updated_at",                              null: false
    t.integer  "occurrence_composition_type", default: 0
    t.integer  "covariate_composition_type",  default: 0
    t.integer  "process_composition_type",    default: 0
    t.integer  "model_composition_type",      default: 0
    t.integer  "output_composition_type",     default: 0
    t.integer  "user_id"
    t.index ["user_id"], name: "index_workflows_on_user_id", using: :btree
  end

  create_table "zoon_modules", force: :cascade do |t|
    t.string   "title"
    t.text     "description"
    t.string   "name",                                    null: false
    t.string   "version"
    t.date     "date_submitted"
    t.string   "family"
    t.datetime "latest_import",  default: -> { "now()" }, null: false
    t.datetime "created_at",                              null: false
    t.datetime "updated_at",                              null: false
    t.json     "authors",        default: [],             null: false
    t.json     "parameters",     default: [],             null: false
    t.string   "location"
    t.text     "references"
    t.text     "return_value"
    t.boolean  "visible",        default: true,           null: false
    t.text     "details",        default: ""
  end

  add_foreign_key "feedbacks", "users"
  add_foreign_key "screenshots", "users"
  add_foreign_key "workflow_modules", "workflows"
  add_foreign_key "workflow_modules", "zoon_modules"
  add_foreign_key "workflows", "users"
end
