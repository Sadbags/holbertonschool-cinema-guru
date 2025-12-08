import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { Title } from './Title.js';
import User from './User.js';

const UserActivity = sequelize.define('UserActivity', {
    activityType: {
        type: DataTypes.ENUM(["favorite", "watchLater", "removeFavorited", "removeWatchLater"])
    }
});

// Relaciones
UserActivity.belongsTo(User, { as: "user", foreignKey: "userId" });
UserActivity.belongsTo(Title, { as: "title", foreignKey: "TitleId" });

export default UserActivity;
