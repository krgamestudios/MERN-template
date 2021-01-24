# MERN-template
A website template using the MERN stack.

# Setup Development

To set up this template, please ensure mariadb is running on the host computer, and run `npm install` as normal.

1. Run `sql/create_database.sql`
2. Run `cp .envdev .env` and enter your details into the new file
3. Execute `npm run dev`

This should get the template working in development mode.

# TODO list

- Account system
	- ~~sign up~~
	- verify email
	- login (with cookies)
	- logout
	- account deletion and management
- Administration Panel
	- Exclusive to admin accounts
	- ban/unban accounts
	- inspect user data
- News blog system
	- access an external news feed
	- build the microservice to provide the news feed

# Email settings

Some of the external requirements can be tricky, so let me outline what is needed. If you decide to use gmail as your email provider, then use the following `.env` settings:

	MAIL_SMTP=smtp.gmail.com
	MAIL_USERNAME=you@gmail.com
	MAIL_PASSWORD=yourpassword

you'll also need to enable "less secure apps" for the specified email address. Remember - don't ever commit the `.env` file! You might even want to create a dedicated email address just for your project.

