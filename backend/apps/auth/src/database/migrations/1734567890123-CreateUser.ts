import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreateUser1734567890123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum types for PostgreSQL
    await queryRunner.query(`
      CREATE TYPE "auth_provider_enum" AS ENUM ('google', 'local');
    `);

    await queryRunner.query(`
      CREATE TYPE "user_role_enum" AS ENUM ('superadmin', 'admin', 'owner', 'guest', 'staff', 'trainer', 'member', 'other');
    `);

    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'firstName',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'lastName',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'dateOfBirth',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'location',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'gymId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'gymLocationId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'address',
            type: 'varchar',
            length: '500',
            isNullable: false,
          },
          {
            name: 'provider',
            type: 'auth_provider_enum',
            default: "'local'",
            isNullable: false,
          },
          {
            name: 'password',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'role',
            type: 'user_role_enum',
            default: "'member'",
            isNullable: false,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
            isNullable: false,
          },
          {
            name: 'isSubscribed',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'isDeleted',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'socialMedia',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
        // foreignKeys: [
        //   {
        //     name: 'FK_USER_GYM_ID',
        //     columnNames: ['gymId'],
        //     referencedTableName: 'gym',
        //     referencedColumnNames: ['id'],
        //     onDelete: 'CASCADE',
        //   },
        //   {
        //     name: 'FK_USER_GYM_LOCATION_ID',
        //     columnNames: ['gymLocationId'],
        //     referencedTableName: 'gym_location',
        //     referencedColumnNames: ['id'],
        //     onDelete: 'CASCADE',
        //   },
        // ],
      }),
      true,
    );

    // Create indexes for better query performance
    await queryRunner.createIndex(
      'user',
      new TableIndex({
        name: 'IDX_USER_EMAIL',
        columnNames: ['email'],
      }),
    );

    await queryRunner.createIndex(
      'user',
      new TableIndex({
        name: 'IDX_USER_GYM_ID',
        columnNames: ['gymId'],
      }),
    );

    await queryRunner.createIndex(
      'user',
      new TableIndex({
        name: 'IDX_USER_GYM_LOCATION_ID',
        columnNames: ['gymLocationId'],
      }),
    );

    await queryRunner.createIndex(
      'user',
      new TableIndex({
        name: 'IDX_USER_IS_ACTIVE',
        columnNames: ['isActive'],
      }),
    );

    await queryRunner.createIndex(
      'user',
      new TableIndex({
        name: 'IDX_USER_IS_DELETED',
        columnNames: ['isDeleted'],
      }),
    );

    await queryRunner.createIndex(
      'user',
      new TableIndex({
        name: 'IDX_USER_ROLE',
        columnNames: ['role'],
      }),
    );

    await queryRunner.createIndex(
      'user',
      new TableIndex({
        name: 'IDX_USER_PROVIDER',
        columnNames: ['provider'],
      }),
    );

    await queryRunner.createIndex(
      'user',
      new TableIndex({
        name: 'IDX_USER_IS_SUBSCRIBED',
        columnNames: ['isSubscribed'],
      }),
    );

    // Composite indexes for common query patterns
    await queryRunner.createIndex(
      'user',
      new TableIndex({
        name: 'IDX_USER_GYM_LOCATION',
        columnNames: ['gymId', 'gymLocationId'],
      }),
    );

    await queryRunner.createIndex(
      'user',
      new TableIndex({
        name: 'IDX_USER_ACTIVE_NOT_DELETED',
        columnNames: ['isActive', 'isDeleted'],
      }),
    );

    await queryRunner.createIndex(
      'user',
      new TableIndex({
        name: 'IDX_USER_GYM_ACTIVE',
        columnNames: ['gymId', 'isActive', 'isDeleted'],
      }),
    );

    // Create trigger function to automatically update updatedAt timestamp
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW."updatedAt" = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Create trigger on user table
    await queryRunner.query(`
      CREATE TRIGGER update_user_updated_at
      BEFORE UPDATE ON "user"
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes first
    await queryRunner.dropIndex('user', 'IDX_USER_GYM_ACTIVE');
    await queryRunner.dropIndex('user', 'IDX_USER_ACTIVE_NOT_DELETED');
    await queryRunner.dropIndex('user', 'IDX_USER_GYM_LOCATION');
    await queryRunner.dropIndex('user', 'IDX_USER_IS_SUBSCRIBED');
    await queryRunner.dropIndex('user', 'IDX_USER_PROVIDER');
    await queryRunner.dropIndex('user', 'IDX_USER_ROLE');
    await queryRunner.dropIndex('user', 'IDX_USER_IS_DELETED');
    await queryRunner.dropIndex('user', 'IDX_USER_IS_ACTIVE');
    await queryRunner.dropIndex('user', 'IDX_USER_GYM_LOCATION_ID');
    await queryRunner.dropIndex('user', 'IDX_USER_GYM_ID');
    await queryRunner.dropIndex('user', 'IDX_USER_EMAIL');

    // Drop trigger and function
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS update_user_updated_at ON "user"`,
    );
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS update_updated_at_column()`,
    );

    // Drop foreign keys
    // const table = await queryRunner.getTable('user');
    // if (table) {
    //   const foreignKeyGymId = table.foreignKeys.find(
    //     (fk) => fk.name === 'FK_USER_GYM_ID',
    //   );
    //   const foreignKeyGymLocationId = table.foreignKeys.find(
    //     (fk) => fk.name === 'FK_USER_GYM_LOCATION_ID',
    //   );

    //   if (foreignKeyGymId) {
    //     await queryRunner.dropForeignKey('user', foreignKeyGymId);
    //   }
    //   if (foreignKeyGymLocationId) {
    //     await queryRunner.dropForeignKey('user', foreignKeyGymLocationId);
    //   }
    // }

    // Drop table
    await queryRunner.dropTable('user');

    // Drop enum types
    await queryRunner.query(`DROP TYPE IF EXISTS "user_role_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "auth_provider_enum"`);
  }
}
