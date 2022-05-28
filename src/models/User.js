const fs = require("fs");
const path = require("path");
let User = {
	filepath: path.resolve(__dirname, "../data/users.json"),

	getData: function () {
		return JSON.parse(fs.readFileSync(this.filepath, "utf-8"));
	},
	generateId: function (users) {
		if (!users) users = this.findAll();
		let id = 1;
		if (users.length > 0) id = users[users.length - 1].id + 1; //users.at(-1).id soportado a patir de Node.js 16.6.0
		return id;
	},

	findAll: function () {
		return this.getData();
	},
	findById: function (id, users = undefined) {
		if (!users) users = this.findAll();
		let userFound = users.find((user) => user.id == id);
		return userFound;
	},
	findByField: function (field, value, users = undefined) {
		if (!users) users = this.findAll();
		let userFound = users.find((user) => user[field] === value);
		return userFound;
	},
	findIndexByID: function (id, users = undefined) {
		if (!users) users = this.findAll();
		let userIndex = users.findIndex((user) => user.id == id);
		return userIndex;
	},

	create: function (userData, filename) {
		let users = this.findAll();
		let id = this.generateId(users);
		let user = this.fillUserData(id, userData, filename);
		users.push(user);
		fs.writeFileSync(this.filepath, JSON.stringify(users), null, " ");
		return id;
	},
	edit: function (id, userData, filename) {
		let users = this.findAll();
		let index = users.findIndex((user) => user.id == id);
		let userTobeEdited = users[index];
		let editedUser = this.fillUserData(id, userData, userTobeEdited, filename);
		users[index] = editedUser;
		fs.writeFileSync(this.filepath, JSON.stringify(users));
		return userTobeEdited.id;
	},
	delete: function (id) {
		let users = this.findAll();
		let index = this.findIndexByID(id, users);
		users.splice(index, 1);
		fs.writeFileSync(this.filepath, JSON.stringify(users, null, " "));
	},
	fillUserData: function (id, userData, currentData = undefined, filename) {
		let user = {
			id: id,
			name: userData.name ? userData.name : currentData.name,
			lastName: userData.lastName ? userData.lastName : currentData.lastName,
			email: userData.email ? userData.email : currentData.email,
			password: this.encryptPassword(userData, currentData),
			category: "user",
		};
		if (currentData && currentData.image && !filename)
			user.image = currentData.image;
		else if (filename) user.image = `/users/${filename}`;
		else user.image = "default-user-image.png";

		return user;
	},

	encryptPassword: function (userData, currentData) {
		if (currentData && userData.changePassword) {
			if (
				userData.currentPassword &&
				userData.newPassword &&
				userData.newPassword2
			) {
				//Aca hay que comparar las claves entre si, usando las funciones de bcrypt (SPRINT 5)
				//currentData, son los datos que estan en el JSON 
				//userData son los datos que vienen del formulario de edicion de usuario
				//Hay que comparar:
				// 1. userData.newPassword y userData.newPassword2 que sean iguales (if simple)
				// 2. userData.currentPassword y currentData.password sean iguales (aca hay que usar bcryptjs.compareSync)
				// Si esto fue exitoso, hay que encriptar el valor userData.newPassword y devolverlo
				// Si alguna de las 2 comparaciones dio error hay que devolver un array errores con el formato de express-validator.
				return userData.newPassword; // Devolver encriptado
			}
		} else if (currentData && !userData.changePassword)
			return currentData.password;
		else {
			//Aca se devolveria la constraseña encriptada por bcrypt (SPRINT 5)
			return userData.password;
		}
	},
};

module.exports = User;
