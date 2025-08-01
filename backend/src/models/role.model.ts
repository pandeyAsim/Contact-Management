import { Optional } from "sequelize";
import {
  Column,
  CreatedAt,
  DataType,
  Table,
  Model,
  UpdatedAt,
  HasMany,
} from "sequelize-typescript";
import User from "./user.model";

interface IRole {
  id?: number;
  title: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({
  underscored: true,
  timestamps: true,
})
class Role extends Model<IRole, Optional<IRole, "id">> {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id?: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @HasMany(() => User)
  users!: User[];
}

export default Role;
