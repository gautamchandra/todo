class ChangeDefaultToStatusTask < ActiveRecord::Migration
	def self.up
		change_column :tasks, :status, :boolean, :default => false
	end

	def self.down
		change_column :tasks, :status, :boolean, :default => true 
	end
end
