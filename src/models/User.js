const fs = require("fs");
const path = require("path");
let User = {
	fileName: path.resolve(__dirname, "../data/users.json"),

	getData: function () {
		return JSON.parse(fs.readFileSync(this.filenName, "utf-8"));
	},
	generateId: function (users) {
		if (!users) users = this.findAll();
		let id = 1;
		if (users.length > 0) id = users.at(-1).id + 1;
		return id;
	},

	findAll: function () {
		return this.getData();
	},
	findById: function (id, users = undefined) {
		if (!users) users = this.findAll();
		let userFound = users.find((user) => user.id === id);
		return userFound;
	},
	findByField: function (field, value, users = undefined) {
		if (!users) users = this.findAll();
		let userFound = users.find((user) => user[field] === value);
		return userFound;
	},

	create: function (userData) {
		let users = this.findAll();
		let id = this.generateID(users);
		let user = fillUserData(id, userData);
		users.push(user);
		fs.writeFileSync(this.filepath, JSON.stringify(users), null, " ");
	},
	edit: function (id, userData) {
		let editedUser = fillUserData(id, userData);
		let users = this.findAll();
		// let index = users.findIndex((user) => user.id == id);
		let userTobeEdited = this.findById(id, users);
		userTobeEdited = editedUser;
		fs.writeFileSync(usersFilePath, JSON.stringify(users));
	},
	delete: function (id) {
		let allUsers = this.findAll();
		let finalUsers = allUsers.filter((oneUser) => oneUser.id !== id);
		fs.writeFileSync(this.fileName, JSON.stringify(finalUsers, null, " "));
		return true;
	},
	fillUserData: function (id, userData, filename) {
		let user = {
			id: id,
			name: userData.name,
			lastName: userData.lastName,
			email: userData.email,
			password: userData.password,
			category: "user",
			image: filename ? `/users/${filename}` : "default-image.png",
		};
		return user;
	},
};

module.exports = User;
