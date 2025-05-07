<?php

namespace App\Entity;

use App\Repository\TestAssignmentRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TestAssignmentRepository::class)]
#[ORM\HasLifecycleCallbacks]
class TestAssignment
{
    #[ORM\Id]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Classroom $classroom = null;

    #[ORM\Id]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Test $test = null;

    #[ORM\ManyToOne]
    private ?Unit $unit = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $assigned_at = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $due_date = null;

    #[ORM\Column(nullable: true)]
    private ?int $time_limit = null;

    #[ORM\Column]
    private ?bool $visibility = true;

    #[ORM\Column]
    private ?bool $is_mandatory = false;

    #[ORM\PrePersist]
    public function setAssignedAtValue(): void
    {
        $this->assigned_at = new \DateTimeImmutable();
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

    public function getUnit(): ?Unit
    {
        return $this->unit;
    }

    public function setUnit(?Unit $unit): static
    {
        $this->unit = $unit;

        return $this;
    }

    public function getAssignedAt(): ?\DateTimeImmutable
    {
        return $this->assigned_at;
    }

    public function getDueDate(): ?\DateTimeImmutable
    {
        return $this->due_date;
    }

    public function setDueDate(?\DateTimeImmutable $due_date): static
    {
        $this->due_date = $due_date;

        return $this;
    }

    public function getTimeLimit(): ?int
    {
        return $this->time_limit;
    }

    public function setTimeLimit(?int $time_limit): static
    {
        $this->time_limit = $time_limit;

        return $this;
    }

    public function isVisible(): ?bool
    {
        return $this->visibility;
    }

    public function setVisibility(bool $visibility): static
    {
        $this->visibility = $visibility;

        return $this;
    }

    public function isMandatory(): ?bool
    {
        return $this->is_mandatory;
    }

    public function setIsMandatory(bool $is_mandatory): static
    {
        $this->is_mandatory = $is_mandatory;

        return $this;
    }
}
