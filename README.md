# MERN-template

A website template using the MERN stack. The primary technology involved is:

* React
* Nodejs
* MariaDB (with Sequelize)
* Docker

This template is designed to support the development of persistent browser based games (PBBGs), but it, and it's component microservices, can be used elsewhere.

This template is released under the zlib license (see LICENSE).

# Microservices

There are external components to this template referred to as "microservices". These can be omitted entirely by simply removing the React components that access them. These are also available via [docker hub](https://hub.docker.com/u/krgamestudios).

* Auth Server: https://github.com/krgamestudios/auth-server
* News Server: https://github.com/krgamestudios/news-server
* Chat Server: https://github.com/krgamestudios/chat-server

# Setup Deployment

A clean install is this easy:

```
git clone https://github.com/krgamestudios/MERN-template.git
node configure-script.js
docker-compose up --build
```

# Setup Development

To set up this template in development mode:

1. Ensure mariadb is running in your development environment
2. Run `mariadb sql/create_database.sql` as the root user
3. Run `npm install`
4. Run `cp .envdev .env` and enter your details into the `.env` file
5. Execute `npm run dev`
6. Navigate to `http://localhost:3001` in your web browser

# Features List

- Full documentation
	- Setup tutorial
- Fully Featured Account System (as a microservice)
	- Email validation
	- Logging in and out
	- Account deletion
	- Password management
	- JSON web token authentication
- Fully Featured News Blog (as a microservice)
	- Publish, edit or delete articles as needed
	- Secured via admin panel
- Fully Featured Chat System (as a microservice)
	- Available when logged in
	- Chat logs saved to the database
	- Room-based chat (type `/room name` to access a specific room)
	- Mute specific users for X minutes
- Easy To Use Configuration Script
	- Sets up everything via docker
	- A default admin account (if desired)

# Coming Soon

- Full documentation
	- Modding tutorials
- Moderation tools for banning/suspending, chat-banning and reporting users

# Coming Eventually

- Fully Featured News Blog (as a microservice)
	- Restore deleted articles
	- Undo edits
- Fully Featured Chat System
	- Custom emoji
	- Private messaging?
	- Broadcasting to all channels?
	- Badges next to usernames?
- Better compression for client files
- Backend for leaderboards (modding tutorial?)
- Backend for energy systems (modding tutorial?)
- Backend for items, shops, trading and currency

# Gmail Email Settings

If you decide to use gmail as your email provider (as I do), then use the following `.env` settings:

	MAIL_SMTP=smtp.gmail.com
	MAIL_USERNAME=you@gmail.com
	MAIL_PASSWORD=yourpassword

you'll also need to enable "less secure apps" for the specified email address. Remember - don't ever commit the `.env` file! You might even want to create a dedicated email address just for your project.

