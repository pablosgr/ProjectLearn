<?php

namespace App\Entity;

use App\Repository\TestResultRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TestResultRepository::class)]
class TestResult
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'testResults')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $student = null;

    #[ORM\ManyToOne(inversedBy: 'testResults')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Classroom $classroom = null;

    #[ORM\ManyToOne(inversedBy: 'testResults')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Test $test = null;

    #[ORM\Column]
    private ?int $score = null;

    #[ORM\Column]
    private ?int $total_questions = null;

    #[ORM\Column]
    private ?int $correct_answers = null;

    #[ORM\Column(length: 80)]
    private ?string $status = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $started_at = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $ended_at = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStudent(): ?User
    {
        return $this->student;
    }

    public function setStudent(?User $student): static
    {
        $this->student = $student;

        return $this;
    }

    public function getClassroom(): ?Classroom
    {
        return $this->classroom;
    }

    public function setClassroom(?Classroom $classroom): static
    {
        $this->classroom = $classroom;

        return $this;
    }

    public function getTest(): ?Test
    {
        return $this->test;
    }

    public function setTest(?Test $test): static
    {
        $this->test = $test;

        return $this;
    }

    public function getScore(): ?int
    {
        return $this->score;
    }

    public function setScore(int $score): static
    {
        $this->score = $score;

        return $this;
    }

    public function getTotalQuestions(): ?int
    {
        return $this->total_questions;
    }

    public function setTotalQuestions(int $total_questions): static
    {
        $this->total_questions = $total_questions;

        return $this;
    }

    public function getCorrectAnswers(): ?int
    {
        return $this->correct_answers;
    }

    public function setCorrectAnswers(int $correct_answers): static
    {
        $this->correct_answers = $correct_answers;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getStartedAt(): ?\DateTimeImmutable
    {
        return $this->started_at;
    }

    public function setStartedAt(\DateTimeImmutable $started_at): static
    {
        $this->started_at = $started_at;

        return $this;
    }

    public function getEndedAt(): ?\DateTimeImmutable
    {
        return $this->ended_at;
    }

    public function setEndedAt(\DateTimeImmutable $ended_at): static
    {
        $this->ended_at = $ended_at;

        return $this;
    }
}
