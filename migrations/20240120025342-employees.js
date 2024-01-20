"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const tableName = "employees";
exports.default = {
  up: (queryInterface) => {
    return queryInterface.createTable(
      tableName,
      {
        id: {
          type: sequelize_1.DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
        },
        employee_id: {
          type: sequelize_1.DataTypes.TEXT,
          allowNull: false,
        },
        first_name: {
          type: sequelize_1.DataTypes.TEXT,
          allowNull: false,
        },
        last_name: {
          type: sequelize_1.DataTypes.TEXT,
          allowNull: false,
        },
        email: {
          type: sequelize_1.DataTypes.TEXT,
          allowNull: false,
        },
        dob: {
          type: sequelize_1.DataTypes.TEXT,
          allowNull: false,
        },
        department: {
          type: sequelize_1.DataTypes.TEXT,
          allowNull: false,
        },
        position: {
          type: sequelize_1.DataTypes.TEXT,
          allowNull: false,
        },

        created_at: {
          type: sequelize_1.DataTypes.DATE,
          allowNull: false,
          defaultValue: sequelize_1.DataTypes.NOW,
        },
      },
      {
        engine: "MYISAM",
        charset: "latin1", // default: null
      }
    );
  },
  down: (queryInterface) => {
    return queryInterface.dropTable(tableName);
  },
};
