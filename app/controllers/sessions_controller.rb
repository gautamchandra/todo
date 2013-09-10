class SessionsController < ApplicationController
	def create
	    user = User.find_by(email: params[:session][:email].downcase)
	    if user && user.authenticate(params[:session][:password])
	      # Sign the user in and redirect to the user's show page.
	      sign_in user
	      redirect_to controller:'users', action: 'planner', id: user.id, notice: 'Time to plan!'
	    else
	      flash.now[:error] = 'Invalid email/password combination'
	      render 'new'
	    end
    	
  	end

	def destroy
		sign_out
		redirect_to root_url
	end


end
