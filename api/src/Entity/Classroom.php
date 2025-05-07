<?php

namespace App\Entity;

use App\Repository\ClassroomRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ClassroomRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Classroom
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'taught_classrooms')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $teacher = null;

    #[ORM\Column(length: 180)]
    private ?string $name = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $created_at = null;

    /**
     * @var Collection<int, Unit>
     */
    #[ORM\OneToMany(targetEntity: Unit::class, mappedBy: 'classroom')]
    private Collection $units;

    /**
     * @var Collection<int, TestResult>
     */
    #[ORM\OneToMany(targetEntity: TestResult::class, mappedBy: 'classroom')]
    private Collection $testResults;

    /**
     * @var Collection<int, StudentClass>
     */
    #[ORM\OneToMany(targetEntity: StudentClass::class, mappedBy: 'classroom', orphanRemoval: true)]
    private Collection $enrolledStudents;

    /**
     * @var Collection<int, TestAssignment>
     */
    #[ORM\OneToMany(targetEntity: TestAssignment::class, mappedBy: 'classroom', orphanRemoval: true)]
    private Collection $testAssignments;
    
    public function __construct()
    {
        $this->units = new ArrayCollection();
        $this->testResults = new ArrayCollection();
        $this->enrolledStudents = new ArrayCollection();
        $this->testAssignments = new ArrayCollection();
    }

    #[ORM\PrePersist]
    public function setCreatedAtValue(): void
    {
        $this->created_at = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTeacher(): ?User
    {
        return $this->teacher;
    }

    public function setTeacher(?User $teacher): static
    {
        $this->teacher = $teacher;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->created_at;
    }

    /**
     * @return Collection<int, Unit>
     */
    public function getUnits(): Collection
    {
        return $this->units;
    }

    public function addUnit(Unit $unit): static
    {
        if (!$this->units->contains($unit)) {
            $this->units->add($unit);
            $unit->setClassroom($this);
        }

        return $this;
    }

    public function removeUnit(Unit $unit): static
    {
        if ($this->units->removeElement($unit)) {
            // set the owning side to null (unless already changed)
            if ($unit->getClassroom() === $this) {
                $unit->setClassroom(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, TestResult>
     */
    public function getTestResults(): Collection
    {
        return $this->testResults;
    }

    public function addTestResult(TestResult $testResult): static
    {
        if (!$this->testResults->contains($testResult)) {
            $this->testResults->add($testResult);
            $testResult->setClassroom($this);
        }

        return $this;
    }

    public function removeTestResult(TestResult $testResult): static
    {
        if ($this->testResults->removeElement($testResult)) {
            // set the owning side to null (unless already changed)
            if ($testResult->getClassroom() === $this) {
                $testResult->setClassroom(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, StudentClass>
     */
    public function getEnrolledStudents(): Collection
    {
        return $this->enrolledStudents;
    }

    public function addEnrolledStudent(StudentClass $enrollment): static
    {
        if (!$this->enrolledStudents->contains($enrollment)) {
            $this->enrolledStudents->add($enrollment);
            $enrollment->setClassroom($this);
        }

        return $this;
    }

    public function removeEnrolledStudent(StudentClass $enrollment): static
    {
        if ($this->enrolledStudents->removeElement($enrollment)) {
            // Not setting null because the entity has a composite primary key
        }

        return $this;
    }

    /**
     * @return Collection<int, TestAssignment>
     */
    public function getTestAssignments(): Collection
    {
        return $this->testAssignments;
    }

    public function addTestAssignment(TestAssignment $testAssignment): static
    {
        if (!$this->testAssignments->contains($testAssignment)) {
            $this->testAssignments->add($testAssignment);
            $testAssignment->setClassroom($this);
        }

        return $this;
    }

    public function removeTestAssignment(TestAssignment $testAssignment): static
    {
        if ($this->testAssignments->removeElement($testAssignment)) {
            // Not setting null because the entity has a composite primary key
        }

        return $this;
    }
}
