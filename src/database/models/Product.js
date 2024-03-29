module.exports = (sequelize, dataTypes) => {
	let alias = "Product";
	let cols = {
		id: {
			type: dataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: dataTypes.STRING(100),
			allowNull: false,
		},
		description: {
			type: dataTypes.STRING,
			allowNull: false,
		},
		longDescription: {
			type: dataTypes.TEXT,
			allowNull: true,
		},
		price: {
			type: dataTypes.DECIMAL(10, 2),
			allowNull: false,
		},
		categoryId: {
			type: dataTypes.INTEGER,
			allowNull: false,
		},
		capacity: {
			type: dataTypes.INTEGER,
			allowNull: true,
		},
		discount: {
			type: dataTypes.INTEGER,
			allowNull: true,
		},
		image: {
			type: dataTypes.STRING,
			allowNull: true,
		},
	};
	let config = {
		timestamps: true,
		tableName: "products",
	};
	const Product = sequelize.define(alias, cols, config);
	Product.associate = function (models) {
		Product.belongsTo(models.Category, {
			as: "category",
			foreignKey: "categoryId",
		});
		Product.belongsToMany(models.Amenity, {
			as: "amenities",
			through: "productsAmenities",
			foreignKey: "productId",
			otherKey: "amenityId",
		});
		Product.belongsToMany(models.Service, {
			as: "services",
			through: "productsServices",
			foreignKey: "productId",
			otherKey: "serviceId",
		});
	};
	return Product;
};
