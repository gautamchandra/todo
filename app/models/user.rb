class User < ActiveRecord::Base
	before_save { self.email = email.downcase }
	has_many :lists, dependent: :destroy

	#email validation
	validates :name, presence: true, length: { maximum: 50 }
	VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i	
	validates :email, presence:   true,
                    format:     { with: VALID_EMAIL_REGEX },
                    uniqueness: { case_sensitive: false }

end
