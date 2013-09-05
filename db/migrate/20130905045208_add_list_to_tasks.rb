class AddListToTasks < ActiveRecord::Migration
  def change
    add_column :tasks, :list, :integer
  end
end
