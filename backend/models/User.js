import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { hashPassword } from '../utils/password.js';

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// Hook para hashear la contraseña antes de guardar
User.beforeCreate(async (user, _) => {
    user.password = await hashPassword(user.password);
});

export default User;
