class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def self.generate_search_scope table_name, text_fields
    text_filters = text_fields.map {|f| "#{table_name}.#{f} ILIKE ?"}

    -> (words, tags) {
      if words.empty? and tags.empty?
        all
      else
        q = words.split(/\s+/).reduce(left_outer_joins(:tags)) do |all, word|
          all.where(
            (
              text_fields.map {|f| "#{table_name}.#{f} ILIKE ?"} +
              ["LOWER(tags.name) = ?"]
            ).join(' OR '),
            *((["%#{word}%"] * text_filters.length) + [word.downcase])
          )
        end

        if not tags.empty?
          q = q.where(
            "LOWER(tags.name) IN (?)",
            tags.map(&:downcase),
          )
        end

        q
      end.
        select("distinct on (#{table_name}.#{text_fields[0]}) #{table_name}.*")
    }
  end
end
