<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250507165636 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE student_class (classroom_id INT NOT NULL, student_id CHAR(36) NOT NULL COMMENT '(DC2Type:guid)', INDEX IDX_657C60026278D5A8 (classroom_id), INDEX IDX_657C6002CB944F1A (student_id), PRIMARY KEY(classroom_id, student_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE test_assignment (classroom_id INT NOT NULL, test_id INT NOT NULL, unit_id INT DEFAULT NULL, assigned_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', due_date DATETIME DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)', time_limit INT DEFAULT NULL, visibility TINYINT(1) NOT NULL, is_mandatory TINYINT(1) NOT NULL, INDEX IDX_4BF6F2836278D5A8 (classroom_id), INDEX IDX_4BF6F2831E5D0459 (test_id), INDEX IDX_4BF6F283F8BD700D (unit_id), PRIMARY KEY(classroom_id, test_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE test_result (id INT AUTO_INCREMENT NOT NULL, student_id CHAR(36) NOT NULL COMMENT '(DC2Type:guid)', classroom_id INT NOT NULL, test_id INT NOT NULL, score INT NOT NULL, total_questions INT NOT NULL, correct_answers INT NOT NULL, status VARCHAR(80) NOT NULL, started_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', ended_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', INDEX IDX_84B3C63DCB944F1A (student_id), INDEX IDX_84B3C63D6278D5A8 (classroom_id), INDEX IDX_84B3C63D1E5D0459 (test_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE test_tag (tag_id INT NOT NULL, test_id INT NOT NULL, INDEX IDX_7AF46B44BAD26311 (tag_id), INDEX IDX_7AF46B441E5D0459 (test_id), PRIMARY KEY(tag_id, test_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE student_class ADD CONSTRAINT FK_657C60026278D5A8 FOREIGN KEY (classroom_id) REFERENCES classroom (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE student_class ADD CONSTRAINT FK_657C6002CB944F1A FOREIGN KEY (student_id) REFERENCES `user` (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE test_assignment ADD CONSTRAINT FK_4BF6F2836278D5A8 FOREIGN KEY (classroom_id) REFERENCES classroom (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE test_assignment ADD CONSTRAINT FK_4BF6F2831E5D0459 FOREIGN KEY (test_id) REFERENCES test (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE test_assignment ADD CONSTRAINT FK_4BF6F283F8BD700D FOREIGN KEY (unit_id) REFERENCES unit (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE test_result ADD CONSTRAINT FK_84B3C63DCB944F1A FOREIGN KEY (student_id) REFERENCES `user` (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE test_result ADD CONSTRAINT FK_84B3C63D6278D5A8 FOREIGN KEY (classroom_id) REFERENCES classroom (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE test_result ADD CONSTRAINT FK_84B3C63D1E5D0459 FOREIGN KEY (test_id) REFERENCES test (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE test_tag ADD CONSTRAINT FK_7AF46B44BAD26311 FOREIGN KEY (tag_id) REFERENCES tag (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE test_tag ADD CONSTRAINT FK_7AF46B441E5D0459 FOREIGN KEY (test_id) REFERENCES test (id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE student_class DROP FOREIGN KEY FK_657C60026278D5A8
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE student_class DROP FOREIGN KEY FK_657C6002CB944F1A
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE test_assignment DROP FOREIGN KEY FK_4BF6F2836278D5A8
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE test_assignment DROP FOREIGN KEY FK_4BF6F2831E5D0459
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE test_assignment DROP FOREIGN KEY FK_4BF6F283F8BD700D
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE test_result DROP FOREIGN KEY FK_84B3C63DCB944F1A
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE test_result DROP FOREIGN KEY FK_84B3C63D6278D5A8
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE test_result DROP FOREIGN KEY FK_84B3C63D1E5D0459
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE test_tag DROP FOREIGN KEY FK_7AF46B44BAD26311
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE test_tag DROP FOREIGN KEY FK_7AF46B441E5D0459
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE student_class
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE test_assignment
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE test_result
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE test_tag
        SQL);
    }
}
