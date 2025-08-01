import { Optional } from "sequelize";
import {
  Column,
  CreatedAt,
  DataType,
  Table,
  Model,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import Role from "./role.model";

interface IUser {
  id?: number;
  email: string;
  roleId: number;
  password: string;
  fullName?: string;
  avatar?: string;
  isEmailVerified?: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  role?: {
    id: number;
    title: string;
  };
}

@Table({
  underscored: true,
  timestamps: true,
})
class User extends Model<IUser, Optional<IUser, "id">> {
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
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  fullName?: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  avatar?: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isEmailVerified!: boolean;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  resetPasswordToken?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  resetPasswordExpires?: Date;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  roleId!: number;

  @BelongsTo(() => Role)
  role!: Role;
}

export default User;
