class ListsController < ApplicationController
  before_action :set_list, only: [:show, :edit, :update, :destroy]
  before_action :signed_in_user, only: [:show, :edit, :update, :destroy, :planner, :index]
  before_action :list_owner, only: [:show, :edit, :update, :destroy]
  before_action :admin_user, only: [:index]

  # GET /lists
  # GET /lists.json
  def index
    @lists = List.all
  end

  # GET /lists/1
  # GET /lists/1.json
  def show
  end

  # GET /lists/new
  def new
    @list = List.new
  end

  # GET /lists/1/edit
  def edit
  end

  # POST /lists
  # POST /lists.json
  def create
    @list = List.new(list_params)
    @list.user_id = current_user.id
    respond_to do |format|
      if @list.save
        @new_task = @list.tasks.new();
        format.html { redirect_to @list, notice: 'List was successfully created.' }
        format.json { render action: 'show', status: :created, location: @list }
        format.js
      else
        format.html { render action: 'new' }
        format.json { render json: @list.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /lists/1
  # PATCH/PUT /lists/1.json
  def update
    respond_to do |format|
      if @list.update(list_params)
        format.html { redirect_to @list, notice: 'List was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @list.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /lists/1
  # DELETE /lists/1.json
  def destroy
    @list.destroy
    respond_to do |format|
      format.html { redirect_to lists_url }
      format.json { head :no_content }
    end
  end


  # def tasks
  #   @list = List.find(params[:id])
  #   @tasks = @list.tasks
  #   @new_task = @list.tasks.new();
  # end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_list
      @list = List.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def list_params
      params.require(:list).permit(:name)
    end

    def signed_in_user
      redirect_to signin_url, notice: "Please sign in." unless signed_in?
    end

    def list_owner
      redirect_to(root_url) unless current_user?(@list.user)
    end

    def admin_user
      redirect_to(root_url) unless current_user.admin?
    end



end
