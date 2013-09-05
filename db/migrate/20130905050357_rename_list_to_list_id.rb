class RenameListToListId < ActiveRecord::Migration
  def self.up
    rename_column :tasks, :list, :list_id
  end

  def self.down
    # rename back if you need or do something else or do nothing
  end
end
