class Task < ActiveRecord::Base
	belongs_to :list
	validates :name, presence: true, length: { maximum: 140 }
end

