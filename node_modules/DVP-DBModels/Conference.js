module.exports = function(sequelize, DataTypes) {
    var Conference = sequelize.define('CSDB_Conference', {
            ConferenceName: {type:DataTypes.STRING, primaryKey:true},
            Description: DataTypes.STRING,
            CompanyId: DataTypes.INTEGER,
            TenantId: DataTypes.INTEGER,
            ObjClass: DataTypes.STRING,
            ObjType: DataTypes.STRING,
            ObjCategory: DataTypes.STRING,
            Pin:DataTypes.STRING,
            AllowAnonymousUser:DataTypes.BOOLEAN,
            StartTime:DataTypes.STRING,//2015-06-10 02:30
            EndTime:DataTypes.STRING,//2015-06-10 03:30
            Domain:DataTypes.STRING,
            IsLocked:DataTypes.BOOLEAN,
            MaxUser:DataTypes.INTEGER

        }
    );


    return Conference;
};