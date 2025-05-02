<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250502080912 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE classroom DROP FOREIGN KEY FK_497D309D2EBB220A
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_497D309D2EBB220A ON classroom
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE classroom CHANGE teacher_id_id teacher_id CHAR(36) NOT NULL COMMENT '(DC2Type:guid)'
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE classroom ADD CONSTRAINT FK_497D309D41807E1D FOREIGN KEY (teacher_id) REFERENCES `user` (id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_497D309D41807E1D ON classroom (teacher_id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE classroom DROP FOREIGN KEY FK_497D309D41807E1D
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_497D309D41807E1D ON classroom
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE classroom CHANGE teacher_id teacher_id_id CHAR(36) NOT NULL COMMENT '(DC2Type:guid)'
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE classroom ADD CONSTRAINT FK_497D309D2EBB220A FOREIGN KEY (teacher_id_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_497D309D2EBB220A ON classroom (teacher_id_id)
        SQL);
    }
}
