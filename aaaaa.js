ItemTag = sequelize.define('item_tag', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tag_id: {
    type: DataTypes.INTEGER,
    unique: 'item_tag_taggable',
  },
  taggable: {
    type: DataTypes.STRING,
    unique: 'item_tag_taggable',
  },
  taggable_id: {
    type: DataTypes.INTEGER,
    unique: 'item_tag_taggable',
    references: null,
  },
});
Tag = sequelize.define('tag', {
  name: DataTypes.STRING,
});

Post.belongsToMany(Tag, {
  through: {
    model: ItemTag,
    unique: false,
    scope: {
      taggable: 'post',
    },
  },
  foreignKey: 'taggable_id',
  constraints: false,
});
Tag.belongsToMany(Post, {
  through: {
    model: ItemTag,
    unique: false,
  },
  foreignKey: 'tag_id',
  constraints: false,
});
