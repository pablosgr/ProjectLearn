<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250505163244 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE test (id INT AUTO_INCREMENT NOT NULL, author_id CHAR(36) NOT NULL COMMENT '(DC2Type:guid)', category_id INT NOT NULL, name VARCHAR(255) NOT NULL, created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', INDEX IDX_D87F7E0CF675F31B (author_id), INDEX IDX_D87F7E0C12469DE2 (category_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE test ADD CONSTRAINT FK_D87F7E0CF675F31B FOREIGN KEY (author_id) REFERENCES `user` (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE test ADD CONSTRAINT FK_D87F7E0C12469DE2 FOREIGN KEY (category_id) REFERENCES category (id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE test DROP FOREIGN KEY FK_D87F7E0CF675F31B
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE test DROP FOREIGN KEY FK_D87F7E0C12469DE2
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE test
        SQL);
    }
}
