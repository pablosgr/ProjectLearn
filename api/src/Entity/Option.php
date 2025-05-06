<?php

namespace App\Entity;

use App\Repository\OptionRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: OptionRepository::class)]
#[ORM\Table(name: '`option`')]
class Option
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'options')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Question $question = null;

    #[ORM\Column(length: 255)]
    private ?string $option_text = null;

    #[ORM\Column]
    private ?bool $is_correct = null;

    #[ORM\Column]
    private ?int $index_order = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getQuestion(): ?Question
    {
        return $this->question;
    }

    public function setQuestion(?Question $question): static
    {
        $this->question = $question;

        return $this;
    }

    public function getOptionText(): ?string
    {
        return $this->option_text;
    }

    public function setOptionText(string $option_text): static
    {
        $this->option_text = $option_text;

        return $this;
    }

    public function isCorrect(): ?bool
    {
        return $this->is_correct;
    }

    public function setIsCorrect(bool $is_correct): static
    {
        $this->is_correct = $is_correct;

        return $this;
    }

    public function getIndexOrder(): ?int
    {
        return $this->index_order;
    }

    public function setIndexOrder(int $index_order): static
    {
        $this->index_order = $index_order;

        return $this;
    }
}
