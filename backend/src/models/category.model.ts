import { Optional } from "sequelize";
import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  HasMany,
} from "sequelize-typescript";
import { Contact } from ".";

interface ICategory {
  id?: number;
  name: string;
  slug: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

@Table({
  underscored: true,
  timestamps: true,
  paranoid: true, // Enables soft delete
})
class Category extends Model<ICategory, Optional<ICategory, "id">> {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id?: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  name!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  slug!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  image?: string;

  @CreatedAt
  createdAt?: Date;

  @UpdatedAt
  updatedAt?: Date;

  @DeletedAt
  deletedAt?: Date | null;

  @HasMany(() => Contact)
  contacts?: Contact[];
}

export default Category;
