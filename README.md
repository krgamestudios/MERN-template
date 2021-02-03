# MERN-template

A website template using the MERN stack.

# Legalities

Please be aware that this template uses cookies. Yes, I know, it's annoying to show that message to the end user, but it's the law, at least in some places.

# Setup Development

To set up this template, please ensure mariadb is running on the host computer, and run `npm install` as normal.

1. Run `sql/create_database.sql`
2. Run `cp .envdev .env` and enter your details into the new file
3. Execute `npm run dev`

This should get the template working in development mode.

# Deployment

When deploying your project, please ensure that you're using HTTPS protocol. It's not hard to set up using certbot.

# Microservices

There are external components to this template referred to as "microservices". These can be omitted entirely by simply removing the React component that accesses them.

* News Server: https://github.com/krgamestudios/news-server

TODO: more info.

# TODO list

- ~~Account system~~
	- ~~sign up~~
	- ~~validate email~~
	- ~~login (with cookies)~~
	- ~~logout (with cookies)~~
	- ~~account deletion~~
	- ~~annoying "This site uses cookies" message~~
- Administration Panel
	- ~~Exclusive to admin accounts~~
	- inspect aggregate user data
- ~~News blog system (microservice)~~
	- ~~build the microservice to provide the news feed~~
	- ~~access an external news feed~~
	- ~~admin panel for publishing and editing news~~
	- ~~"created at" and "updated at" in the response~~
- Chat system (microservice)
	- Based on usernames
	- Chat logs
	- Direct Messages & rooms
	- admin panel banning/unbanning (currently borked)
- Privacy policy & data collection notice

# Email settings

Some of the external requirements can be tricky, so let me outline what is needed. If you decide to use gmail as your email provider, then use the following `.env` settings:

	MAIL_SMTP=smtp.gmail.com
	MAIL_USERNAME=you@gmail.com
	MAIL_PASSWORD=yourpassword

you'll also need to enable "less secure apps" for the specified email address. Remember - don't ever commit the `.env` file! You might even want to create a dedicated email address just for your project.

