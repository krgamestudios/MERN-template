# WARNING

It's not ready yet.

There are legal requirements that will cover both KR Game Studios and the developers who use this - I need to address these, still.

Also, there's a lot of features still missing (see [TODO list](#TODO-list)), and I'm working as hard as I can on this.

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

# Setup Deployment

Eventually, a clean install will be this easy:

```
git clone https://github.com/krgamestudios/MERN-template.git
npm run configure
docker-compose up --build
```

# Microservices

There are external components to this template referred to as "microservices". These can be omitted entirely by simply removing the React component that accesses them.

* News Server: https://github.com/krgamestudios/news-server
* Chat Server: Coming soon...

# TODO list

- Legal Requirements:
	- ~~Physical Mailing Address Config (for emails)~~
	- ~~Opt-out option (for emails)~~
	- Information about legal requirements of the developers using this template
	- Privacy policy & data collection notices
	- LICENSE file
	- ~~annoying "This site uses cookies" message~~
- ~~Account system~~
	- ~~sign up~~
	- ~~validate email~~
	- ~~login (with cookies)~~
	- ~~logout (with cookies)~~
	- ~~account deletion~~
- Administration Panel
	- ~~Default admin account~~
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
- Configuraton Script:
	- Default UUID keys
	- ~~Docker, docker, docker.~~
- Better compression for client files
- Full tutorial for setting up and using the site
	- Start here page
	- Security holes
		- HTTPS
		- Default admin account

# Email settings

Some of the external requirements can be tricky, so let me outline what is needed. If you decide to use gmail as your email provider, then use the following `.env` settings:

	MAIL_SMTP=smtp.gmail.com
	MAIL_USERNAME=you@gmail.com
	MAIL_PASSWORD=yourpassword

you'll also need to enable "less secure apps" for the specified email address. Remember - don't ever commit the `.env` file! You might even want to create a dedicated email address just for your project.

