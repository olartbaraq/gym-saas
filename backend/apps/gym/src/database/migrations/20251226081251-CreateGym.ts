import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateGym20251226081251 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'Gyms',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'slug',
            type: 'varchar',
            length: '255',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'config',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true, // ifNotExists
    );

    // Create indexes for better query performance
    await queryRunner.createIndex(
      'Gyms',
      new TableIndex({
        name: 'IDX_GYMS_SLUG',
        columnNames: ['slug'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'Gyms',
      new TableIndex({
        name: 'IDX_GYMS_NAME',
        columnNames: ['name'],
      }),
    );

    await queryRunner.createIndex(
      'Gyms',
      new TableIndex({
        name: 'IDX_GYMS_CREATED_AT',
        columnNames: ['createdAt'],
      }),
    );

    await queryRunner.createIndex(
      'Gyms',
      new TableIndex({
        name: 'IDX_GYMS_DELETED_AT',
        columnNames: ['deletedAt'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes first
    await queryRunner.dropIndex('Gyms', 'IDX_GYMS_DELETED_AT');
    await queryRunner.dropIndex('Gyms', 'IDX_GYMS_CREATED_AT');
    await queryRunner.dropIndex('Gyms', 'IDX_GYMS_NAME');
    await queryRunner.dropIndex('Gyms', 'IDX_GYMS_SLUG');

    // Drop table
    await queryRunner.dropTable('Gyms');
  }
}
