class AddPinnedToLists < ActiveRecord::Migration
  def change
  	add_column :lists, :pinned, :boolean, :default => true
  end
end
